import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import dynamic from 'next/dynamic';
const LineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Preprocess data to group by decades
        const groupedData = data.map(country => {
            const countryData = { country: country.Country, values: [] };
            for (let year = 1960; year <= 2018; year += 10) {
                const decade = `${year}s`;
                const decadeSum = Object.keys(country)
                    .filter(key => key.endsWith('_y') && +key.replace('_y', '') >= year && +key.replace('_y', '') < year + 10)
                    .reduce((sum, key) => sum + (parseFloat(country[key]) || 0), 0);
                countryData.values.push({ decade, expenditure: decadeSum });
            }
            return countryData;
        });

        const decades = groupedData[0].values.map(d => d.decade);
        const expenditures = groupedData.flatMap(d => d.values.map(v => v.expenditure));

        const x = d3.scalePoint().domain(decades).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(expenditures)]).range([height, 0]);

        const line = d3.line()
            .x(d => x(d.decade))
            .y(d => y(d.expenditure));

        svg.selectAll("*").remove(); // Clear previous content

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        g.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y));

        g.selectAll('.line')
            .data(groupedData)
            .enter()
            .append('path')
            .attr('d', d => line(d.values))
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2);

    }, [data]);

    return (
        <svg ref={svgRef} width={800} height={400}></svg>
    );
}

export default LineChart;