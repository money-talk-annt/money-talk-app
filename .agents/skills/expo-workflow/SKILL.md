---
name: expo-workflow
description: >-
  Use this skill when running, building, diagnosing, installing dependencies, or troubleshooting the Expo SDK 57 / React Native application in this project.
---

# Expo SDK 57 Workflow & Runbook

This skill provides step-by-step instructions for common Expo operations in the Money Talk project.

## Common Operations

### 1. Package Installation
Always verify package compatibility with Expo SDK 57:
```powershell
npx expo install <package-name>
```

### 2. Project Health Check & Diagnostics
Check for version mismatches or misconfigured native modules:
```powershell
npx expo-doctor
```

### 3. Starting Development Server
- Standard start:
  ```powershell
  npx expo start
  ```
- Start with clear cache (Metro bundler reset):
  ```powershell
  npx expo start -c
  ```
- Target specific platforms:
  ```powershell
  npx expo start --android
  npx expo start --ios
  npx expo start --web
  ```

### 4. TypeScript & Lint Verification
```powershell
npx tsc --noEmit
```

## Troubleshooting
- **Metro Bundler Cache Issues**: Run `npx expo start -c`
- **Native Module Inconsistencies**: Run `npx expo install --fix`
