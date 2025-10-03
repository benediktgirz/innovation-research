import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test('should toggle mobile menu when burger icon is clicked', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Get the mobile menu button
    const mobileMenuButton = page.locator('#mobile-menu-button');

    // Verify button is visible on mobile
    await expect(mobileMenuButton).toBeVisible();

    // Get the mobile menu
    const mobileMenu = page.locator('#mobile-menu');

    // Verify mobile menu is initially hidden
    await expect(mobileMenu).toHaveClass(/hidden/);

    // Click the burger icon
    await mobileMenuButton.click();

    // Verify mobile menu is now visible (check it's actually visible on screen)
    await expect(mobileMenu).toBeVisible();

    // Verify aria-expanded attribute is updated
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');

    // Verify hamburger icon is hidden and close icon is visible
    const hamburgerIcon = mobileMenuButton.locator('svg').first();
    const closeIcon = mobileMenuButton.locator('svg').last();

    await expect(hamburgerIcon).toHaveClass(/hidden/);
    await expect(closeIcon).not.toHaveClass(/hidden/);

    // Click again to close
    await mobileMenuButton.click();

    // Verify mobile menu is hidden again
    await expect(mobileMenu).toHaveClass(/hidden/);

    // Verify aria-expanded attribute is updated
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');

    // Verify icons are toggled back
    await expect(hamburgerIcon).not.toHaveClass(/hidden/);
    await expect(closeIcon).toHaveClass(/hidden/);
  });

  test('should display navigation links in mobile menu', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Click the burger icon to open menu
    await page.locator('#mobile-menu-button').click();

    // Get the mobile menu
    const mobileMenu = page.locator('#mobile-menu');

    // Verify navigation links are visible
    await expect(mobileMenu.locator('a:has-text("Study Overview")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Participate")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("About")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Contact")')).toBeVisible();
  });

  test('should display language switcher in mobile menu', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Click the burger icon to open menu
    await page.locator('#mobile-menu-button').click();

    // Get the mobile menu
    const mobileMenu = page.locator('#mobile-menu');

    // Verify language switcher is visible
    await expect(mobileMenu.locator('text=Language')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("English")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Deutsch")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Français")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Español")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Italiano")')).toBeVisible();
  });

  test('should not show mobile menu button on desktop', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Mobile menu button should not be visible on desktop
    const mobileMenuButton = page.locator('#mobile-menu-button');
    await expect(mobileMenuButton).not.toBeVisible();
  });

  test('should work on German page', async ({ page }) => {
    await page.goto('http://localhost:3000/de/');

    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Click the burger icon
    await page.locator('#mobile-menu-button').click();

    // Get the mobile menu
    const mobileMenu = page.locator('#mobile-menu');

    // Verify German navigation links are visible
    await expect(mobileMenu.locator('a:has-text("Studienübersicht")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Teilnehmen")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Über uns")')).toBeVisible();
    await expect(mobileMenu.locator('a:has-text("Kontakt")')).toBeVisible();
  });
});
