"use client";

import React, { useRef, useEffect, useState } from "react";
import { json, zoom, select } from "d3";
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
  const svgRef = useRef();
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });

  const map = useMap(mapUrl);

  useEffect(() => {
    if (!map) return;

    const svg = select(svgRef.current);

    const zoomBehavior = zoom()
      .scaleExtent([1, 5]) // Limit zoom levels (1 = 100%, 5 = 500%)
      .translateExtent([[0, 0], [width, height]]) // Prevent panning out of bounds
      .on("zoom", (event) => {
        setTransform(event.transform); // Update the current transform state
      });

    svg.call(zoomBehavior);
  }, [map]);

  if (!map) return <p>Loading map...</p>;

  const projection = geoEqualEarth()
    .scale(150)
    .translate([width / 2, height / 2]);

  const pathGenerator = geoPath().projection(projection);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ border: "1px solid black" }}
    >
      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
        {map.features.map((feature) => {
          const countryName = feature.properties.name;
          return (
            <path
              key={countryName}
              d={pathGenerator(feature)}
              fill={selectedCountry === countryName ? "orange" : "gray"}
              stroke="black"
              onClick={() =>
                setSelectedCountry(selectedCountry === countryName ? null : countryName)
              }
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default Map;
