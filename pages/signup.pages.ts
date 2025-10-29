import {Page, expect} from '@playwright/test';


export class signup_Page{
    constructor(private page: Page){}
    
    async goto(){
        await this.page.goto('https://sleekflow.io');
        const [newTab] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.page.getByRole('link', {name: 'Log In'}).click(),
        ]);
        await newTab.waitForLoadState();
        this.page = newTab;
        await this.page.getByRole('link', { name: 'Sign up' }).click();
        await expect(this.page.getByText('Sign up for your SleekFlow account to continue')).toBeVisible();
    }

    async fillEmail(email: string){
        await this.page.getByRole('textbox', {name: 'Email address'}).fill(email);
    }
    async fillUsername(username: string){
        await this.page.getByRole('textbox', {name: 'Username'}).fill(username);
    }
    async fillPassword(password: string){
        await this.page.getByRole('textbox', {name: 'Password'}).fill(password);
    }
    async submitBtn(){
        await this.page.getByRole('button', {name: 'Sign Up'}).click();
    }

    async expectErrorMessage(message: string){
        const locator = this.page.getByText(message);
        await expect(locator).toBeVisible();
    }
}