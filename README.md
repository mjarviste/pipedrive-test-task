# Pipedrive DevOps Test Task

This is a simple Node.js/TypeScript application for a Pipedrive home challenge. It forwards API calls to Pipedrive (GET, POST, PUT), logs requests and tracks metrics (viewable at `/metrics`), and demonstrates CI/CD with GitHub Actions and Docker containerization.

---

## Project Structure

pipedrive-devops-ts/
├── src/
│ ├── routes/
│ │ ├── deals.ts # API endpoints (GET, POST, PUT)
│ │ └── metrics.ts # /metrics endpoint
│ └── middleware/
│ └── logger.ts # Logging & metrics middleware
├── tests/ # Test files for API endpoints and middleware
├── .github/
│ └── workflows/
│ ├── ci.yml # CI workflow (tests & linting on PR)
│ └── cd.yml # CD workflow (logs "Deployed!" on merge)
├── Dockerfile # Multi-stage Dockerfile for containerization
├── package.json
├── tsconfig.json
├── .env # Environment variables file
└── README.md # This file

---

## Running the Application Locally

### Using Docker

#### 1.Clone the Repository

```bash
git clone https://github.com/<your_username>/pipedrive-devops-ts.git
cd pipedrive-devops-ts
```

#### 2. Set Up Environment Variables

- Create a .env file in the root (based on .env.example) with:

  ```bash
      BASE_URL=https://api.pipedrive.com/v1/deals
      PIPEDRIVE_API_TOKEN=YOUR_REAL_API_TOKEN
      PORT=8080
  ```

#### 3. Build the Docker Image

```bash
  docker build -t pipedrive-devops-ts .
```

#### 4. Run the Docker Container

```bash
  docker run -e PIPEDRIVE_API_TOKEN=YOUR_REAL_API_TOKEN \
  -e BASE_URL=https://api.pipedrive.com/v1/deals \
  -p 8080:8080 pipedrive-devops-ts
```

### 5. Test the application

Open your browser or use curl/Postman to test the endpoints:

- GET /deals: http://localhost:8080/deals
- GET /metrics: http://localhost:8080/metrics

## CI/CD Setup

### Continuous Integration (CI)

- **Trigger:**  
  CI runs on every pull request targeting the main (or master) branch.
- **What It Does:**  
  The workflow checks out your code, sets up Node.js, installs dependencies, lints the code, and runs tests.
- **Workflow File:**  
  Located at `.github/workflows/ci.yml`

Example `ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "22"

      - name: Install Dependencies
        run: npm install

      - name: Run Lint
        run: npm run lint

      - name: Run Tests
        run: npm test
```

### Continuous Deployment (CD)

- **Trigger:**  
  CD runs when a pull request is merged into the main (or master) branch.

- **What It Does:**  
  The workflow logs “Deployed!” to indicate a deployment.

- **Workflow File:**  
  Located at `.github/workflows/cd.yml`

Example `cd.yml`:

```yaml
name: CD

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Log Deployment
        run: echo "Deployed!"
```

## Conclusion

- **Running Locally:** Use the provided instructions to run the application with Docker.
- **CI/CD:** GitHub Actions ensure that tests and linting run on every pull request, and a deployment log ("Deployed!") is generated when changes are merged.

Thank you for checking out this project.
