# Playwright JavaScript Automation Assignment

## Assignment Overview

This project implements the required UI and API automation scenarios using **Playwright with JavaScript** and follows the **Page Object Model (POM)** design pattern.

The assignment includes:

- DemoQA Book Store UI automation
- ReqRes API automation
- Environment-based configuration using `.env`
- Playwright HTML reporting

---

## Automated UI Flow

> **Note:** User registration on DemoQA is performed manually and is not automated by this project.

1. Navigate to **https://demoqa.com/**.
2. Navigate to the **Book Store Application**.
3. Login using a manually created DemoQA user.
4. Validate the logged-in username and **Logout** button.
5. Click **Go To Book Store**.
6. Search for **Learning JavaScript Design Patterns**.
7. Validate that the search result contains the book.
8. Read the **Title**, **Author**, and **Publisher** from the UI.
9. Write the extracted values to `output/book_details.txt`.
10. Logout and verify the login page is displayed again.

---

## Automated API Flow

The API automation uses **ReqRes Collections** to perform a complete create, retrieve, update, and cleanup flow.

Flow:

1. Create a user record.
2. Validate HTTP **201 Created**.
3. Store the returned **userId**.
4. Fetch the created user.
5. Validate the returned user details.
6. Update the user's name.
7. Validate the update response.
8. Fetch the user again to verify the update was persisted.
9. Delete the created record as cleanup.
10. Validate **204 No Content** for the cleanup request.

Every request includes:

- `x-api-key`
- `X-Reqres-Env`
- `Content-Type: application/json`
- `project_id` query parameter

Secrets are stored in `.env` and are never committed.

---

## Project Structure

```text
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

Generated or ignored files:

- `node_modules/`
- `.browsers/`
- `.env`
- `playwright-report/`
- `test-results/`

---

## Prerequisites

- Node.js (LTS recommended)
- npm
- A manually created DemoQA user
- A ReqRes project with Collections enabled
- A ReqRes collection named `users`
- ReqRes Manage API Key

---

## Installation

```bash
npm install
npx playwright install chromium
```

The project uses a local Playwright browser directory configured in `playwright.config.js`.

---

## Environment Setup

Create a local `.env` file:

```bash
cp .env.example .env
```

Populate it with:

```text
DEMOQA_USERNAME=
DEMOQA_PASSWORD=

REQRES_API_KEY=
REQRES_BASE_URL=https://reqres.in
REQRES_COLLECTION=users
REQRES_ENV=prod
REQRES_PROJECT_ID=
```

> **Note:** `.env` is ignored through `.gitignore` and should never be committed.

---

## Running Tests

Run all tests:

```bash
npm test -- --project=chromium
```

Run UI tests:

```bash
npm run test:ui
```

Run API tests:

```bash
npm run test:api
```

Run headed:

```bash
npx playwright test --headed --project=chromium
```

---

## Test Report

Generate or open the Playwright HTML report:

```bash
npm run report
```

or

```bash
npx playwright show-report
```

---

## Output File

After a successful UI execution, the following file is generated:

```text
output/book_details.txt
```

Contents:

```text
Title: Learning JavaScript Design Patterns
Author: Addy Osmani
Publisher: O'Reilly Media
```

---

## Design Highlights

- Page Object Model (POM)
- Playwright with JavaScript
- Environment variable based configuration
- Playwright `test.step()` for readable execution
- Semantic Playwright locators (`getByRole`, IDs)
- Native `APIRequestContext` for API automation
- Follow-up GET validation after update
- Automatic cleanup using DELETE
- Screenshot on failure
- Trace on first retry

---

## Test Results

| Suite | Result |
|-------|--------|
| UI Test (`tests/ui.spec.js`) | Passed |
| API Test (`tests/api.spec.js`) | Passed |
| Full Suite | **2 Passed** |
