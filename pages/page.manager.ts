import type { Page } from '@playwright/test';
import { InventoryPage } from './inventory.page';
import { LoginPage } from './login.page';
import { ProductDetailsPage } from './product-details.page';

export class PageManager {
  readonly login: LoginPage;
  readonly inventory: InventoryPage;
  readonly productDetails: ProductDetailsPage;

  constructor(page: Page) {
    this.login = new LoginPage(page);
    this.inventory = new InventoryPage(page);
    this.productDetails = new ProductDetailsPage(page);
  }
}
