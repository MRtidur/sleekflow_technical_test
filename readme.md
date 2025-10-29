
---

````markdown
# 🧪 Playwright Automation Tests — Sleekflow.io

This repository contains **Playwright end-to-end automation tests** for the **Signup and Login flow** of [Sleekflow.io](https://sleekflow.io).  
It includes **test design documentation**, **setup instructions**, and **example manual test cases** with bug reporting samples.

---

## 🔧 Part 1: Technical Questions & Implementation

### 1. Project Setup

#### Environment Setup

```bash
# 1. Initialize Node.js project
npm init -y

# 2. Install Playwright with browsers and test runner
npm install -D @playwright/test

# 3. Install browsers
npx playwright install
````

#### Folder Structure

```
sleekflow-tests/
│
├── tests/
│   ├── signup.spec.ts
│   ├── login.spec.ts
│
├── pages/
│   ├── signup.pages.ts
│   ├── login.pages.ts
│
├── fixtures/
│   ├── users.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

#### Config File Example (playwright.config.ts)

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://app.sleekflow.io',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  reporter: [['html'], ['list']],
});
```

#### Test Runner

Using the built-in **Playwright Test Runner**, supporting:

* Parallel execution
* Retry logic
* HTML report generation

---

### 2. Test Case Planning

#### Signup Flow Key Elements

* Email input
* Username field
* Password input
* Validation messages (invalid email, weak password)
* “Sign up” button
* Redirect to company details page

#### Login Test Validations

* Correct redirection (`/inbox`, dashboard)
* Display of error messages for invalid credentials
* Login button enabled/disabled state

#### Handling Valid and Invalid Credentials

```ts
export const users = {
  valid: { email: 'testuser@example.com', password: 'ValidPass123' },
  invalid: { email: 'wrong@example.com', password: 'wrongpass' },
};
```

* **Valid credentials** → Expect successful redirect
* **Invalid credentials** → Expect error message

---

### 3. Locator Strategy

| Type                   | Example                                         | Use Case                            |
| ---------------------- | ----------------------------------------------- | ----------------------------------- |
| **getByRole()**        | `page.getByRole('button', { name: 'Sign up' })` | Buttons/links                       |
| **getByLabel()**       | `page.getByLabel('Email')`                      | Input fields                        |
| **getByPlaceholder()** | `page.getByPlaceholder('Enter email')`          | Placeholder locators                |
| **getByTestId()**      | `page.getByTestId('signup-submit')`             | Preferred when data-testid is added |
| **CSS selector**       | `page.locator('.error-message')`                | Error messages                      |
| **XPath**              | `page.locator('//button[text()="Continue"]')`   | Fallback                            |

**Best Practice:** Prefer accessible selectors (`getByRole`, `getByLabel`) for long-term stability.

---

### 4. Waits and Timing

Playwright automatically waits for actions, but explicit waits can be added for clarity.

```ts
await page.waitForSelector('#success-toast');
await expect(page.getByText('Welcome')).toBeVisible();
await page.waitForURL(/\/dashboard/);
```

✅ **Use `expect()`** for assertion waits instead of `waitForTimeout()`.

---

### 5. Test Data Management

Options:

* Use **unique emails** to prevent duplicates:

  ```ts
  const uniqueEmail = `user_${Date.now()}@example.com`;
  ```
* Use **mock APIs** or a **sandbox testing environment**.
* Cleanup via API after each test if supported.

---

### 6. Reusability (Page Object Model)

```ts
// pages/login.pages.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/u/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
```

Usage:

```ts
await loginPage.login(users.valid.email, users.valid.password);
```

---

### 7. Headless vs Headed

| Mode         | Use When        | Notes                     |
| ------------ | --------------- | ------------------------- |
| **Headless** | CI/CD pipelines | Faster                    |
| **Headed**   | Local debugging | Allows visual observation |

Example:

```bash
npx playwright test --headed
```

---

### 8. CI/CD Integration (GitHub Actions)

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

Artifacts (screenshots, videos, traces) can be uploaded for review.

---

### 9. Error Handling & Debugging

**Automatic capture:**

* Screenshots: `only-on-failure`
* Video + trace: `retain-on-failure`

Manual example:

```ts
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus)
    await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
});
```

---

## 🧩 Part 2: Test Case Design & Bug Reporting

### 1. Manual Test Cases

| Test Case ID                            | Test Objective           | Preconditions       | Test Steps                                                                             | Expected Result                        |
| --------------------------------------- | ------------------------ | ------------------- | -------------------------------------------------------------------------------------- | -------------------------------------- |
| **TC01 - Signup with valid data**       | Verify successful signup | User not registered | 1. Navigate to signup page 2. Enter valid email, username, password 3. Click “Sign up” | Redirects to company setup page        |
| **TC02 - Signup with invalid email**    | Validate email format    | None                | 1. Go to signup page 2. Enter “abc@” 3. Click “Sign up”                                | Error “Invalid email format” displayed |
| **TC03 - Login with valid credentials** | Verify successful login  | Account exists      | 1. Go to login page 2. Enter valid credentials 3. Click “Login”                        | Redirect to `/inbox` dashboard         |

---

### 2. Bug Report Example

**Bug Title:** Login button unresponsive after entering valid credentials

**Environment:**

* Browser: Chrome v118
* OS: macOS 14.0 (Sonoma)
* URL: [https://app.sleekflow.io/u/login](https://app.sleekflow.io/u/login)

**Steps to Reproduce:**

1. Open login page
2. Enter valid email: `testuser@example.com`
3. Enter password: `ValidPass123`
4. Click **Login**

**Expected Result:**
User should be redirected to `/inbox` or dashboard page.

**Actual Result:**
Clicking **Login** does nothing. Page remains static and no error message appears.

**Severity:** High (blocks user access)

**Screenshot Description:**
Chrome window showing login fields filled, Login button clicked, but no redirection or visible feedback.

---

## ✅ Summary

This repository demonstrates:

* Strong Playwright framework setup
* Proper locator and waiting strategy
* Test reusability through Page Object Model
* Professional manual test case design
* Realistic bug reporting format
* CI/CD-ready configuration

