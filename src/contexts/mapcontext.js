import React, { ReactNode, createContext, useState } from "react";

const MapContext = createContext(undefined);

const MapProvider = ({ children }) => {
  const [isCoordinate, setIsCoordinate] = useState();

  const contextValue = {
    isCoordinate,
    setIsCoordinate,
  };

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
};

export { MapProvider, MapContext };
