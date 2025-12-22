import { useEffect, useState } from "react";

import { addApiDownListener, addApiUpListener } from "../utils/apiDown";

export function ApiDownToast() {
	const [visible, setVisible] = useState(false);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		const removeDown = addApiDownListener(() => {
			if (!dismissed) setVisible(true);
		});
		const removeUp = addApiUpListener(() => {
			setVisible(false);
			setDismissed(false);
		});
		return () => {
			removeDown();
			removeUp();
		};
	}, [dismissed]);

	if (!visible) return null;

	return (
		<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
			<div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<p className="text-sm font-medium text-gray-900">
							Service unavailable
						</p>
						<p className="text-sm text-gray-600 mt-1">
							The server is unreachable right now. Please try again later.
						</p>
					</div>
					<button
						onClick={() => {
							setVisible(false);
							setDismissed(true);
						}}
						className="text-gray-400 hover:text-gray-600"
						aria-label="Dismiss"
					>
						✕
					</button>
				</div>
			</div>
		</div>
	);
}
