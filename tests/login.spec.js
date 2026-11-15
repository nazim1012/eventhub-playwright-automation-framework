import { test, expect } from '@playwright/test'
import { LoginPage } from '../pageobjects/loginPage'
import {LoginPageApiUtil} from '../utils/loginApi_Util'
import loginData from '../test-data/loginData.json'
test.use({storageState:{cookies:[],origins:[]}})
/** @type {LoginPage} */
let loginpage;
test.describe('Login Test', () => {
  test.beforeEach(async ({ page }) => {
    loginpage = new LoginPage(page);
    await loginpage.goto();
  })
  test('verify all login page elements', async () => {
    await loginpage.verifyLoginPage()
  })


  // verify password masking
  test('verify password field is masked', async () => {
    await expect(loginpage.passwordInput).toHaveAttribute('type', 'password');
  })

  // verify login with vaild credentials
  test('verify login with vaild credentials', async ({ page }) => {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    if (!email || !password) {
      throw new Error('Login credentials missing in .env');
    }
    await loginpage.fillLoginDetails(email, password);
    await loginpage.clickLogin();
    await expect(page.getByText('Logout')).toBeVisible();
    await page.getByText('Logout').click();
  })

  // verify login with invalid cred
  for (const [index, data] of loginData.invalidLogin.entries()) {
    test(`testing with inValid Credentials ${index + 1}`, async ({page}) => {
      await loginpage.fillLoginDetails(data.email,data.password);
      await loginpage.clickLogin();
      await expect(page).toHaveURL(/login/);
    })
  }

  test('Verify session token expires upon user logout', async ({ page }) => {
    // Documents the known security bug while keeping CI green until fixed
    test.fail(true, 'BUG-101: Backend does not invalidate JWT token upon user logout');
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    if (!email || !password) {
      throw new Error('Login credentials missing in .env');
    }
    await loginpage.fillLoginDetails(email, password);
    await loginpage.clickLogin();
    await expect(page.getByText('Logout')).toBeVisible();
    const oldToken = await loginpage.getAuthToken();
    await page.getByText('Logout').click();
    await expect(page).toHaveURL(/login/);  
    const apiutils= new LoginPageApiUtil(page.request);
    const response= await apiutils.getProtectedResource(`${process.env.API_URL}/events?limit=6`,oldToken);
    console.log('Response status code:', response.status());
    console.log('Response body:', await response.json());
    expect([401,403],`Expected status code to be 401 or 403, but got ${response.status()}`).toContain(response.status());
  })
})