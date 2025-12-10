export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () => {
			const result = reader.result as string;
			const base64 = result.split(",")[1];
			resolve(base64);
		};

		reader.onerror = reject;

		reader.readAsDataURL(file);
	});
}

export const formatTimestamp = (timestamp: string) => {
	if (!timestamp) return "";
	const date = new Date(timestamp);
	const now = new Date();

	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	return isToday
		? date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
		  })
		: date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
};
