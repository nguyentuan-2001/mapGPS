import React, { useEffect, useState } from "react";
import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import axios from "axios";
import { createMap } from "./createmap";

export const NewMap = () => {
  const [arrCoodinate, setArrCoodinate] = useState("");
  const [endPoint, setEndPoint] = useState("");
  // const [coordinatesArray, setCoordinatesArray] = useState([]);

  const polyline = require("@mapbox/polyline");

  const decodedCoordinates = polyline.decode(arrCoodinate);

  const reverseCoordinates = (coordinates) => {
    return coordinates.map((coord) => [coord[1], coord[0]]);
  };

  const mapboxApiKey =
    "pk.eyJ1IjoidHVhbjJrMXR2IiwiYSI6ImNsaWlkN3Z2dzF5MjEzZXBmNmNybzUwMTQifQ.1-igydy5eIwov_1pryiTVA";
  const startCoords = "105.85968116529835,21.01334492864062";
  const endCoords = endPoint;

  const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?access_token=${mapboxApiKey}`;

  useEffect(() => {
    const map = createMap();

    const marker = new Marker({
      color: "#4477CE",
      draggable: false,
    })
      .setLngLat([105.85968116529835, 21.01334492864062])
      .addTo(map);
    map.on("click", (e) => {
      console.log(e.lngLat.lng, e.lngLat.lat);
    });

    map.on("load", () => {
      if (map.getLayer("routel1")) {
        map.getSource("route1").updateSourceData({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: reverseCoordinates(decodedCoordinates),
          },
        });
      } else {
        map.addSource("route1", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: reverseCoordinates(decodedCoordinates),
            },
          },
        });
        map.addLayer({
          id: "routel1",
          type: "line",
          source: "route1",
          paint: {
            "line-color": "blue",
            "line-width": 8,
          },
        });
      }
    });

    if (endPoint) {
      axios
        .get(apiUrl)
        .then((response) => {
          setArrCoodinate(response.data.routes[0].geometry);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu đường đi:", error);
        });
    }

    return () => map.remove();
  }, [arrCoodinate, endPoint]);
  let coordinatesArray = [];

  const handleSubmit = () => {
    coordinatesArray = [
      ...coordinatesArray,
      ...reverseCoordinates(decodedCoordinates),
    ];

    console.log(coordinatesArray);
  };

  return (
    <div className="main__map">
      <form
        style={{ position: "absolute", zIndex: "10" }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          name="endPoint"
          value={endPoint}
          placeholder="End Point"
          onChange={(e) => setEndPoint(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div id="map" />
    </div>
  );
};
