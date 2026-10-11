import { expect, type Page } from '@playwright/test';
import type { CatalogProduct } from './product.types';

export class ProductDetailsPage {
  constructor(private readonly page: Page) {}

  async expectProduct(product: CatalogProduct): Promise<void> {
    await expect(this.page).toHaveURL(/inventory-item\.html\?id=\d+$/);
    await expect(this.page.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
    await expect(this.page.locator('[data-test="inventory-item-desc"]')).toHaveText(product.description);
    await expect(this.page.locator('[data-test="inventory-item-price"]')).toHaveText(product.price);
    await expect(this.page.getByRole('img', { name: product.name })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
  }

  async expectRemoveButton(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async backToProducts(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to products' }).click();
  }
}
