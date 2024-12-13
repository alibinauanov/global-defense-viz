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
        const csvData = await response.text();
        const parsed = Papa.parse(csvData, {
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
    return (
      <p style={{ textAlign: 'center', fontFamily: 'Roboto, sans-serif' }}>
        Loading data...
      </p>
    );
  }

  return (
    <div
      style={{
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#f5f7fa',
        padding: '20px',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ color: '#4a90e2', fontSize: '2.5em', marginBottom: '20px' }}>
        Globe Defense Dynamics
      </h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Map component */}
        <div
          style={{
            flex: '1 1 45%',
            maxWidth: '700px',
            minWidth: '300px',
            position: 'relative',
            right: '38px'
          }}
        >
          <Map selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
        </div>

        {/* Line chart component */}
        <div
          style={{
            flex: '1 1 45%',
            maxWidth: '800px',
            minWidth: '300px',
            position: 'relative',
            right: '50px'
          }}
        >
          <LineChart data={data} selectedCountry={selectedCountry} />
        </div>
      </div>

      {/* Bar chart below */}
      <Top15Chart
        data={data}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </div>
  );
}
