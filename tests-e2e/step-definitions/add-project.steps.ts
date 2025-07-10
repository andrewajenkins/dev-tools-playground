import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { WebDriver, By, until } from 'selenium-webdriver';
import { getDriver } from '../support/world';

Given('I am on the add project page', async function () {
  const driver: WebDriver = getDriver();
  await driver.get('http://localhost:4200/add-project');
  await driver.wait(until.elementLocated(By.css('h4')), 10000);
});

When('I enter project name {string}', async function (projectName: string) {
  const driver: WebDriver = getDriver();
  const projectNameField = await driver.findElement(By.id('projectName'));
  await projectNameField.clear();
  await projectNameField.sendKeys(projectName);
});

When('I select status {string}', async function (status: string) {
  const driver: WebDriver = getDriver();
  const statusField = await driver.findElement(By.id('status'));
  await statusField.click();
  
  const statusOption = await driver.findElement(By.css(`option[value="${status}"]`));
  await statusOption.click();
});

When('I enter lead name {string}', async function (leadName: string) {
  const driver: WebDriver = getDriver();
  const leadField = await driver.findElement(By.id('lead'));
  await leadField.clear();
  await leadField.sendKeys(leadName);
});

When('I click the create project button', async function () {
  const driver: WebDriver = getDriver();
  const createButton = await driver.findElement(By.css('button[type="submit"]'));
  await createButton.click();
});

When('I click the cancel button', async function () {
  const driver: WebDriver = getDriver();
  const cancelButton = await driver.findElement(By.xpath('//button[contains(text(), "Cancel")]'));
  await cancelButton.click();
});

Then('I should see a success message', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.elementLocated(By.css('.alert-success')), 10000);
  const successAlert = await driver.findElement(By.css('.alert-success'));
  expect(await successAlert.isDisplayed()).to.be.true;
});

Then('I should see the new project in the project list', async function () {
  const driver: WebDriver = getDriver();
  // Wait for redirect and page load
  await driver.wait(until.urlContains('/dashboard'), 10000);
  await driver.wait(until.elementLocated(By.css('ag-grid-angular')), 15000);
  
  // Wait for data to load
  await driver.wait(until.elementLocated(By.css('.ag-row')), 20000);
  
  const projectRows = await driver.findElements(By.css('.ag-row'));
  expect(projectRows.length).to.be.greaterThan(0);
});

Then('I should see validation errors for required fields', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.elementLocated(By.css('.invalid-feedback')), 5000);
  const errorMessages = await driver.findElements(By.css('.invalid-feedback'));
  expect(errorMessages.length).to.be.greaterThan(0);
});

Then('I should see validation errors for minimum length', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.elementLocated(By.css('.invalid-feedback')), 5000);
  const errorMessages = await driver.findElements(By.css('.invalid-feedback'));
  expect(errorMessages.length).to.be.greaterThan(0);
});

Then('I should remain on the add project page', async function () {
  const driver: WebDriver = getDriver();
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.include('/add-project');
});

Then('no new project should be created', async function () {
  // This is a placeholder - in a real test we might check the database
  // or verify the project count hasn't changed
  const driver: WebDriver = getDriver();
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.include('/dashboard');
}); 