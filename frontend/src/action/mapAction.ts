import type { MarkerI } from "../interfaces/components/MarkerI";

const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api";

export const fetchCoordinates = async (
	address: string
): Promise<[number, number] | null> => {
	try {
		const searchQuery =
			address.toLowerCase().includes("torino") ||
			address.toLowerCase().includes("turin")
				? address
				: `${address}, Torino, Italy`;
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
				searchQuery
			)}`
		);
		const data = await response.json();
		if (data && data.length > 0) {
			const { lat, lon } = data[0];
			return [parseFloat(lat), parseFloat(lon)];
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error fetching coordinates:", error);
		alert("An error occurred while fetching coordinates.");
		return null;
	}
};

export const fetchAddressByCoordinates = async (
	lat: number,
	lng: number
): Promise<string> => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
		);
		const data = await response.json();
		if (data && data.display_name) {
			return data.display_name;
		} else {
			return "Address not found";
		}
	} catch (error) {
		console.error("Error fetching address:", error);
		return "Address not found";
	}
};

export const fetchActiveReports = async (): Promise<MarkerI[]> => {
	try {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_ENDPOINT}/reports/active`, {
      	headers: { 
        "Content-Type": "application/json",
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
		if (!response.ok) {
			throw new Error("Failed to fetch active reports");
		}
		const jsonResponse = await response.json();
		const data: MarkerI[] = jsonResponse.data || [];
		return data;
	} catch (error) {
		console.error("Error fetching active reports:", error);
		return [];
	}

}