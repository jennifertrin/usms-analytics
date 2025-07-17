# USMS Analytics - Vercel Deployment

This is the Vercel-compatible version of the USMS Analytics application. The application has been restructured to work with Vercel's serverless architecture.

## 🚀 Quick Deploy

### Option 1: Automated Deployment
```bash
./deploy-vercel.sh
```

### Option 2: Manual Deployment

#### Deploy Backend
```bash
cd backend
vercel --prod
```

#### Deploy Frontend
```bash
cd frontend
# Create .env file with your backend URL
echo "VITE_API_BASE_URL=https://your-backend-url.vercel.app" > .env
vercel --prod
```

## 📁 Project Structure

```
usms-analytics/
├── frontend/                 # React + Vite frontend
│   ├── src/                 # React components
│   ├── vercel.json          # Vercel configuration
│   └── package.json         # Frontend dependencies
├── backend/                 # Python serverless functions
│   ├── api/                 # Serverless function endpoints
│   │   ├── analyze.py       # POST /api/analyze
│   │   ├── session.py       # GET/DELETE /api/session
│   │   ├── data.py          # GET /api/data
│   │   └── health.py        # GET /api/health
│   ├── services/            # Business logic
│   ├── models/              # Data models
│   ├── utils/               # Utility functions
│   ├── vercel.json          # Vercel configuration
│   └── requirements-vercel.txt # Python dependencies
└── VERCEL_DEPLOYMENT.md     # Detailed deployment guide
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

#### Backend (Vercel Dashboard)
- `SECRET_KEY`: Secure random string for session management
- `VERCEL`: Set to `true`

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze USMS results |
| GET | `/api/session` | Get session information |
| DELETE | `/api/session` | Clear session |
| GET | `/api/data` | Get user data |
| GET | `/api/health` | Health check |

## 🔄 Session Management

Due to Vercel's serverless architecture:
- Each request creates a new user session
- Data is stored temporarily for the request duration
- No persistent sessions between requests
- For production, consider implementing a database

## 🛠️ Local Development

### Backend (Flask)
```bash
cd backend
python app.py
```

### Frontend (Vite)
```bash
cd frontend
npm run dev
```

## 📦 Dependencies

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- Plotly.js for charts
- Axios for API calls

### Backend
- Python 3.9+
- requests
- beautifulsoup4
- pandas
- numpy

## 🚨 Important Notes

1. **Stateless Architecture**: The serverless functions don't maintain state between requests
2. **CORS**: Configured to allow cross-origin requests from the frontend
3. **Environment Variables**: Must be set in Vercel dashboard for backend
4. **Dependencies**: All Python dependencies must be in `requirements-vercel.txt`

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `VITE_API_BASE_URL` environment variable
   - Verify backend URL is correct

2. **Import Errors**
   - Ensure all Python modules are in the backend directory
   - Check `requirements-vercel.txt` includes all dependencies

3. **Session Issues**
   - Serverless functions are stateless
   - Each request is independent

### Debugging

- Check Vercel function logs in dashboard
- Use `/api/health` endpoint to verify backend
- Test endpoints with Postman or curl

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Detailed Deployment Guide](./VERCEL_DEPLOYMENT.md) 