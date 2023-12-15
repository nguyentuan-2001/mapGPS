import maplibregl, { Map } from "maplibre-gl";

export const createMap = () => {
  const map = new maplibregl.Map({
    container: "map",
    style:
      "https://api.maptiler.com/maps/fefc1891-4e0d-4102-a51f-09768f839b85/style.json?key=S1qTEATai9KydkenOF6W",
    center: [105.84513, 21.005532],
    zoom: 17,
    hash: "map",
  });

  return map;
};
