// D3.js Chart Examples for Future Enhancement
// Add these functions when you're ready to show historical trends

/**
 * Create a line chart showing historical data for an indicator
 * 
 * @param {string} containerId - ID of the container element
 * @param {Array} data - Array of {date, value} objects
 * @param {Object} options - Configuration options
 */
function createLineChart(containerId, data, options = {}) {
    // Default options
    const defaults = {
        width: 600,
        height: 400,
        marginTop: 20,
        marginRight: 30,
        marginBottom: 30,
        marginLeft: 50,
        xLabel: 'Date',
        yLabel: 'Value',
        color: '#4A9EFF',
        animate: true
    };
    
    const config = {...defaults, ...options};
    
    // Clear any existing chart
    d3.select(`#${containerId}`).selectAll('*').remove();
    
    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    data.forEach(d => {
        d.date = parseDate(d.date);
    });
    
    // Create SVG
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', config.width)
        .attr('height', config.height)
        .attr('viewBox', [0, 0, config.width, config.height])
        .attr('style', 'max-width: 100%; height: auto;');
    
    // Create scales
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([config.marginLeft, config.width - config.marginRight]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.1])
        .range([config.height - config.marginBottom, config.marginTop]);
    
    // Create line generator
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);
    
    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${config.height - config.marginBottom})`)
        .call(d3.axisBottom(x).ticks(6))
        .call(g => g.select('.domain').remove());
    
    // Add Y axis
    svg.append('g')
        .attr('transform', `translate(${config.marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(6))
        .call(g => g.select('.domain').remove());
    
    // Add grid lines
    svg.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(y)
            .ticks(6)
            .tickSize(-config.width + config.marginLeft + config.marginRight)
            .tickFormat(''))
        .call(g => g.select('.domain').remove());
    
    // Add the line path
    const path = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', config.color)
        .attr('stroke-width', 2.5)
        .attr('d', line);
    
    // Animate the line if enabled
    if (config.animate) {
        const totalLength = path.node().getTotalLength();
        
        path
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
    }
    
    // Add dots for data points
    svg.selectAll('.dot')
        .data(data)
        .join('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value))
        .attr('r', 0)
        .attr('fill', config.color)
        .transition()
        .delay((d, i) => config.animate ? i * 50 : 0)
        .attr('r', 4);
    
    // Add hover effects
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('padding', '10px')
        .style('border', '1px solid #ddd')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('opacity', 0);
    
    svg.selectAll('.dot')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .attr('r', 6);
            
            tooltip
                .style('opacity', 1)
                .html(`<strong>Date:</strong> ${d3.timeFormat('%Y-%m-%d')(d.date)}<br>
                       <strong>Value:</strong> ${d.value.toFixed(2)}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .attr('r', 4);
            
            tooltip.style('opacity', 0);
        });
}

/**
 * Create a bar chart comparing multiple indicators
 * 
 * @param {string} containerId - ID of the container element
 * @param {Array} data - Array of {name, value} objects
 * @param {Object} options - Configuration options
 */
function createBarChart(containerId, data, options = {}) {
    const defaults = {
        width: 600,
        height: 400,
        marginTop: 20,
        marginRight: 30,
        marginBottom: 60,
        marginLeft: 50,
        color: '#4A9EFF',
        animate: true
    };
    
    const config = {...defaults, ...options};
    
    // Clear any existing chart
    d3.select(`#${containerId}`).selectAll('*').remove();
    
    // Create SVG
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', config.width)
        .attr('height', config.height)
        .attr('viewBox', [0, 0, config.width, config.height]);
    
    // Create scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([config.marginLeft, config.width - config.marginRight])
        .padding(0.3);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.1])
        .range([config.height - config.marginBottom, config.marginTop]);
    
    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${config.height - config.marginBottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
    
    // Add Y axis
    svg.append('g')
        .attr('transform', `translate(${config.marginLeft},0)`)
        .call(d3.axisLeft(y));
    
    // Add bars
    const bars = svg.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('fill', config.color)
        .attr('y', config.height - config.marginBottom)
        .attr('height', 0);
    
    // Animate bars if enabled
    if (config.animate) {
        bars.transition()
            .duration(1000)
            .delay((d, i) => i * 100)
            .attr('y', d => y(d.value))
            .attr('height', d => config.height - config.marginBottom - y(d.value));
    } else {
        bars
            .attr('y', d => y(d.value))
            .attr('height', d => config.height - config.marginBottom - y(d.value));
    }
    
    // Add value labels on bars
    svg.selectAll('.label')
        .data(data)
        .join('text')
        .attr('class', 'label')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('fill', '#333')
        .style('font-size', '12px')
        .style('opacity', 0)
        .text(d => d.value.toFixed(1))
        .transition()
        .delay((d, i) => config.animate ? (i * 100 + 1000) : 0)
        .style('opacity', 1);
}

/**
 * Create a sparkline (mini line chart) for embedding in cards
 * 
 * @param {string} containerId - ID of the container element
 * @param {Array} data - Array of values
 * @param {Object} options - Configuration options
 */
function createSparkline(containerId, data, options = {}) {
    const defaults = {
        width: 100,
        height: 30,
        color: 'white',
        strokeWidth: 2
    };
    
    const config = {...defaults, ...options};
    
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', config.width)
        .attr('height', config.height);
    
    const x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([0, config.width]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(data), d3.max(data)])
        .range([config.height, 0]);
    
    const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d))
        .curve(d3.curveMonotoneX);
    
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', config.color)
        .attr('stroke-width', config.strokeWidth)
        .attr('d', line);
}

/**
 * Example: Integrate chart into data card on click
 */
function enhanceDataCardWithChart(cardElement, historicalData) {
    cardElement.addEventListener('click', function() {
        // Create modal or expand card
        const modal = document.createElement('div');
        modal.className = 'chart-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${this.querySelector('.data-card-title').textContent}</h2>
                <div id="modal-chart"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Create chart
        createLineChart('modal-chart', historicalData, {
            width: 800,
            height: 500
        });
        
        // Close modal
        modal.querySelector('.close').addEventListener('click', () => {
            modal.remove();
        });
        
        // Style the modal
        modal.style.cssText = `
            display: block;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
        `;
        
        modal.querySelector('.modal-content').style.cssText = `
            background-color: white;
            margin: 5% auto;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 900px;
        `;
    });
}

// Example usage:
/*
// Historical data format
const historicalData = [
    {date: '2024-01-01', value: 2.5},
    {date: '2024-02-01', value: 2.6},
    {date: '2024-03-01', value: 2.7},
    // ... more data
];

// Create a line chart
createLineChart('chart-container', historicalData, {
    width: 800,
    height: 500,
    xLabel: 'Month',
    yLabel: 'CPI-U (%)',
    color: '#4A9EFF'
});

// Create a bar chart
const comparisonData = [
    {name: 'CPI-U', value: 2.7},
    {name: 'Unemployment', value: 4.6},
    {name: 'Mortgage Rate', value: 6.2}
];

createBarChart('bar-chart-container', comparisonData);

// Add sparkline to existing card
const sparklineData = [2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.7];
createSparkline('sparkline-container', sparklineData);
*/
