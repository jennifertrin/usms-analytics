# USMS Analytics Platform

A comprehensive analytics platform for USMS (United States Masters Swimming) results analysis with advanced features for performance tracking, meet breakdowns, and club history.

## ✨ New Features

### 🏆 Meet Breakdown
- **Comprehensive Meet Analysis**: View detailed results with place and time improvements
- **Age Group Toggle**: Switch between all-time improvements and age group-specific improvements
- **Place Distribution**: Visual charts showing your placement distribution
- **Time Improvements**: Track performance improvements across different events

### ⭐ Personal Bests
- **All-Time Records**: View your complete personal best history
- **Age Group Breakdowns**: Filter personal bests by age groups (18-24, 25-29, 30-34, 35-39, 40-44, 45-49, 50-54, 55-59, 60-64, 65-69, 70-74, 75-79, 80+)
- **Time Progression**: Visual charts showing your best times across events
- **Recent Achievements**: Highlight your latest accomplishments

### 🎨 Enhanced UI/UX
- **Modern Design**: Beautiful gradient backgrounds and glass effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, smooth transitions, and engaging animations
- **Improved Navigation**: Icon-based tab navigation with better organization

## Features

- **Real-time Data Analysis**: Paste USMS results links and get instant analytics
- **Interactive Visualizations**: Beautiful charts and graphs using Plotly.js
- **Performance Tracking**: Monitor your progress over time with detailed metrics
- **Age Group Comparisons**: See how you stack up against your peers across all age groups
- **Personalized Insights**: Get recommendations for improvement
- **Modern UI**: Clean, responsive design with Tailwind CSS and advanced animations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Plotly.js** for interactive visualizations
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Flask** (Python) for the API server
- **Beautiful Soup** for web scraping
- **Pandas** for data analysis
- **Flask-CORS** for cross-origin requests

## Project Structure

```
usms-analytics/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.tsx
│   │   │   ├── HomePage.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Flask backend API
│   ├── app.py               # Main Flask application
│   └── requirements.txt     # Python dependencies
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```

The backend API will be available at `http://localhost:5000`

## Usage

1. **Homepage**: Land on the homepage and paste your USMS results link
2. **Analysis**: The app will scrape and analyze your data in real-time
3. **Dashboard**: View your personalized analytics dashboard with comprehensive tabs:

### Dashboard Tabs

1. **📊 Overview**: Quick stats and summary information
2. **📈 Performance**: Performance trends and analysis
3. **🏆 Meet Breakdown**: Detailed meet results with improvements and age group toggles
4. **⭐ Personal Bests**: All-time and age group personal records
5. **📉 Trends**: Age group comparison and trend analysis
7. **🎯 Comparisons**: Performance insights and recommendations

## API Endpoints

- `POST /api/analyze` - Analyze USMS results from a provided URL
- `GET /api/health` - Health check endpoint
- `GET /api/sample-data` - Get sample data for testing

## Development

### Frontend Development
- The app uses Vite for fast hot module replacement
- Tailwind CSS is configured with custom swimming-themed colors
- Components are built with TypeScript for type safety

### Backend Development
- Flask app with CORS enabled for frontend communication
- USMSAnalyzer class handles web scraping and data analysis
- Mock data is provided for development and testing

## Customization

### Adding New Visualizations
1. Create new Plotly charts in the Dashboard component
2. Add new tabs to the dashboard navigation
3. Update the data processing in the backend

### Styling
- Custom colors are defined in `tailwind.config.js`
- Component classes are in `src/index.css`
- Use the `swim-` color palette for swimming-themed styling

## Future Enhancements

- **User Accounts**: Save analysis history and preferences
- **Advanced Analytics**: Machine learning for performance predictions
- **Social Features**: Compare with friends and teammates
- **Mobile App**: Native mobile application
- **Export Features**: Download reports and data
- **Integration**: Connect with training apps and devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on the GitHub repository.

---

**Note**: This is a demonstration application. The USMS web scraping functionality uses mock data. In a production environment, you would need to implement proper web scraping for actual USMS results pages and ensure compliance with USMS terms of service. 