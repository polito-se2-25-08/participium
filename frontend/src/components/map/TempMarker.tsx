import { useState } from "react";
import type { MarkerI } from "../interfaces/components/Marker";
import { Marker, Popup } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import { fetchAddressByCoordinates } from "../action/MapAction";

interface TempMarkerProps {
  tempMarker: MarkerI | null;
  setTempMarker: React.Dispatch<React.SetStateAction<MarkerI | null>>;
}
export default function TempMarker({
  tempMarker,
  setTempMarker,
}: TempMarkerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getAddress = async (e: LeafletMouseEvent) => {
    setIsLoading(true);
    const { lat, lng } = e.latlng;
    const address = await fetchAddressByCoordinates(lat, lng);

    setTempMarker((prev) => (prev ? { ...prev, adress: address } : prev));
    setIsLoading(false);
  };

  return tempMarker === null ? null : (
    <Marker
      eventHandlers={{
        click: (e) => {
          getAddress(e);
        },
      }}
      position={tempMarker.position}
    >
      <Popup>{isLoading ? "Loading..." : tempMarker.adress}</Popup>
    </Marker>
  );
}
