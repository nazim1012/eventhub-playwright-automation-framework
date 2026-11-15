import { expect, test } from '@playwright/test';
export class MyBookings {
    constructor(page) {
        this.page = page;
        // Locators
        this.allBookings = page.locator('#booking-card');
        this.viewDetailsButton = page.getByRole('button', { name: 'View Details' });
        this.cancelBookingButton = page.getByRole('button', { name: 'Cancel Booking' });
        this.bookingTitle = page.locator('h3.font-semibold');
        this.confirmCancellationButton = page.getByRole('button', { name: 'Yes, cancel it' });
        this.dismissCancellationButton = page.getByRole('button', { name: 'Cancel' });

        //verification locators
        this.successCancellationMessage = page.getByText('Booking cancelled successfully');
    }
    async goto() {
        await this.page.goto('/bookings');
    }
    async getBookingCount() {
        return await this.allBookings.count();
    }
    async viewBooking(bookingTitle) {
        const card = this.allBookings.filter({ hasText: bookingTitle });
        await expect(card.getByRole('button', { name: 'View Details' })).toBeVisible();
        return card;
    }
    async cancelBooking(bookingTitle) {
        const card = await this.viewBooking(bookingTitle);
        await card.locator(this.cancelBookingButton).click();
    }
    async confirmCancellation() {
        await this.confirmCancellationButton.click();
    }
    async dismissCancellation() {
        await this.dismissCancellationButton.click();
    }
}