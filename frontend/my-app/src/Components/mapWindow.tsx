import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
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

//Once an API file is added this function should be moved there
//Given a position returns the address
const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        return (data.display_name); // Set the address from the response
      } else {
        return ("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return ("Address not found");
    }
    };

// Component to display address with lazy loading
function AddressDisplay({ lat, lng }: { lat: number; lng: number }) {
    const [address, setAddress] = useState<string>("Loading...");

    useEffect(() => {
        const fetchAndSetAddress = async () => {
            const fetchedAddress = await fetchAddress(lat, lng);
            setAddress(fetchedAddress);
        };
        fetchAndSetAddress();
    }, [lat, lng]);

    return <>{address}</>;
}

//Given an address returns the coordinates
const fetchCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0]; // Get the first result
        return ([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("No results found for the given address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("An error occurred while fetching coordinates.");
    }
  };

export function MapWindow() {
    const [markerList, setMarkers] = useState<Marker[]>([]);
    const [temporaryMarkerPosition, setTemporaryMarkerPosition] = useState<[number, number] | null>(null);

    // Dummy values, need to be replaced with real data from backend (useEffect...)
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
        // TODO: fetch markers from backend
        setTimeout(() => {
            setMarkers(markers);
        }, 2000);
    }, []);

    //TODO: if position found is not in Turin area, show alert
    const searchPosition = async (address: string, map: L.Map) => {
        const coords = await fetchCoordinates(address);
        if (coords) {
            map.setView(coords as [number, number], 13); // Use the map instance here
            setTemporaryMarkerPosition(coords as [number, number]);
        }
    };

    const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        // Should open a panel to create a new report at the clicked position
        if(temporaryMarkerPosition) {
            setTemporaryMarkerPosition(null);
            return;
        }
        const { lat, lng } = e.latlng;
        setTemporaryMarkerPosition([lat, lng]);
      },
    });
    return null; // This component does not render anything
  };
    //TODO: style the form and move it in the css
    const MapFormHandler = () => {
        const map = useMap(); // Get the map instance here
        const formRef = useRef<HTMLFormElement>(null);

        useEffect(() => {
            if (formRef.current) {
                // Disable click propagation to prevent map clicks when interacting with the form
                L.DomEvent.disableClickPropagation(formRef.current);
            }
        }, []);

        return (
            <form
                ref={formRef}
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const address = formData.get("address") as string;
                    if (address) {
                        searchPosition(address, map); // Pass the map instance to searchPosition
                    }
                }}
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
                    type="text"
                    name="address"
                    placeholder="Search location..."
                    style={{ padding: "5px", marginRight: "5px" }}
                />
                <button type="submit">Search</button>
            </form>
        );
    };

    return (
        <MapContainer center={[45.0703, 7.6869]} zoom={13} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapFormHandler />
            <MapClickHandler />
            <MarkerList markers={markerList} />
            {temporaryMarkerPosition && (
                <Marker position={temporaryMarkerPosition}>
                    <Popup>
                        <h3>
                            <AddressDisplay
                                lat={temporaryMarkerPosition[0]}
                                lng={temporaryMarkerPosition[1]}
                            />
                        </h3>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

function MarkerList({ markers }: MarkerListProps) {
        return (
            <>
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position}>
                        <Popup>
                            <h3>
                                <AddressDisplay
                                    lat={marker.position[0]}
                                    lng={marker.position[1]}
                                />
                            </h3>
                            {marker.title}<br />    
                            Category: {marker.category}<br />
                            Status: {marker.status}<br />
                            {!marker.anonymity && <>Reported by: {marker.userId}<br /></>}
                            Reported time:{new Date(marker.timestamp).toLocaleString()}<br />
                        </Popup>
                    </Marker>
                ))}
            </>
        );
}
