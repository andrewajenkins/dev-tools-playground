import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { WebDriver, By, until } from 'selenium-webdriver';
import { getDriver } from '../support/world';

Given('I am on the login page', async function () {
  const driver: WebDriver = getDriver();
  await driver.get('http://localhost:4200/login');
  await driver.wait(until.titleContains('QA Sandbox'), 10000);
});

When('I enter username {string} and password {string}', async function (username: string, password: string) {
  const driver: WebDriver = getDriver();
  
  const usernameField = await driver.findElement(By.id('username'));
  const passwordField = await driver.findElement(By.id('password'));
  
  await usernameField.clear();
  await usernameField.sendKeys(username);
  
  await passwordField.clear();
  await passwordField.sendKeys(password);
});

When('I click the login button', async function () {
  const driver: WebDriver = getDriver();
  const loginButton = await driver.findElement(By.css('button[type="submit"]'));
  await loginButton.click();
});

Then('I should be redirected to the dashboard page', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.urlContains('/dashboard'), 10000);
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.include('/dashboard');
});

Then('I should see the project list', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.elementLocated(By.css('ag-grid-angular')), 15000);
  const projectGrid = await driver.findElement(By.css('ag-grid-angular'));
  expect(await projectGrid.isDisplayed()).to.be.true;
});

Then('I should see validation errors', async function () {
  const driver: WebDriver = getDriver();
  await driver.wait(until.elementLocated(By.css('.invalid-feedback')), 5000);
  const errorMessages = await driver.findElements(By.css('.invalid-feedback'));
  expect(errorMessages.length).to.be.greaterThan(0);
});

Then('I should remain on the login page', async function () {
  const driver: WebDriver = getDriver();
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.include('/login');
}); 