

# 🎤 Technical Interview Answers — Playwright (Sleekflow.io Automation)

---

## **1. Project Setup**

**To start the Playwright automation for Sleekflow, I first initialized a clean Playwright + TypeScript project.**

I used Node.js with TypeScript because it gives type safety and better maintainability for larger suites.
The setup steps were simple — `npm init`, install playwright complete with the config `npm init playwright@latest`.

Then I organized the structure using the **Page Object Model** to make each page reusable:

```
playwright_sleekflow/
├── tests/
│   ├── signup.spec.ts
│   └── login.spec.ts
├── pages/
│   ├── signup.pages.ts
│   └── login.pages.ts
├── fixtures/
│   └── users.ts
├── playwright.config.ts
├── package.json
```

For this project, I mainly targeted **Chromium**, and ran in both **headless** and **headed** mode — headed for debugging the dynamic Sleekflow flows, and headless for CI execution.

---

## **2. Test Case Planning**

### **Signup Flow**

> **When I planned the Signup flow, I started by mapping each critical element of the process, then expanded it into test coverage.**

Since Sleekflow uses an SSO-based signup (`https://sso.sleekflow.io/u/signup/password`), the signup process includes:

* **Email field** with inline validation (e.g., invalid format, restricted domain)
* **Username field** which required
* **Password field** that’s validated for strength
* A **sign-up button** that only works when all fields are valid
* Finally, a redirect to the company registration screen (which I skipped, since that part requires to create live account,I avoided polluting production with dummy users.).

In my tests, I covered multiple negative cases:

* Empty email
* Invalid email format
* Blocked domain email
* Already registered email
* Empty username
* Weak password
* empty password

Each test validates both **UI error messages** and **form behavior**, ensuring proper validation triggers before submission.

---

### **Login Flow**

**For login, I focused on verifying both happy and unhappy paths.**

Here, I made sure to validate:

1. **Successful login** — correct redirect to `/en/inbox`
2. **Unregistered email** — shows *“Wrong username or password”*
3. **Wrong password** — same error message
4. **Empty email** — shows *“Email address or username is required”*
5. **Empty password** — shows *“Password is required”*

---

### **Handling Valid and Invalid Credentials**

**For both signup and login, I used a centralized fixture file to manage all test data cleanly.**

In `/fixtures/users.ts`, I defined valid and invalid data sets:

```ts
export const usersForLogin = {
  valid: { email: 'qa_user@sleekflow.io', password: 'ValidPass@123' },
  invalidEmail: { email: 'fake@wrongdomain.com' },
  invalidPassword: { password: 'wrongpass' },
};
```

That way, I can loop through multiple scenarios easily and maintain consistency.
For valid users, I use a pre-created test account to ensure repeatable runs.

---

## **3. Locator Strategy**

**My locator strategy prioritizes accessibility and stability.**

Instead of brittle CSS or XPath selectors, I rely on **Playwright’s semantic locators**:

```ts
page.getByRole('button', { name: 'Sign up' });
page.getByLabel('Email');
page.getByText('Password is required');
```

This ensures the tests remain stable even if the UI layout changes slightly.

---

## **4. Waits and Timing**

**Sleekflow’s SSO introduces redirects and dynamic loads, so handling timing properly was key.**

Playwright’s auto-waiting usually handles most waits, but in cases of redirect or slow response, I explicitly wait for selectors or URLs:

```ts
await expect(page.getByText('Wrong username or password')).toBeVisible();
await page.waitForURL(/\/en\/inbox/);
```

I avoid using `waitForTimeout()` unless debugging, since it slows down CI execution.

---

## **5. Test Data Management**

**Because Sleekflow automatically creates real accounts, I avoided polluting production with dummy users.**

So for signup tests, I only validated front-end behavior (validation, errors, redirection), but didn’t proceed to actual registration or company creation.
If this were a staging environment, I’d use either:

* **Disposable email APIs**, or
* **Mocking API routes** with Playwright’s `page.route()` to intercept signup requests.

This prevents system clutter while still testing validation accuracy.

---

## **6. Reusability**

**I structured everything using the Page Object Model.**

Each page (Login, Signup) has its own class file that wraps all selectors and actions.
This keeps test cases clean and readable:

```ts
await login.fillEmail(user.email);
await login.continue();
await login.fillPassword(user.password);
await login.signIn();
```

So if the UI changes, I only update the page file once — not every test.
It also allows reusing login steps in future flows, like Inbox or Dashboard tests.

---

## **7. Headless vs Headed**

**During development, I prefer headed mode for observing UI behavior.**

* **Headed mode** → for debugging and identifying visual issues (redirects, pop-ups)
* **Headless mode** → for CI/CD and fast batch testing

---

## **8. CI Integration**

**For continuous integration, I’d use GitHub Actions.**

A `.yml` pipeline runs the test suite automatically:

```yaml
name: 🧪 Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    name: Run Playwright Tests
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      # Step 1 — Checkout repository
      - name: Checkout code
        uses: actions/checkout@v4

      # Step 2 — Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: lts/*

      # Step 3 — Install dependencies
      - name: Install dependencies
        run: npm ci

      # Step 4 — Install Playwright browsers
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      # Step 5 — Run tests with multiple reporters
      # list: console summary
      # github: inline annotations for failed tests
      # html: full report for download/viewing
      - name: Run Playwright Tests
        run: npx playwright test --reporter=list,github,html

      # Step 6 — Upload HTML report artifact
      - name: Upload Playwright HTML Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # Optional job: Publish the HTML report to GitHub Pages
  deploy-report:
    name: 📊 Deploy Test Report to GitHub Pages
    needs: test
    if: always() # always run even if tests fail
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: playwright-report
          path: playwright-report

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: playwright-report

```

It runs in headless mode, and Playwright automatically publishes HTML reports and trace artifacts.
here the link of deployed report: https://mrtidur.github.io/sleekflow_technical_test/

---

## **9. Error Handling**

> *“For failure analysis, I enabled screenshot, video, and trace capture in Playwright.”*

In my `playwright.config.ts`:

```ts
use: {
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
}
```

So when a test fails, I can replay the trace or watch the video step-by-step to pinpoint what went wrong — which is especially useful for debugging async flows or flaky selectors.

