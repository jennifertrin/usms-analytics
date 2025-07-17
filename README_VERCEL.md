# USMS Analytics - Vercel Deployment (Restructured)

This is the restructured Vercel-compatible version of the USMS Analytics application. The application has been reorganized for simplified deployment with both frontend and backend in a single repository.

## 🚀 Quick Deploy

### Option 1: Automated Deployment
```bash
./deploy.sh
```

### Option 2: Manual Deployment
```bash
npm install
vercel --prod
```

## 📁 Project Structure

```
usms-analytics/
├── src/                 # React frontend source code
├── public/              # Static assets
├── api/                 # Python serverless functions
│   ├── analyze.py       # POST /api/analyze
│   ├── session.py       # GET/DELETE /api/session
│   ├── data.py          # GET /api/data
│   └── health.py        # GET /api/health
├── services/            # Backend business logic
├── models/              # Data models
├── utils/               # Utility functions
├── package.json         # Frontend dependencies and scripts
├── vite.config.ts       # Vite configuration
├── vercel.json          # Vercel configuration (handles both frontend and API)
└── requirements-vercel.txt # Python dependencies
```

## 🔧 Configuration

### Environment Variables

Set these in your Vercel project dashboard:

- `SECRET_KEY`: Secure random string for session management
- `VERCEL`: Set to `true`

### Vercel Configuration

The `vercel.json` file handles both frontend and backend deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "outputDirectory": "dist"
}
```

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

1. **Single Repository**: Both frontend and backend are now in one repository
2. **Unified Deployment**: One `vercel.json` handles both frontend and API
3. **Stateless Architecture**: The serverless functions don't maintain state between requests
4. **CORS**: Configured to allow cross-origin requests from the frontend
5. **Environment Variables**: Must be set in Vercel dashboard
6. **Dependencies**: All Python dependencies must be in `requirements-vercel.txt`

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**
   - Run `npm install` to install dependencies
   - Check that all files are in the correct locations

2. **Import Errors**
   - Ensure all Python modules are in the correct directories
   - Check `requirements-vercel.txt` includes all dependencies

3. **CORS Errors**
   - CORS is configured in each serverless function
   - No additional configuration needed

4. **Session Issues**
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

## 🔄 Migration from Previous Structure

If you're migrating from the previous frontend/backend structure:

1. **Backup your data** if needed
2. **Update any custom configurations** to work with the new structure
3. **Test the deployment** with the new structure
4. **Update any CI/CD pipelines** to work with the new structure

## ✨ Benefits of New Structure

1. **Simplified Deployment**: One command deploys everything
2. **Better Organization**: Clear separation of concerns
3. **Easier Maintenance**: Single repository to manage
4. **Reduced Complexity**: No need to manage multiple deployments
5. **Faster Development**: Everything in one place 