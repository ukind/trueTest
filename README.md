# MovieSeeker

A modern movie search application built with React, TypeScript, and Vite. MovieSeeker provides an intuitive interface for searching and discovering movies with real-time suggestions and a responsive gallery view.

## 🎬 Features

- **Realtime Suggestions**: Get search suggestions as you type
- **Gallery View**: Browse search results in a responsive grid layout
- **Modern UI**: Built with Material-UI for a clean, professional interface
- **Type-Safe**: Full TypeScript support for better developer experience
- **Modular Architecture**: Feature-based organization for maintainability

## 🛠️ Technology Stack

### Core Technologies

- **React 19.1.1** - UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript superset
- **Vite 7.1.0** - Next-generation frontend build tool

### UI & Styling

- **Material-UI 7.3.1** - React component library for faster web development
- **Emotion 11.14.x** - CSS-in-JS library for styling

### State Management & Data Fetching

- **TanStack React Query 5.84.1** - Server state management for React
- **Axios 1.11.0** - Promise-based HTTP client

### Forms & Validation

- **React Hook Form 7.62.0** - Performant, flexible forms with easy integration
- **Zod 4.0.15** - TypeScript-first schema validation
- **@hookform/resolvers 5.2.1** - Integration between React Hook Form and Zod

### Routing

- **React Router DOM 7.8.0** - Declarative routing for React applications

### Development & Testing

- **ESLint** - JavaScript/TypeScript linting utility
- **Prettier** - Code formatter
- **Vitest 3.2.4** - Unit testing framework
- **Testing Library** - Testing utilities for React components

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ukind/trueTest
   cd truetest
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 🚀 Development Workflow

### Available Scripts

```json
{
  "dev": "Start development server with hot reload",
  "build": "Build the application for production",
  "preview": "Preview production build locally",
  "lint": "Run ESLint to check for code issues",
  "test": "Run test suite with Vitest"
}
```

### Common Development Tasks

#### Starting Development

```bash
npm run dev
```

The development server will start on `http://localhost:3000` with hot module replacement enabled.

#### Building for Production

```bash
npm run build
```

This command will:

- Compile TypeScript to JavaScript
- Bundle and optimize the application
- Generate output in the `dist` directory

#### Previewing Production Build

```bash
npm run preview
```

Preview the production build locally before deployment.

#### Code Quality

```bash
# Lint the codebase
npm run lint

# Run tests
npm test
```

## 📁 Project Structure

```
truetest/
├── public/                 # Static assets
│   ├── vite.svg
│   └── images/
├── src/
│   ├── api/               # API configuration and endpoints
│   │   ├── axiosClient.ts
│   │   ├── endpoints.ts
│   │   └── queryClient.ts
│   ├── assets/            # Images and static assets
│   ├── components/        # Reusable UI components
│   │   └── MovieLoader/
│   ├── features/          # Feature-based modules
│   │   └── MovieSeeker/   # Main application feature
│   │       ├── Gallery/   # Movie gallery component
│   │       ├── SearchBar/ # Search functionality
│   │       └── Pane/      # Main application pane
│   ├── queries/           # React Query hooks
│   ├── routes/            # Route definitions
│   ├── services/          # Business logic and API services
│   │   └── Search/
│   ├── utils/             # Utility functions
│   │   ├── debounce.ts
│   │   └── sleep.ts
│   ├── App.tsx           # Main application component
│   ├── App.css           # Global styles
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── package.json          # Project dependencies and scripts
├── prettierrc            # Prettier configuration
├── tsconfig.app.json     # TypeScript configuration for app
├── tsconfig.json         # Root TypeScript configuration
├── tsconfig.node.json    # TypeScript configuration for Node.js
└── vite.config.ts        # Vite configuration
```

### Architecture Overview

The project follows a **feature-based modular architecture**:

#### Feature Organization

- **`src/features/`** - Contains feature modules, each with their own components, hooks, and styles
- **`src/components/`** - Reusable UI components used across features
- **`src/services/`** - Business logic and API service classes
- **`src/queries/`** - React Query hooks for data fetching

#### Key Features

- **MovieSeeker**: Main application feature containing:
  - **SearchBar**: Handles user input with debouncing and suggestions
  - **Gallery**: Displays search results in a responsive grid
  - **Pane**: Main container component

#### Data Flow

1. User interacts with **SearchBar** component
2. Input is debounced and triggers API calls via **SearchService**
3. **React Query** manages loading states and caching
4. Results are displayed in the **Gallery** component
5. **Material-UI** components provide consistent styling

## 🔌 API Integration

The application uses a service-based architecture for API communication:

### Service Layer

- **`SearchService`** - Handles all movie-related API calls
- **`axiosClient`** - Configured HTTP client with interceptors
- **`CatalogueEndpoint`** - API endpoint definitions

### Query Hooks

- **`useFindSuggestion`** - Search suggestions with debouncing
- **`useGetMovieList`** - Movie search results
- **`useGetMovieDetail`** - Individual movie details

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Structure

- **Component Tests**: Located in `__tests__` folders within feature directories
- **Hook Tests**: Testing custom React hooks for data fetching
- **Service Tests**: API service layer testing

### Testing Tools

- **Vitest** - Fast unit testing framework
- **Testing Library** - User-centric testing utilities
- **jsdom** - DOM environment for testing

### Development Guidelines

- Follow TypeScript best practices
- Use Material-UI components for consistency
- Implement proper error handling
- Write tests for new features
- Keep components modular and reusable
