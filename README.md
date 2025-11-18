# SupportHub

A modern, full-featured helpdesk and ticket management system built with Laravel and React. This system provides role-based access control, real-time notifications, and a polished user interface for managing support tickets and service requests efficiently.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Laravel](https://img.shields.io/badge/Laravel-12-red.svg)
![React](https://img.shields.io/badge/React-19.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)

## 🚀 Features

### Core Functionality
- **Ticket Management**: Create, view, update, and track support tickets
- **Real-time Notifications**: In-app notification system with auto-refresh (30-second polling)
- **Role-Based Access Control (RBAC)**: Three-tier permission system
  - **Admin**: Full system access, user management, view all tickets
  - **Staff**: Manage assigned tickets, view created tickets
  - **User**: Create and track own tickets
- **User Management**: Admin interface for CRUD operations on users with role assignment
- **Advanced Filtering**: Auto-apply filters with debouncing for tickets and requests
- **Comment System**: Add comments and updates to tickets
- **Status Tracking**: Open, In Progress, and Closed states
- **Priority Levels**: High, Medium, and Low priority assignment

### User Interface
- **Modern Design**: Clean, responsive UI with light/dark theme support
- **Collapsible Sidebar**: GitHub Copilot-style navigation with collapse toggle
- **Facebook-like Header**: Notification bell and user profile dropdown
- **Dashboard**: Statistics overview with recent tickets
- **Consistent Theming**: Blue accent color scheme throughout
- **Pastel Badge Design**: Outline-style status, priority, and role indicators
- **Modal-based Forms**: Streamlined user experience for creating/editing records
- **Password Visibility Toggle**: Enhanced UX for password fields

## 🛠️ Tech Stack

### Backend
- **[Laravel 12](https://laravel.com/)** - PHP framework
- **[Laravel Fortify](https://laravel.com/docs/fortify)** - Authentication system
- **[Inertia.js 2.1.4](https://inertiajs.com/)** - Server-side rendering bridge
- **[Laravel Wayfinder 0.1.3](https://github.com/glhd/wayfinder)** - Type-safe routing
- **MySQL** - Relational database

### Frontend
- **[React 19.2.0](https://react.dev/)** - UI library
- **[TypeScript 5.7.2](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4.0.0](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Lucide React](https://lucide.dev/)** - Icon system
- **[Vite 7.0.4](https://vitejs.dev/)** - Build tool with HMR

### Development Tools
- **[Pest](https://pestphp.com/)** - Testing framework
- **[Laravel Pint](https://laravel.com/docs/pint)** - Code formatter
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- npm or yarn
- MySQL >= 8.0

## ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd supporthub
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   
   Update `.env` with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=supporthub
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Run migrations**
   ```bash
   php artisan migrate
   ```

7. **Seed database (optional)**
   ```bash
   php artisan db:seed
   ```

8. **Build assets**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode

1. **Start Laravel development server**
   ```bash
   php artisan serve
   ```

2. **Start Vite development server** (in a separate terminal)
   ```bash
   npm run dev
   ```

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:8000`

### Production Mode

1. **Build production assets**
   ```bash
   npm run build
   ```

2. **Optimize Laravel**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Configure web server** (Apache/Nginx) to point to the `public` directory

## 🧪 Testing

Run the test suite using Pest:

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/DashboardTest.php

# Run with coverage
php artisan test --coverage
```

## 📁 Project Structure

```
supporthub/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Request handlers
│   │   ├── Middleware/       # HTTP middleware
│   │   └── Requests/         # Form request validation
│   ├── Models/               # Eloquent models
│   └── Notifications/        # Notification classes
├── database/
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
├── resources/
│   ├── css/
│   │   └── app.css          # Global styles and theme
│   └── js/
│       ├── components/       # Reusable React components
│       ├── layouts/          # Layout components
│       ├── pages/            # Inertia pages
│       ├── types/            # TypeScript definitions
│       └── app.tsx           # Frontend entry point
├── routes/
│   ├── web.php              # Web routes
│   └── settings.php         # Settings routes
├── tests/
│   ├── Feature/             # Feature tests
│   └── Unit/                # Unit tests
└── public/                  # Public assets
```

## 🎨 Theming

The system uses a blue accent color scheme with OKLCH color format for better color control:

- **Light Mode Primary**: `oklch(0.549 0.186 253.5)` (blue-600 equivalent)
- **Dark Mode Primary**: `oklch(0.645 0.2 253.5)` (lighter blue)
- **Badge Styling**: Pastel outline variants with colored borders and backgrounds

Theme can be toggled via the sidebar footer (Moon/Sun icon).

## 🔐 User Roles

### Admin
- Full system access
- User management (create, edit, delete users)
- View and manage all tickets
- Assign tickets to staff members
- System configuration

### Staff
- View assigned tickets
- View tickets they created
- Update ticket status and priority
- Add comments to tickets
- Manage their assigned workload

### User
- Create new tickets
- View their own tickets
- Add comments to their tickets
- Track ticket status

## 📝 Key Features in Detail

### Notification System
- Real-time in-app notifications (30-second auto-refresh)
- Notification triggers:
  - Ticket created
  - Ticket assigned to staff
  - Ticket status changed
  - New comment added
- "Mark as read" functionality
- "View all notifications" page with pagination

### Auto-Filtering
- 300ms debounce on filter inputs
- No manual "Apply" button needed
- Filters include:
  - Search by title/description
  - Status (Open, In Progress, Closed)
  - Priority (High, Medium, Low)
  - Category
  - Assigned staff (Admin/Staff only)

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for smaller screens
- Touch-friendly interface
- Dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

None currently. Please report issues via the issue tracker.

## 📧 Support

For support, please create an issue in the repository or contact the development team.

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/) - The PHP framework for web artisans
- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [Inertia.js](https://inertiajs.com/) - The modern monolith
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) - Rapidly build modern websites

---

**Built with ❤️ using Laravel and React**
