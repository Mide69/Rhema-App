# AWS Amplify Deployment Steps

## ✅ Repository Cleaned
Large Terraform files removed from Git history.

## 🚀 Deploy to AWS Amplify

### Step 1: AWS Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Select "GitHub" as source
4. Choose repository: `Mide69/Rhema-App`
5. Select branch: `main`

### Step 2: Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/build
    files:
      - '**/*'
```

### Step 3: Environment Variables
- `AMPLIFY_MONOREPO_APP_ROOT`: `frontend`

### Step 4: Deploy
Click "Save and deploy"

## 📱 Access Your App
URL will be: `https://main.amplifyapp.com`

Repository is now clean and ready for Amplify deployment!