import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { WebDriver, By, until } from 'selenium-webdriver';
import { getDriver } from '../support/world';

Given('I am logged in to the application', async function () {
  const driver: WebDriver = getDriver();
  await driver.get('http://localhost:4200/login');
  
  const usernameField = await driver.findElement(By.id('username'));
  const passwordField = await driver.findElement(By.id('password'));
  const loginButton = await driver.findElement(By.css('button[type="submit"]'));
  
  await usernameField.sendKeys('testuser');
  await passwordField.sendKeys('password123');
  await loginButton.click();
  
  await driver.wait(until.urlContains('/dashboard'), 10000);
});

Given('I am on the dashboard page', async function () {
  const driver: WebDriver = getDriver();
  await driver.get('http://localhost:4200/dashboard');
  await driver.wait(until.elementLocated(By.css('h2')), 10000);
});

Then('I should see the project table', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.elementLocated(By.css('ag-grid-angular')), 15000);
  const projectGrid = await driver.findElement(By.css('ag-grid-angular'));
  expect(await projectGrid.isDisplayed()).to.be.true;
});

Then('I should see project data loaded', async function () {
  const driver: WebDriver = getDriver();
  // Wait for data to load (accounting for API delay)
  await driver.wait(until.elementLocated(By.css('.ag-row')), 20000);
  const projectRows = await driver.findElements(By.css('.ag-row'));
  expect(projectRows.length).to.be.greaterThan(0);
});

Then('I should see pagination controls', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.elementLocated(By.css('.ag-paging-panel')), 15000);
  const paginationPanel = await driver.findElement(By.css('.ag-paging-panel'));
  expect(await paginationPanel.isDisplayed()).to.be.true;
});

When('I enter {string} in the search filter', async function (searchTerm: string) {
  const driver: WebDriver = getDriver();
  const searchField = await driver.findElement(By.css('.ag-header-cell-filter-input'));
  await searchField.clear();
  await searchField.sendKeys(searchTerm);
});

Then('I should see filtered project results', async function () {
  const driver: WebDriver = getDriver();
  await driver.sleep(1000); // Wait for filter to apply
  const projectRows = await driver.findElements(By.css('.ag-row'));
  expect(projectRows.length).to.be.greaterThan(0);
});

Then('I should see projects matching the search term', async function () {
  const driver: WebDriver = getDriver();
  const projectRows = await driver.findElements(By.css('.ag-row'));
  expect(projectRows.length).to.be.greaterThan(0);
});

When('I click the {string} button', async function (buttonText: string) {
  const driver: WebDriver = getDriver();
  
  if (buttonText === 'Add Project') {
    // Handle dynamic button ID - try multiple selectors
    let button;
    try {
      button = await driver.findElement(By.css('[id*="add-project-btn-"]'));
    } catch (error) {
      button = await driver.findElement(By.xpath(`//button[contains(text(), '${buttonText}')]`));
    }
    await button.click();
  } else {
    const button = await driver.findElement(By.xpath(`//button[contains(text(), '${buttonText}')]`));
    await button.click();
  }
});

Then('I should be redirected to the add project page', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.urlContains('/add-project'), 10000);
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.include('/add-project');
});

// INTENTIONAL FLAKY TEST
Then('I should see exactly {int} projects on the first page', async function (expectedCount: number) {
  const driver: WebDriver = getDriver();
  // This test is intentionally flaky due to API delays and timing issues
  await driver.wait(until.elementLocated(By.css('.ag-row')), 20000);
  
  // Add random delay to make test more flaky
  const randomDelay = Math.floor(Math.random() * 1000) + 500;
  await driver.sleep(randomDelay);
  
  const projectRows = await driver.findElements(By.css('.ag-row'));
  
  // This assertion may fail due to timing issues with API delays
  expect(projectRows.length).to.equal(expectedCount);
});

Then('the project count should be stable across refreshes', async function () {
  const driver: WebDriver = getDriver();
  
  // Get initial count
  const initialRows = await driver.findElements(By.css('.ag-row'));
  const initialCount = initialRows.length;
  
  // Refresh page
  await driver.navigate().refresh();
  await driver.wait(until.elementLocated(By.css('.ag-row')), 20000);
  
  // Get count after refresh
  const afterRefreshRows = await driver.findElements(By.css('.ag-row'));
  const afterRefreshCount = afterRefreshRows.length;
  
  // This assertion may fail due to variable API delays
  expect(afterRefreshCount).to.equal(initialCount);
});

Then('I should see the {string} button with a dynamic ID', async function (buttonText: string) {
  const driver: WebDriver = getDriver();
  const button = await driver.findElement(By.css('[id*="add-project-btn-"]'));
  expect(await button.isDisplayed()).to.be.true;
  
  const buttonId = await button.getAttribute('id');
  expect(buttonId).to.match(/^add-project-btn-\d+$/);
});

Then('the button ID should contain {string}', async function (idPattern: string) {
  const driver: WebDriver = getDriver();
  const button = await driver.findElement(By.css('[id*="add-project-btn-"]'));
  const buttonId = await button.getAttribute('id');
  expect(buttonId).to.include(idPattern);
});

Then('the button should be clickable regardless of ID changes', async function () {
  const driver: WebDriver = getDriver();
  const button = await driver.findElement(By.css('[id*="add-project-btn-"]'));
  expect(await button.isEnabled()).to.be.true;
  
  // Verify button is clickable by checking it's not disabled
  const isDisabled = await button.getAttribute('disabled');
  expect(isDisabled).to.be.null;
}); 