# Nero Cars - Car Showroom Marketplace (Web)

A modern car marketplace built with Next.js 14, Supabase, and Prisma ORM.

## Latest Updates (v2.0.0)

**Major Upgrade with Prisma ORM & Advanced Features!**

- Migrated to **Prisma ORM** for type-safe database access
- **Google OAuth** support
- **Real-time Chat** with Supabase Realtime
- **Real-time Notifications**
- **Analytics & Statistics** tracking
- **Auth Logging** (login attempts, failed logins)
- **System Logging** for debugging and monitoring
- **Session Management** with refresh tokens
- **User Activity** tracking

## Features

### Authentication

- Email/Password & Google OAuth
- Session management with refresh tokens
- Failed login attempt tracking

### Car Listings

- Create, read, update, delete cars
- Image upload to Supabase Storage
- Draft mode for incomplete listings
- Mark as sold functionality
- Real-time view counts

### Real-time Chat

- Instant messaging between buyers and sellers
- Read receipts
- Typing indicators
- Conversation management

### Favorites/Wishlist

- Save favorite cars
- Track favorite count per car

### Real-time Notifications

- Instant notifications for messages, favorites, etc.
- Browser notifications
- Mark as read functionality

### Analytics & Statistics

- Track page views, car views, searches
- Per-car statistics (views, favorites, messages)
- User activity logs
- Admin dashboard metrics

### Security & Logging

- Authentication logs
- System logs (errors, warnings, info)
- Row Level Security (RLS) on all tables

### User Features

- User profiles with customizable information
- Responsive design for all devices
- Advanced search & filters
- Image galleries with Swiper

### Admin Dashboard

- Separate admin authentication
- Metrics and analytics
- Manage all cars
- User management
- Newsletter management

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **ORM**: Prisma (Type-safe database access)
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Image Slider**: Swiper

## Installation

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Supabase account

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Setup Environment Variables

Create .env.local file in root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 3: Setup Database

Run the SQL scripts in scripts/ folder in your Supabase SQL Editor:

1. Complete schema setup
2. Seed data (brands, locations, FAQs)
3. RLS policies

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nero-cars-web-v2/
 app/                    # Next.js App Router
    (auth)/            # Authentication pages
    admin/             # Admin dashboard
    cars/              # Car listings
    chat/              # Chat functionality
    api/               # API routes
 components/            # React components
 lib/                   # Utilities & configs
    supabase.ts       # Supabase client
    database.ts       # Database queries
    utils.ts          # Helper functions
 store/                 # Zustand state management
 types/                 # TypeScript types
 scripts/               # SQL scripts
 public/                # Static assets
```

## Database Schema

Complete database schema with 13+ tables:

- profiles (user information)
- brands & cars (vehicle data)
- reviews & ratings
- favorites & wishlist
- messages & conversations
- notifications
- feedback system
- analytics & statistics
- And more...

## Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for most actions
- Admin-only access for sensitive operations
- Input validation with Zod
- SQL injection protection with Prisma

## Contributing

1. Fork the project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is private and proprietary.

## Developer

**Alvin Ilham**

- GitHub: [@AlvinIlham](https://github.com/AlvinIlham)

## Support

For questions or support, please open an issue in this repository.

---

Made with using Next.js, Supabase, and Prisma
