# Security Guidelines

## Environment Variables

### 🚨 NEVER commit .env files to the repository!

Environment files contain sensitive information like:
- Database credentials
- API keys
- JWT secrets
- Third-party service tokens

### Setup Instructions

1. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Frontend Setup:**
   ```bash
   cd front-end
   cp .env.example .env
   # Edit .env with your actual values
   ```

### What to do if .env files are accidentally committed:

1. Remove from tracking: `git rm --cached .env`
2. Create sanitized examples: `cp .env .env.example` (then remove sensitive data)
3. Commit the fix: `git commit -m "Security fix: Remove .env files"`
4. **IMPORTANT:** Rotate all exposed credentials immediately!

### Credential Rotation Checklist

If environment variables were exposed in git history:
- [ ] Change MongoDB passwords
- [ ] Regenerate API keys
- [ ] Update JWT secrets
- [ ] Revoke and recreate Clerk keys
- [ ] Update any other sensitive credentials

### Best Practices

- Always use `.env.example` files as templates
- Never share actual `.env` files
- Use different credentials for development/staging/production
- Regularly rotate sensitive credentials
- Use environment-specific configurations