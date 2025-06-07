import test, { expect } from "@playwright/test";

test.describe("[UI] [Heroku] Dynamic Controls", () => {

  test.beforeEach(async ({ page }) => {
    //arrange
    await page.goto("https://the-internet.herokuapp.com/");
    const dynamiccontrolsLink = page.getByRole('link', { name: 'Dynamic Controls' });
    await dynamiccontrolsLink.click();
  })
  test("Dynamic Controls page test", async ({ page }) => {
    const removeButton = page.getByRole('button', { name: 'Remove' });
    const addButton = page.getByRole('button', { name: 'Add' });
    const checkbox = page.locator('input[type="checkbox"]');
    const message = page.locator('#message');
    const heading = page.getByRole('heading', { name: 'Dynamic Controls' });

    await expect(removeButton).toBeVisible();
    await expect(heading).toHaveText('Dynamic Controls');

    // Remove
    await checkbox.check();
    await removeButton.click();
    await expect(message).toHaveText("It's gone!");
    await expect(checkbox).toBeHidden();

    // Add
    await addButton.click();
    await expect(message).toHaveText("It's back!");
    await expect(checkbox).toBeVisible();
  })
});