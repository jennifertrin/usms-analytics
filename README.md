# USMS Analytics - Monorepo

A comprehensive swimming performance analysis platform that scrapes USMS (United States Masters Swimming) results and provides detailed analytics and insights.

## 🏗️ Monorepo Structure

```
usms-analytics/
├── client/                 # React frontend application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── server/                # Python Flask backend
│   ├── app.py            # Flask application entry point
│   ├── routes/           # API route definitions
│   ├── requirements.txt  # Python dependencies
│   └── tests/           # Backend tests
├── api/                  # Vercel serverless functions
├── models/               # Shared data models
├── services/             # Business logic services
├── utils/                # Utility functions
├── data/                 # Data storage
└── package.json          # Root monorepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Python >= 3.8
- npm >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd usms-analytics
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up Python environment**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

### Development

**Start both frontend and backend in development mode:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Start only the frontend:**
```bash
npm run dev:client
```

**Start only the backend:**
```bash
npm run dev:server
```

### Building

**Build the frontend for production:**
```bash
npm run build
```

**Build only the frontend:**
```bash
npm run build:client
```

### Testing

**Run backend tests:**
```bash
npm run test
```

## 📁 Project Structure Details

### Client (Frontend)
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Plotly.js** for data visualization
- **Axios** for API communication

### Server (Backend)
- **Flask** web framework
- **Flask-CORS** for cross-origin requests
- **Flask-Session** for session management
- **BeautifulSoup4** for web scraping
- **Pandas** for data manipulation
- **NumPy** for numerical operations

### Shared Components
- **Models**: Data structures and type definitions
- **Services**: Business logic for scraping and analysis
- **Utils**: Helper functions for time and age calculations
- **API**: Vercel serverless functions for deployment

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-change-in-production
FLASK_DEBUG=True
HOST=0.0.0.0
PORT=5000

# Vercel Configuration (for deployment)
VERCEL=false
```

### API Configuration

The application supports both local Flask development and Vercel serverless deployment. The API endpoints are automatically configured based on the environment.

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel deployment with both frontend and serverless functions:

1. **Frontend**: Deployed as a static site
2. **API**: Deployed as serverless functions in the `/api` directory

### Local Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Backend Tests
```bash
cd server
python run_tests.py
```

### Frontend Tests
```bash
cd client
npm run test
```

## 📊 Features

- **USMS Results Scraping**: Automated scraping of swimming meet results
- **Performance Analysis**: Detailed analysis of swimming performance
- **Personal Bests Tracking**: Track and compare personal best times
- **Age Group Analysis**: Performance analysis by age groups
- **Meet Breakdown**: Detailed breakdown of individual meets
- **Trend Analysis**: Performance trends over time
- **Interactive Visualizations**: Charts and graphs for data visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository. 