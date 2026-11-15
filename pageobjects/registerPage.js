import {test,expect} from '@playwright/test'

export class RegisterPage{
    constructor(page){
        this.page=page;
        //Locators
        this.emailInput=page.getByPlaceholder('you@email.com');
        this.passwordInput=page.getByPlaceholder('Min 8 chars, uppercase, number & symbol');
        this.confirmPasswordInput=page.getByPlaceholder('Repeat your password');
        this.createAccountButton=page.getByRole('button',{name:'Create Account'});

        //validation message 
        this.emailError=page.getByText('Enter a valid email');
        this.passwordError=page.getByText('Password does not meet the requirements below');
        this.confirmPasswordError=page.getByText('Passwords do not match');
    }
    // navigate to registration page
    async goto(){
        await this.page.goto('/register')
    }
    // fill registration form
    async fillRegistrationForm(email,password,confirmPassword){
        await this.page.waitForLoadState('networkidle');
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    //click Create account
    async submitForm(){
        await this.createAccountButton.click();
    }

    // verify registration page
    async verifyRegistrationPage(){
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.confirmPasswordInput).toBeVisible();
        await expect(this.createAccountButton).toBeVisible();
    }

}