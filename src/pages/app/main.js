import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Map from './maps';
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
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Globe defense dynamics</h1>
      <Map selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      <Top15Chart
        data={data}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
      <LineChart data={data} selectedCountry={selectedCountry} />
    </div>
  );
}
