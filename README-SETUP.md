# 🚀 Next.js Migration Setup Guide

## Prerequisites
- Node.js 18+
- Supabase account and project
- Git

## 1. Environment Setup

### Copy environment template
```bash
cp .env.local.example .env.local
```

### Configure Supabase credentials in `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
```

## 2. Database Setup

### Run database migrations
```bash
# Install Drizzle CLI globally (if not already installed)
npm install -g drizzle-kit

# Run migrations
drizzle-kit push
```

### Import real property data
```bash
# Import sample real properties
node scripts/import-real-properties.js
```

## 3. Install Dependencies
```bash
npm install
```

## 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your website!

## 5. Features Included

### ✅ Public Website
- **Homepage** with hero section and featured properties
- **Property listings** with advanced filtering
- **Property detail pages** with SEO optimization
- **Responsive design** for all devices

### ✅ Admin Panel
- **Property management** CRUD operations
- **Location intelligence** (Provinsi → Kabupaten → Kecamatan → Kelurahan)
- **Advanced search** and filtering

### ✅ Technical Features
- **Next.js 15** with App Router
- **TypeScript** full type safety
- **Tailwind CSS** modern styling
- **Supabase** database integration
- **React Query** data management

## 6. Database Schema

The application uses the following main tables:
- `properties` - Property listings
- `admin_users` - Admin authentication
- `inquiries` - Lead management
- `analytics_events` - User behavior tracking

## 7. API Routes

- `GET/POST /api/properties` - Property CRUD
- `GET/PUT/DELETE /api/properties/[id]` - Individual property operations
- `POST /api/properties/search` - Advanced search

## 8. Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## 9. Troubleshooting

### Common Issues

**Database Connection Error:**
- Check your Supabase credentials in `.env.local`
- Ensure your Supabase project is active
- Run `drizzle-kit push` to sync schema

**Missing Dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build Errors:**
- Check TypeScript errors: `npm run type-check`
- Lint code: `npm run lint`

## 10. Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Database migration
drizzle-kit push
```

## 🎉 Success!

Your Next.js property website is now ready with:
- ✅ Real property data integration
- ✅ Modern responsive design
- ✅ Admin panel for content management
- ✅ SEO optimization
- ✅ Production deployment ready

Visit `http://localhost:3000` to explore your new website!