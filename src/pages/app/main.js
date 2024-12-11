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
        const response = await fetch('/datasets/merged_dataset.csv');
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
    <div>
      <h1>Interactive Visualizations</h1>
      <div>
        <h2>World Map</h2>
        <Maps selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      </div>
      <div>
        <h2>Top 15 Bar Chart</h2>
        {/* Pass setSelectedCountry to allow clicking on the bar chart to update selection */}
        <Top15Chart data={data} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      </div>
      <div>
        <h2>Line Chart</h2>
        <LineChart data={data} selectedCountry={selectedCountry} />
      </div>
    </div>
  );
}
