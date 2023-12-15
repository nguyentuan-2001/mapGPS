import { useContext } from "react";
import { MapContext } from "../contexts/mapcontext";
import React, { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import axios from "axios";

export const DrawLine = ({map}) => {
  const { isCoordinate } = useContext(MapContext);
  const [arrCoodinate, setArrCoodinate] = useState("");
  const [startPoint, setStartPoint] = useState();
  const [endPoint, setEndPoint] = useState();

  const polyline = require("@mapbox/polyline");

  const decodedCoordinates = polyline.decode(arrCoodinate);

  const reverseCoordinates = (coordinates) => {
    return coordinates.map((coord) => [coord[1], coord[0]]);
  };

  const mapboxApiKey =
    "pk.eyJ1IjoidHVhbjJrMXR2IiwiYSI6ImNsaWlkN3Z2dzF5MjEzZXBmNmNybzUwMTQifQ.1-igydy5eIwov_1pryiTVA";
  const startCoords = startPoint;
  const endCoords = endPoint;

  const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?access_token=${mapboxApiKey}`;
  let clickCount;

  map.on("click", (e) => {
    const coordinates = [e.lngLat.lng, e.lngLat.lat];

    if (clickCount === 0) {
      setStartPoint(coordinates);
      console.log("Start Point:", coordinates);
    } else if (clickCount === 1) {
      setEndPoint(coordinates);
      console.log("End Point:", coordinates);
    }

    clickCount = (clickCount + 1) % 2;
  });

  if (startPoint && endPoint) {
    axios
      .get(apiUrl)
      .then((response) => {
        setArrCoodinate(response.data.routes[0].geometry);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu đường đi:", error);
      });
  }
  console.log(decodedCoordinates);
  if (map) {
    map.on("load", () => {
      if (map.getLayer("routel1")) {
        map.getSource("route2").setData({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: reverseCoordinates(decodedCoordinates),
          },
        });
      } else {
        map.addSource("route2", {
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
          source: "route2",
          paint: {
            "line-color": "blue",
            "line-width": 8,
          },
        });
      }
    });
  }
  return <div></div>;
};
