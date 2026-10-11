# Sauce Demo Comprehensive Web Test Plan

## Application Overview

Functional and negative test coverage for https://www.saucedemo.com: authentication, six-product catalog and sorting, product details, cart state, checkout validation and completion, session/navigation controls, and the documented demo-account variants. Run every scenario independently from a fresh browser context with no retained cookies or local storage unless a step says otherwise. Use the publicly displayed demo usernames and shared password (secret_sauce); avoid relying on state left by another test. Record browser, viewport, account, and any console/network failures for defects. Success means the stated observable behavior is correct and no unexpected errors or data leakage occur.

## Test Scenarios

### 1. Authentication

**Fixture:** `fixture/test.fixture.ts` (`authenticatedPages`)

#### 1.1. Sign in with standard_user

**File:** `tests/saucedemo/authentication/valid-standard-user.spec.ts`

**Steps:**
  1. Start at https://www.saucedemo.com in a fresh context and enter standard_user and secret_sauce.
    - expect: Username and password are accepted.
  2. Select Login.
    - expect: The user is navigated to the Products inventory page.
    - expect: The catalog loads with six products, a sort control, and an empty cart indicator.

#### 1.2. Reject blank credentials

**File:** `tests/saucedemo/authentication/blank-credentials.spec.ts`

**Steps:**
  1. Start from a fresh login page and select Login without entering either field.
    - expect: Authentication is rejected and the login page remains visible.
    - expect: A clear validation error identifies the missing username.

#### 1.3. Reject username without password

**File:** `tests/saucedemo/authentication/missing-password.spec.ts`

**Steps:**
  1. Enter standard_user, leave Password blank, and select Login.
    - expect: Authentication is rejected; the user remains on the login page.
    - expect: The error identifies the missing password, and no authenticated catalog is exposed.

#### 1.4. Reject password without username

**File:** `tests/saucedemo/authentication/missing-username.spec.ts`

**Steps:**
  1. Leave Username blank, enter secret_sauce, and select Login.
    - expect: Authentication is rejected; the user remains on the login page.
    - expect: The error identifies the missing username.

#### 1.5. Reject invalid credentials

**File:** `tests/saucedemo/authentication/invalid-credentials.spec.ts`

**Steps:**
  1. Enter a nonexistent username and an incorrect password, then select Login.
    - expect: Authentication is rejected with a clear invalid-credentials message.
    - expect: The user remains unauthenticated and no cart or catalog data is shown.
  2. Repeat with a valid username and incorrect password.
    - expect: Authentication is still rejected and sensitive password content is not exposed in the error.

#### 1.6. Block locked-out account

**File:** `tests/saucedemo/authentication/locked-out-user.spec.ts`

**Steps:**
  1. Enter locked_out_user and secret_sauce, then select Login.
    - expect: The user is not logged in.
    - expect: A clear locked-out account message is shown on the login page.

#### 1.7. Recover from a login validation error

**File:** `tests/saucedemo/authentication/login-error-recovery.spec.ts`

**Steps:**
  1. Submit the login form with both fields blank.
    - expect: A validation error appears without navigating away.
  2. Dismiss the error if a close control is provided, enter standard_user and secret_sauce, and submit again.
    - expect: The error clears or is replaced appropriately, and successful login reaches Products.

### 2. Catalog and Product Details

**Seed:** `tests/seed.spec.ts`

#### 2.1. Render all products and essential content

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Log in as standard_user from a fresh context.
    - expect: Exactly six distinct products are visible, each with a name, image, description, price, and Add to cart control.
    - expect: Prices are displayed as currency, and the cart badge is empty.

#### 2.2. Sort products in all supported orders

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Log in as standard_user and inspect the default Name (A to Z) ordering.
    - expect: Product names are in ascending alphabetical order.
  2. Choose Name (Z to A), Price (low to high), and Price (high to low), one at a time.
    - expect: Each selection immediately reorders the full six-product list correctly.
    - expect: Price ascending begins at $7.99 and ends at $49.99; price descending begins at $49.99 and ends at $7.99.
    - expect: Products with equal prices are both present; no unintended item is omitted or duplicated.

