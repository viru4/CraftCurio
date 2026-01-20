# CraftCurio Documentation

Welcome to the CraftCurio documentation hub. This folder contains comprehensive technical documentation for the platform, organized by category for easy navigation.

## 📁 Documentation Structure

```
docs/
├── api/                      # API Documentation
├── architecture/             # System Architecture & Design
├── guides/                   # Development Guides
├── deployment/               # Deployment & Setup
├── security/                 # Security Documentation
├── database/                 # Database Documentation
├── implementation/           # Implementation Notes
├── troubleshooting/          # Bug Fixes & Debugging
├── academic/                 # Research Papers & Reports
├── README.md                 # This file
└── DOCUMENTATION_GUIDE.md    # Documentation maintenance guide
```

---

## 📚 Documentation Index

### 🚀 Getting Started
- **[Quick Reference](guides/QUICK_REFERENCE.md)** - Fast lookup for common tasks and endpoints
- **[Project Structure](guides/PROJECT_STRUCTURE.md)** - Overview of codebase organization

### 📖 Development Guides
Located in [`guides/`](guides/)
- **[Frontend Guide](guides/FRONTEND_GUIDE.md)** - React components, hooks, and patterns
- **[Backend Structure](guides/BACKEND_STRUCTURE.md)** - Backend folder structure and organization
- **[Quick Reference](guides/QUICK_REFERENCE.md)** - Common tasks and quick commands
- **[Project Structure](guides/PROJECT_STRUCTURE.md)** - Complete codebase structure

### 🔌 API Documentation
Located in [`api/`](api/)
- **[API Reference](api/API_REFERENCE.md)** - Complete REST API endpoints with examples
  - Collectibles API
  - Auction API
  - Payment API (Razorpay)
  - AI Chatbot API
  - Content Generation API
  - Authentication API
  - User Management API

### 🏗️ Architecture & Design
Located in [`architecture/`](architecture/)
- **[System Architecture](architecture/ARCHITECTURE.md)** - Architecture diagrams and data flow
- **[Auction System](architecture/AUCTION_SYSTEM.md)** - Auction functionality design
- **[DFD Diagrams](architecture/DFD_Diagrams.md)** - Data Flow Diagrams

### 🚢 Deployment
Located in [`deployment/`](deployment/)
- **[Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Render Deployment](deployment/RENDER_DEPLOYMENT_QUICKSTART.md)** - Quick deployment to Render
- **[Razorpay Setup](deployment/RAZORPAY_SETUP.md)** - Payment gateway configuration
- **[Payment Quickstart](deployment/PAYMENT_QUICKSTART.txt)** - Quick payment integration guide

### 🔐 Security
Located in [`security/`](security/)
- **[Security Guidelines](security/SECURITY.md)** - Comprehensive security best practices
  - Environment Variables
  - Authentication & Authorization
  - API Security & Rate Limiting
  - Payment Security
  - AI Service Security
  - CORS Configuration
  - Data Protection
  - Deployment Security
  - Monitoring & Logging

### 💾 Database
Located in [`database/`](database/)
- **[Database Scripts](database/DATABASE_SCRIPTS.md)** - Database setup and migration scripts

### 🛠️ Implementation Notes
Located in [`implementation/`](implementation/)
- **[Auction Management](implementation/AUCTION_MANAGEMENT_IMPLEMENTATION.md)** - Auction implementation details
- **[Post-Auction Analysis](implementation/POST_AUCTION_IMPLEMENTATION_ANALYSIS.md)** - Implementation insights

### 🐛 Troubleshooting
Located in [`troubleshooting/`](troubleshooting/)
- **[Collectible Update Fix](troubleshooting/COLLECTIBLE_UPDATE_FIX.md)** - Product visibility fixes
- **[Razorpay Fixes Summary](troubleshooting/RAZORPAY_FIXES_SUMMARY.md)** - Payment integration fixes
- **[Razorpay Troubleshooting](troubleshooting/RAZORPAY_TROUBLESHOOTING.md)** - Common payment issues
- **[Razorpay Test Cards](troubleshooting/RAZORPAY_TEST_CARDS.md)** - Test payment credentials
- **[Razorpay 400 Debug](troubleshooting/RAZORPAY_400_DEBUG.md)** - Bad request fixes
- **[Razorpay 500 Fix](troubleshooting/RAZORPAY_500_VALIDATE_ACCOUNT_FIX.md)** - Account validation fixes
- **[Razorpay 502 Fix](troubleshooting/RAZORPAY_502_ERROR_FIX.md)** - Gateway error fixes
- **[Razorpay Console Warnings](troubleshooting/RAZORPAY_CONSOLE_WARNINGS.md)** - Console error fixes

