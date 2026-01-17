# Economic Well-Being Index

A dynamic, interactive dashboard for visualizing economic indicators using data from the Federal Reserve Economic Data (FRED) API.

## 🚀 Quick Start

### Option 1: Local Development
1. Extract the zip file
2. Open a terminal in the project directory
3. Run a local server:
   ```bash
   python -m http.server 8000
   ```
4. Open `http://localhost:8000` in your browser

### Option 2: GitHub Pages Deployment
1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select "main" branch as source
4. Your site will be live at `https://yourusername.github.io/Well-Being-Index/`

## 📊 Features

- **Interactive Visualization**: Click subcategories to add economic indicators
- **Multi-Selection**: Select multiple indicators across different categories
- **Color-Coded Performance**: Gradient from light blue (poor) to dark blue (excellent)
- **Dynamic Status Word**: Real-time economic sentiment based on selected indicators
- **FRED Integration Ready**: Configured to pull live data from Federal Reserve

## 🔑 FRED API Setup

Your API Key: `6352ad3b393d3ab83709630e61d2b14e`

### Current Status
- Currently using sample data for demonstration
- FRED Series IDs are mapped and documented in the code
- Ready for live API integration

### To Enable Live Data
1. Open `js/app.js` (or the script section in `index.html`)
2. Uncomment the FRED API call code in `fetchFREDData()` function
3. The system will automatically fetch latest data from FRED

### Example FRED Series IDs Used
- `UNRATE` - Unemployment Rate
- `CPIAUCSL` - Consumer Price Index
- `MORTGAGE30US` - 30-Year Mortgage Rate
- `GDP` - Gross Domestic Product
- `SP500` - S&P 500 Index
- `BOPGSTB` - Trade Balance
- `EMRATIO` - Employment-Population Ratio

## 🎨 Customization

### Colors
The color gradient uses three key points:
- Light (0.0): `#dff4ff` - Worst performance
- Mid (0.5): `#1889d7` - Average performance  
- Dark (1.0): `#0a4b78` - Best performance

Edit these in the `colorStops` array in the JavaScript.

### Status Words
Modify the `statusWords` array to change the economic sentiment labels:
- Critical, Poor, Weak, Fair, Good, Strong, Excellent

### Categories
Add or modify categories in the `data` object structure.

## 📁 File Structure

```
Well-Being-Index/
├── index.html          # Main application file
├── css/
│   └── styles.css      # Stylesheet (legacy, styles embedded in index.html)
├── js/
│   └── app.js          # JavaScript logic (legacy, embedded in index.html)
├── data/
│   └── economic-data.json  # Sample data structure
└── README.md           # This file
```

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 Data Structure

Each indicator follows this structure:

```json
{
  "id": "unemployment",
  "name": "Unemployment",
  "fredSeriesId": "UNRATE",
  "indicator": {
    "name": "U-3 Unemployment Rate",
    "value": 4.6,
    "format": "decimal",
    "description": "in Percent, United States",
    "normalizedValue": 0.95,
    "source": "FRED"
  }
}
```

## 🔧 Technical Details

- **No build process required** - Works directly in browsers
- **No dependencies** - Pure JavaScript with modern browser APIs
- **Responsive design** - 4 columns on desktop, adapts to mobile
- **Real-time calculations** - Status word updates as you select indicators

## 📈 Future Enhancements

- [ ] Automatic FRED data refresh
- [ ] Historical trend charts
- [ ] Export functionality
- [ ] User preferences/saved views
- [ ] API for programmatic access
- [ ] GPT integration for dynamic status descriptions

## 📄 License

MIT License - Feel free to use and modify.

## 🤝 Contributing

This is a demonstration project. For production use:
1. Implement proper FRED API error handling
2. Add data caching
3. Implement rate limiting
4. Add comprehensive testing
5. Set up CI/CD pipeline

## 📞 Support

For issues or questions about FRED API:
- FRED Documentation: https://fred.stlouisfed.org/docs/api/
- API Key Management: https://fred.stlouisfed.org/docs/api/api_key.html

---

**Built with data from the Federal Reserve Bank of St. Louis**
