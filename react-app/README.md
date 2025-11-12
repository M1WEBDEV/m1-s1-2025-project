# Babel's Library

A beautiful and powerful library management system built with React, TypeScript, and Ant Design. Manage your book collection, track authors, maintain client relationships, and analyze sales performance with an elegant, modern interface.

## 🌟 Features

### Core Functionality
- **Books Management**: Complete CRUD operations for books with cover images, descriptions, and publication details
- **Authors Management**: Track author profiles with biographical information, book counts, and average sales metrics
- **Clients Management**: Maintain detailed client profiles with contact information and sales history
- **Sales Tracking**: Record and manage sales transactions with filtering by client and book
- **Analytics**: View sales statistics, book counts, and performance metrics across all entities

### User Interface
- **Modern Design**: Apple-inspired, professional UI with gradient hero sections and smooth animations
- **Responsive Layout**: Fully responsive design that works seamlessly on desktop, tablet, and mobile devices
- **Interactive Carousels**: 
  - Home page hero carousel with beautiful book-themed images (auto-advances every 1 second)
  - Featured books carousel showcasing novels and science books (auto-advances every 0.5 seconds)
- **Search & Filter**: Advanced search functionality across all list pages with real-time filtering
- **Sortable Tables**: Sortable, paginated tables with row-click navigation to detail pages
- **Breadcrumb Navigation**: Consistent breadcrumb navigation throughout the application
- **Empty States**: Beautiful, informative empty states with helpful messages and actions

### Technical Features
- **Type-Safe Routing**: Full TypeScript support with TanStack Router for type-safe navigation
- **Context API**: Centralized state management using React Context API with custom hooks
- **Optimistic UI**: Optimistic updates for better user experience
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Loading indicators and spinners for better UX
- **Form Validation**: Client-side form validation with Ant Design Form components
- **Auto-scroll**: Automatic scroll-to-top on route changes

## 🛠️ Tech Stack

- **React 19.2.0**: Modern React with hooks and functional components
- **TypeScript 5.9.3**: Full type safety throughout the application
- **Vite 7.1.7**: Fast build tool and development server
- **TanStack Router 1.132.45**: Type-safe routing solution
- **Ant Design 5.27.4**: Comprehensive UI component library
- **dayjs 1.11.13**: Lightweight date manipulation library

## 📁 Project Structure

```
react-app/
├── src/
│   ├── authors/          # Authors domain
│   │   ├── components/    # Author-specific components
│   │   ├── pages/        # Author pages (list, details)
│   │   ├── providers/    # Author data providers
│   │   └── AuthorModel.ts
│   ├── books/            # Books domain
│   │   ├── components/   # Book-specific components
│   │   ├── pages/        # Book pages (list, details)
│   │   ├── providers/    # Book data providers
│   │   └── BookModel.tsx
│   ├── clients/          # Clients domain
│   │   ├── components/   # Client-specific components
│   │   ├── pages/        # Client pages (list, details)
│   │   ├── useClientsProvider.tsx
│   │   └── ClientModel.ts
│   ├── sales/            # Sales domain
│   │   ├── pages/        # Sales page
│   │   ├── salesApi.ts   # Sales API functions
│   │   ├── useSales.tsx  # Sales data hook
│   │   └── SaleModel.ts
│   ├── shared/           # Shared utilities
│   │   ├── http.ts       # Custom fetch wrapper
│   │   └── ui/           # Reusable UI components
│   │       ├── AvatarImg.tsx
│   │       ├── Breadcrumbs.tsx
│   │       └── BookIcon.tsx
│   ├── routes/           # Route definitions
│   ├── assets/           # Static assets
│   │   └── images/       # Image files
│   ├── Layout.tsx        # Main layout component
│   └── main.tsx          # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd m1-s1-2025-project
```

2. Navigate to the React app directory:
```bash
cd react-app
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_URL=http://your-api-url.com
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🎨 Design Principles

- **Consistency**: Uniform spacing, typography, and component usage throughout
- **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation
- **Performance**: Optimized rendering with React hooks and memoization
- **User Experience**: Smooth animations, loading states, and clear feedback
- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes

## 🔧 API Integration

The application uses a custom `http.ts` wrapper for API calls. All API endpoints are configured via the `VITE_API_URL` environment variable.

### API Endpoints Structure

- `GET /books` - List all books
- `GET /books/:id` - Get book details
- `POST /books` - Create new book
- `PATCH /books/:id` - Update book
- `DELETE /books/:id` - Delete book

Similar patterns for `/authors`, `/clients`, and `/sales` endpoints.

## 👥 Development Team

- **Chiemerie Ekweanua** - Lead Developer
- **Borshon Alfred Gomes** - Developer
- **Delassie Efua Brempong** - Developer

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Ant Design](https://ant.design/) for beautiful UI components
- Powered by [TanStack Router](https://tanstack.com/router) for type-safe routing
- Images from [Pexels](https://www.pexels.com/) and [Unsplash](https://unsplash.com/)
