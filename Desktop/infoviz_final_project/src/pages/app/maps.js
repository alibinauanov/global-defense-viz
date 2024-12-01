"use client"; // probably delete it

import React from "react";
import { json } from "d3";
import { geoPath, geoMercator } from "d3-geo";

const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';

function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(setData);
    }, [jsonPath]);
    return data;
}

function Map() {
    const map = useMap(mapUrl);
    const [selectedCountry, setSelectedCountry] = React.useState(null);

    if (!map) return <p>Loading map...</p>;

    const projection = geoMercator().scale(120).translate([300, 150]);
    const pathGenerator = geoPath().projection(projection);

    return (
        <svg width={600} height={300}>
            {map.features.map((feature) => (
                <path
                    key={feature.properties.name}
                    d={pathGenerator(feature)}
                    fill={selectedCountry === feature.properties.name ? "orange" : "gray"}
                    stroke="white"
                    onClick={() => setSelectedCountry(feature.properties.name)}
                />
            ))}
        </svg>
    );
}

export default Map;
