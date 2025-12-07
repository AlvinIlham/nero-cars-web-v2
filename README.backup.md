# Nero Cars - Car Showroom Marketplace (Web)

A modern car marketplace built with Next.js 14, Supabase, and Prisma ORM.

## ✨ Latest Updates (v2.0.0)

🎉 **Major Upgrade with Prisma ORM & Advanced Features!**

- ✅ Migrated to **Prisma ORM** for type-safe database access
- ✅ **Google OAuth** support (kolom google_id, auth_provider, provider_id)
- ✅ **Real-time Chat** with Supabase Realtime
- ✅ **Real-time Notifications**
- ✅ **Analytics & Statistics** tracking (views, favorites, messages)
- ✅ **Auth Logging** (login attempts, failed logins)
- ✅ **System Logging** for debugging and monitoring
- ✅ **Session Management** with refresh tokens
- ✅ **User Activity** tracking

## 🚀 Features

### 🔐 Authentication
- Email/Password & Google OAuth
- Session management
- Failed login tracking

### 🚗 Car Listings
- Create, read, update, delete cars
- Image upload to Supabase Storage
- Draft mode for incomplete listings
- Mark as sold
- Real-time view counts

### 💬 Real-time Chat
- Instant messaging between buyers and sellers
  - Read receipts
  - Typing indicators
  - Conversation management
  
- ❤️ **Favorites/Wishlist**
  - Save favorite cars
  - Track favorite count per car
  
- 🔔 **Real-time Notifications**
  - Instant notifications for messages, favorites, etc.
  - Browser notifications
  - Mark as read functionality
  
- 📊 **Analytics & Statistics**
  - Track page views, car views, searches
  - Per-car statistics (views, favorites, messages)
  - User activity logs
  - Admin dashboard metrics
  
- 🔒 **Security & Logging**
  - Authentication logs
  - System logs (errors, warnings, info)
  - Failed login attempt tracking
  - Row Level Security (RLS) on all tables

### User Features
- 👤 User profiles with customizable information
- 📱 Responsive design for all devices
- 🔍 Advanced search & filters
- 🖼️ Image galleries with Swiper
>>>>>>> 47e24bf40d8920e8cc945710ed4ce818ba4c48ab

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **ORM**: Prisma (Type-safe database access)
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Image Slider**: Swiper
- **ORM**: Prisma (Optional for type safety)

## 🆕 NEW: Complete Database Setup

Database lengkap sudah tersedia! Tidak perlu hardcode data lagi.

### ⚡ Quick Start (15 menit)

Lihat **[QUICK_START.md](QUICK_START.md)** untuk setup database dalam 15 menit.

### 📚 Full Migration Guide

Lihat **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** untuk panduan lengkap migrasi dari hardcode ke database.

### ✅ Checklist

Gunakan **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** untuk tracking progress setup.

### 📊 Database Schema

- 13 Tables (profiles, brands, cars, reviews, feedback, dll)
- 18 Brands + 50+ Car Models (pre-populated)
- 30 Locations Indonesia
- 10 FAQs
- Row Level Security (RLS)
- Auto-triggers & functions

## 🚀 Quick Start

<<<<<<< HEAD
### Method 1: Quick Start (Recommended)

1. **Install dependencies:**
=======
### Prerequisites
- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Git
>>>>>>> 47e24bf40d8920e8cc945710ed4ce818ba4c48ab

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Car_Showroom
```

2. **Install dependencies**
```bash
npm install
```

<<<<<<< HEAD
2. **Setup Database (15 menit):**

   Ikuti panduan di **[QUICK_START.md](QUICK_START.md)**:

   - Run `database/complete-schema.sql` di Supabase
   - Run `database/seed-data.sql` di Supabase
   - Setup storage buckets

3. **Configure environment variables:**
=======
3. **Setup Environment Variables**
>>>>>>> 47e24bf40d8920e8cc945710ed4ce818ba4c48ab

Create `.env.local` file (see `.env.local.example`):
```env
<<<<<<< HEAD
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For Prisma
DATABASE_URL=your_database_connection_string
DIRECT_URL=your_direct_database_url
```

4. **Run the development server:**
=======
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Prisma Database
DATABASE_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
```

4. **Generate Prisma Client**
```bash
npx prisma generate
```
>>>>>>> 47e24bf40d8920e8cc945710ed4ce818ba4c48ab

5. **Push Database Schema**
```bash
npx prisma db push
```

6. **Run RLS Policies**
- Open Supabase SQL Editor
- Run `prisma/rls-policies.sql`

7. **Start Development Server**
```bash
npm run dev
```

8. **Open Browser**
```
http://localhost:3000
```

## 📚 Documentation

- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Detailed setup guide (START HERE!)
- **[PRISMA_SETUP_GUIDE.md](./PRISMA_SETUP_GUIDE.md)** - Prisma ORM usage guide
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - SQL to Prisma migration guide
- **[CHECKLIST_KRITERIA.md](./CHECKLIST_KRITERIA.md)** - Feature completion checklist
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Project structure overview

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── cars/                # Car listing pages
│   ├── profile/             # User profile pages
│   ├── messages/            # Chat pages
│   ├── notifications/       # Notifications page
│   ├── login/               # Login page
│   ├── register/            # Register page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── home/               # Home page components
│   ├── chat/               # Chat components
│   └── providers/          # Context providers
├── lib/                    # Utility functions & configs
│   ├── prisma.ts           # Prisma client & helpers
│   ├── supabase.ts         # Supabase client
│   ├── realtime.ts         # Realtime utilities
│   ├── logger.ts           # Logging utilities
│   └── api-examples.ts     # API implementation examples
├── store/                  # Zustand state management
│   ├── authStore.ts        # Auth state
│   ├── carStore.ts         # Car state
│   ├── chatStore.ts        # Chat state (with realtime)
│   └── notificationStore.ts # Notification state (with realtime)
├── prisma/                 # Prisma ORM
│   ├── schema.prisma       # Database schema
│   └── rls-policies.sql    # RLS policies for Supabase
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## 🗄️ Database Schema

The application uses Prisma ORM with the following tables:

### Core Tables
- `profiles` - User profiles (with Google OAuth support)
- `cars` - Car listings
- `favorites` - User favorites
- `conversations` - Chat conversations
- `messages` - Chat messages
- `notifications` - User notifications

### New Analytics & Logging Tables
- `analytics` - Event tracking (page views, car views, searches)
- `car_statistics` - Per-car statistics (views, favorites, messages count)
- `user_activity` - User activity logs
- `auth_logs` - Authentication logs
- `user_sessions` - Session management
- `system_logs` - System-wide logging

See `prisma/schema.prisma` for the complete schema.

## 🔒 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Authentication required for sensitive operations
- ✅ Image upload validation
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Failed login tracking & account lockout
- ✅ Session management with refresh tokens
- ✅ Audit trail for all critical operations

## 🎯 API Usage Examples

### Using Prisma Client

```typescript
import { db, prisma } from '@/lib/prisma'

// Fetch cars
const cars = await db.car.findMany()

// Create car
const car = await db.car.create({
  userId: 'user-id',
  brand: 'Honda',
  model: 'Civic',
  year: 2023,
  price: 300000000n,
  // ... other fields
})

// Track analytics
await db.analytics.track('car_view', userId, { carId })

// Increment statistics
await db.carStatistics.increment(carId, 'views')
```

See `lib/api-examples.ts` for more examples.

## 📊 Analytics & Monitoring

### Track Events
```typescript
import { analytics } from '@/lib/logger'

// Page view
await analytics.pageView('/cars', userId)

// Car view
await analytics.carView(carId, userId, request)

// Search
await analytics.carSearch('honda', filters, resultsCount, userId)
```

### Get Statistics
```typescript
// User statistics
const stats = await db.carStatistics.getTopViewed(10)

// System logs
const logs = await db.systemLog.getRecent('auth', 'error')
```

## 🔄 Realtime Features

### Chat
```typescript
import { useChatStore } from '@/store/chatStore'

// Initialize realtime
chatStore.initializeRealtime(userId)

// New messages arrive automatically via subscription
```

### Notifications
```typescript
import { useNotificationStore } from '@/store/notificationStore'

// Initialize realtime
notificationStore.initializeRealtime(userId)

// New notifications arrive automatically
```

## 🚧 Development Roadmap

### Completed ✅
- [x] Authentication system (email + Google OAuth)
- [x] Car listing CRUD operations
- [x] Real-time chat system
- [x] Favorites functionality
- [x] Real-time notifications
- [x] Advanced search & filters
- [x] Analytics & statistics
- [x] System logging
- [x] Prisma ORM integration

### In Progress 🔄
- [ ] Migrate all pages to use Prisma
- [ ] Admin dashboard
- [ ] Advanced analytics visualizations

### Planned 📋
- [ ] Payment integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Car comparison feature
- [ ] Flutter mobile app
- [ ] Progressive Web App (PWA)

## 🧪 Testing

```bash
# Run development server
npm run dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Format Prisma schema
npx prisma format

# Validate schema
npx prisma validate
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT

## 👨‍💻 Authors

Nero Cars Development Team

## 🆘 Support

For issues or questions:
1. Check documentation files
2. Review `SETUP_INSTRUCTIONS.md`
3. Check `MIGRATION_GUIDE.md`
4. Open an issue on GitHub

---

**Version:** 2.0.0  
**Last Updated:** November 11, 2025  
**Built with ❤️ using Next.js, Supabase, and Prisma**
#   n e r o - c a r - w e b 
 
 #   n e r o - c a r s - w e b 
 
 #   n e r o - c a r s - w e b - v 2 
 
 