// tests/signup.spec.ts
import { test, expect } from '@playwright/test';
import { usersForSignup } from '../fixtures/users';
import { signup_Page } from '../pages/signup.pages';

test.describe('Signup Flow', () => {
  let signup: signup_Page;

  test.beforeEach(async ({ page }) => {
    signup = new signup_Page(page);
    await signup.goto();
  });

  // Invalid email - empty
  test('Verify Signup with empty email', async () => {
    const u = usersForSignup.invalidEmailEmpty;
    await signup.fillEmail(u.email);
    await signup.submitBtn();
    await signup.expectErrorMessage('Please enter an email address');
  });

  // Invalid email - wrong format
  test('Verify Signup with invalid email format', async () => {
    const u = usersForSignup.invalidEmailFormat;
    await signup.fillEmail(u.email);
    await signup.submitBtn();
    await signup.expectErrorMessage('Email is not valid.');
  });

  // Invalid email - domain not accepted
  test('Verify Signup with not accepted domain email', async () => {
    const u = usersForSignup.invalidEmailDomain;
    await signup.fillEmail(u.email);
    await signup.submitBtn();
    await signup.fillUsername(u.username);
    await signup.fillPassword(u.password);
    await signup.submitBtn();
    await signup.expectErrorMessage(`User registration is not allowed in this Application invalid email ${u.email}`);
  });

  // Already registered email
  test('Verify Signup with already registered email', async () => {
    const u = usersForSignup.registered;
    await signup.fillEmail(u.email);
    await signup.submitBtn();
    await signup.fillUsername(usersForSignup.valid.username);
    await signup.fillPassword(usersForSignup.valid.password);
    await signup.submitBtn();
    await signup.expectErrorMessage('We couldn’t complete your registration. Please try again or contact us for support.');
  });

  // Invalid username - empty
  test('Verify Signup with empty username', async () => {
    const u = usersForSignup.invalidUsernameEmpty;
    await signup.fillEmail(u.email);
    await signup.submitBtn();
    await signup.submitBtn();
    await signup.expectErrorMessage('Username is required');
  });

  // Invalid password - empty
  test('Verify Signup with empty password', async () => {
    const u = usersForSignup.invalidPasswordEmpty;
    await signup.fillEmail(u.email);
    await signup.submitBtn();
    await signup.fillUsername(u.username);
    await signup.submitBtn();
    await signup.expectErrorMessage('Password is required');
  });

  // Invalid password - too short
  test('Verify Signup with password too short', async () => {
    const u = usersForSignup.invalidPasswordTooShort;
    await signup.fillEmail(u.email);
    await signup.submitBtn();
    await signup.fillUsername(u.username);
    await signup.fillPassword(u.password);
    await signup.submitBtn();
    await signup.expectErrorMessage('The password is too weak');
  });

  // Invalid password - too weak (fails 3-of-4 rules)
  test('Verify Signup with weak password', async () => {
    const u = usersForSignup.invalidPasswordTooWeak;
    await signup.fillEmail(u.email);
    await signup.submitBtn();
    await signup.fillUsername(u.username);
    await signup.fillPassword(u.password);
    await signup.submitBtn();
    await signup.expectErrorMessage('The password is too weak');
  });

});
