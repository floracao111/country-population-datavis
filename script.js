const margin = { top: 20, right: 30, bottom: 50, left: 100 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;


d3.select("body")
    .style("background-color", "black");

const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

d3.dsv(";", "https://raw.githubusercontent.com/lorey/list-of-countries/refs/heads/master/csv/countries.csv", function(d) {
    return {
        name: d.name, 
        population: +d.population 
    };
}).then(function(data) {
    // Filter out countries without a population value
    data = data.filter(d => !isNaN(d.population));

    // Sort data by population (descending)
    data = data.sort((a, b) => b.population - a.population).slice(0, 25); // Top 12 countries


    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.name)) 
        .range([0, height])
        .padding(0.1);

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format(".2s")))
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('fill', 'white'); 

    
    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('fill', 'white'); 

   
    svg.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', 0)
        .attr('y', d => y(d.name))
        .attr('width', d => x(d.population))
        .attr('height', y.bandwidth())
        .attr('fill', 'aqua') 
        .style('opacity', d => d.population / d3.max(data, d => d.population)); // Adjust opacity based on population
});
