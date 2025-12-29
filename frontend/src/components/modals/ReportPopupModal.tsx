import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface ReportPopupModalProps {
	isOpen: boolean;
	onClose: () => void;
	header: React.ReactNode;
	children: React.ReactNode;
}

export default function ReportPopupModal({
	isOpen,
	onClose,
	header,
	children,
}: ReportPopupModalProps) {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[99999] flex items-center justify-center"
			role="dialog"
			aria-modal="true"
		>
			<button
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				aria-label="Close report details"
			/>
			<div className="relative w-11/12 max-w-4xl max-h-[90vh] rounded-xl shadow-xl border border-gray-600 bg-white flex flex-col overflow-hidden">
				<div className="flex flex-row items-center justify-between p-6 border-b border-gray-200">
					<div className="flex flex-col min-w-0 flex-1 gap-1">{header}</div>
					<button
						onClick={onClose}
						className="border rounded-full p-3 flex items-center justify-center hover:cursor-pointer"
						aria-label="Close"
					>
						<FontAwesomeIcon icon={faX} />
					</button>
				</div>

				<div className="p-6 overflow-y-auto min-h-0">{children}</div>
			</div>
		</div>
	);
}