#### 2.3. Open and return from a product detail page using its image

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. From Products, select a product image, such as Sauce Labs Backpack.
    - expect: The matching detail page opens and displays the selected product's image, name, description, price, and Add to cart control.
    - expect: The cart remains unchanged.
  2. Select Back to products.
    - expect: The inventory page returns and the product list remains available.

#### 2.4. Open a product detail page using its name

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. From Products, select the Sauce Labs Bike Light name.
    - expect: The detail page corresponds to Sauce Labs Bike Light, with correct price and description.
  2. Use Back to products.
    - expect: The inventory page is restored without changing cart contents.

#### 2.5. Add a product from inventory

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Select Add to cart for one product on the inventory page.
    - expect: That product's button changes to Remove.
    - expect: The cart badge increments to 1.

#### 2.6. Add a product from its detail page

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Open a product detail and select Add to cart.
    - expect: The cart badge increments once and the product control changes to Remove.
    - expect: Adding from details has the same cart result as adding from inventory.

#### 2.7. Add multiple distinct products

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Add three different products from the inventory list.
    - expect: Each selected product changes to Remove.
    - expect: The cart badge reflects three items and each item is counted once.

#### 2.8. Use the navigation drawer

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Open the navigation menu from Products and inspect its available actions.
    - expect: Menu actions include All Items, About, Logout, and Reset App State; any additional catalog entry behaves consistently with its label.
  2. Select All Items, then reopen the menu and select Reset App State.
    - expect: All Items returns to the inventory page.
    - expect: Reset App State clears cart selections and restores Add to cart controls and an empty badge.
    - Known issue: Sauce Demo currently clears the cart badge but leaves the selected product's control as Remove. The automation keeps this assertion as an expected failure until the website behavior is corrected.

### 3. Cart

**Seed:** `tests/seed.spec.ts`

#### 3.1. Verify cart contents match selected products

**File:** `tests/saucedemo/cart/cart-content.spec.ts`

**Steps:**
  1. Add Sauce Labs Bike Light and Sauce Labs Backpack, then open the cart.
    - expect: Both selected products appear once with the correct names, descriptions, prices, and quantity indicators.
    - expect: The cart badge equals the number of selected products.

#### 3.2. Remove one item while retaining another

**File:** `tests/saucedemo/cart/remove-one-item.spec.ts`

**Steps:**
  1. Add two distinct products, open the cart, and remove one.
    - expect: The removed product disappears and its cart selection is cleared.
    - expect: The other product remains, and the badge decrements by one.

#### 3.3. Remove the last cart item

**File:** `tests/saucedemo/cart/remove-last-item.spec.ts`

**Steps:**
  1. Add one product, open the cart, and select Remove.
    - expect: The cart has no product rows and the badge is empty or absent.
    - expect: The removed product can be added again from Products.

#### 3.4. Continue shopping without losing cart state

**File:** `tests/saucedemo/cart/continue-shopping.spec.ts`

**Steps:**
  1. Add a product, open the cart, and select Continue Shopping.
    - expect: The inventory page opens and the existing cart badge and selected-product Remove control are preserved.

#### 3.5. Inspect empty-cart behavior

**File:** `tests/saucedemo/cart/empty-cart.spec.ts`

**Steps:**
  1. Open the cart from a fresh signed-in session without adding products.
    - expect: The cart is visibly empty and does not show stale product rows or a nonzero badge.
    - expect: Continue Shopping returns to Products.
    - expect: If Checkout is available, follow it and verify no product or amount is fabricated; document whether the application permits an empty order according to the product's intended rule.

#### 3.6. Preserve cart state across product navigation

**File:** `tests/saucedemo/cart/state-across-product-navigation.spec.ts`

