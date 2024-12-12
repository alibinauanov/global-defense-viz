import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const Top15Chart = ({ data, selectedCountry, setSelectedCountry }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [top15, setTop15] = useState([]);

  // Extract and normalize years from column names
  const years = [...new Set(
    Object.keys(data[0] || {})
      .filter(col => /^\d{4}_[xy]$/.test(col))
      .map(col => col.match(/^\d{4}/)[0])
  )].sort((a, b) => a - b);

  const featureColumns = ['Active military', 'Reserve military', 'Paramilitary_x', 'Total_x', 'Per 1,000 capita(active)', 'Per 1,000 capita(total)', 'Active Personnel', 'Aircraft Carriers', 'Armored Vehicles', 'Attack Helicopters'];

  useEffect(() => {
    if (!selectedYear && years.length > 0) {
      setSelectedYear(years[years.length - 1]); // Default to the latest year
    }
  }, [years, selectedYear]);

  useEffect(() => {
    if (selectedColumn && selectedYear) {
      const filteredData = data.map(d => {
        const yearColumn = Object.keys(d).find(col => col.startsWith(selectedYear)); // Match column with selected year
        return {
          Country: d.Country,
          [selectedColumn]: d[yearColumn], // Access value dynamically by matched column
        };
      }).filter(d => !isNaN(Number(d[selectedColumn]))); // Filter invalid data

      const sortedData = [...filteredData]
        .sort((a, b) => b[selectedColumn] - a[selectedColumn])
        .slice(0, 15);
      setTop15(sortedData);
    } else {
      setTop15([]);
    }
  }, [selectedColumn, selectedYear, data]);

  const colors = top15.map(item =>
    item.Country === selectedCountry ? 'orange' : 'steelblue'
  );

  const handleBarClick = (event) => {
    if (event && event.points && event.points.length > 0) {
      const point = event.points[0];
      const countryName = top15[point.pointNumber].Country;
      setSelectedCountry(countryName);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="year-slider">Select Year: {selectedYear}</label>
        <input
          type="range"
          id="year-slider"
          min={0}
          max={years.length - 1}
          value={years.indexOf(selectedYear)}
          onChange={(e) => setSelectedYear(years[e.target.value])}
          step="1"
        />
      </div>

      <label htmlFor="column-select">Select Column:</label>
      <select
        id="column-select"
        onChange={(e) => setSelectedColumn(e.target.value)}
      >
        <option value="">-- Select --</option>
        {featureColumns.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      {selectedColumn && top15.length > 0 && (
        <Plot
          data={[
            {
              x: top15.map((item) => item[selectedColumn]),
              y: top15.map((item) => item.Country),
              type: 'bar',
              orientation: 'h',
              marker: {
                color: colors
              }
            },
          ]}
          layout={{
            title: `Top 15 by ${selectedColumn} in ${selectedYear}`,
            yaxis: { automargin: true },
          }}
          onClick={handleBarClick}
        />
      )}
    </div>
  );
};

export default Top15Chart;
