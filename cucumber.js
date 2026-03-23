const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/support/world.ts',
      'src/support/hooks.ts',
      'src/support/hooks.ui.ts',
      'step-definitions/**/*.ts',
    ],
    format: [
      'summary',
      `html:reports/cucumber-report-${timestamp}.html`,
    ],
    paths: ['features/**/*.feature'],
  },
  api: {
    requireModule: ['ts-node/register'],
    require: [
      'src/support/world.ts',
      'src/support/hooks.ts',
      'step-definitions/**/*.ts',
    ],
    format: [
      'summary',
      `html:reports/cucumber-report-api-${timestamp}.html`,
    ],
    paths: ['features/api/**/*.feature'],
  },
  ui: {
    requireModule: ['ts-node/register'],
    require: [
      'src/support/world.ts',
      'src/support/hooks.ui.ts',
      'step-definitions/**/*.ts',
    ],
    format: [
      'summary',
      `html:reports/cucumber-report-ui-${timestamp}.html`,
    ],
    paths: ['features/ui/**/*.feature'],
  },
};
