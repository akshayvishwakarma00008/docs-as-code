---
sidebar_position: 1
---

# Deploying Websites to GitHub Pages: Complete Guide

This guide covers how to deploy websites (particularly Docusaurus sites) to GitHub Pages, including all the issues we encountered and their solutions.

## Overview

GitHub Pages is a free hosting service that allows you to host static websites directly from a GitHub repository. This guide walks through the entire process of setting up and deploying your documentation site.

## Prerequisites

Before you start, ensure you have:

- A GitHub account with a repository
- Git installed on your machine
- Node.js and npm installed
- GitHub CLI (`gh`) installed (recommended for easier authentication)
- A Docusaurus or static site project ready to deploy

## Step-by-Step Deployment Guide

### 1. Update Configuration Files

#### 1.1 Configure `docusaurus.config.js`

You need to update your Docusaurus configuration with your GitHub organization, project name, and deployment branch:

```javascript
const config = {
  title: 'Your Site Title',
  
  // Set the production URL
  url: 'https://YOUR_GITHUB_USERNAME.github.io',
  
  // Set baseUrl - for a project repo, use /repository-name/
  baseUrl: '/repository-name/',
  
  // GitHub pages deployment config
  organizationName: 'YOUR_GITHUB_USERNAME',
  projectName: 'YOUR_REPO_NAME',
  deploymentBranch: 'gh-pages',
  
  // ... rest of your config
};
```

**Key Points:**
- `url`: Must be your GitHub Pages URL (`https://username.github.io`)
- `baseUrl`: For user/organization sites: `/`, for project repos: `/repo-name/`
- `deploymentBranch`: Should be `gh-pages` (GitHub Pages branch)

#### 1.2 Update `package.json`

Ensure your package.json has the correct project name:

```json
{
  "name": "your-project-name",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "deploy": "docusaurus deploy"
  }
}
```

### 2. Create the `gh-pages` Branch

Before deploying, you need to create and initialize the `gh-pages` branch on GitHub:

```bash
# Create a new orphan branch (unrelated history)
git checkout --orphan gh-pages

# Create a placeholder file
touch .gitkeep

# Add and commit
git add .gitkeep
git commit -m "Initial gh-pages commit"

# Push to GitHub
git push -f origin gh-pages

# Switch back to main
git checkout main
```

**Why this is necessary:**
- GitHub Pages looks for a `gh-pages` branch to host your site
- Creating it first prevents deployment errors
- The `-f` flag forces the push since it's a new branch

### 3. Set Up Authentication

#### Option A: Using GitHub CLI (Recommended)

Install GitHub CLI if you haven't already:

```bash
brew install gh  # macOS
```

Then deploy using:

```bash
GIT_USER=YOUR_GITHUB_USERNAME GH_TOKEN=$(gh auth token) npm run deploy
```

#### Option B: Using SSH

Set the `USE_SSH` environment variable:

```bash
USE_SSH=true npm run deploy
```

**Note:** This requires SSH keys to be configured with GitHub.

#### Option C: Using Personal Access Token

Create a personal access token on GitHub and use:

```bash
GIT_USER=YOUR_GITHUB_USERNAME GH_TOKEN=your_token npm run deploy
```

### 4. Deploy Your Site

Run the deploy command with authentication:

```bash
cd /path/to/your/project
GIT_USER=YOUR_GITHUB_USERNAME GH_TOKEN=$(gh auth token) npm run deploy
```

The deployment process will:
1. Build your site
2. Clone the `gh-pages` branch
3. Add the built files to that branch
4. Push the changes to GitHub

### 5. Verify Deployment

Your site will be available at:
```
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/
```

Check GitHub repository settings → Pages section to confirm the source branch is set to `gh-pages`.

---

## Common Issues and Solutions

### Issue 1: `.vale.ini` Not Found Error

**Error Message:**
```
E100 [.vale.ini not found] Runtime error
no config file found
```

**Cause:**
Vale (a linting tool) looks for configuration in the current working directory where you run the command.

**Solution:**
Always run vale from the project root directory:

```bash
cd /path/to/project
vale docs/intro.md
```

Or specify the config explicitly:

```bash
vale --config=./.vale.ini docs/intro.md
```

**Prevention Tip:**
Create an alias in your shell config (`~/.zshrc` or `~/.bash_profile`):

```bash
alias vale='vale --config=/Users/YOUR_USERNAME/Documents/dev/docs-as-code/.vale.ini'
```

---

### Issue 2: Directory Already Exists Error

**Error Message:**
```
[ERROR] Error: Directory already exists at "/path/to/project"!
```

**Cause:**
When running `npx create-docusaurus@latest .`, the command refuses to initialize in a non-empty directory.

**Solution:**
If you already have a git repository or files in the directory:

1. Create a temporary directory for the template:
   ```bash
   npx create-docusaurus@latest temp-docs --skip-install
   ```

2. Move files from the temporary directory to your project:
   ```bash
   mv temp-docs/* your-project/
   mv temp-docs/.* your-project/ 2>/dev/null
   ```

3. Remove the temporary directory:
   ```bash
   rmdir temp-docs
   ```

4. Restore your git folder if you backed it up:
   ```bash
   mv git-backup your-project/.git
   ```

---

### Issue 3: React Version Conflict

**Error Message:**
```
npm error ERESOLVE could not resolve
npm error While resolving: @docusaurus/core@3.5.2
npm error Found: react@19.2.4
npm error peer react@"^18.0.0" from @docusaurus/core@3.5.2
```

**Cause:**
Docusaurus and its dependencies expect React 18, but React 19 is installed.

**Solution:**
Update `package.json` to use React 18:

