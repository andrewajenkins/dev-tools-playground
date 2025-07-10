module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['step-definitions/**/*.ts', 'support/**/*.ts'],
    format: [
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
      'progress-bar'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
}; 