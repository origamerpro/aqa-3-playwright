import test, { expect } from "@playwright/test";

test.describe("[UI] [Heroku] Dynamic Controls", () => {

  test.beforeEach(async ({ page }) => {
    //arrange
    await page.goto("https://the-internet.herokuapp.com/");
    const dynamiccontrolsLink = page.getByRole('link', { name: 'Dynamic Controls' });
    await dynamiccontrolsLink.click();
  })
  test("Dynamic Controls page test", async ({ page }) => {
    //act
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
    const header = page.getByRole('heading', { name: 'Dynamic Controls' }).innerText();
    expect(await header).toBe('Dynamic Controls');
    await page.getByRole('checkbox').check();
    //assert
    await page.getByRole('button', { name: 'Remove' }).click();
    await page.waitForFunction(() => {
      const checkbox = document.querySelector('[type="checkbox"]');
      const button = document.querySelector('[onclick="swapCheckbox()"]')?.textContent;
      const message = document.querySelector('#message')?.textContent;
      return !checkbox && button ==='Add' && message === 'It\'s gone!';
    }, { timeout: 5000 });
    await page.getByRole('button', { name: 'Add' }).click();
    await page.waitForFunction(() => {
      const checkbox = document.querySelector('[type="checkbox"]');
      const button = document.querySelector('[onclick="swapCheckbox()"]')?.textContent;
      const message = document.querySelector('#message')?.textContent;
      return checkbox && button ==='Remove' && message === 'It\'s back!';
    }, { timeout: 5000 });
  })
});