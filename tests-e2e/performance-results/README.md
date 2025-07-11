# Performance Monitoring with perf-sentinel

This directory contains performance data collected by perf-sentinel during E2E test execution.

## Files

- `latest-run.json` - Performance data from the most recent test run (ignored by git)
- `history.json` - Historical performance data used for regression detection (committed to git)
- `runs/` - Directory for multiple run files when seeding (ignored by git)

## Usage

### Running Tests with Performance Monitoring

```bash
# Run tests and analyze performance (Chrome)
npm run test:perf:chrome

# Run tests and analyze performance (Headless Chrome)
npm run test:perf:headless

# Run tests only (without performance analysis)
npm run test:headless

# Analyze existing performance data
npm run perf:analyze
```

### How it Works

1. **Data Collection**: During test execution, the Cucumber hooks in `support/hooks.ts` capture timing data for each step
2. **File Output**: After tests complete, performance data is written to `latest-run.json`
3. **Analysis**: `perf-sentinel` compares the latest run against historical data in `history.json`
4. **Regression Detection**: Uses statistical analysis (standard deviation) to detect performance regressions

### Performance Data Structure

Each performance data point includes:
- `stepText` - The Cucumber step text
- `duration` - Step duration in milliseconds
- `timestamp` - When the step was executed
- `scenario` - The scenario name containing the step

### Regression Detection

perf-sentinel uses a threshold of 2 standard deviations by default to detect regressions:
- ✅ **No issues**: Performance within normal range
- ⚠️  **Warning**: Performance degraded but within threshold
- ❌ **Regression**: Performance significantly worse than baseline

### First Time Setup

If this is your first time running performance tests:

1. Run tests a few times to establish baseline:
```bash
npm run test:perf:headless
npm run test:perf:headless
npm run test:perf:headless
```

2. The `history.json` file will be created automatically and should be committed to git

### Intentional Performance Issues

The QA Sandbox includes intentional performance bottlenecks for testing:
- API delays in `/api/projects/` (200ms + 0-150ms random)
- These should be detected by perf-sentinel as consistent slow performance

### Troubleshooting

If you see errors about missing history file:
```bash
# Create an initial history from current run
cp performance-results/latest-run.json performance-results/history.json
git add performance-results/history.json
git commit -m "Add initial performance baseline"
```

## Integration with CI/CD

This setup is designed to work with the existing CI/CD pipelines:
- GitHub Actions: Uses `npm run test:perf:headless`
- Jenkins: Can be integrated with performance reporting stages 