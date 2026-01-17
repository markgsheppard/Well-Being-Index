// Data Processing Utilities
// Use this file to convert your existing data into the required format

/**
 * Convert CSV data to the Economic Well-Being Index format
 * 
 * Expected CSV format:
 * category_id,category_name,subcategory_id,subcategory_name,highlighted,indicator_name,value,format,description,change
 */
async function convertCSVToJSON(csvFilePath) {
    try {
        const response = await fetch(csvFilePath);
        const csvText = await response.text();
        const rows = d3.csvParse(csvText);
        
        // Group by category
        const categories = {};
        
        rows.forEach(row => {
            const categoryId = row.category_id;
            
            // Initialize category if it doesn't exist
            if (!categories[categoryId]) {
                categories[categoryId] = {
                    id: categoryId,
                    name: row.category_name,
                    subcategories: []
                };
            }
            
            // Create subcategory with indicator
            const subcategory = {
                id: row.subcategory_id,
                name: row.subcategory_name,
                highlighted: row.highlighted === 'true' || row.highlighted === '1',
                indicator: {
                    name: row.indicator_name,
                    value: parseFloat(row.value),
                    format: row.format || 'decimal',
                    description: row.description || '',
                    change: row.change ? parseFloat(row.change) : null,
                    source: row.source || '',
                    lastUpdated: row.last_updated || new Date().toISOString().split('T')[0]
                }
            };
            
            categories[categoryId].subcategories.push(subcategory);
        });
        
        // Convert to array
        const result = {
            lastUpdated: new Date().toISOString().split('T')[0],
            overallStatus: "Fair",
            categories: Object.values(categories)
        };
        
        return result;
        
    } catch (error) {
        console.error('Error converting CSV:', error);
        return null;
    }
}

/**
 * Convert Excel/XLSX data (requires SheetJS library)
 * Include: <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
 */
async function convertExcelToJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                
                // Assume data is in first sheet
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                
                // Process similar to CSV
                const categories = {};
                
                jsonData.forEach(row => {
                    const categoryId = row['Category ID'] || row.category_id;
                    
                    if (!categories[categoryId]) {
                        categories[categoryId] = {
                            id: categoryId,
                            name: row['Category Name'] || row.category_name,
                            subcategories: []
                        };
                    }
                    
                    const subcategory = {
                        id: row['Subcategory ID'] || row.subcategory_id,
                        name: row['Subcategory Name'] || row.subcategory_name,
                        highlighted: (row.Highlighted || row.highlighted) === 'true',
                        indicator: {
                            name: row['Indicator Name'] || row.indicator_name,
                            value: parseFloat(row.Value || row.value),
                            format: row.Format || row.format || 'decimal',
                            description: row.Description || row.description || '',
                            change: row.Change || row.change ? parseFloat(row.Change || row.change) : null
                        }
                    };
                    
                    categories[categoryId].subcategories.push(subcategory);
                });
                
                const result = {
                    lastUpdated: new Date().toISOString().split('T')[0],
                    overallStatus: "Fair",
                    categories: Object.values(categories)
                };
                
                resolve(result);
                
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Download the current data as JSON file
 */
function downloadJSON(data, filename = 'economic-data.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
}

/**
 * Validate data structure
 */
function validateData(data) {
    const errors = [];
    
    if (!data.categories || !Array.isArray(data.categories)) {
        errors.push('Missing or invalid categories array');
        return errors;
    }
    
    data.categories.forEach((category, catIndex) => {
        if (!category.id) {
            errors.push(`Category ${catIndex}: Missing id`);
        }
        
        if (!category.subcategories || !Array.isArray(category.subcategories)) {
            errors.push(`Category ${category.id}: Missing or invalid subcategories array`);
            return;
        }
        
        category.subcategories.forEach((sub, subIndex) => {
            if (!sub.id) {
                errors.push(`Category ${category.id}, Subcategory ${subIndex}: Missing id`);
            }
            
            if (sub.indicator) {
                if (typeof sub.indicator.value !== 'number') {
                    errors.push(`${category.id}/${sub.id}: indicator.value must be a number`);
                }
                
                const validFormats = ['decimal', 'integer', 'percent'];
                if (sub.indicator.format && !validFormats.includes(sub.indicator.format)) {
                    errors.push(`${category.id}/${sub.id}: invalid format (must be decimal, integer, or percent)`);
                }
            }
        });
    });
    
    return errors;
}

/**
 * Example: Fetch from API and convert
 */
async function fetchFromAPI(apiEndpoint) {
    try {
        const response = await fetch(apiEndpoint);
        const apiData = await response.json();
        
        // Transform API response to your format
        // This is highly dependent on your API structure
        const transformed = {
            lastUpdated: new Date().toISOString().split('T')[0],
            overallStatus: apiData.status || "Fair",
            categories: apiData.indicators.map(indicator => ({
                id: indicator.category.toLowerCase().replace(/ /g, '-'),
                name: indicator.category,
                subcategories: [{
                    id: indicator.id,
                    name: indicator.name,
                    highlighted: indicator.highlighted || false,
                    indicator: {
                        name: indicator.display_name,
                        value: indicator.current_value,
                        format: indicator.format,
                        description: indicator.description,
                        change: indicator.percent_change,
                        source: indicator.source,
                        lastUpdated: indicator.updated_at
                    }
                }]
            }))
        };
        
        return transformed;
        
    } catch (error) {
        console.error('Error fetching from API:', error);
        return null;
    }
}

/**
 * Create a template CSV structure
 */
function generateTemplateCSV() {
    const template = [
        'category_id,category_name,subcategory_id,subcategory_name,highlighted,indicator_name,value,format,description,change,source,last_updated',
        'aggregates,Aggregates,cpi-u,CPI-U,false,CPI-U Inflation,2.7,decimal,Monthly Data United States,,Bureau of Labor Statistics,2026-01-15',
        'aggregates,Aggregates,unemployment,Unemployment,false,U-3 Unemployment Rate,4.6,decimal,in Percent United States,,Bureau of Labor Statistics,2026-01-10',
        'mobility,Mobility,income-mobility,Income Mobility,false,Income Mobility Index,45.3,decimal,Intergenerational Mobility,-2.1,Economic Mobility Project,2025-12-15'
    ].join('\n');
    
    const blob = new Blob([template], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'economic-data-template.csv';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Example usage in console:
// 1. Download template: generateTemplateCSV()
// 2. Fill in your data in Excel/Google Sheets
// 3. Convert: convertCSVToJSON('path/to/your/data.csv').then(data => console.log(data))
// 4. Validate: validateData(yourData)
// 5. Download: downloadJSON(yourData)
