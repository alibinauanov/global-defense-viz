import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Maps from './maps';
import Top15Chart from './barChart';

export default function Main() {
  const [data, setData] = useState([]); // Initialize with an empty array

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
        setData(parsed.data || []); // Ensure data is always an array
      } catch (error) {
        console.error('Error fetching or parsing the CSV file:', error);
        setData([]); // Fallback to an empty array in case of error
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
        <Maps />
      </div>
      <div>
        <h2>Top 15 Bar Chart</h2>
        <Top15Chart data={data} />
      </div>
    </div>
  );
}
