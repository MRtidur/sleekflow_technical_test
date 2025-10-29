import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login.pages';
import { usersForLogin } from '../fixtures/users';
import { log } from 'console';

test.describe('Login Flow', () => {
    let login: LoginPage;

    test.beforeEach(async ({page}) => {
        login = new LoginPage(page);
        await login.goto();
      });

    test('Verify Login with valid credentials', async () => {
        await login.fillEmail(usersForLogin.valid.email);
        await login.continue();
        await login.fillPassword(usersForLogin.valid.password);
        await login.signIn();
        await login.verifyLoginSuccess();


    });


    test('Verify Login with not registered email', async () => {
        await login.fillEmail(usersForLogin.invalidEmail.email);
        await login.continue();
        await login.fillPassword(usersForLogin.valid.password);
        await login.signIn();

        await login.expectErrorMessage('Wrong username or password');
    });

    test('Verify Login with invalid password', async () => {
        await login.fillEmail(usersForLogin.valid.email);
        await login.continue();
        await login.fillPassword(usersForLogin.invalidPassword.password);
        await login.signIn();

        await login.expectErrorMessage('Wrong username or password');
    });

    test('Verify Login with empty email field', async () => {

        await login.continue();

        await login.expectErrorMessage('Email address or username is required');
    });


    test('Verify Login with empty password field', async () => {

        await login.fillEmail(usersForLogin.valid.email);
        await login.continue();
        await login.signIn();

        await login.expectErrorMessage('Password is required');
    });
    
});