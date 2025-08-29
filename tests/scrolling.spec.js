import { test, expect } from '@playwright/test';

test.describe('Scrolling Behavior Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load and GSAP to initialize
    await page.waitForTimeout(2000);
  });

  test('intro content should be centered initially', async ({ page }) => {
    const introContent = page.locator('#intro-content');
    await expect(introContent).toBeVisible();
    
    // Check that intro content is centered
    const boundingBox = await introContent.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    // Should be roughly centered (allowing for some tolerance)
    expect(boundingBox.y).toBeGreaterThan(viewportHeight * 0.4);
    expect(boundingBox.y).toBeLessThan(viewportHeight * 0.6);
  });

  test('menu items should be visible and positioned correctly', async ({ page }) => {
    const menuItems = page.locator('#menu-items');
    await expect(menuItems).toBeVisible();
    
    // Check that menu items are below the title
    const title = page.locator('#intro-title');
    const titleBox = await title.boundingBox();
    const menuBox = await menuItems.boundingBox();
    
    expect(menuBox.y).toBeGreaterThan(titleBox.y + titleBox.height);
  });

  test('scrolling should move intro content', async ({ page }) => {
    const introContent = page.locator('#intro-content');
    const initialPosition = await introContent.boundingBox();
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    const newPosition = await introContent.boundingBox();
    
    // Position should have changed
    expect(newPosition.y).not.toBe(initialPosition.y);
  });

  test('menu items should stick to top when scrolling', async ({ page }) => {
    const menuItems = page.locator('#menu-items');
    
    // Get initial position
    const initialPosition = await menuItems.boundingBox();
    
    // Scroll down significantly
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(1000);
    
    const newPosition = await menuItems.boundingBox();
    
    // Menu items should be near the top of the viewport (5% + title height)
    expect(newPosition.y).toBeLessThan(150);
  });

  test('intro image should have animation applied', async ({ page }) => {
    const introImage = page.locator('#intro-image img');
    await expect(introImage).toBeVisible();
    
    // Check if GSAP animations are running by looking for transform changes
    const initialTransform = await introImage.evaluate(el => el.style.transform);
    
    // Wait for animation to potentially change
    await page.waitForTimeout(2000);
    
    const newTransform = await introImage.evaluate(el => el.style.transform);
    
    // Transform should have changed due to GSAP animation
    expect(newTransform).not.toBe(initialTransform);
  });

  test('page should be responsive to different viewport sizes', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const introContent = page.locator('#intro-content');
    await expect(introContent).toBeVisible();
    
    // Test on desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    await expect(introContent).toBeVisible();
  });
});
