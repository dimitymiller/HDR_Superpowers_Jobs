# Robotics & AI Jobs Australia — GitHub Pages website

A self-contained, mobile-friendly public jobs directory. This version contains **15 carefully selected listings supplied by the site owner**; 13 are based in Australia, one is remote worldwide, and one is in the USA. The last review was **6 November 2026**. One additional supplied LinkedIn link was a generic redirect for expired vacancies, so it was **not** added.

## Publish without installing anything

1. Sign in to GitHub at https://github.com/new . Create a **Public** repository called `robotics-jobs-australia` (any name also works).
2. **Unzip** `robotics-jobs-australia.zip` on your computer. Open the extracted `robotics-jobs-australia` folder.
3. In your new GitHub repository, click **Add file → Upload files** (if the repository is brand-new, click the **uploading an existing file** link).
4. Drag **these five individual files**, not the ZIP and not the enclosing folder, into the upload area:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `jobs.csv`
   - `README.md`
5. Click **Commit changes**.
6. Go to **Settings → Pages** (under Code and automation). Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
7. The site should become available at `https://YOUR-USERNAME.github.io/robotics-jobs-australia/` once Pages finishes its deployment. View it from the Pages settings screen.

**Important:** `index.html`, `app.js`, `styles.css` and `jobs.csv` must all be at the repository **root**, not inside an extra subfolder. Do not upload only the ZIP; GitHub Pages will not automatically unpack it.

## Add, remove, or edit jobs later

1. On GitHub, open **jobs.csv** → pencil icon (Edit this file).
2. Each row is one job. Use the same column order as the header:

`id,title,company,location,state,sector,focus,phd,level,summary,url,deadline,checked,notes,status`

3. Copy an existing row to add a job; give it a **unique `id`**. Put commas inside **double-quoted CSV fields**. Spreadsheet apps such as Excel can also export CSV files.
4. Save by clicking **Commit changes**. GitHub Pages will update automatically.

For clarity, the field values work as follows:
- `state`: `NSW`, `VIC`, `QLD`, `Australia-wide`, `USA`, `Worldwide remote`, etc.; used by the Location filter.
- `sector`: `Big tech`, `University`, `Large industry`, `Established industry`, `Startup / scale-up` (or add new categories; the filter updates automatically).
- `focus`: `Robot learning`, `Robotics & autonomy`, `Hardware & mechatronics`, `Navigation & control`, `Computer vision & AI`, `Modelling & simulation`, `Academic research`, etc.
- `phd`: `Required`, `Preferred`, `PhD or equivalent`, `Accepted (not required)`, `Not specified`.
- `deadline`: `YYYY-MM-DD`, or blank if not provided. Once the date has passed, the job is automatically hidden from the site.
- `checked`: `YYYY-MM-DD`, the **date you last manually checked** the listing. The site never checks vacancy status automatically.
- `notes`: one short qualification, salary, link note, visa caveat, etc.
- `status`: `active`, `review` (shows on site with verification warning), or `archived` (hides the job).

A useful maintenance habit is to review every listing weekly or fortnightly. Mark closed jobs `archived` and only update `checked` after actually checking the employer's page.

## Links replaced from the supplied list

- **Built Robotics (SEEK)** → https://roboticsengineerjobs.com/companies/built-robotics-2/jobs/robotics-hardware-engineer-c2e5bb630e93 — publicly readable independent copy of the same job.
- **The Onset (LinkedIn)** → https://marketplace.theonset.com.au/job/73996/founding-robotics-engineer — exact job on the recruiting firm's public site.
- **Ornata (Indeed)** → https://builtin.com/job/senior-robotics-software-engineer-ornata/11564342 — public employer/investor job listing.
- **Google DeepMind**: original URL retained; currently appears to open Google's general jobs search, rather than confirmed application details. It is flagged `review`. It is **in Cambridge, Massachusetts (USA)**, not Australia.
- **Generic LinkedIn Signal Processing search**: supplied link redirected to a broad **US jobs search**, not a unique vacancy. Excluded to avoid misleading visitors. Provide an exact employer/title link to add it later.
- **Lucky Robots**: linked to the specific Research Engineer vacancy on the company's site instead of the generic careers page. This is advertised as worldwide remote; working from Australia should be confirmed.

## Test locally (optional)

Opening `index.html` directly from the file system may show a CSV load warning due to browser file access protections. GitHub Pages will work correctly. To test before uploading, from this folder run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000/ in a browser.

## Technical notes

- Pure HTML/CSS/JavaScript, no build step, database, API key, or recurring fee.
- External links open in a separate tab; no user data is collected by the site.
- Accessible labelled search/filter controls, responsive cards, URL validation and basic escaping through `textContent`.
- The board is independently curated, not affiliated with any listed employer, and should not be described as a live feed of currently open jobs.
