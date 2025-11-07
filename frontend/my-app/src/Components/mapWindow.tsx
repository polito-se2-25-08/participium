import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

//Might need to adjust it later
interface Marker {
    title: string;
    timestamp: string;
    anonymity: boolean;
    category: string;
    userId: string;
    status: string;
    position: [number, number];
} 
interface MarkerListProps {
        markers: Marker[];
}

export function MapWindow() {
    const  [markerList, setMarkers]  = useState<Marker[]>([]);
    //dummy values, need to be replaced with real data from backend (useEffect...)
    const markers: Marker[] = [
        {
            title: "Report 1",
            timestamp: "2024-06-01T12:00:00Z",
            anonymity: true,
            category: "Category A",
            userId: "user123",
            status: "Pending approval",
            position: [45.0703, 7.6869],
        },
        {
            title: "Report 2",
            timestamp: "2024-06-02T15:30:00Z",
            anonymity: false,
            category: "Category B",
            userId: "user456",
            status: "Suspended",
            position: [45.0713, 7.6879],
        },
        {
            title: "Report 3",
            timestamp: "2024-06-03T09:45:00Z",
            anonymity: true,
            category: "Category C",
            userId: "user789",
            status: "Resolved",
            position: [45.0723, 7.6889],
        },
    ];

    useEffect(() => {
        setTimeout(() => {
            setMarkers(markers);
        }, 2000);
    }, []);

    return (
        <MapContainer center={[45.0703, 7.6869]} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerList markers={markerList} />
        </MapContainer>
    );
}

function MarkerList({ markers }: MarkerListProps) {
        return (
            <>
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position}>
                        <Popup>
                            {marker.title}<br />    
                            Category: {marker.category}<br />
                            Status: {marker.status}<br />
                            {!marker.anonymity && <>Reported by: {marker.userId}</>}<br />
                            {new Date(marker.timestamp).toLocaleString()}<br />
                        </Popup>
                    </Marker>
                ))}
            </>
        );
}
