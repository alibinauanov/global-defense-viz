import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const Top15Chart = ({ data, selectedCountry, setSelectedCountry }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [top15, setTop15] = useState([]);

  useEffect(() => {
    if (selectedColumn) {
      const sortedData = [...data]
        .filter(d => !isNaN(Number(d[selectedColumn]))) 
        .sort((a, b) => b[selectedColumn] - a[selectedColumn])
        .slice(0, 15);
      setTop15(sortedData);
    } else {
      setTop15([]);
    }
  }, [selectedColumn, data]);

  const numericColumns = Object.keys(data[0] || {}).filter(
    (key) => !isNaN(Number(data[0][key]))
  );

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
      <label htmlFor="column-select">Select Column:</label>
      <select
        id="column-select"
        onChange={(e) => setSelectedColumn(e.target.value)}
      >
        <option value="">-- Select --</option>
        {numericColumns.map((key) => (
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
            title: `Top 15 by ${selectedColumn}`,
            yaxis: { automargin: true },
          }}
          onClick={handleBarClick}
        />
      )}
    </div>
  );
};

export default Top15Chart;
