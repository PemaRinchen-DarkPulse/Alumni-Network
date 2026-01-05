# Security Configuration Guide

## ⚠️ IMPORTANT - Exposed Credentials Detected

Your repository currently contains sensitive credentials in `application.properties`. These credentials have been exposed and should be considered compromised.

## Immediate Actions Required

### 1. Rotate All Credentials
- **Database Password**: Change your MySQL root password immediately
- **Brevo API Key**: Generate a new API key in your Brevo dashboard and revoke the old one
- **Email Address**: Consider if this email needs additional security measures

### 2. Check Git History
Your sensitive data may already be in your Git history. To remove it:

```bash
# Check if application.properties is tracked
git ls-files | grep application.properties

# If it appears, you need to remove it from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch server/src/main/resources/application.properties" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

### 3. Setup Configuration File

1. Copy the example configuration:
   ```bash
   cp server/src/main/resources/application-example.properties server/src/main/resources/application.properties
   ```

2. Edit `application.properties` with your actual credentials:
   - Database username and password
   - Brevo API key
   - Email address

3. Verify the file is ignored:
   ```bash
   git status
   # application.properties should NOT appear in the list
   ```

## Protected Files

The following sensitive files are now protected in `.gitignore`:

### Server (Java/Spring Boot)
- `application.properties` - Main configuration file
- `application-*.properties` - Environment-specific configs
- Any `.secret`, `.key` files
- `credentials.*` files

### Client (React/Vite)
- `.env` files - Environment variables
- `.env.local`, `.env.*.local` - Local environment configs

### Build Artifacts
- `target/` - Maven build output
- `node_modules/` - NPM dependencies
- `dist/`, `build/` - Build outputs

## Best Practices Going Forward

1. **Never commit credentials** - Use environment variables or config files that are gitignored
2. **Use example files** - Commit `.env.example` or `application-example.properties` as templates
3. **Rotate regularly** - Change API keys and passwords periodically
4. **Scan commits** - Use tools like git-secrets to prevent accidental commits
5. **Environment variables** - Consider using system environment variables instead of property files

## Current Status

✅ `.gitignore` files updated
✅ `application-example.properties` created as template
⚠️ **Action needed**: Your actual `application.properties` is still in the repository
⚠️ **Action needed**: Rotate all exposed credentials
⚠️ **Action needed**: Clean Git history if previously committed

## Verification

Run these commands to verify security:

```bash
# Ensure sensitive files aren't tracked
git ls-files | grep -E "application.properties|\.env$"

# Should return empty or only show example files

# Check for untracked sensitive files
git status
# application.properties should appear under "Untracked files" if present
```

## Need Help?

If you've already pushed sensitive data to a remote repository:
1. Rotate ALL credentials immediately
2. Consider the data compromised
3. Follow GitHub's guide to remove sensitive data
4. Enable branch protection and code scanning on GitHub