### 🎓 Academic Resources
Located in [`academic/`](academic/)
- **[Project Report](academic/CraftCurio-Project-Report.md)** - Comprehensive B.Tech project report
- **[Research Paper](academic/CraftCurio-Research-Paper.md)** - IEEE-style academic research paper
- [Project Report v1](academic/CraftCurio-Project-Report_1.md) - Previous version (archived)

---

## 🎯 Quick Navigation

### For Developers
1. **Setup:** [Quick Reference](guides/QUICK_REFERENCE.md) → [Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)
2. **Architecture:** [System Architecture](architecture/ARCHITECTURE.md) → [Project Structure](guides/PROJECT_STRUCTURE.md)
3. **API Development:** [API Reference](api/API_REFERENCE.md) → [Backend Structure](guides/BACKEND_STRUCTURE.md)
4. **Frontend:** [Frontend Guide](guides/FRONTEND_GUIDE.md)
5. **Security:** [Security Guidelines](security/SECURITY.md)

### For Academic Review
1. **[Project Report](academic/CraftCurio-Project-Report.md)** - Complete project documentation (140+ pages)
2. **[Research Paper](academic/CraftCurio-Research-Paper.md)** - Academic research paper with citations

### For Feature Implementation
- **Auctions:** [Auction System](architecture/AUCTION_SYSTEM.md) + [Implementation](implementation/AUCTION_MANAGEMENT_IMPLEMENTATION.md)
- **Payments:** [Razorpay Setup](deployment/RAZORPAY_SETUP.md) + [API Reference](api/API_REFERENCE.md)
- **AI Features:** [Project Report §6.6-6.7](academic/CraftCurio-Project-Report.md) + [API Reference](api/API_REFERENCE.md)
- **Security:** [Security Guidelines](security/SECURITY.md)

### For Troubleshooting
- **Payment Issues:** [Razorpay Troubleshooting](troubleshooting/RAZORPAY_TROUBLESHOOTING.md)
- **Bug Fixes:** [Troubleshooting Directory](troubleshooting/)
- **Deployment:** [Render Deployment](deployment/RENDER_DEPLOYMENT_QUICKSTART.md)

---

## 🤖 AI Features (Latest)

CraftCurio includes cutting-edge AI integration using Hugging Face Inference API v4.13.9:

### Intelligent Chatbot System
- **Model:** Meta Llama-3.2-3B-Instruct
- **Performance:** 85% intent recognition accuracy, 2.1s avg response time
- **Capabilities:** Context-aware responses, 6 intent types, 80% support automation
- **Documentation:** [Project Report §6.6](academic/CraftCurio-Project-Report.md) + [API Reference](api/API_REFERENCE.md)

