// Main application state
const state = {
    currentCategory: 'aggregates',
    selectedSubcategories: [],
    data: null
};

// Configuration for different shading levels
const cardStyles = ['light', 'medium', 'dark'];

// Initialize the application
async function init() {
    try {
        // Load data
        state.data = await loadData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize with default category
        updateUI();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data/economic-data.json');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        // Return sample data if file doesn't exist
        return getSampleData();
    }
}

// Set up event listeners
function setupEventListeners() {
    // Category tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            selectCategory(category);
        });
    });
}

// Handle category selection
function selectCategory(category) {
    state.currentCategory = category;
    state.selectedSubcategories = [];
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active-category');
        if (btn.dataset.category === category) {
            btn.classList.add('active-category');
        }
    });
    
    updateUI();
}

// Handle subcategory selection (toggle on/off)
function toggleSubcategory(subcategoryId) {
    const index = state.selectedSubcategories.indexOf(subcategoryId);
    
    if (index > -1) {
        // Already selected, remove it
        state.selectedSubcategories.splice(index, 1);
    } else {
        // Not selected, add it
        state.selectedSubcategories.push(subcategoryId);
    }
    
    updateDataGrid();
}

// Update the entire UI
function updateUI() {
    updateSubcategories();
    updateDataGrid();
}

