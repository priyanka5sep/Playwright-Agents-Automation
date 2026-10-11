import { test } from '../fixture/test.fixture';
import catalogData from '../testdata/catalog.json';
import type { CatalogProduct } from '../pages/product.types';

const products: CatalogProduct[] = catalogData.products;
const productNames = products.map(({ name }) => name);

function getProduct(name: string): CatalogProduct {
  const product = products.find((item) => item.name === name);
  if (!product) {
    throw new Error(`Catalog test data does not define "${name}".`);
  }
  return product;
}

const backpack = getProduct('Sauce Labs Backpack');
const bikeLight = getProduct('Sauce Labs Bike Light');

test.describe('Catalog and Product Details', () => {
  test('shows all products with complete product information', async ({ authenticatedPages }) => {
    await authenticatedPages.inventory.expectProducts(products);
    await authenticatedPages.inventory.expectCartCount(0);
  });

  test('sorts products by name and price in both directions', async ({ authenticatedPages }) => {
    const inventory = authenticatedPages.inventory;
    const ascendingNames = [...productNames].sort((left, right) => left.localeCompare(right));

    await inventory.expectProductNames(ascendingNames);

    await inventory.sortBy(catalogData.sortOptions.nameDescending);
    await inventory.expectProductNames([...ascendingNames].reverse());

    await inventory.sortBy(catalogData.sortOptions.priceAscending);
    await inventory.expectPriceOrder(true, '$7.99', '$49.99');
    await inventory.expectProductNamesContain(productNames);

    await inventory.sortBy(catalogData.sortOptions.priceDescending);
    await inventory.expectPriceOrder(false, '$49.99', '$7.99');
    await inventory.expectProductNamesContain(productNames);
  });

  test('opens and returns from product details using the product image', async ({ authenticatedPages }) => {
    await authenticatedPages.inventory.openProductFromImage(backpack);
    await authenticatedPages.productDetails.expectProduct(backpack);
    await authenticatedPages.productDetails.backToProducts();

    await authenticatedPages.inventory.expectLoaded();
    await authenticatedPages.inventory.expectProducts(products);
    await authenticatedPages.inventory.expectCartCount(0);
  });

  test('opens and returns from product details using the product name', async ({ authenticatedPages }) => {
    await authenticatedPages.inventory.openProductFromName(bikeLight);
    await authenticatedPages.productDetails.expectProduct(bikeLight);
    await authenticatedPages.productDetails.backToProducts();

    await authenticatedPages.inventory.expectLoaded();
    await authenticatedPages.inventory.expectCartCount(0);
  });

  test('adds a product to cart from the inventory', async ({ authenticatedPages }) => {
    await authenticatedPages.inventory.addProduct(backpack.name);

    await authenticatedPages.inventory.expectProductCanBeRemoved(backpack.name);
    await authenticatedPages.inventory.expectCartCount(1);
  });

  test('adds a product to cart from product details', async ({ authenticatedPages }) => {
    await authenticatedPages.inventory.openProductFromImage(backpack);
    await authenticatedPages.productDetails.addToCart();

    await authenticatedPages.productDetails.expectRemoveButton();
    await authenticatedPages.inventory.expectCartCount(1);
  });

  test('adds multiple distinct products exactly once', async ({ authenticatedPages }) => {
    const selectedProducts = products.slice(0, 3);

    for (const product of selectedProducts) {
      await authenticatedPages.inventory.addProduct(product.name);
      await authenticatedPages.inventory.expectProductCanBeRemoved(product.name);
    }

    await authenticatedPages.inventory.expectCartCount(selectedProducts.length);
  });

  test('uses All Items and Reset App State from the navigation menu', async ({ authenticatedPages }) => {
    test.fail(
      true,
      'Known Sauce Demo issue: Reset App State clears the cart badge but leaves the selected product button as Remove.',
    );

    await authenticatedPages.inventory.addProduct(backpack.name);
    await authenticatedPages.inventory.openMenu();

    await authenticatedPages.inventory.expectMenuActionsVisible();
    await authenticatedPages.inventory.selectMenuItem('All Items');
    await authenticatedPages.inventory.expectLoaded();
    await authenticatedPages.inventory.openMenu();
    await authenticatedPages.inventory.selectMenuItem('Reset App State');

    await authenticatedPages.inventory.expectLoaded();
    await authenticatedPages.inventory.expectCartCount(0);
    await authenticatedPages.inventory.expectAllProductsCanBeAdded(products.length);
  });
});
