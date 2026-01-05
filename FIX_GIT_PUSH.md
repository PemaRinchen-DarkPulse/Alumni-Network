# Fix Git Push Protection Block

## ✅ What I've Done

1. Created `.env` file with your credentials
2. Created `.env.example` as a template
3. Updated `application.properties` to use environment variables (${DB_PASSWORD}, etc.)
4. Added `spring-dotenv` dependency to `pom.xml` to load .env files
5. Updated `.gitignore` to protect `.env` files

## 🚨 Critical: Remove Sensitive Data from Git History

GitHub blocked your push because commit **965d247393a8ab5e4ee438736509a3941554c301** contains the Sendinblue API key.

### Option 1: Reset and Recommit (Simplest)

```bash
# 1. Soft reset to before the bad commit (keeps your changes)
git reset --soft HEAD~1

# 2. Stage the updated files
git add .

# 3. Commit again with the environment variable version
git commit -m "Configure application with environment variables"

# 4. Push to GitHub
git push origin main
```

### Option 2: Amend Last Commit (If it's the most recent)

```bash
# 1. Stage the updated application.properties
git add server/src/main/resources/application.properties

# 2. Amend the last commit
git commit --amend --no-edit

# 3. Force push (rewrites history)
git push origin main --force
```

### Option 3: Remove File from Commit History (More thorough)

```bash
# Remove the file from ALL commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch server/src/main/resources/application.properties" \
  --prune-empty --tag-name-filter cat -- --all

# Add the updated file back
git add server/src/main/resources/application.properties
git commit -m "Configure application with environment variables"

# Force push
git push origin main --force
```

## ⚠️ After Fixing Git History

**CRITICAL**: Your API key is now compromised. You MUST:

1. **Rotate Brevo API Key**:
   - Log into Brevo dashboard
   - Generate a new API key
   - Revoke the old key: `<YOUR_OLD_KEY_HERE>`
   - Update `server/.env` with the new key

2. **Change Database Password** (recommended)

3. **Update your .env file** with new credentials

## 🔧 How It Works Now

- `server/.env` contains your actual credentials (ignored by git)
- `server/.env.example` is a template (committed to git)
- `application.properties` uses `${VARIABLE_NAME}` syntax
- Spring Boot with `spring-dotenv` automatically loads `.env` file

## ✅ Verify Before Pushing

```bash
# Check git status
git status

# Make sure .env is NOT in the staged files
# Make sure application.properties IS staged (with ${} variables)

# Check the file content
cat server/src/main/resources/application.properties
# Should show ${DB_PASSWORD} NOT the actual password

# Check what will be committed
git diff --cached
```

## 📝 For New Team Members

Share this setup process:

1. Clone the repository
2. Copy `server/.env.example` to `server/.env`
3. Fill in actual credentials in `.env`
4. Run the application

Your `.env` file is automatically ignored and never gets committed!
