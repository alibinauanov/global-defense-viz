"use client";

import React from "react";
import { json } from "d3";
import { geoPath, geoEqualEarth } from "d3-geo";

const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';

function useMap(jsonPath) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    json(jsonPath).then(setData);
  }, [jsonPath]);
  return data;
}

function Map({ selectedCountry, setSelectedCountry }) {
  const width = 700; 
  const height = 400; 

  const map = useMap(mapUrl);

  if (!map) return <p>Loading map...</p>;

  const projection = geoEqualEarth()
    .scale(150)
    .translate([width / 2, height / 2]);

  const pathGenerator = geoPath().projection(projection);

  return (
    <svg width={width} height={height} style={{ border: '1px solid black' }}>
      {map.features.map((feature) => {
        const countryName = feature.properties.name;
        return (
          <path
            key={countryName}
            d={pathGenerator(feature)}
            fill={selectedCountry === countryName ? "orange" : "gray"}
            stroke="black"
            onClick={() => setSelectedCountry(countryName)}
            style={{ cursor: 'pointer' }}
          />
        );
      })}
    </svg>
  );
}

export default Map;
