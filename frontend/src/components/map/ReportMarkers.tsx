import { useState } from "react";
import type { MarkerI } from "../../interfaces/components/MarkerI";
import {Marker, Popup} from "leaflet"

interface MarkerListProps {
  Markers: MarkerI[] | null;
  setMarkers: React.Dispatch<React.SetStateAction<MarkerI[] | null>>;
}

export function ReportMarkers({
  Markers,
  setMarkers,
}: MarkerListProps) {
  const [isLoading, setIsLoading] = useState(false);
    return Markers === null ? null : (
        <p>TODO</p>
    );
}

