import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Plotly with SSR disabled
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const Top15Chart = ({ data }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [top15, setTop15] = useState([]);

  useEffect(() => {
    if (selectedColumn) {
      const sortedData = [...data]
        .sort((a, b) => b[selectedColumn] - a[selectedColumn])
        .slice(0, 15);
      setTop15(sortedData);
    }
  }, [selectedColumn, data]);

  const numericColumns = Object.keys(data[0] || {}).filter(
    (key) => !isNaN(Number(data[0][key]))
  );

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

      {selectedColumn && (
        <Plot
          data={[
            {
              x: top15.map((item) => item[selectedColumn]),
              y: top15.map((item) => item.Country),
              type: 'bar',
              orientation: 'h',
            },
          ]}
          layout={{
            title: `Top 15 by ${selectedColumn}`,
            yaxis: { automargin: true },
          }}
        />
      )}
    </div>
  );
};

export default Top15Chart;
