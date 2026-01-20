# Security Guidelines

## Environment Variables

### 🚨 NEVER commit .env files to the repository

Environment files contain sensitive information like:

- Database credentials
- API keys (Razorpay, Hugging Face AI)
- JWT secrets
- Third-party service tokens
- Payment gateway credentials

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

### What to do if .env files are accidentally committed

1. Remove from tracking: `git rm --cached .env`
2. Create sanitized examples: `cp .env .env.example` (then remove sensitive data)
3. Commit the fix: `git commit -m "Security fix: Remove .env files"`
4. **IMPORTANT:** Rotate all exposed credentials immediately!

### Credential Rotation Checklist

If environment variables were exposed in git history:

- [ ] Change MongoDB passwords
- [ ] Regenerate API keys (Razorpay, Hugging Face)
- [ ] Update JWT secrets
- [ ] Revoke and recreate authentication keys
- [ ] Update any other sensitive credentials
- [ ] Review git history and consider repo reset if highly sensitive

### Best Practices

- Always use `.env.example` files as templates
- Never share actual `.env` files
- Use different credentials for development/staging/production
- Regularly rotate sensitive credentials
- Use environment-specific configurations
- Store AI API keys securely (never in frontend code)
- Monitor API usage quotas to detect unauthorized access

---

## Authentication & Authorization

### JWT Token Security

**Backend Configuration:**
```javascript
// JWT token expires in 7 days
const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
  expiresIn: '7d'
});
```

**Best Practices:**
- Use strong JWT secrets (minimum 256 bits)
- Set appropriate expiration times
- Validate tokens on every protected route
- Implement token refresh mechanism
- Never expose JWT secrets

### Role-Based Access Control

**User Roles:**
- `collector` - Can create and manage own listings
- `artisan` - Can create and sell products
- `admin` - Full platform access

**Middleware Protection:**
```javascript
// Protect routes with authentication
router.post('/collectibles', authMiddleware, createCollectible);

// Protect admin routes
router.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);
```

---

## API Security

### Rate Limiting

**Implementation:**
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**Deployment Configuration (Render.com):**
```javascript
// Trust proxy for correct IP detection behind reverse proxy
app.set('trust proxy', 1);
```

**AI Endpoint Limits:**
- General API: 100 requests/15 minutes
- AI Content Generation: Included in general limits
- Hugging Face Free Tier: 1,000 requests/day

### Input Validation

**Zod Schema Validation:**
```javascript
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().positive(),
  description: z.string().min(10).max(2000),
  category: z.enum(['pottery', 'textiles', 'jewelry', 'art'])
});
```

**Content Sanitization:**
- Remove markdown formatting from AI-generated text
- Validate image URLs before processing
- Escape HTML in user inputs
- Limit file upload sizes

---

## Payment Security

### Razorpay Integration

**Server-Side Verification:**
```javascript
// ALWAYS verify payment signatures on the server
const crypto = require('crypto');

const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(order_id + '|' + payment_id)
  .digest('hex');

if (expectedSignature !== received_signature) {
  throw new Error('Payment verification failed');
}
```

**Best Practices:**
- Never expose Razorpay Key Secret in frontend
- Always verify payment signatures server-side
- Use webhook secret for webhook verification
- Log all payment transactions
- Implement payment failure handling

---

## AI Service Security

### Hugging Face API

**API Key Management:**
```env
# Backend .env only (NEVER in frontend)
HUGGINGFACE_API_KEY=hf_...
```

**Best Practices:**
- Store API key only in backend environment variables
- Never expose in frontend or client-side code
- Monitor usage to detect unusual activity
- Set usage quotas and alerts
- Validate all AI-generated content before saving
- Implement retry logic with exponential backoff

**Content Validation:**
```javascript
// Clean AI-generated text
function cleanAIContent(text) {
  return text
    .replace(/\*\*/g, '')  // Remove markdown bold
    .replace(/\*/g, '')    // Remove markdown italic
    .replace(/\n{3,}/g, '\n\n')  // Normalize newlines
    .trim();
}
```

---

## CORS Configuration

**Backend Setup:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-production-domain.com'
  ],
  credentials: true
}));
```

**Production Checklist:**
- [ ] Update CORS origins for production domains
- [ ] Enable credentials for authenticated requests
- [ ] Restrict origins (no wildcard * in production)

---

## Data Protection

### Password Security

**bcrypt Hashing:**
```javascript
const bcrypt = require('bcryptjs');

// Hash password before saving
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password on login
const isMatch = await bcrypt.compare(password, user.password);
```

### Database Security

**MongoDB Security:**
- Use connection string with authentication
- Enable IP whitelisting
- Regular backups
- Encrypt data at rest
- Use SSL/TLS for connections

**Example .env:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/craftcurio?retryWrites=true&w=majority
```

---

## Deployment Security

### Render.com Configuration

**Essential Settings:**
```javascript
// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security headers
const helmet = require('helmet');
app.use(helmet());
```

**Environment Variables:**
- Set all sensitive values in Render dashboard
- Use different credentials for production
- Enable auto-deploy from main branch only
- Set up health check endpoints

### Pre-Deployment Checklist

- [ ] All API keys rotated for production
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] Trust proxy configured (if behind reverse proxy)
- [ ] Security headers enabled (Helmet)
- [ ] Database connection secured
- [ ] Error messages don't expose sensitive data
- [ ] Logging configured (without sensitive data)
- [ ] HTTPS enabled
- [ ] AI API quotas monitored

---

## Monitoring & Logging

### Security Logging

**What to Log:**
- Failed login attempts
- API rate limit violations
- Payment verification failures
- Unauthorized access attempts
- AI API errors and usage

**What NOT to Log:**
- Passwords (even hashed)
- API keys
- JWT tokens
- Payment card details
- Full user personal information

### Incident Response

**If security breach detected:**
1. Immediately rotate all credentials
2. Review access logs
3. Notify affected users
4. Update security measures
5. Document incident and response
6. Review and update security policies

---

## Regular Security Maintenance

### Monthly Tasks
- Review access logs for suspicious activity
- Check API usage for anomalies
- Verify backup integrity
- Update dependencies with security patches

### Quarterly Tasks
- Rotate production credentials
- Security audit of codebase
- Review and update CORS origins
- Check rate limiting effectiveness
- AI API usage review

### Annual Tasks
- Comprehensive security assessment
- Update security documentation
- Review third-party integrations
- Disaster recovery testing
