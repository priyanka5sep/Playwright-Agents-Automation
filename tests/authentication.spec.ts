import { test, expect } from '../fixture/test.fixture';
import authenticationData from '../testdata/authentication.json';

const password = process.env.SAUCEDEMO_PASSWORD;

if (!password) {
  throw new Error('SAUCEDEMO_PASSWORD is required. Set it in the root .env file.');
}

test.describe('Authentication', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.login.open();
  });

  test('rejects blank credentials', async ({ pages, page }) => {
    await pages.login.submit();

    await pages.login.expectError(authenticationData.errors.missingUsername);
    await expect(page).toHaveURL('/');
  });

  test('requires a password when a username is provided', async ({ pages, page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(authenticationData.users.standard);
    await pages.login.submit();

    await pages.login.expectError(authenticationData.errors.missingPassword);
    await expect(page).toHaveURL('/');
  });

  test('rejects invalid credentials', async ({ pages, page }) => {
    await pages.login.signIn(authenticationData.users.invalid, authenticationData.invalidPassword);

    await pages.login.expectError(authenticationData.errors.invalidCredentials);
    await expect(page).toHaveURL('/');
  });

  test('rejects a locked-out user', async ({ pages, page }) => {
    await pages.login.signIn(authenticationData.users.lockedOut, password);

    await pages.login.expectError(authenticationData.errors.lockedOut);
    await expect(page).toHaveURL('/');
  });

  test('allows a standard user to sign in', async ({ pages }) => {
    await pages.login.signIn(authenticationData.users.standard, password);

    await pages.inventory.expectLoaded();
  });
});
