import { expect, test } from '@playwright/test';
export class EventPage {
    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;
        // Locators 
        this.serachEventInput = page.getByPlaceholder('Search events, venues…');
        this.categoryDropdown = page.locator('select', { hasText: 'All Categories' });
        this.cityDropdown = page.locator('select', { hasText: 'All Cities' });
        this.events = page.locator('div.p-4.flex.flex-col.flex-1');
        this.bookEventButton = page.getByTestId('book-now-btn');
        this.clearFilterButton = page.getByRole('button', { name: 'Clear filters' });

        // events headings
        this.dilliDiwaliMela = page.getByRole('heading', { name: 'Dilli Diwali Mela' });
        this.hollywoodEvent = page.getByRole('heading', { name: /Hollywood Monsoon Night/ });
        this.worldTechSummit = page.getByRole('heading', { name: 'World Tech Summit' });

        // booking form locators
        this.nameInput = page.getByPlaceholder('Your full name');
        this.emailInput = page.getByPlaceholder('you@email.com');
        this.phoneInput = page.getByLabel('Phone Number');
        this.confirmBookingButton = page.getByRole('button', { name: 'Confirm Booking' });
        this.basePrice = page.locator('.text-2xl.font-bold.text-indigo-700');
        this.increaseTickcetQuantityButton = page.getByRole('button', { name: '+' });
        this.ticketCount = page.locator('#ticket-count');
        this.totalPrice = page.locator('.text-indigo-700').nth(1);
        this.confirmBookingMessage = page.getByText('Booking Confirmed! 🎉');

        this.eventCards = page.locator('#event-card');
        this.banner = page.getByText('Your sandbox holds up to ');

    }
    async goto() {
        await this.page.goto('/events');
    }
    async searchEvents(text) {
        await this.serachEventInput.fill(text);
    }
    async getEventCount() {
        return await this.events.count();
    }
    async bookEvents(eventName) {
        const card = this.events.filter({ has: this.page.getByRole('heading', { name: eventName }) });
        await card.getByTestId('book-now-btn').click();
    }
    async filterEventsByCategory(category) {
        await this.categoryDropdown.selectOption({ label: category });
    }
    async cityDropdownSelect(city) {
        await this.cityDropdown.selectOption({ label: city });
    }
    async fillBookingDetails(name, email, phoneNo) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.phoneInput.fill(phoneNo);
    }
    async priceVerification() {
        const basePriceText = await this.basePrice.textContent();
        const numericBasePrice = Number(basePriceText.replace(/[^0-9.]/g, ''));
        const ticketCount = await this.ticketCount.textContent();
        const expectedTotalPrice = numericBasePrice * Number(ticketCount);
        await expect(this.totalPrice).toHaveText(`$${expectedTotalPrice.toLocaleString('en-US')}`);
    }
    async confirmBooking() {
        await this.confirmBookingButton.click();
    }
    async increaseTicketQuantity() {
        await this.increaseTickcetQuantityButton.click();
    }
    async mockEventResponse(mockResponse) {
        await this.page.route("**/api/events**", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockResponse)
            });
        })
    }

}