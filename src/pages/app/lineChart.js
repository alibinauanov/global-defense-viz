import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, selectedCountry }) => {
  const svgRef = useRef();
  const margin = { top: 50, right: 120, bottom: 60, left: 70 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Filter data for the selected country or top 10 countries
    const groupedData = data.map((country) => {
      const countryData = { country: country.Country, values: [] };
      for (let year = 1960; year <= 2018; year++) {
        const yearKey = `${year}_x`;
        if (country[yearKey] !== undefined && country.Type === 'Country') {
          countryData.values.push({
            year: year.toString(),
            expenditure: parseFloat(country[yearKey].replace(/,/g, '')) || 0,
          });
        }
      }
      return countryData;
    });

    let chartData = selectedCountry
      ? groupedData.filter((d) => d.country === selectedCountry)
      : groupedData
          .filter((d) => d.values.some((v) => v.year === '2018'))
          .slice(0, 10);

    if (chartData.length === 0) return;

    const years = chartData[0].values.map((d) => d.year);
    const expenditures = chartData.flatMap((d) =>
      d.values.map((v) => v.expenditure)
    );

    // Set y-axis limits
    const yDomain = [0, Math.max(1.1 * d3.max(expenditures), 100000)];
    const x = d3.scalePoint().domain(years).range([0, width]);
    const y = d3.scaleLinear().domain(yDomain).range([height, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(chartData.map((d) => d.country))
      .range(d3.schemeCategory10);

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.expenditure));

    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left + 30}, ${margin.top})`);

    // Chart title
    svg
      .append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Global Military Expenditure');

    // X-axis
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickValues(years.filter((d, i) => i % 5 === 0)));

    // X-axis label
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Year');

    // Y-axis
    g.append('g').call(d3.axisLeft(y));

    // Y-axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -85)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Expenditure($)');

    // Add lines
    const lines = g
      .selectAll('.line-group')
      .data(chartData)
      .enter()
      .append('g')
      .attr('class', 'line-group');

    lines
      .append('path')
      .attr('class', 'line')
      .attr('d', (d) => line(d.values))
      .attr('fill', 'none')
      .attr('stroke', (d) => colorScale(d.country))
      .attr('stroke-width', 2);

    lines
      .append('text')
      .datum((d) => ({
        country: d.country,
        value:
          d.values[d.values.length - 1] || {
            year: years[years.length - 1],
            expenditure: 0,
          },
      }))
      .attr(
        'transform',
        (d) => `translate(${x(d.value.year)}, ${y(d.value.expenditure)})`
      )
      .attr('x', 10)
      .attr('dy', '.35em')
      .style('font-size', '12px')
      .style('fill', (d) => colorScale(d.country))
      .text((d) => d.country);
  }, [data, selectedCountry]);

  return (
    <svg
      ref={svgRef}
      width={880}
      height={400}
      style={{
        margin: '20px auto',
        display: 'block',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      }}
    ></svg>
  );
};

export default LineChart;
