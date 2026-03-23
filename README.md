# QA Automation — Paylocity Benefits Dashboard

End-to-end QA automation suite for the Paylocity Benefits Dashboard, covering both REST API and UI testing using Cucumber.js, Playwright, and TypeScript.

---

## Architecture

```
qa-automation-benefits-dashboard/
├── features/                        # Gherkin feature files
│   ├── api/
│   │   └── employees/
│   │       ├── get-employees.feature
│   │       ├── get-employee-by-id.feature
│   │       ├── create-employee.feature
│   │       ├── update-employee.feature
│   │       └── delete-employee.feature
│   └── ui/
│       ├── benefits-dashboard.feature
│       └── manage-employee.feature
│
├── step-definitions/                # Step implementations
│   ├── api/
│   │   └── employee.steps.ts
│   └── ui/
│       ├── benefits-dashboard.steps.ts
│       ├── manage-employee.steps.ts
│       └── add-employee.steps.ts
│
├── src/
│   ├── api/
│   │   ├── clients/
│   │   │   └── base.client.ts       # HTTP client wrapper
│   │   └── services/
│   │       └── employee.service.ts  # API service layer
│   ├── config/
│   │   └── config.ts                # Environment variable config
│   ├── factories/
│   │   └── employee.factory.ts      # Test data factory
│   ├── models/
│   │   └── employee.model.ts        # TypeScript interfaces
│   ├── support/
│   │   ├── world.ts                 # Cucumber world context
│   │   ├── hooks.ts                 # API lifecycle hooks
│   │   └── hooks.ui.ts              # UI lifecycle hooks (Playwright)
│   └── ui/
│       ├── locators/
│       │   └── app.locators.ts      # UI element selectors
│       └── pages/
│           ├── login.page.ts
│           ├── dashboard.page.ts
│           ├── add-employee.page.ts
│           ├── edit-employee.page.ts
│           └── delete-employee.page.ts
│
├── bugs-report/                     # Bug reports with screenshots
│   ├── API/
│   └── UI/
│
├── reports/                         # Generated test reports (gitignored)
├── cucumber.json                    # Cucumber profiles config
├── .github/
│   └── workflows/
│       └── tests.yml                # CI/CD pipeline
└── package.json
```

### Tech Stack

