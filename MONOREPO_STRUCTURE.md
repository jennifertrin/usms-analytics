# Monorepo Structure Guide

## Overview

This document explains the new monorepo structure for the USMS Analytics platform, which consolidates the frontend and backend into a single repository with clear separation of concerns.

## Migration Summary

### What Changed

1. **Removed `backend/` folder**: All backend files were moved to appropriate locations
2. **Created `client/` folder**: Frontend files are now organized in a dedicated client directory
3. **Created `server/` folder**: Backend files are now organized in a dedicated server directory
4. **Updated import paths**: All Python imports have been updated to work with the new structure
5. **Consolidated configuration**: Root-level configuration files manage the entire monorepo

### File Movements

#### Backend → Server
- `backend/app.py` → `server/app.py`
- `backend/config.py` → `config.py` (kept at root for shared access)
- `backend/requirements.txt` → `server/requirements.txt`
- `backend/requirements-vercel.txt` → `server/requirements-vercel.txt`
- `backend/vercel.json` → `server/vercel.json`
- `backend/routes/` → `server/routes/`
- `backend/tests/` → `server/tests/`
- `backend/flask_session/` → `server/flask_session/`
- `backend/run_tests.py` → `server/run_tests.py`
- `backend/migrate_to_refactored.py` → `server/migrate_to_refactored.py`
- `backend/README_REFACTORED.md` → `server/README_REFACTORED.md`

#### Frontend → Client
- `src/` → `client/src/`
- `public/` → `client/public/`
- `package.json` → `client/package.json`
- `package-lock.json` → `client/package-lock.json`
- `node_modules/` → `client/node_modules/`
- `vite.config.ts` → `client/vite.config.ts`
- `tsconfig.json` → `client/tsconfig.json`
- `tsconfig.app.json` → `client/tsconfig.app.json`
- `tsconfig.node.json` → `client/tsconfig.node.json`
- `tailwind.config.js` → `client/tailwind.config.js`
- `postcss.config.js` → `client/postcss.config.js`
- `eslint.config.js` → `client/eslint.config.js`
- `index.html` → `client/index.html`
- `.viterc` → `client/.viterc`

#### Shared Components (Kept at Root)
- `models/` - Data models used by both frontend and backend
- `services/` - Business logic services
- `utils/` - Utility functions
- `api/` - Vercel serverless functions
- `config.py` - Shared configuration
- `data/` - Data storage

## New Directory Structure

```
usms-analytics/
├── client/                    # React frontend application
│   ├── src/                  # React source code
│   │   ├── components/       # React components
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── node_modules/        # Frontend dependencies
├── server/                   # Python Flask backend
│   ├── app.py              # Flask application entry point
│   ├── routes/             # API route definitions
│   │   └── api_routes.py   # Main API routes
│   ├── tests/              # Backend tests
│   ├── flask_session/      # Session storage
│   ├── requirements.txt    # Python dependencies
│   ├── requirements-vercel.txt # Vercel Python dependencies
│   ├── vercel.json         # Vercel configuration
│   └── run_tests.py        # Test runner
├── api/                     # Vercel serverless functions
│   ├── analyze.py          # Analysis endpoint
│   ├── data.py             # Data endpoint
│   ├── health.py           # Health check
│   └── session.py          # Session management
├── models/                  # Shared data models
│   ├── __init__.py
│   └── data_models.py      # Data structures
├── services/                # Business logic services
│   ├── __init__.py
│   ├── performance_analyzer.py
│   ├── user_service.py
│   └── usms_scraper.py
├── utils/                   # Utility functions
│   ├── __init__.py
│   ├── age_utils.py
│   └── time_utils.py
├── data/                    # Data storage
├── config.py               # Shared configuration
├── package.json            # Root monorepo configuration
├── vercel.json             # Root Vercel configuration
├── requirements-vercel.txt  # Root Python dependencies
├── README.md               # Main documentation
└── scripts/                # Deployment and utility scripts
    ├── deploy.sh
    ├── deploy-vercel.sh
    └── start.sh
```

## Import Path Updates

### Server-side Imports

#### Before (backend/app.py)
```python
from config import Config
from routes.api_routes import api_bp
```

#### After (server/app.py)
```python
import sys
import os
from flask import Flask
from flask_cors import CORS
from flask_session import Session

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from server.routes.api_routes import api_bp
```

#### Before (backend/routes/api_routes.py)
```python
from services.usms_scraper import USMSScraper
from services.performance_analyzer import PerformanceAnalyzer
from services.user_service import UserService
from models.data_models import AnalysisResult
```

#### After (server/routes/api_routes.py)
```python
import sys
import os
from flask import Blueprint, request, jsonify, session
from datetime import datetime
from typing import Dict, Any

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from services.usms_scraper import USMSScraper
from services.performance_analyzer import PerformanceAnalyzer
from services.user_service import UserService
from models.data_models import AnalysisResult
```

## Development Workflow

### Starting Development

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

### Building

```bash
# Build frontend for production
npm run build

# Build frontend only
npm run build:client
```

### Testing

```bash
# Run backend tests
npm run test

# Run frontend tests
cd client && npm run test
```

## Deployment

### Vercel Deployment

The monorepo is configured for Vercel deployment with:

1. **Frontend**: Deployed from the `client/` directory
2. **API**: Deployed from the `api/` directory (serverless functions)
3. **Root Configuration**: `vercel.json` handles routing

### Local Production

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Benefits of Monorepo Structure

1. **Unified Development**: Single repository for frontend and backend
2. **Shared Code**: Common models, services, and utilities
3. **Simplified Deployment**: Single deployment pipeline
4. **Better Organization**: Clear separation between client and server
5. **Easier Testing**: Coordinated testing across the entire application
6. **Version Control**: Atomic commits across frontend and backend changes

## Migration Notes

- All existing functionality has been preserved
- Import paths have been updated to work with the new structure
- Configuration files have been consolidated
- Deployment scripts have been updated
- Documentation has been updated to reflect the new structure

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure you're running from the correct directory
2. **Path Issues**: Check that import paths are correctly updated
3. **Dependencies**: Run `npm run install:all` to install all dependencies
4. **Environment**: Ensure Python virtual environment is activated for server development

### Getting Help

If you encounter issues with the new structure:

1. Check the updated README.md for setup instructions
2. Verify all import paths are correct
3. Ensure all dependencies are installed
4. Check the deployment scripts for your specific use case 