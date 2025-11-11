export const fetchCoordinates = async (
	address: string
): Promise<[number, number] | null> => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
				address
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
