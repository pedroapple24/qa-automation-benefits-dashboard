import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(30000);
import { chromium } from '@playwright/test';
import { CustomWorld } from './world';

Before({ tags: '@ui' }, async function (this: CustomWorld) {
  const headless = process.env.UI_HEADLESS !== 'false';

  this.browser = await chromium.launch({ headless });
  const context = await this.browser.newContext();
  this.page = await context.newPage();
});

After({ tags: '@ui' }, async function (this: CustomWorld) {
  await this.page?.close();
  await this.browser?.close();
});
