# EventHub -- Playwright Test Automation

A JavaScript-based end-to-end test automation project for the
**EventHub** web application, built with Playwright.

The framework covers key user journeys such as registration, login,
browsing events, booking tickets, and managing bookings. It also uses
API calls to prepare and clean up test data so that tests are less
dependent on existing application data.

## Features

-   **Page Object Model (POM):** Page locators and reusable actions are
    organized into separate page classes to keep test files readable and
    maintainable.
-   **Authentication with Storage State:** A setup test signs in and
    saves the authenticated browser state. Authenticated tests can reuse
    that state instead of logging in before every test.
-   **API-based Test Data Management:** Booking scenarios create events
    through the API and remove the created events during test cleanup.
-   **Data-driven Testing:** JSON files provide test data for scenarios
    such as invalid email formats, weak passwords, and incorrect login
    credentials.
-   **Network Mocking:** Playwright's `page.route()` is used to mock
    event API responses and check UI behaviour with controlled data.
-   **API Security Testing:** A logout test captures the token before
    logout and checks whether that old token can still access a
    protected API afterwards.
-   **Failure Evidence:** Playwright is configured to capture
    screenshots, videos, and traces to help investigate failures.
-   **HTML Reporting:** Playwright's HTML report is used to review test
    execution results.

## Tech Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  Playwright Test                     Browser automation, API requests,
                                      and test execution

  JavaScript                          Test scripts and reusable framework
                                      utilities

  Node.js                             JavaScript runtime

  dotenv                              Loading environment variables from
                                      `.env`

  Git and GitHub                      Version control and source-code
                                      hosting
  -----------------------------------------------------------------------

## Project Structure

eventhub-playwright-automation-framework/
│
├── pageobjects/
│   ├── eventPage.js
│   ├── loginPage.js
│   ├── mybooking.js
│   └── registerPage.js
│
├── test-data/
│   ├── eventMockData.json
│   ├── loginData.json
│   └── registrationData.json
│
├── tests/
│   ├── auth.setup.js
│   ├── events.spec.js
│   ├── login.spec.js
│   ├── mybooking.spec.js
│   └── register.spec.js
│
├── utils/
│   ├── createEventApi.js
│   └── loginApi_Util.js
│
├── .env.example
├── .gitignore
├── package.json
└── playwright.config.js
``` 

## Test Scenarios Covered

### 1. User Registration

-   Verify registration page elements.
-   Check required-field validation.
-   Test invalid email formats.
-   Check password complexity requirements.
-   Verify password and confirm-password mismatch.
-   Test successful account registration.

### 2. Login

-   Verify login page elements.
-   Check password masking.
-   Test login with valid credentials.
-   Test multiple invalid credential combinations using JSON test data.
-   Check whether a previously captured authentication token can access
    protected APIs after logout.

### 3. Events

-   Search for events by name.
-   Filter events by category.
-   Filter events by city.
-   Verify the Clear Filters functionality.
-   Book an event and validate the price calculation.
-   Verify the booking confirmation message.
-   Mock event API responses to check banner visibility when different
    numbers of events are returned.

### 4. My Bookings

-   View booking details.
-   Verify booking information.
-   Cancel a booking.
-   Create test events through the API for booking scenarios.
-   Clean up events created by the test.

## Getting Started

### Prerequisites

-   Node.js 18 or later.
-   npm.
-   Access to the EventHub application.
-   A valid EventHub test account.

### 1. Clone the repository

``` bash
git clone https://github.com/nazim1012/eventhub-playwright-automation-framework.git
cd eventhub-eventhub-playwright-automation-framework
```

### 2. Install dependencies

``` bash
npm install
npx playwright install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a
reference.

Add your own application details:

``` env
BASE_URL=https://eventhub.rahulshettyacademy.com
API_URL=your_api_base_url
EMAIL=your_test_email
PASSWORD=your_test_password
```
### 4. Run the tests

Run the complete test suite:

``` bash
npx playwright test
```

Run a specific test file:

``` bash
npx playwright test tests/mybooking.spec.js
```

Run tests with the browser visible:

``` bash
npx playwright test --headed
```

Open Playwright UI mode:

``` bash
npx playwright test --ui
```

Debug tests step by step:

``` bash
npx playwright test --debug
```

List discovered tests without executing them:

``` bash
npx playwright test --list
```

### 5. View the HTML report

After test execution, open the report:

``` bash
npx playwright show-report
```

The report helps review passed and failed tests and inspect the evidence
captured for failures.

## Key Framework Implementations

### Authentication and Storage State

I use a Playwright setup project to avoid repeating the login process in
every authenticated test.

The flow is:

1.  The setup test signs in using the configured test credentials.
2.  After successful login, Playwright saves the browser state to
    `.auth/user.json`.
3.  The Chromium project depends on the setup project.
4.  Authenticated tests reuse the saved state through `storageState`.
5.  Login and registration tests use an unauthenticated context because
    those scenarios need to start without an existing session.

### API-based Test Data Creation and Cleanup

For booking-related scenarios, the framework creates a new event through
the EventHub API rather than relying only on pre-existing events.

The typical flow is:

1.  Obtain the authentication token required by the API.
2.  Send a `POST` request to create an event with unique test data.
3.  Read and store the event ID from the API response.
4.  Use the UI to perform the booking scenario.
5.  Send a `DELETE` request with the stored event ID during cleanup.

This keeps test data creation separate from the UI behaviour being
tested and helps reduce dependencies on existing records. Cleanup should
target only records created by that test.

### Network Mocking

I use Playwright's network interception to test UI behaviour with
controlled API responses.

For example:

-   When the mocked API returns six events, the banner should be
    visible.
-   When the mocked API returns four events, the banner should be
    hidden.

This makes it possible to verify the UI under predictable conditions
without depending on the live event data for those scenarios.

### Logout Token Security Check

The framework includes a security test to verify authentication token behaviour after logout.

During testing, I observed the following:

- After logout, the frontend successfully removes the authentication token from localStorage.
- Before logout, the test captures a copy of the authentication token.
- After logout, the test uses the previously captured token to access a protected API endpoint.
- The API still accepts the old token and returns HTTP 200 instead of rejecting the request with HTTP 401 or 403.

This indicates that frontend logout works, but backend token invalidation is not happening immediately, or is not enforced.

This behaviour has been identified as a potential backend session-management/security issue.

## Current Test Execution

In one recent execution, the suite reported:

-   **32 total tests**
-   **31 passed**
-   **1 failed**

The failing scenario was:

`Verify logged-out token cannot access protected API endpoints`

The frontend successfully removes the authentication token from localStorage when the user logs out. However, the test captures a copy of the token before logout and uses that old token to call a protected API endpoint afterwards.

The API returns 200 OK instead of the expected 401 Unauthorized or 403 Forbidden, which indicates that the backend still accepts the previously issued token.

## What I Practised in This Project

Building this framework gave me hands-on practice with:

-   Structuring a Playwright framework using Page Object Model.
-   Creating reusable page methods and test utilities.
-   Reusing authenticated sessions with Storage State.
-   Sending API requests with Playwright's `APIRequestContext`.
-   Creating and cleaning up test data through APIs.
-   Writing data-driven tests using JSON files.
-   Mocking network responses with `page.route()`.
-   Checking authentication and session behaviour.
-   Investigating intermittent failures with Playwright traces.
-   Generating and reviewing HTML test reports.

## Author

**Nazim Thokan**

-   GitHub: [@nazim1012](https://github.com/nazim1012)
-   LinkedIn: [Nazim
    Thokan](https://www.linkedin.com/in/nazim-thokan-69bb35278)
