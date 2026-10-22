import { expect, test } from '@playwright/test';

test('locale, dark theme, help and keyboard controls preserve honest states', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('لم يبدأ القياس');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await page.getByRole('button', { name: 'Change theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(17, 19, 24)');
  await page.getByRole('button', { name: 'How it works' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Only your household connection' })).toBeVisible();
  await page.getByRole('button', { name: 'Devices', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'No device data yet' })).toBeVisible();
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`responsive RTL/LTR and 200% text at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'English' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your usage, clearly');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const button of await page.getByRole('button').all()) {
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    }
  });
}
