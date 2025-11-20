import { MapContainer, TileLayer } from "react-leaflet";

import type { MarkerI } from "../interfaces/components/Marker";
import { useState } from "react";

import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClickHandler";
import SearchLocationInput from "./SearchLocationInput";
import TempMarker from "./TempMarker";

const ZOOM = 13;

interface ReportMapViewProps {
  className?: string;
  scrollWheelZoom?: boolean;
  isReport?: boolean;
  setAdress?: React.Dispatch<React.SetStateAction<string>>;
  setLocation?: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

export function MapWindow({
  className,
  scrollWheelZoom = true,
  isReport = false,
  setAdress,
  setLocation,
}: ReportMapViewProps) {
  const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);

  return (
    <MapContainer
      center={[45.0703, 7.6869]}
      zoom={ZOOM}
      className={className}
      scrollWheelZoom={scrollWheelZoom}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler
        tempMarker={tempMarker}
        setTempMarker={setTempMarker}
        setAdress={setAdress}
        setLocation={setLocation}
      />
      {isReport && <SearchLocationInput setMarker={setTempMarker} />}

      <TempMarker tempMarker={tempMarker} setTempMarker={setTempMarker} />
    </MapContainer>
  );
}
