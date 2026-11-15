import { test, expect } from '@playwright/test'
import { RegisterPage } from '../pageobjects/registerPage'
import registrationData from '../test-data/registrationData.json'
test.use({storageState:{cookies:[],origins:[]}})
/** @type {RegisterPage} */

let registerPage;
test.describe("registration page ", () => {
    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        await registerPage.goto();
    })


    //verify Ui Elements
    test("verify UI registration page UI Elements", async ({ page }) => {
        await registerPage.verifyRegistrationPage();

    })

    // verify empty field validation
    test('Verify validation for empty fields', async () => {

        await registerPage.submitForm();
        await expect(registerPage.emailError).toBeVisible();
        await expect(registerPage.passwordError).toBeVisible();


    });

    // verify invaild email formats
    for (const email of registrationData.invalidEmails) {
        test(`Verify invalid email: ${email}`, async () => {
            await registerPage.emailInput.fill(email);
            await registerPage.passwordInput.fill('Test@12345');
            await registerPage.confirmPasswordInput.fill('Test@12345');
            await registerPage.submitForm();
            await expect(registerPage.emailError).toBeVisible();
        });
    }

    // verify weak password validation 
    for (const password of registrationData.weakPasswords) {
        test(`verify weak password validation ${password}`, async () => {
            await registerPage.emailInput.fill('Xyz@gmail.com');
            await registerPage.passwordInput.fill(password);
            await registerPage.submitForm();
            await expect(registerPage.passwordError).toBeVisible();
            await expect(registerPage.confirmPasswordError).toBeVisible();
        })
    }

    // verify pasword mismatch
    test('Verify password mismatched', async () => {
        await registerPage.emailInput.fill('xyz@gmail.com');
        await registerPage.passwordInput.fill('Xyz@61617');
        await registerPage.confirmPasswordInput.fill('Xyz@12r25');
        await registerPage.submitForm();
        await expect(registerPage.confirmPasswordError).toBeVisible();
    })

    // verify user is able create account with valid credentials
    test("Verify user creation", async ({page}) => {
        const email = "test"+Math.floor(Math.random() * 10000) + "@gmail.com";
        const password = process.env.PASSWORD;
        await registerPage.fillRegistrationForm(email, password, password);
        await registerPage.submitForm();
        await expect(page).toHaveURL('/');
        

    })
})