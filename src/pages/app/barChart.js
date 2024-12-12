import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const Top15Chart = ({ data, selectedCountry, setSelectedCountry }) => {
  const [selectedColumn, setSelectedColumn] = useState('Active military');
  const [selectedYear, setSelectedYear] = useState('');
  const [top15, setTop15] = useState([]);
  const [selectedCountryRank, setSelectedCountryRank] = useState(null);

  const years = [...new Set(
    Object.keys(data[0] || {})
      .filter(col => /^\d{4}_[xy]$/.test(col))
      .map(col => col.match(/^\d{4}/)[0])
  )].sort((a, b) => a - b);

  const featureColumns = ['Active military', 'Reserve military', 'Paramilitary_x', 'Total_x', 'Per 1,000 capita(active)', 'Per 1,000 capita(total)', 'Active Personnel', 'Aircraft Carriers', 'Armored Vehicles', 'Attack Helicopters'];

  useEffect(() => {
    if (!selectedYear && years.length > 0) {
      setSelectedYear(years[years.length - 1]);
    }
  }, [years, selectedYear]);

  useEffect(() => {
    if (selectedColumn && selectedYear) {
      const filteredData = data.map(d => {
        const yearColumn = Object.keys(d).find(col => col.startsWith(selectedYear));
        return {
          Country: d.Country,
          [selectedColumn]: d[yearColumn],
        };
      }).filter(d => !isNaN(Number(d[selectedColumn])));

      const sortedData = [...filteredData]
        .sort((a, b) => b[selectedColumn] - a[selectedColumn]);

      const top15Data = sortedData.slice(0, 15);

      if (selectedCountry) {
        const selectedCountryData = sortedData.find(d => d.Country === selectedCountry);
        const rank = sortedData.findIndex(d => d.Country === selectedCountry) + 1;
        setSelectedCountryRank(rank);

        if (selectedCountryData && !top15Data.some(d => d.Country === selectedCountry)) {
          top15Data.push(selectedCountryData);
        }
      } else {
        setSelectedCountryRank(null);
      }

      setTop15(top15Data);
    } else {
      setTop15([]);
      setSelectedCountryRank(null);
    }
  }, [selectedColumn, selectedYear, data, selectedCountry]);

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
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginLeft: '410px' }}>
        <div>
          <label htmlFor="year-slider" style={{ marginRight: '10px' }}>Select Year: {selectedYear}</label>
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
        <div style={{ marginLeft: '30px' }}>
          <label htmlFor="column-select" style={{ marginRight: '6px' }}>Select Column:</label>
          <select
            id="column-select"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            {featureColumns.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedColumn && top15.length > 0 && (
        <Plot
          data={[
            {
              x: top15.map((item) => item[selectedColumn]),
              y: top15.map((item) =>
                item.Country === selectedCountry && selectedCountryRank
                  ? `${item.Country} (Rank: ${selectedCountryRank})`
                  : item.Country
              ),
              type: 'bar',
              orientation: 'h',
              marker: {
                color: colors,
              },
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