### Vision-Language Content Generation
- **Vision Model:** Salesforce BLIP-2 (image analysis)
- **Language Model:** Meta Llama-3.2-3B-Instruct (text generation)
- **Performance:** 90% accuracy, 4.1s generation time, 70% time savings
- **Content Types:** 7 types including descriptions, titles, keywords, social posts, batch generation
- **Documentation:** [Project Report §6.7](academic/CraftCurio-Project-Report.md) + [API Reference](api/API_REFERENCE.md)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CraftCurio Platform                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React 18.2 + Vite)                               │
│  ├── Components (UI, Layout, Forms)                         │
│  ├── Contexts (State Management)                            │
│  ├── Hooks (Custom React Hooks)                             │
│  └── Routes (React Router)                                  │
├─────────────────────────────────────────────────────────────┤
│  Backend (Node.js + Express 5.1)                            │
│  ├── API Controllers                                        │
│  ├── Routes & Middleware                                    │
│  ├── Services (Business Logic)                              │
│  │   ├── Auction Service                                    │
│  │   ├── Payment Service (Razorpay)                         │
│  │   ├── AI Services (Hugging Face)                         │
│  │   └── Email Service                                      │
│  └── Socket.io (Real-time)                                  │
├─────────────────────────────────────────────────────────────┤
│  Database (MongoDB 8.18 + Mongoose)                         │
│  ├── Users, Artisans, Collectors                            │
│  ├── Products & Collectibles                                │
│  ├── Orders & Payments                                      │
│  └── Auctions & Bids                                        │
├─────────────────────────────────────────────────────────────┤
│  External Services                                          │
│  ├── Razorpay (Payments)                                    │
│  ├── Hugging Face (AI)                                      │
│  ├── Cloudinary (Images)                                    │
│  └── Nodemailer (Email)                                     │
└─────────────────────────────────────────────────────────────┘
```

For detailed architecture, see [Architecture Documentation](architecture/ARCHITECTURE.md).

---

## 📊 Key Metrics

| Metric | Value | Source |
|--------|-------|--------|
| **Platform Users** | 1,247 | [Project Report §12.3](academic/CraftCurio-Project-Report.md) |
| **Products Listed** | 3,892 | [Project Report §12.3](academic/CraftCurio-Project-Report.md) |
| **AI Chatbot Accuracy** | 85% | [Project Report §12.4](academic/CraftCurio-Project-Report.md) |
| **Content Generation Accuracy** | 90% | [Project Report §12.4](academic/CraftCurio-Project-Report.md) |
| **Payment Success Rate** | 98.5% | [Razorpay Setup](deployment/RAZORPAY_SETUP.md) |
| **Auction Completion Rate** | 92% | [Auction System](architecture/AUCTION_SYSTEM.md) |

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 5.1.0
- **Database:** MongoDB 8.18 + Mongoose 8.18
- **Real-time:** Socket.io 4.8.1
- **AI:** Hugging Face Inference API 4.13.9
- **Payment:** Razorpay 2.9.6
- **Security:** JWT, bcrypt, Helmet 7.2, express-rate-limit 7.5

### Frontend
- **Framework:** React 18.2
- **Build Tool:** Vite 5.0
- **Styling:** Tailwind CSS 3.3
- **HTTP Client:** Axios 1.6
- **State:** React Context API
- **Icons:** Lucide React

### AI Models
- **Text Generation:** Meta Llama-3.2-3B-Instruct
- **Vision Analysis:** Salesforce BLIP-2

---

## 📋 Recent Updates

| Date | Update | Docs Updated |
|------|--------|--------------|
| Jan 20, 2026 | Documentation restructuring into categories | All |
| Jan 20, 2026 | AI API endpoints documentation | [API Reference](api/API_REFERENCE.md) |
| Jan 20, 2026 | Security guide expansion | [Security](security/SECURITY.md) |
| Jan 20, 2026 | Trust proxy configuration for Render | [Architecture](architecture/ARCHITECTURE.md) |
| Jan 19, 2026 | Dashboard product visibility fix | [Troubleshooting](troubleshooting/COLLECTIBLE_UPDATE_FIX.md) |
| Jan 18, 2026 | AI features added to academic docs | [Project Report](academic/CraftCurio-Project-Report.md), [Research Paper](academic/CraftCurio-Research-Paper.md) |

---

## 🔗 External Resources

- **GitHub Repository:** [viru4/CraftCurio](https://github.com/viru4/CraftCurio)
- **Hugging Face Models:**
  - [Llama-3.2-3B-Instruct](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)
  - [BLIP-2](https://huggingface.co/Salesforce/blip-image-captioning-large)
- **Razorpay Docs:** [razorpay.com/docs](https://razorpay.com/docs/)
- **Socket.io Docs:** [socket.io/docs](https://socket.io/docs/)

---

## 📝 Documentation Maintenance

For guidelines on maintaining and updating these documents, see [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md).

### Contributing to Documentation
1. Follow the structure outlined in this README
2. Update the appropriate category folder
3. Maintain consistent formatting
4. Update this README when adding new documents
5. Keep the Documentation Guide synchronized

---

## 💡 Need Help?

- **Getting Started:** [Quick Reference](guides/QUICK_REFERENCE.md)
- **API Questions:** [API Reference](api/API_REFERENCE.md)
- **Bugs & Issues:** [Troubleshooting](troubleshooting/)
- **Security Concerns:** [Security Guidelines](security/SECURITY.md)
- **Academic Inquiries:** [Project Report](academic/CraftCurio-Project-Report.md) or [Research Paper](academic/CraftCurio-Research-Paper.md)

---

**Last Updated:** January 20, 2026  
**Documentation Version:** 2.0 (Structured)  
**Platform Version:** 2.0 (AI Enhanced)
