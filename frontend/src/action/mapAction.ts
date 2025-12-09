import type { MarkerI } from "../interfaces/components/MarkerI";
import barrierIcon from "../assets/markers/architectural_barriers.svg";
import waterIcon from "../assets/markers/drinking_water.svg";
import otherIcon from "../assets/markers/other.svg";
import playIcon from "../assets/markers/playground.svg";
import lightIcon from "../assets/markers/public_lights.svg";
import roadIcon from "../assets/markers/road_sign.svg";
import sewerIcon from "../assets/markers/sewer.svg";
import furnishingIcon from "../assets/markers/urban_furnishing.svg";
import wasteIcon from "../assets/markers/waste.svg";
import type { ApiResponse } from "../interfaces/dto/Response";
import type { ReportMapI } from "../interfaces/dto/report/NewReportResponse";
import type { ApiResponse } from "../interfaces/dto/Response";

//wip = rgb(29.8% 72.2% 31.4%)
//assigned = rgb(93.3% 86.3% 23.5%)
//suspended = rgb(65.5% 65.5% 65.5%)

const API_ENDPOINT =
	import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api";

export const chooseIcon = (category: string, status: string) => {
	switch (category) {
		case "Water Supply - Drinking Water":
			switch (status) {
				case "ASSIGNED":
					return waterIconAssigned;
				case "IN_PROGRESS":
					return waterIconWip;
				case "SUSPENDED":
					return waterIconSuspended;
				default:
					return waterIconAssigned;
			}
		case "Architectural Barriers":
			switch (status) {
				case "ASSIGNED":
					return barrierIconAssigned;
				case "IN_PROGRESS":
					return barrierIconWip;
				case "SUSPENDED":
					return barrierIconSuspended;
				default:
					return barrierIconAssigned;
			}
		case "Sewer System":
			switch (status) {
				case "ASSIGNED":
					return sewerIconAssigned;
				case "IN_PROGRESS":
					return sewerIconWip;
				case "SUSPENDED":
					return sewerIconSuspended;
				default:
					return sewerIconAssigned;
			}
		case "Public Lighting":
			switch (status) {
				case "ASSIGNED":
					return lightIconAssigned;
				case "IN_PROGRESS":
					return lightIconWip;
				case "SUSPENDED":
					return lightIconSuspended;
				default:
					return lightIconAssigned;
			}
		case "Waste":
			switch (status) {
				case "ASSIGNED":
					return wasteIconAssigned;
				case "IN_PROGRESS":
					return wasteIconWip;
				case "SUSPENDED":
					return wasteIconSuspended;
				default:
					return wasteIconAssigned;
			}
		case "Road Signs and Traffic Lights":
			switch (status) {
				case "ASSIGNED":
					return roadIconAssigned;
				case "IN_PROGRESS":
					return roadIconWip;
				case "SUSPENDED":
					return roadIconSuspended;
				default:
					return roadIconAssigned;
			}
		case "Roads and Urban Furnishing":
			switch (status) {
				case "ASSIGNED":
					return furnishingIconAssigned;
				case "IN_PROGRESS":
					return furnishingIconWip;
				case "SUSPENDED":
					return furnishingIconSuspended;
				default:
					return furnishingIconAssigned;
			}
		case "Public Green Areas and Playgrounds":
			switch (status) {
				case "ASSIGNED":
					return playIconAssigned;
				case "IN_PROGRESS":
					return playIconWip;
				case "SUSPENDED":
					return playIconSuspended;
				default:
					return playIconAssigned;
			}
		case "Other":
		default:
			switch (status) {
				case "ASSIGNED":
					return otherIconAssigned;
				case "IN_PROGRESS":
					return otherIconWip;
				case "SUSPENDED":
					return otherIconSuspended;
				default:
					return otherIconAssigned;
			}
	}
};

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

export const fetchActiveReports = async (): Promise<
	ApiResponse<ReportMapI[]>
> => {
	try {
		const token = localStorage.getItem("token");
		const response = await fetch(`${API_ENDPOINT}/reports/active`, {
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
			},
		});
		if (!response.ok) {
			throw new Error("Failed to fetch active reports");
		}

		const data = await response.json();

		return data;
	} catch (error) {
		return {
			success: false,
			data: {
				message: "Failed to fetch active reports",
			},
		};
	}
};
