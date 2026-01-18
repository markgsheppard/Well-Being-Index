/*
        ============================================
        FRED API INTEGRATION
        ============================================
        API Key: 6352ad3b393d3ab83709630e61d2b14e
        Base URL: https://api.stlouisfed.org/fred/
        
        Example FRED Series IDs for Economic Indicators:
        - UNRATE: Unemployment Rate
        - CPIAUCSL: Consumer Price Index (CPI-U)
        - GDP: Gross Domestic Product
        - MORTGAGE30US: 30-Year Fixed Rate Mortgage Average
        - DEXUSEU: Euro to US Dollar Exchange Rate
        - SP500: S&P 500 Stock Price Index
        - DGS10: 10-Year Treasury Constant Maturity Rate
        - MEHOINUSA672N: Real Median Household Income
        - GINI: Gini Index of Income Inequality
        
        To integrate live FRED data:
        1. Replace fetchFREDData() placeholder with actual API calls
        2. Map FRED series IDs to your indicators
        3. Calculate normalized values based on historical ranges
        4. Update indicators in real-time or on page load
        
        Example API Call:
        https://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&api_key=6352ad3b393d3ab83709630e61d2b14e&file_type=json&limit=1&sort_order=desc
        */

        // Color gradient configuration
        const colorStops = [
            { value: 0.0, color: { r: 223, g: 244, b: 255 } },  // #dff4ff (light)
            { value: 0.5, color: { r: 24, g: 137, b: 215 } },    // #1889d7 (true blue)
            { value: 1.0, color: { r: 10, g: 75, b: 120 } }      // #0a4b78 (dark)
        ];

        // FRED Series ID mapping (to be used with real API)
        const fredSeriesMapping = {
            'cpi-u': 'CPIAUCSL',
            'unemployment': 'UNRATE',
            'mortgage': 'MORTGAGE30US',
            'gdp': 'GDP',
            'stock-market': 'SP500',
            'trade-balance': 'BOPGSTB',
            'employment': 'EMRATIO',
            'poverty-rate': 'SIPOVGINIUSA'
        };

        // Placeholder function for FRED API integration
        async function fetchFREDData(seriesId) {
            /*
            const apiKey = '6352ad3b393d3ab83709630e61d2b14e';
            const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=1&sort_order=desc`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                return parseFloat(data.observations[0].value);
            } catch (error) {
                console.error('Error fetching FRED data:', error);
                return null;
            }
            */
            
            // For now, return sample data
            // Replace this with actual API call above
            return null;
        }

        // Sample data (in production, this should come from FRED API)
        // NOTE: These are SAMPLE values for demonstration only
        // Real implementation should fetch from FRED using the API key above
        const data = {
            categories: [
                {
                    id: 'aggregates',
                    name: 'Aggregates',
                    subcategories: [
                        { 
                            id: 'cpi-u', 
                            name: 'CPI-U', 
                            highlighted: false, 
                            fredSeriesId: 'CPIAUCSL',
                            indicator: { 
                                name: 'CPI-U, Inflation', 
                                value: 2.7, 
                                format: 'decimal', 
                                description: 'Monthly Data, United States', 
                                normalizedValue: 0.73,
                                source: 'FRED'
                            }
                        },
                        { 
                            id: 'unemployment', 
                            name: 'Unemployment', 
                            highlighted: false, 
                            fredSeriesId: 'UNRATE',
                            indicator: { 
                                name: 'U-3 Unemployment Rate', 
                                value: 4.6, 
                                format: 'decimal', 
                                description: 'in Percent, United States', 
                                normalizedValue: 0.95,
                                source: 'FRED'
                            }
                        },
                        { 
                            id: 'mortgage', 
                            name: 'Gross Domestic Product', 
                            highlighted: false,
                            fredSeriesId: 'MORTGAGE30US',
                            indicator: { 
                                name: 'Mortgage Rate', 
                                value: 6.2, 
                                format: 'decimal', 
                                description: '30-Year Fixed', 
                                normalizedValue: 0.50,
                                source: 'FRED'
                            }
                        },
                        { 
                            id: 'rent', 
                            name: 'GDP Growth Rate', 
                            highlighted: false,
                            fredSeriesId: 'GDP',
                            indicator: { 
                                name: 'Current Rent Amount', 
                                value: 1.9, 
                                format: 'decimal', 
                                description: 'in Thousands', 
                                change: 30, 
                                normalizedValue: 0.30,
                                source: 'FRED'
                            }
                        },
                        { 
                            id: 'debt', 
                            name: 'Inflation Rate', 
                            highlighted: false,
                            indicator: { 
                                name: 'Household Debt Service Ratio', 
                                value: 11.3, 
                                format: 'decimal', 
                                description: 'in Percent of Disposable Income', 
                                normalizedValue: 0.68,
                                source: 'FRED'
                            }
                        },
                        { 
                            id: 'deliquency', 
                            name: 'Consumer Price Index', 
                            highlighted: false,
                            indicator: { 
                                name: 'Debt Deliquency', 
                                value: 9.4, 
                                format: 'decimal', 
                                description: 'Student Debt 90+ Days Delinquent, in Percent', 
                                normalizedValue: 0.42,
                                source: 'FRED'
                            }
                        },
                        { 
                            id: 'wealth-top', 
                            name: 'Producer Prices', 
                            highlighted: false,
                            indicator: { 
                                name: 'National Wealth Share', 
                                value: 31, 
                                format: 'integer', 
                                description: 'of Top 1% in the United States', 
                                normalizedValue: 0.18,
                                source: 'FRED'
                            }
                        },
                        { 
                            id: 'wealth-bottom', 
                            name: 'Personal Consumption', 
                            highlighted: false,
                            indicator: { 
                                name: 'National Wealth Share', 
                                value: 2.5, 
                                format: 'decimal', 
                                description: 'of Bottom 50% in the United States', 
                                normalizedValue: 0.08,
                                source: 'FRED'
                            }
                        }
                    ]
                },
                {
                    id: 'mobility',
                    name: 'Mobility',
                    subcategories: [
                        { 
                            id: 'income-mobility', 
                            name: 'Income Mobility', 
                            highlighted: false,
                            indicator: { 
                                name: 'Income Mobility Index', 
                                value: 45.3, 
                                format: 'decimal', 
                                description: 'Intergenerational Mobility', 
                                change: -2.1, 
                                normalizedValue: 0.60,
                                source: 'FRED'
                            }
                        }
                    ]
                },
                {
                    id: 'poverty',
                    name: 'Poverty',
                    subcategories: [
                        { 
                            id: 'poverty-rate', 
                            name: 'Poverty Rate', 
                            highlighted: false,
                            fredSeriesId: 'SIPOVGINIUSA',
                            indicator: { 
                                name: 'Poverty Rate', 
                                value: 12.4, 
                                format: 'decimal', 
                                description: 'Percent Below Poverty Line', 
                                change: 1.2, 
                                normalizedValue: 0.22,
                                source: 'FRED'
                            }
                        }
                    ]
                },
                {
                    id: 'labor',
                    name: 'Labor',
                    subcategories: [
                        { 
                            id: 'employment', 
                            name: 'Employment Rate', 
                            highlighted: false,
                            fredSeriesId: 'EMRATIO',
                            indicator: { 
                                name: 'Employment Rate', 
                                value: 60.1, 
                                format: 'decimal', 
                                description: 'Employment-Population Ratio', 
                                change: 0.3, 
                                normalizedValue: 0.78,
                                source: 'FRED'
                            }
                        }
                    ]
                },
                {
                    id: 'trade',
                    name: 'Trade',
                    subcategories: [
                        { 
                            id: 'trade-balance', 
                            name: 'Trade Balance', 
                            highlighted: false,
                            fredSeriesId: 'BOPGSTB',
                            indicator: { 
                                name: 'Trade Balance', 
                                value: -68.9, 
                                format: 'decimal', 
                                description: 'Billions USD', 
                                change: -5.2, 
                                normalizedValue: 0.12,
                                source: 'FRED'
                            }
                        }
                    ]
                },
                {
                    id: 'finance',
                    name: 'Finance',
                    subcategories: [
                        { 
                            id: 'stock-market', 
                            name: 'Stock Market', 
                            highlighted: false,
                            fredSeriesId: 'SP500',
                            indicator: { 
                                name: 'S&P 500 Index', 
                                value: 4783, 
                                format: 'integer', 
                                description: 'Stock Market Index', 
                                change: 12.5, 
                                normalizedValue: 0.92,
                                source: 'FRED'
                            }
                        }
                    ]
                }
            ]
        };

        let currentCategory = null;
        let selectedIndicators = [];

        const statusWords = [
            { min: 0.00, max: 0.20, word: 'Critical' },
            { min: 0.20, max: 0.35, word: 'Poor' },
            { min: 0.35, max: 0.50, word: 'Weak' },
            { min: 0.50, max: 0.65, word: 'Fair' },
            { min: 0.65, max: 0.75, word: 'Good' },
            { min: 0.75, max: 0.85, word: 'Strong' },
            { min: 0.85, max: 1.00, word: 'Excellent' }
        ];

        function interpolateColor(value) {
            value = Math.max(0, Math.min(1, value));
            
            let lower = colorStops[0];
            let upper = colorStops[colorStops.length - 1];
            
            for (let i = 0; i < colorStops.length - 1; i++) {
                if (value >= colorStops[i].value && value <= colorStops[i + 1].value) {
                    lower = colorStops[i];
                    upper = colorStops[i + 1];
                    break;
                }
            }
            
            const range = upper.value - lower.value;
            const relativeValue = range === 0 ? 0 : (value - lower.value) / range;
            
            const r = Math.round(lower.color.r + (upper.color.r - lower.color.r) * relativeValue);
            const g = Math.round(lower.color.g + (upper.color.g - lower.color.g) * relativeValue);
            const b = Math.round(lower.color.b + (upper.color.b - lower.color.b) * relativeValue);
            
            return `rgb(${r}, ${g}, ${b})`;
        }


        function updateFormulaDisplay() {
            const formulaSection = document.getElementById('formula-section');
            const formulaDisplay = document.getElementById('formula-display');
            const formulaExplanation = document.getElementById('formula-explanation');
            
            if (selectedIndicators.length === 0) {
                formulaSection.style.display = 'none';
                return;
            }
            
            formulaSection.style.display = 'block';
            
            const n = selectedIndicators.length;
            const weight = (1 / n).toFixed(3);
            const sum = selectedIndicators.reduce((acc, item) => acc + item.indicator.normalizedValue, 0);
            const average = sum / n;
            const scoreColor = interpolateColor(average);
            
            // Format score: one decimal unless needs more precision
            let scoreDisplay;
            const oneDecimal = average.toFixed(1);
            const threeDecimal = average.toFixed(3);
            if (Math.abs(parseFloat(oneDecimal) - average) > 0.01) {
                scoreDisplay = threeDecimal;
            } else {
                scoreDisplay = oneDecimal;
            }
            
            // Build formula as HTML
            let formulaHTML = '<span class="index-score-label" style="color: ' + scoreColor + ';">' + scoreDisplay + '</span> = ';
            
            selectedIndicators.forEach((item, index) => {
                let name = item.indicator.name.split(',')[0].trim().replace(/\([^)]*\)/g, '').trim();
                if (index > 0) formulaHTML += ' + ';
                formulaHTML += weight + ' · ' + name;
            });
            
            formulaDisplay.innerHTML = formulaHTML;
            
            // Build explanation
            const indicatorNames = selectedIndicators.map((item) => {
                return item.indicator.name.split(',')[0].trim().replace(/\([^)]*\)/g, '').trim();
            });
            
            let indicatorText;
            if (indicatorNames.length === 1) {
                indicatorText = indicatorNames[0];
            } else if (indicatorNames.length === 2) {
                indicatorText = indicatorNames.join(' and ');
            } else {
                const lastIndicator = indicatorNames.pop();
                indicatorText = indicatorNames.join(', ') + ', and ' + lastIndicator;
            }
            
            formulaExplanation.innerHTML = `
                <p>The Index Score is calculated by taking an equal-weighted average of the selected economic indicators. In this case, you've chosen ${indicatorText}, each receiving a weight of ${weight}. Each indicator's normalized value (ranging from zero to one) represents its relative performance compared to historical data, where higher values indicate stronger economic conditions. The weighted sum of these normalized values produces the overall index score of ${average.toFixed(3)}, which determines the economic status displayed above.</p>
            `;
        }

        function init() {
            setupEventListeners();
            updateUI();
        }

        function setupEventListeners() {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    selectCategory(e.target.dataset.category);
                });
            });
        }

        function selectCategory(category) {
            currentCategory = category;
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active-category');
                if (btn.dataset.category === category) {
                    btn.classList.add('active-category');
                }
            });
            
            updateUI();
        }

        function toggleSubcategory(categoryId, subcategoryId) {
            const key = `${categoryId}:${subcategoryId}`;
            const index = selectedIndicators.findIndex(item => item.key === key);
            
            if (index > -1) {
                selectedIndicators.splice(index, 1);
            } else {
                const categoryData = data.categories.find(c => c.id === categoryId);
                const sub = categoryData.subcategories.find(s => s.id === subcategoryId);
                if (sub && sub.indicator) {
                    selectedIndicators.push({
                        key: key,
                        categoryId: categoryId,
                        subcategoryId: subcategoryId,
                        indicator: sub.indicator
                    });
                }
            }
            
            updateDataGrid();
            updateEconomyStatus();
            updateFormulaDisplay();
        }

        function updateEconomyStatus() {
            const statusElement = document.getElementById('economy-status');
            
            if (selectedIndicators.length === 0) {
                statusElement.textContent = '_____';
                statusElement.classList.remove('has-value');
                return;
            }

            const sum = selectedIndicators.reduce((acc, item) => acc + item.indicator.normalizedValue, 0);
            const average = sum / selectedIndicators.length;

            const status = statusWords.find(s => average >= s.min && average <= s.max);
            
            if (status) {
                statusElement.textContent = status.word;
                statusElement.style.color = interpolateColor(average);
                statusElement.classList.add('has-value');
            }
        }

        function updateUI() {
            updateSubcategories();
            updateDataGrid();
            updateFormulaDisplay();
        }

        function updateSubcategories() {
            const container = document.getElementById('subcategories-container');
            container.innerHTML = '';
            
            // Don't show subcategories if no category is selected
            if (!currentCategory) return;
            
            const categoryData = data.categories.find(c => c.id === currentCategory);
            if (!categoryData) return;
            
            categoryData.subcategories.forEach(sub => {
                const btn = document.createElement('button');
                btn.className = 'subcategory-btn';
                btn.textContent = sub.name;
                btn.dataset.subcategory = sub.id;
                
                if (sub.highlighted) {
                    btn.classList.add('highlighted');
                }
                
                const key = `${currentCategory}:${sub.id}`;
                if (selectedIndicators.some(item => item.key === key)) {
                    btn.classList.add('active');
                }
                
                btn.addEventListener('click', () => {
                    toggleSubcategory(currentCategory, sub.id);
                    
                    const key = `${currentCategory}:${sub.id}`;
                    if (selectedIndicators.some(item => item.key === key)) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                
                container.appendChild(btn);
            });
        }

        function updateDataGrid() {
            const grid = document.getElementById('data-grid');
            
            if (selectedIndicators.length === 0) {
                grid.innerHTML = '';
                return;
            }
            
            grid.innerHTML = '';
            
            selectedIndicators.forEach((item, index) => {
                const card = createDataCard(item.indicator, index);
                grid.appendChild(card);
            });
        }

        function createDataCard(indicator, index) {
            const card = document.createElement('div');
            card.className = 'data-card';
            
            const bgColor = interpolateColor(indicator.normalizedValue);
            card.style.backgroundColor = bgColor;
            
            let formattedValue = indicator.value;
            if (indicator.format === 'percent' || indicator.format === 'decimal') {
                formattedValue = indicator.value.toFixed(1);
            } else if (indicator.format === 'integer') {
                formattedValue = indicator.value.toLocaleString();
            }
            
            let changeHTML = '';
            if (indicator.change) {
                const changeSign = indicator.change > 0 ? '+' : '';
                changeHTML = `<div class="data-card-change">${changeSign}${indicator.change}%</div>`;
            }
            
            card.innerHTML = `
                <div class="data-card-title">${indicator.name}</div>
                <div class="data-card-value">${formattedValue}</div>
                <div class="data-card-subtitle">${indicator.description || ''}</div>
                ${changeHTML}
            `;
            
            return card;
        }

        document.addEventListener('DOMContentLoaded', init);