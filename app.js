// This website is deliberately framework-free. Edit jobs.csv to change the listings.
const $ = (selector) => document.querySelector(selector);
const filters = {
  search: $('#search'), country: $('#country-filter'), location: $('#location-filter'),
  focus: $('#focus-filter'), sector: $('#sector-filter'), phd: $('#phd-filter'),
};
let allJobs = [];

// Parses CSV with quoted commas, newlines and escaped double quotes.
function parseCSV(input) {
  const rows = []; let row = [], field = '', quoted = false;
  input = input.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && input[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
    } else { field += c; }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((h, i) => [h, (values[i] || '').trim()])));
}
function validUrl(url) {
  try { return new URL(url).protocol === 'https:'; } catch { return false; }
}
function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return '';
  return new Date(`${value}T12:00:00Z`).toLocaleDateString('en-AU', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
}
function dateIsPast(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const today = new Date();
  const localToday = [today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  return value < localToday;
}
function stale(value) {
  if (!value) return true;
  const diff = Date.now() - new Date(`${value}T00:00:00Z`).getTime();
  return diff > 30 * 86400000;
}
function element(tag, className, textValue) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textValue !== undefined) node.textContent = textValue;
  return node;
}
function addTag(parent, text, extra = '') { parent.appendChild(element('span', `tag ${extra}`.trim(), text)); }
function card(job) {
  const article = element('article', 'job-card');
  const top = element('div','card-top');
  const company = element('div','company-line');
  const initials = job.company.split(/\s+/).slice(0,2).map(w => w[0] || '').join('').toUpperCase();
  company.append(element('span','company-logo',initials),element('span','company-label',job.company));
  top.append(company,element('span','sector-tag',job.sector)); article.append(top);
  article.appendChild(element('h3','card-title',job.title));
  const meta = element('div','card-meta');
  meta.append(element('span','',job.location),element('span','meta-sep'),element('span','',job.level || 'Various levels'));
  article.appendChild(meta);
  article.appendChild(element('p','card-summary',job.summary));
  const tags = element('div','tag-row'); addTag(tags,job.focus);
  if (job.phd && job.phd !== 'Not specified') addTag(tags,`PhD: ${job.phd}`,'phd');
  if (job.country && job.country !== 'Australia') addTag(tags,'International / remote','international');
  if (job.status === 'review') addTag(tags,'Link needs verification','review');
  if (job.deadline) addTag(tags,`Closes ${formatDate(job.deadline)}`,'deadline');
  article.appendChild(tags);
  if (job.notes) article.appendChild(element('p','card-note',job.notes));
  const foot = element('div','card-foot');
  foot.appendChild(element('span','checked-text',stale(job.checked) ? `Last checked ${formatDate(job.checked)} · recheck vacancy` : `Checked ${formatDate(job.checked)}`));
  const link = element('a','job-link','View job ↗');
  link.href = job.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label',`View ${job.title} at ${job.company} (opens new tab)`);
  foot.appendChild(link); article.appendChild(foot);
  return article;
}
function addOptions(select, values) {
  for (const v of [...new Set(values)].filter(Boolean).sort((a,b) => a.localeCompare(b))) {
    const o = element('option','',v); o.value = v; select.appendChild(o);
  }
}
function matchesPhd(job, selection) {
  if (!selection) return true;
  if (selection === 'required') return job.phd === 'Required';
  if (selection === 'valued') return ['Required','Preferred','PhD or equivalent','Preferred / equivalent'].includes(job.phd);
  if (selection === 'unspecified') return ['Not specified','Accepted (not required)'].includes(job.phd);
  return true;
}
function render() {
  const q = filters.search.value.trim().toLowerCase();
  const filtered = allJobs.filter(job =>
    (!filters.country.value || (job.country || '').split('|').map(v => v.trim()).includes(filters.country.value)) &&
    (!filters.location.value || job.state === filters.location.value) &&
    (!filters.focus.value || job.focus === filters.focus.value) &&
    (!filters.sector.value || job.sector === filters.sector.value) &&
    matchesPhd(job,filters.phd.value) &&
    (!q || [job.title,job.company,job.location,job.focus,job.summary,job.level].join(' ').toLowerCase().includes(q))
  );
  const grid = $('#jobs-grid'); grid.replaceChildren(...filtered.map(card)); grid.setAttribute('aria-busy','false');
  $('#result-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'position' : 'positions'} found`;
  $('#empty-state').hidden = filtered.length !== 0;
}
function reset() { Object.values(filters).forEach(field => field.value = ''); render(); }
async function init() {
  try {
    const response = await fetch('./jobs.csv', {cache: 'no-store'});
    if (!response.ok) throw Error('jobs.csv not available');
    const parsed = parseCSV(await response.text());
    allJobs = parsed.filter(job => ['active','review'].includes((job.status || '').toLowerCase()) && validUrl(job.url) && !dateIsPast(job.deadline));
    allJobs.sort((a,b) => (b.checked || '').localeCompare(a.checked || '') || a.company.localeCompare(b.company) || a.title.localeCompare(b.title));
    addOptions(filters.country,allJobs.flatMap(j => (j.country || '').split('|').map(s => s.trim())));
    addOptions(filters.location,allJobs.map(j => j.state));
    addOptions(filters.focus,allJobs.map(j => j.focus));
    addOptions(filters.sector,allJobs.map(j => j.sector));
    $('#hero-count').textContent = String(allJobs.length);
    $('#hero-companies').textContent = String(new Set(allJobs.map(j => j.company)).size);
    $('#hero-locations').textContent = String(new Set(allJobs.flatMap(j => (j.country || '').split('|').map(s => s.trim()))).size);
    const lastChecked = allJobs.map(j => j.checked).filter(Boolean).sort().at(-1);
    $('#hero-checked').textContent = lastChecked ? formatDate(lastChecked) : 'Not recorded';
    $('#footer-date').textContent = lastChecked ? `Latest check ${formatDate(lastChecked)}` : 'Listings reviewed periodically';
    render();
  } catch(err) {
    console.error(err); $('#jobs-grid').replaceChildren(); $('#result-count').textContent = 'Unable to load jobs'; $('#error-state').hidden = false;
    $('#jobs-grid').setAttribute('aria-busy','false');
  }
}
Object.values(filters).forEach(field => field.addEventListener(field.tagName === 'INPUT' ? 'input' : 'change', render));
$('#clear-filters').addEventListener('click',reset);
$('#empty-reset').addEventListener('click',reset);
init();