| Tool | Purpose |
|---|---|
| [Cucumber.js](https://cucumber.io/) | BDD test runner |
| [Playwright](https://playwright.dev/) | Browser automation |
| [TypeScript](https://www.typescriptlang.org/) | Language |
| [Faker.js](https://fakerjs.dev/) | Test data generation |
| GitHub Actions | CI/CD pipeline |

---

## Environment Setup

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Install Playwright browsers

```bash
npx playwright install chromium
```

### Environment variables

Create a `.env` file in the project root:

```env
API_BASE_URL=<api-base-url>
API_AUTH_TOKEN=<your-auth-token>
UI_BASE_URL=<ui-base-url>
UI_USERNAME=<your-username>
UI_PASSWORD=<your-password>
```

---

## Running Tests

### Run all tests

```bash
npm test
```

### Run API tests only

```bash
npm run test:api
```

### Run UI tests only

```bash
npm run test:ui
```

### Run by tag

```bash
npm run test:tags -- @api
npm run test:tags -- @ui
```

---

## Test Cleanup

After every test run an `AfterAll` hook automatically deletes all employees from the system. This ensures the environment is clean before the next run and prevents test data from accumulating.

```
Test run completes
       │
       └── AfterAll hook fires
               │
               ├── GET /api/Employees → fetch all records
               ├── DELETE each employee by id
               └── Dispose API context
```

> Cleanup failure is non-blocking — if the cleanup fails the test results are not affected.

---

## Test Cases

### API — Happy Path (8 scenarios — all passing)

| Feature | Scenario |
|---|---|
| Get All Employees | Successfully retrieve all employees |
| Get Employee by ID | Successfully retrieve an employee by ID |
| Create Employee | Successfully create a new employee |
| Create Employee | Net Pay calculated correctly — 0 dependants |
| Create Employee | Net Pay calculated correctly — 1 dependant |
| Create Employee | Net Pay calculated correctly — 2 dependants |
| Update Employee | Successfully update an existing employee salary and dependants |
| Delete Employee | Successfully delete an employee |

---

### API — Bug Scenarios (13 scenarios — expected to FAIL until bugs are fixed)

| Bug | Scenario | Expected | Actual |
|---|---|---|---|
| BUG-GET-002 | Response should not expose `username` in employee records | `username` absent | `username` present |
| BUG-GET-003 | Response should not expose `expiration` in employee records | `expiration` absent | `expiration` present |
| BUG-GET-004 | Monetary fields should have at most 2 decimal places | 2 decimal places | 6+ decimal places |
| BUG-GET-006 | GET with non-existent employee ID should return 404 | 404 | 200 empty body |
| BUG-POST-001 | POST should not silently override client-provided `id` | submitted id returned | new UUID generated |
| BUG-POST-003 | POST should not silently override client-provided `salary` | submitted salary stored | hardcoded to 52000 |
| BUG-POST-004 | POST should reject a past expiration date | 400 | 200 date stored |
| BUG-POST-005 | POST should reject a single character `lastName` | 400 | 200 accepted |
| BUG-POST-006 | Second POST with identical data should return 409 | 409 | 200 duplicate created |
| BUG-PUT-001 | PUT should not accept custom salary to alter gross calculation | gross = 2000.00 | gross recalculated |
| BUG-PUT-002 | PUT should reject placeholder username "string" | 400 | 200 accepted |
| BUG-PUT-003 | PUT with non-existent id should return 404 not create a new record | 404 | 200 new record created |
| BUG-DELETE-001 | DELETE with non-existent employee ID should return 404 | 404 | 200 empty body |

---

### UI — Happy Path (12 scenarios — all passing)

| Feature | Scenario |
|---|---|
| Benefits Dashboard | Successful login to the Benefits Dashboard |
| Benefits Dashboard | Dashboard table displays all required columns |
| Benefits Dashboard | Add Employee button is visible |
| Benefits Dashboard | Login fails when no credentials are provided |
| Benefits Dashboard | Successfully log out and validate login page is shown |
| Add Employee Modal | Add Employee modal displays all required elements |
| Add Employee Modal | Successfully create an employee |
| Add Employee Modal | Net Pay calculated correctly — 0 dependants |
| Add Employee Modal | Net Pay calculated correctly — 1 dependant |
| Add Employee Modal | Net Pay calculated correctly — 2 dependants |
| Manage Employee | Edit an existing employee and validate updated info |
| Manage Employee | Delete an existing employee and validate it is removed |

---

## Viewing Reports

Each run generates a timestamped report so previous runs are never overwritten:

```
reports/
├── cucumber-report-api-2026-03-23T14-30-00-000Z.html
├── cucumber-report-ui-2026-03-23T15-00-00-000Z.html
└── ...
```

The filename tells you the profile (`api` or `ui`) and exactly when it ran.

### Open the last executed report

```bash
open reports/$(ls -t reports/ | head -1)
```

### List all reports newest first

```bash
ls -t reports/
```

---

## CI/CD — GitHub Actions

The pipeline is defined in [.github/workflows/tests.yml](.github/workflows/tests.yml).

### Trigger

| Event | Behavior |
|---|---|
| Push to `main` | Runs automatically |
| Manual | Go to **Actions** tab → select workflow → **Run workflow** |

### Pipeline flow

```
Trigger
   │
   └── API Tests ──► (pass or fail) ──► UI Tests
```

API tests run first. UI tests always run after, regardless of the API result.

### Artifacts

After each run, HTML reports are saved as downloadable artifacts:

1. Go to **Actions** tab in GitHub
2. Click the workflow run
3. Scroll to **Artifacts**
4. Download `api-test-report` or `ui-test-report`
5. Open the `.html` file locally

### Required Secrets

Add these in **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Description |
|---|---|
| `API_BASE_URL` | API base URL |
| `API_AUTH_TOKEN` | API auth token |
| `UI_BASE_URL` | UI app URL |
| `UI_USERNAME` | Login username |
| `UI_PASSWORD` | Login password |

---

## Bug Reports

Full bug reports with evidence are in [bugs-report/](bugs-report/).


### API Bugs

#### GET /api/Employees — 7 bugs found

| ID | Severity | Summary |
|---|---|---|
| BUG-GET-001 | High | Internal DB fields `partitionKey` and `sortKey` exposed in response |
| BUG-GET-002 | High | `username` field embedded in every employee record |
| BUG-GET-003 | Medium | Ambiguous `expiration` field exposed with no business context |
| BUG-GET-004 | Medium | Monetary fields returned with excessive decimal precision (6+ places) |
| BUG-GET-005 | High | Malformed UUID returns 500 instead of 400 Bad Request |
| BUG-GET-006 | High | Non-existent employee ID returns 200 OK with empty body instead of 404 |
| BUG-GET-007 | High | Empty `id` path variable crashes server with 500 instead of 400 |

#### POST /api/Employees — 6 bugs found

| ID | Severity | Summary |
|---|---|---|
| BUG-POST-001 | Medium | Client-provided `id` silently ignored and replaced by server-generated UUID |
| BUG-POST-002 | Medium | Client-provided `username` silently replaced by authenticated user's username |
| BUG-POST-003 | Medium | Client-provided `salary` silently discarded and hardcoded to 52000 |
| BUG-POST-004 | Medium | Past `expiration` date accepted without validation |
| BUG-POST-005 | Low | Single character `lastName` accepted without validation |
| BUG-POST-006 | High | Duplicate employee records created on repeated POST with identical data |

#### PUT /api/Employees — 3 bugs found

| ID | Severity | Summary |
|---|---|---|
| BUG-PUT-001 | Critical | Custom `salary` accepted and used in calculations, violating fixed $2,000 business rule |
| BUG-PUT-002 | Medium | Literal placeholder value "string" accepted as valid `username` |
| BUG-PUT-003 | Critical | PUT creates a new record instead of updating existing one — not idempotent |

#### DELETE /api/Employees/{id} — 1 bug found

| ID | Severity | Summary |
|---|---|---|
| BUG-DELETE-001 | High | Returns 200 OK with empty body when employee does not exist instead of 404 |

---

### UI Bugs

#### Login / Authentication — 1 bug found

| ID | Severity | Summary |
|---|---|---|
| BUG-UI-001 | Critical | Dashboard accessible without authentication — no session validation on `/Prod/Benefits` |

#### Benefits Dashboard — 2 bugs found

| ID | Severity | Summary |
|---|---|---|
| BUG-UI-Dash-001 | Low | `favicon.ico` returns 403 Forbidden |
| BUG-UI-Dash-002 | High | 28 dependents accepted and displayed with no validation warning |

#### Add Employee — 2 bugs found

| ID | Severity | Summary |
|---|---|---|
| BUG-UI-ADD-001 | High | Submitting empty form fires API call returning 405 — no validation shown to user |
| BUG-UI-ADD-002 | High | Single quote and special characters accepted as valid employee names |

#### Edit Employee — 2 bugs found

| ID | Severity | Summary |
|---|---|---|
| BUG-UI-EDIT-001 | High | Empty fields on Update fires PUT returning 405 — no validation shown to user |
| BUG-UI-EDIT-002 | Medium | Edit Employee modal title incorrectly displays "Add Employee" |

---

### Bug Summary

| Area | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| GET | 0 | 4 | 2 | 0 | 6 |
| POST | 0 | 1 | 4 | 1 | 6 |
| PUT | 2 | 0 | 1 | 0 | 3 |
| DELETE | 0 | 1 | 0 | 0 | 1 |
| UI | 1 | 4 | 1 | 1 | 7 |
| **Total** | **3** | **10** | **8** | **2** | **23** |

Full bug reports with evidence are in [bugs-report/](bugs-report/).
