# Testing and SonarCloud Integration Guide

## Quick Commands

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="user"

# Run integration tests only
npm test -- test/integration

# Run unit tests only
npm test -- test/unit
```

### Coverage Reports

After running `npm run test:coverage`, you can view coverage in:
- **HTML Report:** Open `file:///PATH_TO_PROJECT/backend/coverage/index.html` in browser
- **LCOV Report:** `coverage/lcov.info` (used by SonarCloud)

## SonarCloud Integration

### Configuration Files

1. **Root Configuration:** `/sonar-project.properties`
   - Project key: `polito-se2-25-08_participium`
   - Organization: `polito-se2-25-08`
   - Points to backend source and test files

2. **Backend Configuration:** `/backend/sonar-project.properties`
   - Backend-specific settings
   - Coverage report paths

### GitHub Actions Workflow

Location: `.github/workflows/build.yml`

**Triggers:**
- Push to `main` branch
- Pull requests (opened, synchronize, reopened)

**Steps:**
1. Checkout code
2. Install dependencies (`npm install`)
3. Run tests with coverage (`npm run test:coverage`)
4. SonarQube scan with coverage data

### Setting Up SonarCloud

1. **Add Repository to SonarCloud:**
   - Go to https://sonarcloud.io/
   - Login with GitHub
   - Click "+" → "Analyze new project"
   - Select `polito-se2-25-08/participium`

2. **Configure GitHub Secret:**
   - Go to GitHub repository settings
   - Navigate to "Secrets and variables" → "Actions"
   - Add new secret: `SONAR_TOKEN`
   - Get token from SonarCloud: Account → Security → Generate Token

3. **Trigger Analysis:**
   - Push to `main` branch, or
   - Create a pull request
   - GitHub Actions will automatically run tests and upload to SonarCloud

### Viewing SonarCloud Results

After the workflow completes, view results at:
- **Dashboard:** https://sonarcloud.io/project/overview?id=polito-se2-25-08_participium
- **Code Coverage:** Coverage tab in SonarCloud dashboard
- **Issues:** Issues tab for code quality problems
- **Security:** Security hotspots and vulnerabilities