// Update subcategories display
function updateSubcategories() {
    const container = document.getElementById('subcategories-container');
    container.innerHTML = '';
    
    const categoryData = state.data.categories.find(c => c.id === state.currentCategory);
    if (!categoryData || !categoryData.subcategories) return;
    
    categoryData.subcategories.forEach(sub => {
        const btn = document.createElement('button');
        btn.className = 'subcategory-btn';
        btn.textContent = sub.name;
        btn.dataset.subcategory = sub.id;
        
        // Check if this subcategory should be highlighted
        if (sub.highlighted) {
            btn.classList.add('highlighted');
        }
        
        // Check if already selected
        if (state.selectedSubcategories.includes(sub.id)) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            toggleSubcategory(sub.id);
            
            // Update button active state
            if (state.selectedSubcategories.includes(sub.id)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        container.appendChild(btn);
    });
}

// Update data grid with animated cards
function updateDataGrid() {
    const grid = document.getElementById('data-grid');
    
    // If no subcategories selected, clear the grid
    if (state.selectedSubcategories.length === 0) {
        grid.innerHTML = '';
        return;
    }
    
    const categoryData = state.data.categories.find(c => c.id === state.currentCategory);
    if (!categoryData) return;
    
    // Get all selected indicators in order
    const indicators = state.selectedSubcategories
        .map(subId => {
            const sub = categoryData.subcategories.find(s => s.id === subId);
            return sub && sub.indicator ? { id: subId, indicator: sub.indicator } : null;
        })
        .filter(item => item !== null);
    
    // Clear and rebuild grid
    grid.innerHTML = '';
    
    indicators.forEach((item, index) => {
        const card = createDataCard(item.indicator, index);
        grid.appendChild(card);
    });
}

// Create a data card element
function createDataCard(indicator, index) {
    const card = document.createElement('div');
    const styleIndex = index % cardStyles.length;
    card.className = `data-card ${cardStyles[styleIndex]}`;
    
    // Format the value based on type
    let formattedValue = indicator.value;
    if (indicator.format === 'percent') {
        formattedValue = indicator.value.toFixed(1);
    } else if (indicator.format === 'decimal') {
        formattedValue = indicator.value.toFixed(1);
    } else if (indicator.format === 'integer') {
        formattedValue = indicator.value.toFixed(0);
    }
    
    // Create change indicator if available
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

// Sample data structure
function getSampleData() {
    return {
        categories: [
            {
                id: 'aggregates',
                name: 'Aggregates',
                subcategories: [
                    {
                        id: 'cpi-u',
                        name: 'CPI-U',
                        highlighted: false,
                        indicator: {
                            name: 'CPI-U, Inflation',
                            value: 2.7,
                            format: 'decimal',
                            description: 'Monthly Data, United States',
                            change: null
                        }
                    },
                    {
                        id: 'unemployment',
                        name: 'Unemployment',
                        highlighted: false,
                        indicator: {
                            name: 'U-3 Unemployment Rate',
                            value: 4.6,
                            format: 'decimal',
                            description: 'in Percent, United States',
                            change: null
                        }
                    },
                    {
                        id: 'gdp',
                        name: 'Gross Domestic Product',
                        highlighted: false,
                        indicator: {
                            name: 'Mortgage Rate',
                            value: 6.2,
                            format: 'decimal',
                            description: '30-Year Fixed',
                            change: null
                        }
                    },
                    {
                        id: 'gdp-growth',
                        name: 'GDP Growth Rate',
                        highlighted: false,
                        indicator: {
                            name: 'Current Rent Amount',
                            value: 1.9,
                            format: 'decimal',
                            description: 'in Thousands',
                            change: 30
                        }
                    },
                    {
                        id: 'inflation',
                        name: 'Inflation Rate',
                        highlighted: false,
                        indicator: {
                            name: 'Household Debt Service Ratio',
                            value: 11.3,
                            format: 'decimal',
                            description: 'in Percent of Disposable Income',
                            change: null
                        }
                    },
                    {
                        id: 'consumer-price',
                        name: 'Consumer Price Index',
                        highlighted: false,
                        indicator: {
                            name: 'Debt Deliquency',
                            value: 9.4,
                            format: 'decimal',
                            description: 'Student Debt 90+ Days Delinquent, in Percent',
                            change: null
                        }
                    },
                    {
                        id: 'producer-prices',
                        name: 'Producer Prices',
                        highlighted: false,
                        indicator: {
                            name: 'National Wealth Share',
                            value: 31,
                            format: 'integer',
                            description: 'of Top 1% in the United States',
                            change: null
                        }
                    },
                    {
                        id: 'personal-consumption',
                        name: 'Personal Consumption',
                        highlighted: false,
                        indicator: {
                            name: 'National Wealth Share',
                            value: 2.5,
                            format: 'decimal',
                            description: 'of Bottom 50% in the United States',
                            change: null
                        }
                    },
                    {
                        id: 'retail-sales',
                        name: 'Spending Retail Sales',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'production',
                        name: 'Industrial Production',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'housing',
                        name: 'Housing Starts',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'home-sales',
                        name: 'Home Sales',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'home-prices',
                        name: 'Home Prices',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'rent-inflation',
                        name: 'Rent Inflation',
                        highlighted: true,
                        indicator: null
                    },
                    {
                        id: 'job-openings',
                        name: 'Job Openings',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'hiring-rate',
                        name: 'Hiring Rate',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'quits-rate',
                        name: 'Quits Rate',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'layoffs',
                        name: 'Layoffs and Discharges',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'labor-participation',
                        name: 'Labor Force Participation',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'wage-growth',
                        name: 'Wage Growth Productivity',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'labor-costs',
                        name: 'Unit Labor Costs',
                        highlighted: false,
                        indicator: null
                    },
                    {
                        id: 'interest-rates',
                        name: 'Interest Rates',
                        highlighted: false,
                        indicator: null
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
                            change: -2.1
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
                        indicator: {
                            name: 'Poverty Rate',
                            value: 12.4,
                            format: 'decimal',
                            description: 'Percent Below Poverty Line',
                            change: 1.2
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
                        indicator: {
                            name: 'Employment Rate',
                            value: 60.1,
                            format: 'decimal',
                            description: 'Employment-Population Ratio',
                            change: 0.3
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
                        indicator: {
                            name: 'Trade Balance',
                            value: -68.9,
                            format: 'decimal',
                            description: 'Billions USD',
                            change: -5.2
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
                        indicator: {
                            name: 'S&P 500 Index',
                            value: 4783,
                            format: 'integer',
                            description: 'Stock Market Index',
                            change: 12.5
                        }
                    }
                ]
            }
        ]
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
