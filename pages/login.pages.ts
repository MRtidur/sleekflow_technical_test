import {Page, expect} from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    async goto(){
        await this.page.goto('https://sleekflow.io');
        const [newTab] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.page.getByRole('link', {name: 'Log In'}).click(),
        ]);
        await newTab.waitForLoadState();
        this.page = newTab;
    }

    async fillEmail(email: string){
        await this.page.getByRole('textbox', {name: 'Email or username'}).fill(email);
    }

    async continue(){
        await this.page.locator('button[type="submit"][name="action"]').click();
    }

    async fillPassword(password: string){
        await this.page.getByRole('textbox', {name: 'Password'}).fill(password);
    }

    async signIn(){
        await this.page.getByRole('button', {name: 'Sign in'}).click();
    }

    async expectErrorMessage(message: string){
        const locator = this.page.getByText(message);
        await expect(locator).toBeVisible();
    }

    async verifyLoginSuccess(){
        // Wait until URL contains '/en/inbox' using URL.href
        await this.page.waitForURL((url) => url.href.includes('/en/inbox'), { timeout: 30000 });

        // Then check that the "Assigned to me" heading is visible
        await expect(this.page.getByRole('heading', { name: 'Assigned to me', level: 2 })).toBeVisible();
    }
}