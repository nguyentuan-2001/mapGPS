import logo from "./logo.svg";
import "./App.css";
import { NewMap } from "./map/newmap";
import { MapProvider } from "./contexts/mapcontext";

function App() {
  return (
    <MapProvider>
      <NewMap />
    </MapProvider>
  );
}

export default App;
