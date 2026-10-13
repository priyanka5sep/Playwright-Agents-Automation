import { expect, type Page } from '@playwright/test';
import type { CatalogProduct } from './product.types';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  private productCard(name: string) {
    return this.page.locator('.inventory_item').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html$/);
    
    await expect(this.page.locator('[data-test="title"]')).toHaveText('Products');
  }

  async expectProducts(products: CatalogProduct[]): Promise<void> {
    const cards = this.page.locator('.inventory_item');
    await expect(cards).toHaveCount(products.length);

    for (const product of products) {
      const card = this.productCard(product.name);
      await expect(card).toBeVisible();
      await expect(card.getByRole('img', { name: product.name })).toBeVisible();
      await expect(card.locator('[data-test="inventory-item-desc"]')).toHaveText(product.description);
      await expect(card.locator('[data-test="inventory-item-price"]')).toHaveText(product.price);
      await expect(card.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }
  }

  async expectProductNames(names: string[]): Promise<void> {
    await expect(this.page.locator('[data-test="inventory-item-name"]')).toHaveText(names);
  }

  async expectProductNamesContain(names: string[]): Promise<void> {
    const actualNames = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(actualNames).toHaveLength(names.length);
    expect(actualNames).toEqual(expect.arrayContaining(names));
  }

  async expectPriceOrder(ascending: boolean, firstPrice: string, lastPrice: string): Promise<void> {
    const priceTexts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    const prices = priceTexts.map((price) => Number(price.replace('$', '')));
    const sortedPrices = [...prices].sort((left, right) => ascending ? left - right : right - left);

    expect(prices).toEqual(sortedPrices);
    await expect(this.page.locator('[data-test="inventory-item-price"]').first()).toHaveText(firstPrice);
    await expect(this.page.locator('[data-test="inventory-item-price"]').last()).toHaveText(lastPrice);
  }

  async sortBy(value: string): Promise<void> {
    await this.page.getByRole('combobox', { name: 'Sort products' }).selectOption(value);
  }

  async openProductFromImage(product: CatalogProduct): Promise<void> {
    await this.productCard(product.name)
      .getByRole('button', { name: `View details for ${product.name}` })
      .first()
      .click();
  }

  async openProductFromName(product: CatalogProduct): Promise<void> {
    await this.productCard(product.name)
      .getByRole('button', { name: `View details for ${product.name}` })
      .last()
      .click();
  }

  async addProduct(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async expectProductCanBeRemoved(name: string): Promise<void> {
    await expect(this.productCard(name).getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async expectCartCount(count: number): Promise<void> {
    const badge = this.page.locator('[data-test="shopping-cart-badge"]');

    if (count === 0) {
      await expect(badge).toHaveCount(0);
      return;
    }

    await expect(badge).toHaveText(String(count));
  }

  async openMenu(): Promise<void> {
    const navigation = this.page.getByRole('navigation');
    if (!(await navigation.isVisible())) {
      await this.page.getByRole('button', { name: 'Open Menu' }).click();
      await expect(navigation).toBeVisible();
    }
  }

  async selectMenuItem(name: 'All Items' | 'Reset App State'): Promise<void> {
    await this.page.getByRole('button', { name, exact: true }).click();
  }

  async expectMenuActionsVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'All Items', exact: true })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Logout', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Reset App State', exact: true })).toBeVisible();
  }

  async expectAllProductsCanBeAdded(count: number): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Add to cart' })).toHaveCount(count);
  }
}
