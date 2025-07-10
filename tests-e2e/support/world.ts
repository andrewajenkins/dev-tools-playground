import { WebDriver, Builder, Capabilities } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as firefox from 'selenium-webdriver/firefox';

let driver: WebDriver;

export function getDriver(): WebDriver {
  if (!driver) {
    throw new Error('WebDriver not initialized. Call initializeDriver() first.');
  }
  return driver;
}

export async function initializeDriver(): Promise<WebDriver> {
  const browserName = process.env.BROWSER || 'chrome';
  
  let capabilities: Capabilities;
  
  switch (browserName.toLowerCase()) {
    case 'chrome':
      capabilities = Capabilities.chrome();
      const chromeOptions = new chrome.Options();
      chromeOptions.addArguments('--no-sandbox');
      chromeOptions.addArguments('--disable-dev-shm-usage');
      chromeOptions.addArguments('--disable-gpu');
      chromeOptions.addArguments('--window-size=1920,1080');
      
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
      break;
      
    case 'chrome-headless':
      capabilities = Capabilities.chrome();
      const chromeHeadlessOptions = new chrome.Options();
      chromeHeadlessOptions.addArguments('--no-sandbox');
      chromeHeadlessOptions.addArguments('--disable-dev-shm-usage');
      chromeHeadlessOptions.addArguments('--disable-gpu');
      chromeHeadlessOptions.addArguments('--headless');
      chromeHeadlessOptions.addArguments('--window-size=1920,1080');
      
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeHeadlessOptions)
        .build();
      break;
      
    case 'firefox':
      capabilities = Capabilities.firefox();
      const firefoxOptions = new firefox.Options();
      firefoxOptions.addArguments('--width=1920');
      firefoxOptions.addArguments('--height=1080');
      
      driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(firefoxOptions)
        .build();
      break;
      
    default:
      throw new Error(`Unsupported browser: ${browserName}`);
  }
  
  // Set implicit wait
  await driver.manage().setTimeouts({ implicit: 10000 });
  
  return driver;
}

export async function quitDriver(): Promise<void> {
  if (driver) {
    await driver.quit();
    driver = null as any;
  }
} 