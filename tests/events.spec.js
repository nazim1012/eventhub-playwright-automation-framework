import { test, expect } from '@playwright/test';
import { EventPage } from '../pageobjects/eventPage';
import mockEventData from '../test-data/eventMockData.json'
/**@type{EventPage} */
let eventPage;
test.describe('Event Tests', () => {
  test.beforeEach(async ({ page }) => {
    eventPage = new EventPage(page);
    await eventPage.goto();
  })
  test('verify search functionality', async () => {
    await eventPage.searchEvents('Dilli');
    await expect(eventPage.dilliDiwaliMela).toBeVisible();
  });
  test('verify event Dropdown functionality', async () => {
    await eventPage.filterEventsByCategory('🎙 Conference');
    await expect(eventPage.worldTechSummit).toBeVisible();
  });
  test('verify city Dropdown functionality', async () => {
    await eventPage.cityDropdownSelect('Delhi');
    await expect(eventPage.dilliDiwaliMela).toBeVisible();
  });
  test('verify clear filter functionality', async () => {
    await eventPage.filterEventsByCategory('🎙 Conference');
    await eventPage.clearFilterButton.click();
    await expect(eventPage.dilliDiwaliMela).toBeVisible();
    await expect(eventPage.hollywoodEvent).toBeVisible();
    await expect(eventPage.worldTechSummit).toBeVisible();
  });
  
  test('verify booking functionality', async () => {
    await eventPage.bookEvents('Hollywood');
    await eventPage.fillBookingDetails('John Doe', 'john.doe@email.com', '1234567890');
    await eventPage.priceVerification();
    await eventPage.confirmBookingButton.click();
    await expect(eventPage.confirmBookingMessage).toBeVisible();
  });
  test('Banner should be visible when 6 events are Displayed',async()=>{
    await eventPage.mockEventResponse(mockEventData.sixEvents);
    await expect(eventPage.eventCards).toHaveCount(6);
    await expect(eventPage.banner).toBeVisible();
  })
  test('banner should not be visible when 4 events are displayed',async()=>{
    await eventPage.mockEventResponse(mockEventData.fourEvents);
    await expect(eventPage.eventCards).toHaveCount(4);
    await expect(eventPage.banner).toBeHidden();
  })
  });