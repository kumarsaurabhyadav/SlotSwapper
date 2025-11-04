# 🚀 Deployment Guide for SlotSwapper

This guide will help you deploy SlotSwapper to production on various platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
  - [Option 1: Render (Recommended)](#option-1-render-recommended)
  - [Option 2: Railway](#option-2-railway)
  - [Option 3: Heroku](#option-3-heroku)
  - [Option 4: Vercel + Render](#option-4-vercel--render)
  - [Option 5: Docker Compose](#option-5-docker-compose)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Post-Deployment Checklist](#post-deployment-checklist)

## 🧩 Prerequisites

- GitHub repository (public or with deployment access)
- PostgreSQL database (free tier available on most platforms)
- Domain name (optional, but recommended)

## 🎯 Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

#### Backend Deployment:

1. **Sign up at [Render.com](https://render.com)**

2. **Create New Web Service:**
   - Connect your GitHub repository
   - Select `slotswap-backend/server` directory
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment: `Node`

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<generate-strong-secret>
   PORT=4000
   FRONTEND_URL=<your-frontend-url>
   ```

4. **Create PostgreSQL Database:**
   - In Render dashboard, create new PostgreSQL database
   - Copy the connection string to `DATABASE_URL`

5. **Run Database Schema:**
   - Connect to database and run `schema.sql`
   - Or use Render's shell: `psql $DATABASE_URL -f schema.sql`

#### Frontend Deployment:

1. **Create New Static Site:**
   - Connect GitHub repository
   - Root directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `build`

2. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
   ```

---

### Option 2: Railway

1. **Sign up at [Railway.app](https://railway.app)**

2. **Deploy Backend:**
   - New Project → Deploy from GitHub
   - Select repository → Set root directory to `server`
   - Add PostgreSQL database
   - Set environment variables

3. **Deploy Frontend:**
   - New Service → Deploy from GitHub
   - Root directory: `client`
   - Build command: `npm run build`
   - Set environment variables

---

### Option 3: Heroku

#### Backend:

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App:**
   ```bash
   heroku login
   heroku create your-app-name-backend
   ```

3. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy:**
   ```bash
   cd server
   git subtree push --prefix server heroku main
   ```

6. **Run Schema:**
   ```bash
   heroku run psql $DATABASE_URL -f schema.sql
   ```

#### Frontend:

1. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   cd client
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard**

---

### Option 4: Vercel + Render (Best Free Option)

#### Backend on Render:
- Follow Render steps above

#### Frontend on Vercel:

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Project:**
   - Connect GitHub repository
   - Root directory: `client`
   - Framework: React
   - Build command: `npm run build`
   - Output directory: `build`

3. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   REACT_APP_SOCKET_URL=https://your-backend.onrender.com
   ```

---

### Option 5: Docker Compose (Self-Hosted)

1. **Clone Repository:**
   ```bash
   git clone <your-repo>
   cd slotswap-backend
   ```

2. **Create `.env` file:**
   ```env
   POSTGRES_DB=slotswap
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password
   DATABASE_URL=postgresql://postgres:your_secure_password@db:5432/slotswap
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   REACT_APP_API_URL=http://localhost:4000/api
   REACT_APP_SOCKET_URL=http://localhost:4000
   BACKEND_PORT=4000
   FRONTEND_PORT=3000
   ```

3. **Build and Run:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Run Database Schema:**
   ```bash
   cat server/schema.sql | docker exec -i slotswapper_db_prod psql -U postgres -d slotswap
   ```

---

## 🔐 Environment Variables

### Backend (.env):

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_very_strong_secret_key_min_32_characters
PORT=4000
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env):

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

**Important:** 
- Generate a strong JWT_SECRET (at least 32 characters)
- Never commit `.env` files
- Use different secrets for production and development

---

## 🗄️ Database Setup

### For Cloud Databases:

1. **Connect to your PostgreSQL database:**
   ```bash
   psql $DATABASE_URL
   ```

2. **Run the schema:**
   ```bash
   \i schema.sql
   ```

Or copy and paste the contents of `schema.sql` into your database console.

### For Render/Railway:

Use the shell/console provided by the platform to run:
```bash
psql $DATABASE_URL -f schema.sql
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and accessible
- [ ] Database schema is applied
- [ ] Environment variables are set correctly
- [ ] CORS is configured for your frontend URL
- [ ] Test login/signup functionality
- [ ] Test creating events
- [ ] Test swap request flow
- [ ] Test password reset (check email sending)
- [ ] Socket.io connection is working
- [ ] Health check endpoint is responding
- [ ] SSL/HTTPS is enabled (if using custom domain)

---

## 🔧 Troubleshooting

### Backend Issues:

**Problem:** Database connection failed
- **Solution:** Check `DATABASE_URL` format and credentials

**Problem:** CORS errors
- **Solution:** Verify `FRONTEND_URL` matches your frontend domain

**Problem:** Socket.io not connecting
- **Solution:** Check `REACT_APP_SOCKET_URL` matches backend URL

### Frontend Issues:

**Problem:** API calls failing
- **Solution:** Check `REACT_APP_API_URL` is correct

**Problem:** Build fails
- **Solution:** Check all environment variables are set

**Problem:** 404 errors on refresh
- **Solution:** Configure your hosting to serve `index.html` for all routes

---

## 📝 Production Best Practices

1. **Security:**
   - Use strong JWT secrets
   - Enable HTTPS/SSL
   - Set proper CORS origins
   - Don't expose sensitive data in logs

2. **Performance:**
   - Enable database connection pooling
   - Use CDN for static assets
   - Enable gzip compression
   - Set up caching headers

3. **Monitoring:**
   - Set up error logging
   - Monitor database connections
   - Track API response times
   - Set up alerts for downtime

4. **Backup:**
   - Regular database backups
   - Version control for code
   - Document all environment variables

---

## 🎯 Quick Deploy Commands

### Render (Backend):
```bash
# After pushing to GitHub, Render auto-deploys
# Just set environment variables in dashboard
```

### Vercel (Frontend):
```bash
cd client
npm install -g vercel
vercel --prod
```

### Railway:
```bash
# Connect GitHub repo in Railway dashboard
# Auto-deploys on push
```

---

## 📞 Support

If you encounter issues during deployment:
1. Check the platform's logs
2. Verify environment variables
3. Test database connection
4. Check CORS configuration
5. Verify all URLs are correct

---

**Good luck with your deployment! 🚀**

