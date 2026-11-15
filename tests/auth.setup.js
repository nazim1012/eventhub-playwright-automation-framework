import { test, expect } from '@playwright/test'
import { LoginPage } from '../pageobjects/loginPage'
const authFile = '.auth/user.json'
test('verify login with valid credentials', async ({ page }) => {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    if (!email || !password) {
        throw new Error('Login credentials missing in .env');
    }
    const loginpage = new LoginPage(page);
    await loginpage.goto();
    await loginpage.fillLoginDetails(email, password);
    await loginpage.clickLogin();
    await expect(page.getByText('Logout')).toBeVisible();
    await page.context().storageState({path: authFile});
})
