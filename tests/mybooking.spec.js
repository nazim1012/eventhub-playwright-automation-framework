import { test, expect } from '@playwright/test';
import { MyBookings } from '../pageobjects/mybooking';
import { EventPage } from '../pageobjects/eventPage';
import { CreateEvents } from '../utils/createEventApi';
/**@type {MyBookings} */
let bookingPage;
let api;
let eventTitle;
let eventId;
test.describe(`Booking Tests`, () => {
  test.beforeEach(async ({ page, request }) => {

    // get token from logged in session
    await page.goto('/');
    const token = await page.evaluate(() => localStorage.getItem('eventhub_token'));
    // Create a unique event Via API
    api = new CreateEvents(request, token);
    const event = await api.createEvent();
    eventTitle = event.title;
    eventId = event.id;

    // booking via ui
    const eventPage = new EventPage(page);
    await eventPage.goto();
    await eventPage.bookEvents(eventTitle);
    await eventPage.fillBookingDetails('John Doe', 'john.doe@email.com', '1234567890');
    await eventPage.confirmBooking();
    await expect(eventPage.confirmBookingMessage).toBeVisible();

    // open my bookings
    bookingPage = new MyBookings(page);
    await bookingPage.goto()
  });
  test('view booking details', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await bookingPage.viewBooking(eventTitle);
  });
  test('cancel booking', async ({ page }) => {
    await bookingPage.cancelBooking(eventTitle);
    await bookingPage.confirmCancellation();
    await expect(bookingPage.successCancellationMessage).toBeVisible();
  });
  test.afterEach(async () => {
    if (eventId) {
      await api.deleteEvent(eventId);
      console.log(`deleted event ${eventId}`)
      eventId = undefined; 
    }
  })
});