**Steps:**
  1. Add a product, navigate to its detail page, return to Products, and open the cart.
    - expect: The selected item remains in the cart throughout navigation and is not duplicated.

### 4. Checkout

**Seed:** `tests/seed.spec.ts`

#### 4.1. Require each checkout information field

**File:** `tests/saucedemo/checkout/required-fields.spec.ts`

**Steps:**
  1. Add a product, open the cart, select Checkout, and submit the information form with all fields blank.
    - expect: The user remains on Checkout: Your Information and an error identifies First Name as required.
  2. Enter only a first name and submit; then enter a last name while leaving postal code blank and submit.
    - expect: The missing Last Name is identified in the first case and missing Zip/Postal Code in the second.
    - expect: No checkout overview or order completion occurs until all required fields are supplied.

#### 4.2. Continue with valid checkout information

**File:** `tests/saucedemo/checkout/valid-information.spec.ts`

**Steps:**
  1. Add an item and proceed to checkout. Enter a nonempty first name, last name, and postal code, then select Continue.
    - expect: The Checkout: Overview page opens.
    - expect: The item, quantity, item total, tax, and final total are shown and are mathematically consistent.
    - expect: Payment and shipping information are displayed.

#### 4.3. Handle checkout field boundary and unusual values

**File:** `tests/saucedemo/checkout/input-boundaries.spec.ts`

**Steps:**
  1. Attempt checkout using whitespace-only required values, very long values, punctuation, and non-ASCII characters in names; use a postal code with letters and punctuation as a separate case.
    - expect: Required fields reject values that are effectively blank.
    - expect: Nonblank values are handled without breaking layout, losing input unexpectedly, or causing a crash.
    - expect: Postal-code acceptance or rejection follows the application's documented rule; record behavior and confirm no invalid silent truncation.

#### 4.4. Cancel from checkout information

**File:** `tests/saucedemo/checkout/cancel-information.spec.ts`

**Steps:**
  1. Add an item, start checkout, and select Cancel on the information page.
    - expect: The user returns to the cart or the documented prior page.
    - expect: The cart contents remain intact and no order is created.

#### 4.5. Cancel from checkout overview

**File:** `tests/saucedemo/checkout/cancel-overview.spec.ts`

**Steps:**
  1. Add an item, enter valid checkout details, continue to overview, and select Cancel.
    - expect: The user returns to shopping without completing the order.
    - expect: No confirmation page appears and cart state follows the application's documented cancellation behavior.

#### 4.6. Review multi-item order and totals

**File:** `tests/saucedemo/checkout/review-order-totals.spec.ts`

**Steps:**
  1. Add multiple products with different prices and complete checkout information.
    - expect: Every selected item and its price is present on Overview.
    - expect: Item total equals the sum of item prices, tax is calculated consistently, and total equals item total plus tax.
    - expect: No unselected or removed product appears.

#### 4.7. Complete a valid order

**File:** `tests/saucedemo/checkout/complete-order.spec.ts`

**Steps:**
  1. From an order overview with at least one item and valid information, select Finish.
    - expect: Checkout: Complete! appears with a clear thank-you/order-dispatched confirmation.
    - expect: The cart is empty and the order is not still presented as pending.
  2. Select Back Home.
    - expect: The inventory page is displayed with a cleared cart state.

#### 4.8. Prevent duplicate completion on repeated navigation

**File:** `tests/saucedemo/checkout/finish-reentry.spec.ts`

**Steps:**
  1. Complete an order, then use browser Back/Forward or revisit the completion URL.
    - expect: The application does not create a second order or display stale cart contents as a new order.
    - expect: Navigation is handled safely and consistently with the completed state.

#### 4.9. Generate order confirmation PDF

**File:** `tests/saucedemo/checkout/order-confirmation-pdf.spec.ts`

**Steps:**
  1. Complete a valid order and select Generate PDF order.
    - expect: A readable PDF is generated or downloaded and corresponds to the completed order.
    - expect: The PDF action does not unexpectedly alter the user's cart or order-completion state.

