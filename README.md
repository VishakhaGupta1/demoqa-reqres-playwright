# Playwright JavaScript Automation Assignment

## Assignment Overview

This project implements two end-to-end automation flows using **Playwright with JavaScript** and the **Page Object Model (POM)** design pattern:

1. **DemoQA Book Store UI automation** — logs in, searches a book, extracts its details, saves them to a text file, and logs out.
2. **ReqRes persistent collection API automation** — creates a user record, reads it back, updates it with PUT (not PATCH), re-reads it to confirm persistence, and deletes it for cleanup.

---

## Automated UI Flow

> **Note:** User registration on DemoQA is performed **manually** and is not automated by this project.

1. Navigate directly to the Book Store login page (`/login`).
2. Login using manually registered DemoQA credentials (stored in `.env`).
3. Validate the expected username is displayed on the profile page.
4. Navigate to the Book Store screen via the "Go To Book Store" button.
5. Search the book catalog for: **`Learning JavaScript Design Patterns`**.
6. Validate the search result contains the exact book (single matching row).
7. Extract three fields from the UI:
   - **Title**
   - **Author**
   - **Publisher**
8. Write the three values into `output/book_details.txt` in the exact required format.
9. Logout and confirm the login page is displayed again.

---

## Automated API Flow

Uses **ReqRes persistent Collections** (instead of the legacy `/api/users` fixture APIs) so the create → get → update → delete lifecycle is truly persistent against a real scoped collection.

Every request includes:
- `x-api-key` header (Manage API key, never committed)
- `X-Reqres-Env` header
- `Content-Type: application/json`
- `?project_id=<id>` query parameter

Secrets are stored in `.env` and never committed (`.gitignore`).

Flow:

1. **POST** a new user record to the collection.
2. Validate HTTP **201 Created**.
3. Store the returned record `id` in `userId`.
4. Validate the echoed envelope contains the expected `name` / `job`.
5. **GET** the record by `userId`.
6. Validate HTTP **200 OK** and compare `name` / `job` against the created values.
7. **PUT** an updated `name` + `job` on the same record.
8. Validate HTTP **200 OK**, compare the updated fields in the response envelope, and confirm `response.data.id === userId`.
9. **GET** the record again and validate the update **actually persisted** (defensive follow-up read — protects against echo-only verbs such as PATCH).
10. **DELETE** the record as cleanup.
11. Validate DELETE returns **204 No Content**. Cleanup is wrapped in `try / finally` so it runs even if an earlier assertion fails.

---

## Project Structure

```
auto/
├── pages/
│   ├── LoginPage.js
│   ├── ProfilePage.js
│   └── BookStorePage.js
├── tests/
│   ├── ui.spec.js
│   └── api.spec.js
├── utils/
│   └── fileUtils.js
├── output/
│   └── book_details.txt
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
```

Intentionally not listed (gitignored or generated):
- `node_modules/`
- `.browsers/`
- `.env`
- `playwright-report/`
- `test-results/`

---

## Prerequisites

- **Node.js** (LTS recommended)
- **npm** (ships with Node.js)
- A **manually registered DemoQA user** (do NOT automate registration)
- A **ReqRes project** with persistent collections enabled
- A ReqRes collection named `users` with string fields `name` and `job`
- A ReqRes **Manage API key** (not the public read-only key)

---

## Installation

```bash
npm install
npx playwright install chromium
```

This project pins Playwright browsers to a project-local `.browsers` folder. The path is resolved inside `playwright.config.js` via
`process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(__dirname, '.browsers')` (set **before** `require('@playwright/test')`), so test commands always find the correct binary even if `PLAYWRIGHT_BROWSERS_PATH` was set only temporarily during install.

---

## Environment Setup

Copy the template and fill in your real values locally:

```bash
cp .env.example .env
```

Then populate `.env`:

```
DEMOQA_USERNAME=
DEMOQA_PASSWORD=
REQRES_API_KEY=
REQRES_BASE_URL=https://reqres.in
REQRES_COLLECTION=users
REQRES_ENV=prod
REQRES_PROJECT_ID=
```

**Never commit `.env`.** It is listed in `.gitignore`.

---

## Running Tests

Run all tests (UI + API):

```bash
npx playwright test --project=chromium
```

Run UI only:

```bash
npx playwright test tests/ui.spec.js --project=chromium
```

Run API only:

```bash
npx playwright test tests/api.spec.js --project=chromium
```

Run headed (watch the browser):

```bash
npx playwright test --headed --project=chromium
```

---

## Test Report

Open the last Playwright HTML report:

```bash
npx playwright show-report
```

Report is generated inside `playwright-report/`. A screenshot of the final HTML report should be included as part of the assignment submission.

---

## Output File

After a successful UI run, `output/book_details.txt` is written with the following exact contents:

```
Title: Learning JavaScript Design Patterns
Author: Addy Osmani
Publisher: O'Reilly Media
```

---

## Design Highlights

- **Page Object Model (POM)** — each screen is a dedicated JS class (`LoginPage`, `ProfilePage`, `BookStorePage`). Selectors live in constructors; actions live as async methods. Tests read as plain English.
- **Environment-based secret management** — `dotenv` loads credentials at startup; no strings are hard-coded into specs or Page Objects.
- **`test.step()` reporting** — every logical phase of the UI and API flow is a named step that renders correctly in the HTML report.
- **Semantic Playwright locators** — prefers `getByRole()`, `getByLabel()`, and stable element IDs over brittle classname/XPath queries.
- **Playwright `APIRequestContext`** — native Playwright HTTP client. No `axios`/`fetch`. Shares headers + baseURL across all five API steps.
- **Follow-up GET after PUT** — never trusts a write-response echo as proof of persistence. Re-reads the record defensively. (In ReqRes collections, PATCH returns 200 but never persists — only PUT is safe.)
- **`finally` DELETE cleanup** — test data is always removed, even if a mid-flow assertion fails.
- **Screenshot on failure** — `playwright.config.js` sets `screenshot: 'only-on-failure'`.
- **Trace on first retry** — `playwright.config.js` sets `trace: 'on-first-retry'`.

---

## Test Results

| Suite | Result |
|---|---|
| UI test (`tests/ui.spec.js`) | **Passed** |
| API test (`tests/api.spec.js`) | **Passed** |
| Full run (`--project=chromium`) | **2 passed** |

---


