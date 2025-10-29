// import { test, expect } from '@playwright/test';


// test('test case 1', async ({context, page}) => {
//   await page.goto('https://sleekflow.io');
//   const [newTab] = await Promise.all([
//     context.waitForEvent('page'),      // Wait for new tab
//     await page.getByRole('link', { name: 'Log In' }).click()
//   ]);
  
//   await newTab.waitForLoadState();
//   await newTab.getByRole('textbox', { name: 'Email or username' }).fill('sleekflowinterview@gmail.com');
//   await newTab.getByRole('button', {name: 'Continue', exact: true}).click();
//   await newTab.getByRole('textbox', { name: 'Password' }).fill('Abcde123#');
//   await newTab.getByRole('button', {name: 'Sign in'}).click();
//   await newTab.waitForLoadState();
//   await expect(newTab).toHaveURL(/.*\/en\/inbox/);


    

  
// });