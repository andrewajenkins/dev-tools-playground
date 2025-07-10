# QA Sandbox - Test Automation Playground

A comprehensive web application designed specifically for testing and demonstrating advanced test automation tools including **perf-sentinel**, **tias** (Test Impact Analysis System), and **Healenium/Report Portal**.

## 🎯 Overview

QA Sandbox is a realistic project management dashboard that serves as a feature-rich testbed for developing, testing, and demonstrating test automation capabilities. The application includes intentional flaws and bottlenecks to provide realistic challenges for automation tools.

### Key Features
- **Modern Tech Stack**: Angular 14 frontend with Django backend
- **Real Database**: PostgreSQL with 100+ seeded records
- **Containerized**: Full Docker Compose orchestration
- **CI/CD Ready**: GitHub Actions and Jenkins pipelines
- **Comprehensive E2E Tests**: Selenium WebDriver with Cucumber

## 🚀 Quick Start

**One-command setup:**
```bash
docker-compose up --build
```

This will start all services:
- 📱 Frontend: http://localhost:4200
- 🔧 Backend API: http://localhost:8000
- 🗄️ PostgreSQL: localhost:5432

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

## 🏗️ Architecture

```
qa-sandbox/
├── .github/workflows/     # GitHub Actions CI/CD
├── backend/              # Django REST API
├── frontend/             # Angular 14 SPA
├── tests-e2e/           # Selenium + Cucumber tests
├── docker-compose.yml    # Container orchestration
├── Jenkinsfile          # Jenkins pipeline
└── README.md           # This file
```

## 💻 Local Development

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

### E2E Tests
```bash
cd tests-e2e
npm install
npm run test:chrome        # Run with Chrome
npm run test:headless      # Run headless Chrome
npm run test:firefox       # Run with Firefox
```

## 🎭 Application Features

### Pages
1. **Login Page** (`/login`)
   - Mock authentication (accepts any credentials)
   - Form validation
   - Responsive design

2. **Dashboard** (`/`)
   - ag-Grid data table with 100+ projects
   - Client-side sorting, filtering, pagination
   - Real-time project status visualization

3. **Add Project** (`/add-project`)
   - Form validation
   - Project creation with API integration
   - Success/error feedback

### API Endpoints
- `POST /api/login/` - Mock authentication
- `GET /api/projects/` - Retrieve all projects (with intentional delay)
- `POST /api/projects/create/` - Create new project

## 🐛 Intentional Flaws (For Testing)

### 1. Performance Bottleneck
**Location**: `backend/app/views.py` - `ProjectListView`
- **Issue**: Artificial API delay (200ms base + 0-150ms random)
- **Purpose**: Test perf-sentinel performance monitoring
- **Code**:
```python
# Intentional delay for perf-sentinel testing
base_delay = 0.2  # 200ms
random_delay = random.uniform(0, 0.15)  # 0-150ms
time.sleep(base_delay + random_delay)
```

### 2. Unstable UI Element
**Location**: `frontend/src/app/dashboard/dashboard.component.ts`
- **Issue**: Dynamic button ID generation
- **Purpose**: Test Healenium self-healing capabilities
- **Code**:
```typescript
// INTENTIONAL FLAW: Dynamic button ID
this.addProjectButtonId = `add-project-btn-${Math.floor(Math.random() * 10000)}`;
```

### 3. Flaky Test
**Location**: `tests-e2e/features/dashboard.feature`
- **Issue**: Test depends on exact timing/count
- **Purpose**: Test automation tool resilience
- **Scenario**: "Verify exact project count on first page"

## 🧪 Test Automation Integration

### perf-sentinel Hook
**Location**: `tests-e2e/support/hooks.ts`
```typescript
// PLACEHOLDER: perf-sentinel integration
// await perfSentinel.startMonitoring(scenario.pickle.name);
```

### tias Integration
The project structure supports Test Impact Analysis:
- Component-based architecture
- Clear separation of concerns
- Comprehensive test coverage mapping

### Healenium Integration
Dynamic UI elements test self-healing capabilities:
- Changing button IDs
- Multiple selector strategies
- Fallback element location

## 🔧 CI/CD Pipelines

### GitHub Actions
- **Trigger**: Push to main/develop, Pull Requests
- **Services**: PostgreSQL, Node.js, Python
- **Steps**: Build, Test, Deploy, E2E Testing
- **Artifacts**: Test reports, screenshots

### Jenkins Pipeline
- **Stages**: Checkout, Build, Test, Deploy
- **Parallel Execution**: Multi-stage builds
- **Reporting**: HTML test reports
- **Cleanup**: Automated resource cleanup

## 📊 Test Reports

Test results are generated in multiple formats:
- **HTML Reports**: `tests-e2e/reports/cucumber-report.html`
- **JSON Reports**: `tests-e2e/reports/cucumber-report.json`
- **Screenshots**: Captured on test failures

## 🔍 Monitoring & Debugging

### Performance Monitoring
- API response time logging
- Database query analysis
- Frontend performance metrics

### Debug Information
- Dynamic button IDs displayed on dashboard
- API delay timing in console logs
- Detailed error messages

## 🛠️ Troubleshooting

### Common Issues

1. **Services won't start**
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

2. **Database connection issues**
   ```bash
   # Check PostgreSQL container
   docker-compose ps
   docker-compose logs db
   ```

3. **E2E tests failing**
   ```bash
   # Check service health
   curl http://localhost:8000/api/projects/
   curl http://localhost:4200
   ```

4. **Permission issues**
   ```bash
   chmod +x manage.py
   sudo chown -R $USER:$USER .
   ```

## 🎯 Testing the Intentional Flaws

### Testing Performance Issues
1. Monitor API response times on `/api/projects/`
2. Use browser dev tools to measure delays
3. Check console logs for timing information

### Testing UI Stability
1. Refresh dashboard multiple times
2. Note changing button IDs in debug info
3. Verify tests handle dynamic elements

### Testing Flaky Tests
1. Run E2E tests multiple times
2. Observe intermittent failures on count assertions
3. Check test retry mechanisms

## 📈 Extending the Application

### Adding New Features
1. Create new Django models/views
2. Add Angular components/services
3. Write corresponding E2E tests
4. Update CI/CD pipelines

### Adding New Flaws
1. Modify existing components
2. Document the intentional issue
3. Create tests that demonstrate the flaw
4. Update this README

## 🤝 Contributing

This is a testing playground - contributions welcome!
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## 📝 License

This project is created for educational and testing purposes.

---

**Built for the QA Community** 🧪

*Happy Testing!* 🎉
