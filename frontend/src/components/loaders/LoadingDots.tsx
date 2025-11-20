export default function LoadingDots() {
	return (
		<div className="flex justify-center items-center gap-1 h-6 ">
			<div className="w-3.5 h-3.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
			<div className="w-3.5 h-3.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
			<div className="w-3.5 h-3.5 bg-white rounded-full animate-bounce"></div>
		</div>
	);
}
