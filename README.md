# Playwright-Agents-Automation

Playwright automation for Sauce Demo using Playwright Test and a page object model.

## Project structure

- `tests/` - test specifications
- `pages/` - page objects and the page manager
- `testdata/` - JSON test data
- `fixture/` - shared Playwright fixtures
- `test-results/` - generated test artifacts
- `docs/` - project documentation and test plans

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` in the project root.
3. Set `SAUCEDEMO_BASE_URL` and `SAUCEDEMO_PASSWORD` in `.env`.

Run the authentication tests with:

```sh
npm run test:auth
```

Run the catalog and product-detail tests with:

```sh
npm run test:catalog
```
