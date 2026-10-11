import { test as base, expect } from '@playwright/test';
import { PageManager } from '../pages/page.manager';
import authenticationData from '../testdata/authentication.json';

type TestFixtures = {
  pages: PageManager;
  authenticatedPages: PageManager;
};

export const test = base.extend<TestFixtures>({
  pages: async ({ page }, use) => {
    await use(new PageManager(page));
  },
  authenticatedPages: async ({ page }, use) => {
    const password = process.env.SAUCEDEMO_PASSWORD;
    if (!password) {
      throw new Error('SAUCEDEMO_PASSWORD is required. Set it in the root .env file.');
    }

    const pageManager = new PageManager(page);
    await pageManager.login.open();
    await pageManager.login.signIn(authenticationData.users.standard, password);
    await pageManager.inventory.expectLoaded();
    await use(pageManager);
  },
});

export { expect };
