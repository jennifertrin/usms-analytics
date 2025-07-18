# USMS Analytics - Next.js Version

This is the Next.js version of the USMS Analytics application, converted from the original Vite + React Router setup.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Plotly.js** for data visualization
- **Axios** for API communication
- **Session Management** with backend integration

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home page
│   └── dashboard/
│       └── page.tsx         # Dashboard page
├── components/
│   ├── HomePage.tsx         # Main home page component
│   ├── Dashboard.tsx        # Dashboard component
│   ├── PersonalBests.tsx    # Personal bests component
│   ├── MeetBreakdown.tsx    # Meet breakdown component
│   └── EventProgressionModal.tsx # Event progression modal
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 22)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

Make sure your Python backend is running on `http://localhost:5000` (or update the environment variable accordingly).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Changes from Vite Version

1. **Routing**: Replaced React Router with Next.js App Router
2. **File Structure**: Moved to Next.js app directory structure
3. **Environment Variables**: Changed from `VITE_` to `NEXT_PUBLIC_` prefix
4. **Client Components**: Added `'use client'` directive to interactive components
5. **API Proxy**: Configured Next.js rewrites for API calls

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (default: http://localhost:5000)

## API Integration

The app communicates with the Python backend through the following endpoints:
- `POST /api/analyze` - Analyze USMS results
- `GET /api/session` - Get current session
- `DELETE /api/session` - Clear session
- `GET /api/data` - Get analysis data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 