import { Before, After, BeforeAll, AfterAll, AfterStep, Status } from '@cucumber/cucumber';
import { initializeDriver, quitDriver, getDriver } from './world';
import * as fs from 'fs';
import * as path from 'path';

// Performance data collection for perf-sentinel
const performanceData: any[] = [];

// Global setup before all tests
BeforeAll({ timeout: 30000 }, async function () {
  console.log('🚀 Starting QA Sandbox E2E Test Suite');
  await initializeDriver();
});

// Global cleanup after all tests
AfterAll({ timeout: 30000 }, async function () {
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
  
  // Navigate to the application first to enable localStorage
  await driver.get('http://localhost:4200');
  
  // Clear browser storage before each test
  await driver.executeScript('localStorage.clear();');
  await driver.executeScript('sessionStorage.clear();');
  
  // Set a reasonable window size
  await driver.manage().window().setRect({ width: 1920, height: 1080 });
});

// After each scenario
After({ timeout: 30000 }, async function (scenario) {
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

// === PERF-SENTINEL HOOKS ===

// Capture performance data for each step
AfterStep(function (testStep) {
  if (testStep.result?.status === Status.PASSED && testStep.pickleStep) {
    const durationMs = testStep.result.duration ? 
      testStep.result.duration.nanos / 1_000_000 : 
      0; // Convert nanoseconds to milliseconds
    
    performanceData.push({
      stepText: testStep.pickleStep.text,
      duration: durationMs,
      timestamp: new Date().toISOString(),
      scenario: this.pickle?.name || 'unknown'
    });
    
    console.log(`⏱️  Step "${testStep.pickleStep.text}" took ${durationMs.toFixed(2)}ms`);
  }
});

// Write performance data to file after all tests
AfterAll({ timeout: 10000 }, async function () {
  if (performanceData.length > 0) {
    const outputDir = path.join(process.cwd(), 'performance-results');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the latest run data
    const latestRunFile = path.join(outputDir, 'latest-run.json');
    fs.writeFileSync(latestRunFile, JSON.stringify(performanceData, null, 2));
    
    console.log(`📊 Performance data written to ${latestRunFile}`);
    console.log(`📈 Captured ${performanceData.length} step measurements`);
    
    // Clear data for next run
    performanceData.length = 0;
  }
}); 