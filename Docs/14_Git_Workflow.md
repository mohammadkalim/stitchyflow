# Git Workflow & Version Control

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Git Strategy

### 1.1 Branching Model
We follow a simplified Git Flow strategy:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Feature development branches
- **bugfix/***: Bug fix branches
- **hotfix/***: Emergency production fixes
- **release/***: Release preparation branches

---

## 2. Branch Naming Conventions

### 2.1 Feature Branches
```
feature/user-authentication
feature/order-management
feature/payment-integration
```

### 2.2 Bugfix Branches
```
bugfix/login-validation
bugfix/order-status-update
```

### 2.3 Hotfix Branches
```
hotfix/security-patch
hotfix/critical-bug-fix
```

### 2.4 Release Branches
```
release/v1.0.0
release/v1.1.0
```

---

## 3. Commit Message Guidelines

### 3.1 Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 3.2 Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### 3.3 Examples
```bash
feat(auth): add JWT authentication

Implemented JWT-based authentication with access and refresh tokens.
- Added login endpoint
- Added token refresh endpoint
- Implemented middleware for protected routes

Closes #123

---

fix(orders): resolve order status update issue

Fixed bug where order status was not updating correctly
when tailor marked order as completed.

Fixes #456

---

docs(api): update API documentation

Added documentation for new payment endpoints
```

---

## 4. Workflow Steps

### 4.1 Starting New Feature

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/new-feature

# Work on feature
# ... make changes ...

# Commit changes
git add .
git commit -m "feat(module): add new feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### 4.2 Code Review Process

1. Create Pull Request
2. Assign reviewers
3. Address review comments
4. Get approval
5. Merge to develop

### 4.3 Merging Feature

```bash
# Update feature branch with latest develop
git checkout feature/new-feature
git pull origin develop
git merge develop

# Resolve conflicts if any
# Run tests
npm test

# Push changes
git push origin feature/new-feature

# Merge via Pull Request (preferred)
# Or merge locally:
git checkout develop
git merge --no-ff feature/new-feature
git push origin develop

# Delete feature branch
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

---

## 5. Release Process

### 5.1 Creating Release

```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Update version numbers
# Update CHANGELOG.md
# Final testing

# Commit changes
git add .
git commit -m "chore(release): prepare v1.0.0"

# Merge to main
git checkout main
git merge --no-ff release/v1.0.0

# Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop

# Delete release branch
git branch -d release/v1.0.0
```

---

## 6. Hotfix Process

### 6.1 Creating Hotfix

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix the bug
# ... make changes ...

# Commit fix
git add .
git commit -m "fix(critical): resolve security vulnerability"

# Merge to main
git checkout main
git merge --no-ff hotfix/critical-bug

# Tag hotfix
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main --tags

# Merge to develop
git checkout develop
git merge --no-ff hotfix/critical-bug
git push origin develop

# Delete hotfix branch
git branch -d hotfix/critical-bug
```

---

## 7. Pull Request Guidelines

### 7.1 PR Title Format
```
[TYPE] Brief description

Examples:
[FEATURE] Add user authentication
[BUGFIX] Fix order status update
[HOTFIX] Resolve security vulnerability
```

### 7.2 PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Hotfix
- [ ] Documentation update
- [ ] Code refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #123
Relates to #456

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

---

## 8. Code Review Checklist

### 8.1 Reviewer Checklist
- [ ] Code follows project standards
- [ ] Logic is correct and efficient
- [ ] Error handling is appropriate
- [ ] Security considerations addressed
- [ ] Tests are adequate
- [ ] Documentation is updated
- [ ] No hardcoded values
- [ ] Performance implications considered

---

## 9. Git Commands Reference

### 9.1 Common Commands

```bash
# Clone repository
git clone <repository-url>

# Check status
git status

# View changes
git diff

# Stage changes
git add <file>
git add .

# Commit changes
git commit -m "message"

# Push changes
git push origin <branch>

# Pull changes
git pull origin <branch>

# Create branch
git checkout -b <branch-name>

# Switch branch
git checkout <branch-name>

# Merge branch
git merge <branch-name>

# Delete branch
git branch -d <branch-name>

# View branches
git branch -a

# View commit history
git log --oneline --graph

# Stash changes
git stash
git stash pop

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## 10. .gitignore Configuration

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production

# Build output
build/
dist/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Temporary files
*.tmp
*.temp
```

---

## 11. Git Hooks

### 11.1 Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint

# Run tests
npm test

# If tests fail, prevent commit
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

### 11.2 Commit Message Hook

```bash
#!/bin/sh
# .git/hooks/commit-msg

commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "Invalid commit message format"
  echo "Format: <type>(<scope>): <subject>"
  exit 1
fi
```

---

## 12. Conflict Resolution

### 12.1 Resolving Merge Conflicts

```bash
# Pull latest changes
git pull origin develop

# If conflicts occur
# 1. Open conflicted files
# 2. Look for conflict markers:
#    <<<<<<< HEAD
#    Your changes
#    =======
#    Their changes
#    >>>>>>> branch-name

# 3. Resolve conflicts manually
# 4. Remove conflict markers
# 5. Stage resolved files
git add <resolved-file>

# 6. Complete merge
git commit -m "merge: resolve conflicts with develop"

# 7. Push changes
git push origin <your-branch>
```

---

## 13. Best Practices

### 13.1 General Guidelines
- Commit often, push regularly
- Write meaningful commit messages
- Keep commits atomic (one logical change)
- Never commit sensitive data
- Always pull before push
- Use branches for all changes
- Delete merged branches
- Tag releases properly

### 13.2 Code Review Guidelines
- Review within 24 hours
- Be constructive and respectful
- Test the changes locally
- Check for security issues
- Verify documentation updates
- Approve only when satisfied

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
