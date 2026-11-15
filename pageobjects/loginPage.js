import {test,expect}  from '@playwright/test'
export class LoginPage{
    /** @param {import('@playwright/test').Page} page */
    constructor(page){
        this.page=page;
        // Locators 
        this.emailInput=page.getByPlaceholder('you@email.com');
        this.passwordInput=page.getByPlaceholder('••••••');
        this.loginButton=page.getByRole('button',{name:'Sign In'});

        // validation messages
        this.emailError=page.getByText('Enter a valid email');
        this.passwordError=page.getByText('Password must be at least 6 characters');
        this.invaildCredError=page.getByText('Invalid email or password');
    }
    async goto(){
        await this.page.goto('/login');
    }

    async verifyLoginPage(){
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }
    async fillLoginDetails(email,password){
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }
    async clickLogin(){
        await this.loginButton.click();
    }
    async getAuthToken(){
        const token= await this.page.evaluate(() => localStorage.getItem('eventhub_token'));
        if(!token){
            throw new Error('Auth token not found in local storage');
        }
        return token;
    }
}