import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { initializeDriver, quitDriver, getDriver } from './world';

// Global setup before all tests
BeforeAll(async function () {
  console.log('🚀 Starting QA Sandbox E2E Test Suite');
  await initializeDriver();
});

// Global cleanup after all tests
AfterAll(async function () {
  console.log('🏁 Completed QA Sandbox E2E Test Suite');
  await quitDriver();
});

// Before each scenario
Before(async function (scenario) {
  console.log(`📋 Starting scenario: ${scenario.pickle.name}`);
  
  // PLACEHOLDER: perf-sentinel integration hook
  // This is where perf-sentinel would be initialized to monitor performance
  // Example:
  // await perfSentinel.startMonitoring(scenario.pickle.name);
  
  const driver = getDriver();
  
  // Clear browser storage before each test
  await driver.executeScript('localStorage.clear();');
  await driver.executeScript('sessionStorage.clear();');
  
  // Set a reasonable window size
  await driver.manage().window().setRect({ width: 1920, height: 1080 });
});

// After each scenario
After(async function (scenario) {
  const driver = getDriver();
  
  // Take screenshot if scenario failed
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await driver.takeScreenshot();
    this.attach(screenshot, 'image/png');
    console.log(`❌ Scenario failed: ${scenario.pickle.name}`);
  } else {
    console.log(`✅ Scenario passed: ${scenario.pickle.name}`);
  }
  
  // PLACEHOLDER: perf-sentinel integration hook
  // This is where perf-sentinel would collect and analyze performance data
  // Example:
  // const perfData = await perfSentinel.stopMonitoring();
  // await perfSentinel.analyzePerformance(perfData);
  // if (perfData.slowRequests.length > 0) {
  //   console.log('🐌 Performance issues detected:', perfData.slowRequests);
  // }
  
  // Clear any alerts or popups
  try {
    await driver.switchTo().alert().dismiss();
  } catch (error) {
    // No alert present, continue
  }
});

// Hook specifically for flaky tests
Before('@flaky', async function (scenario) {
  console.log(`⚠️  Running flaky test: ${scenario.pickle.name}`);
  console.log('Note: This test may fail intermittently due to intentional timing issues');
});

After('@flaky', async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    console.log(`💥 Flaky test failed as expected: ${scenario.pickle.name}`);
    console.log('This failure is intentional and helps test automation tooling');
  }
}); 