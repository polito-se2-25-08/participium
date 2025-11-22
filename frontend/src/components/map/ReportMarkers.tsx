import { useEffect} from "react";
import type { MarkerI } from "../../interfaces/components/MarkerI";
import { divIcon, point } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { fetchActiveReports } from "../../action/mapAction";
import  MarkerClusterGroup  from "react-leaflet-cluster";

interface MarkerListProps {
  Markers: MarkerI[] | null;
  setMarkers: React.Dispatch<React.SetStateAction<MarkerI[] | null>>;
}

export function ReportMarkers({
  Markers,
  setMarkers,
}: MarkerListProps) {

  /* useEffect(
    () => {
      fetchActiveReports().then((data) => {
        setMarkers(data);
      });
    }
  ,[]); */

  // Example markers in Turin
  const exampleMarkers: MarkerI[] = [
    {
      title: "Water Leakage",
      timestamp: new Date().toISOString(),
      anonymity: false,
      category: "water issue",
      userId: "exampleUser1",
      status: "active",
      position: [45.0703, 7.6869],
      adress: "Piazza Castello, Turin",
    },
    {
      title: "Broken Streetlight",
      timestamp: new Date().toISOString(),
      anonymity: true,
      category: "lighting issue",
      userId: "exampleUser2",
      status: "active",
      position: [45.0677, 7.6825],
      adress: "Mole Antonelliana, Turin",
    },
    {
      title: "Park Bench Damaged",
      timestamp: new Date().toISOString(),
      anonymity: false,
      category: "public furniture",
      userId: "exampleUser3",
      status: "active",
      position: [45.0637, 7.6616],
      adress: "Parco del Valentino, Turin",
    },
    {
      title: "Train Station Graffiti",
      timestamp: new Date().toISOString(),
      anonymity: true,
      category: "vandalism",
      userId: "exampleUser4",
      status: "active",
      position: [45.0761, 7.6698],
      adress: "Porta Susa, Turin",
    },
  ];

  // Set example markers if Markers is null
  useEffect(() => {
    if (Markers === null) {
      setMarkers(exampleMarkers);
    }
  }, [Markers, setMarkers]);

  const createIcon = (cluster) => {
    return divIcon({
      html: `<div class="flex items-center justify-center rounded-full bg-amber-500/25 w-25 h-25 transform -translate-x-10 -translate-y-10 text-xl font-bold">${cluster.getChildCount()}</div>`,
      iconSize: point(60, 60, true),
      className: '',
    });
  };

  if (Markers === null) return null;

  return (
    <MarkerClusterGroup 
    chunkedLoading 
    iconCreateFunction={createIcon}>
      {Markers.map((marker, idx) => (
        <Marker key={idx} position={marker.position}>
          <Popup>
            <h2>{marker.title}</h2>
            <p>{marker.adress}</p>
            <p>{marker.timestamp}</p>
            <p>{marker.category}</p>
            {marker.anonymity ? <p>Reported Anonymously</p> : <p>Reported by User: {marker.userId}</p>}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}


