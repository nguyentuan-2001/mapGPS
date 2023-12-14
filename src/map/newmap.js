import React, { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import axios from "axios";

export const NewMap = () => {
  const [arrCoodinate, setArrCoodinate] = useState("");
  const [startPoint, setStartPoint] = useState();
  const [endPoint, setEndPoint] = useState();

  const polyline = require("@mapbox/polyline");

  const decodedCoordinates = polyline.decode(arrCoodinate);
  console.log(decodedCoordinates);
  const reverseCoordinates = (coordinates) => {
    return coordinates.map((coord) => [coord[1], coord[0]]);
  };

  const mapboxApiKey =
    "pk.eyJ1IjoidHVhbjJrMXR2IiwiYSI6ImNsaWlkN3Z2dzF5MjEzZXBmNmNybzUwMTQifQ.1-igydy5eIwov_1pryiTVA";
  const startCoords = startPoint;
  const endCoords = endPoint;

  const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?access_token=${mapboxApiKey}`;
  let map;
  useEffect(() => {
    map = new maplibregl.Map({
      container: "map",
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      center: [105.843484, 21.005532],
      zoom: 14,
      hash: "map",
    });
    let clickCount = 0;

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
    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [105.86273434052822, 20.996365402052348],
              [105.86604329914258, 20.995619353137855],
            ],
          },
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "red",
          "line-width": 8,
        },
      });

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

    return () => map.remove();
  }, [arrCoodinate, endPoint]);

  // useEffect(() => {}, [ endPoint]);

  //   useEffect(() => {

  //   const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/105.86273434052822, 20.996365402052348;105.86604329914258, 20.995619353137855.json?overview=false&alternatives=true&waypoints_per_route=true&engine=electric&ev_initial_charge=600&ev_max_charge=50000&ev_connector_types=ccs_combo_type1,ccs_combo_type2&energy_consumption_curve=0,300;20,160;80,140;120,180&ev_charging_curve=0,100000;40000,70000;60000,30000;80000,10000&ev_min_charge_at_charging_station=1&access_token=pk.eyJ1IjoidHVhbjJrMXR2IiwiYSI6ImNsaWlkN3Z2dzF5MjEzZXBmNmNybzUwMTQifQ.1-igydy5eIwov_1pryiTVA`;

  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       console.log("API Response:", response.data.routes[0]);
  //       // const routeData = response.data.routes[0].geometry.coordinates;
  //       // console.log("Dữ liệu đường đi:", routeData);
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi lấy dữ liệu đường đi:", error);
  //     });
  //   //   }, []);

  return (
    <div className="main__map">
      <div id="map" />
    </div>
  );
};