```json
"dependencies": {
  "@docusaurus/core": "^3.5.2",
  "@docusaurus/preset-classic": "^3.5.2",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

Then reinstall:
```bash
npm install
```

---

### Issue 4: Empty URL Configuration Error

**Error Message:**
```
[ERROR] Error: "url" is not allowed to be empty
```

**Cause:**
The `url` field in `docusaurus.config.js` is empty or missing.

**Solution:**
Update your configuration with a valid URL:

```javascript
const config = {
  url: 'https://YOUR_GITHUB_USERNAME.github.io',
  baseUrl: '/repo-name/',
  // ... rest of config
};
```

---

### Issue 5: GIT_USER Environment Variable Not Set

**Error Message:**
```
[ERROR] Error: Please set the GIT_USER environment variable, or explicitly specify USE_SSH instead!
```

**Cause:**
The deployment script needs to know your GitHub username for authentication.

**Solution:**
Set the `GIT_USER` variable before running deploy:

```bash
GIT_USER=YOUR_GITHUB_USERNAME npm run deploy
```

Or use SSH:
```bash
USE_SSH=true npm run deploy
```

---

### Issue 6: gh-pages Branch Not Found in Upstream

**Error Message:**
```
fatal: Remote branch gh-pages not found in upstream origin
```

**Cause:**
The `gh-pages` branch doesn't exist in your GitHub repository yet.

**Solution:**
Create and push the branch first:

```bash
# Create an orphan branch
git checkout --orphan gh-pages

# Create a file (required for the branch to have content)
touch .gitkeep

# Commit and push
git add .gitkeep
git commit -m "Initial gh-pages commit"
git push -f origin gh-pages

# Switch back to main
git checkout main
```

---

### Issue 7: SSH Key Permission Denied

**Error Message:**
```
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

**Cause:**
SSH keys are not properly configured, or `USE_SSH=true` is set without valid keys.

**Solution:**
Either set up SSH keys, or use HTTPS authentication with a token:

```bash
# Use HTTPS with token instead
GIT_USER=YOUR_USERNAME GH_TOKEN=$(gh auth token) npm run deploy
```

---

### Issue 8: Mac OS X Resource Fork Files in Styles Directory

**Error Message:**
```
E201 Invalid value [/path/to/styles/Microsoft/._AMPM.yml:0:1]:
'extends' key must be one of [capitalization conditional consistency...]
```

**Cause:**
Mac OS creates hidden resource fork files (starting with `._`) when extracting archives. Vale tries to read these as configuration files.

**Solution:**
Remove all resource fork files:

```bash
find styles -name '._*' -delete
```

Or prevent them when extracting:
```bash
COPYFILE_DISABLE=1 unzip archive.zip
```

---

### Issue 9: No oauth Token Found Error

**Error Message:**
```
no oauth token found for github.com
```

**Cause:**
GitHub CLI is not authenticated with your GitHub account.

**Solution:**
Authenticate with GitHub CLI:

```bash
gh auth login
```

This will open an interactive prompt to authenticate. Follow the prompts to complete authentication.

---

### Issue 10: `node_modules` Not Being Ignored

**Issue:**
Git shows `node_modules` folder in status even though `.gitignore` has it.

**Solution:**
The folder was already tracked before being added to `.gitignore`. Remove it from git index:

```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
```

Your `.gitignore` should include:
```
# Dependencies
/node_modules
```

---

## Best Practices

### 1. Use Environment Variables

Always use environment variables for sensitive information:

```bash
GIT_USER=$GITHUB_USERNAME GH_TOKEN=$GITHUB_TOKEN npm run deploy
```

### 2. Configure Git User (Optional but Recommended)

Set your git configuration to avoid warnings:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Enable Explicit Trailing Slash

Add to your config to prevent SEO issues:

```javascript
const config = {
  trailingSlash: false, // or true, depending on preference
  // ... rest of config
};
```

### 4. Test Locally Before Deploying

Always build and test locally:

```bash
npm run build
npm run serve
```

### 5. Use a `.gitignore` Template

Essential entries for a Docusaurus project:

```
# Dependencies
/node_modules
/build
.docusaurus

# Environment
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
.vscode/
.idea/
```

---

## Automation: CI/CD Pipeline

For automatic deployments on every push, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          GIT_USER=github-actions GH_TOKEN=${{ secrets.GITHUB_TOKEN }} npm run deploy
```

This automatically deploys whenever you push to the main branch.

---

## Troubleshooting Checklist

- [ ] `organizationName` matches your GitHub username
- [ ] `projectName` matches your repository name
- [ ] `url` is correctly set to your GitHub Pages URL
- [ ] `baseUrl` is `/` for user sites, `/repo-name/` for project repos
- [ ] `gh-pages` branch exists in your GitHub repository
- [ ] Authentication is set up (SSH or token)
- [ ] `node_modules` is in `.gitignore`
- [ ] Site builds successfully locally with `npm run build`
- [ ] GitHub Pages source is set to `gh-pages` branch in settings

---

## Summary

Deploying to GitHub Pages involves:

1. **Configuration**: Update config files with correct GitHub details
2. **Setup**: Create the `gh-pages` branch
3. **Authentication**: Set up SSH or token authentication
4. **Deployment**: Run the deploy command
5. **Verification**: Check that your site is live

While the process can encounter several issues, most are easily resolved with proper configuration and error handling. This guide covers the common problems and their solutions to help you deploy smoothly.

---

## Additional Resources

- [Docusaurus Deployment Documentation](https://docusaurus.io/docs/deployment)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Git Configuration Guide](https://git-scm.com/docs/git-config)
- [GitHub CLI Documentation](https://cli.github.com/manual)
