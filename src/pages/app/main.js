import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Maps from './maps';
import Top15Chart from './barChart';
import LineChart from './lineChart';

export default function Main() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/datasets/merged_dataset3.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const csvData = await reader.read();
        const parsed = Papa.parse(decoder.decode(csvData.value), {
          header: true,
          skipEmptyLines: true,
        });
        setData(parsed.data || []);
      } catch (error) {
        console.error('Error fetching or parsing the CSV file:', error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return <p>Loading data...</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '40px' }}>Interactive Visualizations</h1>

      {/* First level: World Map */}
      <div style={{ marginBottom: '60px', width: '100%', maxWidth: '800px' }}>
        <h2>World Map</h2>
        <Maps
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </div>

      {/* Second level: Top 15 Bar Chart */}
      <div style={{ marginBottom: '60px', width: '100%', maxWidth: '800px' }}>
        <h2>Top 15 Bar Chart</h2>
        <Top15Chart
          data={data}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </div>

      {/* Third level: Line Chart */}
      <div style={{ marginBottom: '60px', width: '100%', maxWidth: '800px' }}>
        <h2>Line Chart</h2>
        <LineChart data={data} selectedCountry={selectedCountry} />
      </div>
    </div>
  );
}
