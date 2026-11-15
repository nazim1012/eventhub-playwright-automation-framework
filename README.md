# Event Hub – Playwright Test Automation

End-to-end test automation for the **Event Hub** web application, built with [Playwright](https://playwright.dev/) and JavaScript.

The suite covers user registration, login, event browsing, booking and booking management. It combines UI tests with API calls for fast, independent test-data setup.

---

## Features

- **Page Object Model.** Locators and page actions live in `pageobjects/`, keeping tests short and readable.
- **Authentication reuse.** A setup project logs in once and saves the session (`storageState`), so tests start already logged in.
- **API-driven test data.** Booking tests create a unique event through the API before each test and delete it afterwards. Tests are independent and can run in parallel.
- **Data-driven tests.** Invalid emails, weak passwords and invalid logins are read from JSON files in `test-data/`.
- **Network mocking.** `page.route()` mocks the events API to test UI behaviour (e.g. the sandbox banner) with controlled data.
- **API security check.** Verifies that an auth token is rejected (401/403) after logout.
- **Failure evidence.** Screenshots, videos and traces are captured for failed tests.
- **CI ready.** A GitHub Actions workflow runs the suite on every push and pull request.

---

## Tech stack

| Tool | Purpose |
|---|---|
| [Playwright Test](https://playwright.dev/) | Test runner, browser automation, API requests |
| JavaScript (Node.js) | Language |
| [dotenv](https://github.com/motdotla/dotenv) | Loads environment variables from `.env` |
| GitHub Actions | Continuous integration |

---

## Project structure

```
eventhub-playwright-automation/
├── .github/workflows/
│   └── playwright.yml        # CI pipeline
├── pageobjects/              # Page Object Model classes
│   ├── eventPage.js          # Events list, search, filters, booking form
│   ├── loginPage.js          # Login page
│   ├── mybooking.js          # My Bookings page
│   └── registerPage.js       # Registration page
├── test-data/                # JSON data for data-driven and mocked tests
│   ├── eventMockData.json
│   ├── loginData.json
│   └── registrationData.json
├── tests/
│   ├── auth.setup.js         # Logs in once and saves the session
│   ├── events.spec.js        # Search, filters, booking, mocked banner
│   ├── login.spec.js         # Login UI, valid/invalid login, token expiry
│   ├── mybooking.spec.js     # View and cancel bookings
│   └── register.spec.js      # Registration validation and account creation
├── utils/                    # API helpers
│   ├── createEventApi.js     # Create and delete events via API
│   └── loginApi_Util.js      # Calls protected endpoints with a token
├── .env.example              # Template for required environment variables
└── playwright.config.js
```

---

## Test coverage

| Area | Scenarios |
|---|---|
| **Registration** | UI elements, empty-field validation, invalid email formats, weak passwords, password mismatch, successful account creation |
| **Login** | UI elements, password masking, valid login, invalid credentials (data-driven), token rejected after logout |
| **Events** | Search, category filter, city filter, clear filters, booking with price calculation, banner shown/hidden based on event count (mocked API) |
| **My Bookings** | View booking details, cancel booking (each test creates and cleans up its own event) |

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A test account on the Event Hub application

### 1. Clone and install

```bash
git clone https://github.com/nazim1012/eventhub-playwright-automation.git
cd eventhub-playwright-automation
npm install
npx playwright install
```

### 2. Configure environment variables

Copy the template and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `BASE_URL` | URL of the Event Hub web app |
| `API_URL` | Base URL of the Event Hub API |
| `EMAIL` | Email of your test account |
| `PASSWORD` | Password of your test account |

> `.env` is git-ignored. Never commit real credentials.

### 3. Run the tests

```bash
# Run all tests
npx playwright test

# Run one file
npx playwright test tests/mybooking.spec.js

# Run with the browser visible
npx playwright test --headed

# Open Playwright's interactive UI mode
npx playwright test --ui

# Debug step by step
npx playwright test --debug
```

### 4. View the report

```bash
npx playwright show-report
```

The HTML report includes screenshots, videos and traces for failed tests.

---

## How authentication works

1. The `setup` project runs `tests/auth.setup.js`, which logs in through the UI and saves the session to `.auth/user.json`.
2. The `chromium` project depends on `setup` and loads that session, so every test starts logged in.
3. Login and registration tests clear the session with `test.use({ storageState: { cookies: [], origins: [] } })` because they need a logged-out browser.

---

## How booking tests stay independent

Each test in `mybooking.spec.js`:

1. Reads the auth token from the logged-in browser.
2. Creates a new event with a unique title through the API (`POST /events`).
3. Books that event.
4. Runs its checks on the My Bookings page.
5. Deletes the event in `afterEach` (`DELETE /events/:id`), even if the test failed.

No test depends on existing data or on another test, so the suite can run in any order and in parallel.

---

## Continuous integration

The workflow in `.github/workflows/playwright.yml` runs on every push and pull request to `main`/`master`. It installs dependencies and browsers, runs the suite, and uploads the HTML report as a build artifact.

Add these repository secrets under **Settings → Secrets and variables → Actions**:

`BASE_URL`, `API_URL`, `EMAIL`, `PASSWORD`

---

## Author

**Nazim Thokan**

- GitHub: [@nazim1012](https://github.com/nazim1012)
- LinkedIn: [nazim-thokan](https://www.linkedin.com/in/nazim-thokan-69bb35278)
