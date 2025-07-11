import { WebDriver, Builder, Browser } from 'selenium-webdriver';
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
  console.log(`🔧 Initializing WebDriver with Selenium Manager for browser: ${browserName}`);
  
  try {
    let builder = new Builder();
    
    switch (browserName.toLowerCase()) {
      case 'chrome':
        console.log('🔧 Setting up Chrome with Selenium Manager...');
        const chromeOptions = new chrome.Options();
        chromeOptions.addArguments('--no-sandbox');
        chromeOptions.addArguments('--disable-dev-shm-usage');
        chromeOptions.addArguments('--disable-gpu');
        chromeOptions.addArguments('--window-size=1920,1080');
        chromeOptions.addArguments('--disable-web-security');
        chromeOptions.addArguments('--allow-running-insecure-content');
        // Suppress password and security warnings
        chromeOptions.addArguments('--disable-password-generation');
        chromeOptions.addArguments('--disable-password-manager-reauthentication');
        chromeOptions.addArguments('--disable-save-password-bubble');
        chromeOptions.addArguments('--disable-translate');
        chromeOptions.addArguments('--disable-infobars');
        chromeOptions.addArguments('--disable-notifications');
        chromeOptions.addArguments('--disable-popup-blocking');
        chromeOptions.addArguments('--disable-default-apps');
        chromeOptions.addArguments('--disable-extensions');
        chromeOptions.addArguments('--disable-component-extensions-with-background-pages');
        chromeOptions.addArguments('--disable-background-timer-throttling');
        chromeOptions.addArguments('--disable-renderer-backgrounding');
        chromeOptions.addArguments('--disable-backgrounding-occluded-windows');
        chromeOptions.addArguments('--disable-features=TranslateUI,VizDisplayCompositor,PasswordLeakDetection,SafeBrowsingEnhancedProtection');
        // Additional flags to disable password breach warnings
        chromeOptions.addArguments('--disable-features=PasswordLeakDetection');
        chromeOptions.addArguments('--disable-features=SafeBrowsingEnhancedProtection');
        chromeOptions.addArguments('--disable-client-side-phishing-detection');
        chromeOptions.addArguments('--disable-sync');
        chromeOptions.addArguments('--disable-background-networking');
        chromeOptions.addArguments('--disable-features=AutofillServerCommunication');
        // Set preferences to disable password manager and breach detection
        chromeOptions.setUserPreferences({
          'credentials_enable_service': false,
          'profile.password_manager_enabled': false,
          'profile.default_content_setting_values.notifications': 2,
          'profile.default_content_settings.popups': 0,
          'profile.managed_default_content_settings.notifications': 2,
          'profile.password_manager_leak_detection': false,
          'profile.password_manager.leak_detection_enabled': false,
          'safebrowsing.enabled': false,
          'safebrowsing.enhanced': false,
          'profile.default_content_setting_values.password_protection_warning_trigger': 2,
          'generated.password_leak_detection_enabled': false
        });
        
        driver = await builder
          .forBrowser(Browser.CHROME)
          .setChromeOptions(chromeOptions)
          .build();
        break;
        
      case 'chrome-headless':
        console.log('🔧 Setting up Chrome headless with Selenium Manager...');
        const chromeHeadlessOptions = new chrome.Options();
        chromeHeadlessOptions.addArguments('--no-sandbox');
        chromeHeadlessOptions.addArguments('--disable-dev-shm-usage');
        chromeHeadlessOptions.addArguments('--disable-gpu');
        chromeHeadlessOptions.addArguments('--headless');
        chromeHeadlessOptions.addArguments('--window-size=1920,1080');
        chromeHeadlessOptions.addArguments('--disable-web-security');
        chromeHeadlessOptions.addArguments('--allow-running-insecure-content');
        // Suppress password and security warnings (headless mode)
        chromeHeadlessOptions.addArguments('--disable-password-generation');
        chromeHeadlessOptions.addArguments('--disable-password-manager-reauthentication');
        chromeHeadlessOptions.addArguments('--disable-save-password-bubble');
        chromeHeadlessOptions.addArguments('--disable-translate');
        chromeHeadlessOptions.addArguments('--disable-infobars');
        chromeHeadlessOptions.addArguments('--disable-notifications');
        chromeHeadlessOptions.addArguments('--disable-popup-blocking');
        chromeHeadlessOptions.addArguments('--disable-default-apps');
        chromeHeadlessOptions.addArguments('--disable-extensions');
        chromeHeadlessOptions.addArguments('--disable-component-extensions-with-background-pages');
        chromeHeadlessOptions.addArguments('--disable-background-timer-throttling');
        chromeHeadlessOptions.addArguments('--disable-renderer-backgrounding');
        chromeHeadlessOptions.addArguments('--disable-backgrounding-occluded-windows');
        chromeHeadlessOptions.addArguments('--disable-features=TranslateUI,VizDisplayCompositor,PasswordLeakDetection,SafeBrowsingEnhancedProtection');
        // Additional flags to disable password breach warnings
        chromeHeadlessOptions.addArguments('--disable-features=PasswordLeakDetection');
        chromeHeadlessOptions.addArguments('--disable-features=SafeBrowsingEnhancedProtection');
        chromeHeadlessOptions.addArguments('--disable-client-side-phishing-detection');
        chromeHeadlessOptions.addArguments('--disable-sync');
        chromeHeadlessOptions.addArguments('--disable-background-networking');
        chromeHeadlessOptions.addArguments('--disable-features=AutofillServerCommunication');
        // Set preferences to disable password manager and breach detection
        chromeHeadlessOptions.setUserPreferences({
          'credentials_enable_service': false,
          'profile.password_manager_enabled': false,
          'profile.default_content_setting_values.notifications': 2,
          'profile.default_content_settings.popups': 0,
          'profile.managed_default_content_settings.notifications': 2,
          'profile.password_manager_leak_detection': false,
          'profile.password_manager.leak_detection_enabled': false,
          'safebrowsing.enabled': false,
          'safebrowsing.enhanced': false,
          'profile.default_content_setting_values.password_protection_warning_trigger': 2,
          'generated.password_leak_detection_enabled': false
        });
        
        driver = await builder
          .forBrowser(Browser.CHROME)
          .setChromeOptions(chromeHeadlessOptions)
          .build();
        break;
        
      case 'firefox':
        console.log('🔧 Setting up Firefox with Selenium Manager...');
        const firefoxOptions = new firefox.Options();
        firefoxOptions.addArguments('--width=1920');
        firefoxOptions.addArguments('--height=1080');
        
        driver = await builder
          .forBrowser(Browser.FIREFOX)
          .setFirefoxOptions(firefoxOptions)
          .build();
        break;
        
      default:
        throw new Error(`Unsupported browser: ${browserName}`);
    }
    
    console.log('🔧 Setting timeouts...');
    // Set implicit wait
    await driver.manage().setTimeouts({ implicit: 10000 });
    
    console.log('✅ WebDriver initialized successfully with Selenium Manager');
    return driver;
  } catch (error) {
    console.error('❌ Failed to initialize WebDriver with Selenium Manager:', error);
    throw error;
  }
}

export async function quitDriver(): Promise<void> {
  if (driver) {
    await driver.quit();
    driver = null as any;
  }
} 