### 5. Session, Navigation, and Demo Account Variants

**Seed:** `tests/seed.spec.ts`

#### 5.1. Log out and prevent access to authenticated pages

**File:** `tests/saucedemo/session/logout.spec.ts`

**Steps:**
  1. Log in as standard_user, open the menu, and select Logout.
    - expect: The login page is displayed and the authenticated session is ended.
  2. Use browser Back and directly revisit an inventory URL.
    - expect: Protected content is not accessible without signing in; the user is redirected to login or receives the app's unauthenticated-access handling.

#### 5.2. Reset application state while shopping

**File:** `tests/saucedemo/session/reset-state.spec.ts`

**Steps:**
  1. Add multiple products, use Reset App State from the menu, and inspect inventory and cart.
    - expect: All cart selections and badge state are reset.
    - expect: The catalog remains usable and products can be added again.

#### 5.3. Handle direct access to protected routes

**File:** `tests/saucedemo/session/direct-route.spec.ts`

**Steps:**
  1. In a fresh logged-out context, directly open inventory, cart, checkout information, overview, and completion routes one by one.
    - expect: Protected pages do not expose another session's data.
    - expect: The app redirects to login or presents a safe unauthenticated response for each route.

#### 5.4. Assess problem_user catalog and purchase behavior

**File:** `tests/saucedemo/session/problem-user.spec.ts`

**Steps:**
  1. Log in as problem_user and inspect catalog images, product names/details, sorting, add/remove actions, cart contents, and checkout.
    - expect: The account can authenticate and the site remains navigable.
    - expect: Record any known seeded defects (such as incorrect product images/details or control mismatches) distinctly from regressions that break the core flow.
    - expect: No other user's cart or personal information is exposed.

#### 5.5. Assess performance_glitch_user responsiveness

**File:** `tests/saucedemo/session/performance-glitch-user.spec.ts`

**Steps:**
  1. Log in as performance_glitch_user and measure login, inventory rendering, product navigation, and checkout progression against the agreed performance budget.
    - expect: The account can eventually complete supported flows without duplicate actions or lost state.
    - expect: Record timings against the team-defined threshold; timeouts, frozen controls, and incomplete transitions are failures.

#### 5.6. Assess error_user behavior and error recovery

**File:** `tests/saucedemo/session/error-user.spec.ts`

**Steps:**
  1. Log in as error_user and exercise product viewing, adding/removing items, sorting, cart, and checkout.
    - expect: Unexpected product/control failures are reproducible and recorded with the affected action.
    - expect: Errors do not corrupt cart state, expose sensitive data, or prevent recovery/logout.

#### 5.7. Assess visual_user rendering and usability

**File:** `tests/saucedemo/session/visual-user.spec.ts`

**Steps:**
  1. Log in as visual_user and inspect login, inventory, product detail, cart, checkout, and completion at desktop and narrow mobile widths.
    - expect: All essential controls and content remain visible, legible, and operable at tested sizes.
    - expect: Record visual regressions, overlap, clipping, or inaccessible controls; core actions remain usable.

#### 5.8. Navigate and operate core flow with keyboard

**File:** `tests/saucedemo/session/keyboard-accessibility.spec.ts`

**Steps:**
  1. From login, use keyboard navigation to reach and submit the fields and Login button. After login, use keyboard navigation to sort, add an item, open cart, and proceed through checkout.
    - expect: Focusable controls have a visible focus indication and logical order.
    - expect: Form labels and validation are perceivable, and the complete core flow can be performed without a pointer.

#### 5.9. Verify footer external links

**File:** `tests/saucedemo/session/external-links.spec.ts`

**Steps:**
  1. Inspect X, Facebook, and LinkedIn links in the page footer and activate each in a controlled test browser.
    - expect: Each link targets the expected Sauce Labs destination and does not replace the shopping session unexpectedly.
    - expect: External navigation behavior is safe and consistent with its link target.
