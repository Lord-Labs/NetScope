import { expect, test } from '@playwright/test';

/** Converts a computed CSS duration ("1e-05s", "0.01ms") to seconds. */
function durationInSeconds(value: string): number {
  const amount = Number.parseFloat(value);
  return value.trim().endsWith('ms') ? amount / 1000 : amount;
}

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

test('overview never fakes usage and the gallery labels its examples', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.metric')).toHaveText('–');
  await expect(page.locator('.metric')).toHaveAttribute('aria-label', 'الاستهلاك غير معروف');
  await expect(page.locator('main')).not.toContainText(/\d\s?(?:B|KB|MB|GB|TB)\b/);
  await page.getByRole('button', { name: 'الحالات', exact: true }).click();
  await expect(page.getByRole('note')).toContainText('قيم توضيحية فقط');
  await expect(page.locator('[data-usage="measured-zero"]')).toContainText('B');
});

test('state gallery opens from the keyboard with explicit labels and a working demo', async ({ page }) => {
  await page.goto('/');
  const states = page.getByRole('button', { name: 'الحالات', exact: true });
  for (let step = 0; step < 8 && !(await states.evaluate((element) => element === document.activeElement)); step += 1) {
    await page.keyboard.press('Tab');
  }
  await expect(states).toBeFocused();
  await expect(states).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('حالات الواجهة');
  await expect(page.getByRole('note')).toContainText('قيم توضيحية فقط');
  await expect(page.locator('[data-usage="unknown"]')).toContainText('–');
  await expect(page.locator('[data-usage="unknown"]')).toContainText('لا يوجد رصد لهذه الفترة بعد');
  await expect(page.locator('[data-usage="measured-zero"]')).toContainText('B');
  await expect(page.locator('[data-usage="estimated"]')).toContainText('≈');
  await expect(page.locator('[data-usage="estimated"]')).toContainText('تقديري');
  await expect(page.locator('[data-usage="partial"]')).toContainText('جزئي');
  await expect(page.locator('[data-history="error"]')).toContainText('تعذر تحميل الفترات.');
  await expect(page.locator('[data-history="ready"]')).toContainText('فجوة');
  await expect(page.locator('[data-status="unsupported"]')).toContainText('غير مدعوم على هذا الجهاز');
  await expect(page.locator('[data-freshness="offline"]')).toContainText('غير متصل');
  await expect(page.locator('[data-setup="success"]')).toContainText('نجاح في المكان');

  await page.getByRole('button', { name: 'إعادة المحاولة', exact: true }).click();
  await expect(page.getByText('نجاح توضيحي — لم يُطلب إذن ولم يبدأ قياس.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'إعادة العرض', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'تغيير المظهر' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Interface states');
  await expect(page.getByRole('heading', { name: 'Measured zero' })).toBeVisible();
  await expect(page.locator('[data-usage="unknown"]')).toContainText('No reading covers this period yet.');
});

test('language and theme preferences survive a reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('button', { name: 'Change theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your usage, clearly');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('reduced motion shows gallery states immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'الحالات', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'صفر مقيس' })).toBeVisible();
  const durations = await page.locator('.ns-feedback').evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).transitionDuration),
  );
  expect(durations.length).toBeGreaterThan(0);
  for (const duration of durations) expect(durationInSeconds(duration)).toBeLessThanOrEqual(0.001);
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

    await page.getByRole('button', { name: 'States', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Interface states');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const button of await page.getByRole('button').all()) {
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    }
    await page.getByRole('button', { name: 'العربية' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('حالات الواجهة');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
