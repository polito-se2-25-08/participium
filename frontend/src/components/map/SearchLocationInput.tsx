import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";
import type { MarkerI } from "../../interfaces/components/Marker";
import { fetchCoordinates } from "../../action/mapAction";

const ZOOM = import.meta.env.VITE_MAP_ZOOM;

interface SearchLocationInputProps {
  setMarker: React.Dispatch<React.SetStateAction<MarkerI | null>>;
}
export default function SearchLocationInput({
  setMarker,
}: SearchLocationInputProps) {
  const map = useMap();
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (divRef.current) {
      L.DomEvent.disableClickPropagation(divRef.current);
    }
  }, []);

  const handleSearch = async () => {
    const address = inputRef.current?.value;
    if (address) {
      const coords = await fetchCoordinates(address);
      if (coords) {
        map.setView(coords, ZOOM);
        const newMarker: MarkerI = {
          title: "New Marker",
          timestamp: new Date().toISOString(),
          anonymity: true,
          category: "Category A",
          userId: "user123",
          status: "Pending approval",
          position: coords,
          adress: "",
        };

        setMarker(newMarker);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        top: "10px",
        left: "50px",
        zIndex: 1000,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        name="address"
        placeholder="Search location..."
        style={{ padding: "5px", marginRight: "5px" }}
        onKeyPress={handleKeyPress}
      />
      <button type="button" onClick={handleSearch}>Search</button>
    </div>
  );
}
