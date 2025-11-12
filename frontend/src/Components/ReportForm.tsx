import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ReportCategory, Location } from "../types";
import {
	REPORT_CATEGORIES,
	MAX_PHOTOS_PER_REPORT,
	MIN_PHOTOS_PER_REPORT,
} from "../constants";

import "./ReportForm.css";
import ReportMapView from "./ReportMapView";

// Turin boundary coordinates (approximate metropolitan area)
const TURIN_BOUNDS = {
	north: 45.2,
	south: 44.9,
	east: 7.9,
	west: 7.4,
};

// Helper function to check if coordinates are within Turin bounds
const isWithinTurinBounds = (lat: number, lng: number): boolean => {
	return (
		lat >= TURIN_BOUNDS.south &&
		lat <= TURIN_BOUNDS.north &&
		lng >= TURIN_BOUNDS.west &&
		lng <= TURIN_BOUNDS.east
	);
};

interface ReportFormData {
	title: string;
	description: string;
	category: ReportCategory | "";
	photos: File[];
	location: Location | null;
	address: string;
	anonymous: boolean;
}

const ReportForm = () => {
	const [formData, setFormData] = useState<ReportFormData>({
		title: "",
		description: "",
		category: "",
		photos: [],
		location: null,
		address: "",
		anonymous: false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = (
		e: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);

		if (formData.photos.length + files.length > MAX_PHOTOS_PER_REPORT) {
			setErrors((prev) => ({
				...prev,
				photos: `Maximum ${MAX_PHOTOS_PER_REPORT} photos allowed`,
			}));
			return;
		}

		setFormData((prev) => ({
			...prev,
			photos: [...prev.photos, ...files],
		}));
		setErrors((prev) => ({ ...prev, photos: "" }));
	};

	const removePhoto = (index: number) => {
		setFormData((prev) => ({
			...prev,
			photos: prev.photos.filter((_, i) => i !== index),
		}));
	};

	const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			anonymous: e.target.checked,
		}));
	};

	const handleLocationSelect = (location: Location, address: string) => {
		// Validate that the location is within Turin bounds
		if (!isWithinTurinBounds(location.latitude, location.longitude)) {
			setErrors((prev) => ({
				...prev,
				address:
					"The selected location is outside Turin. Please select a location within Turin city limits.",
			}));
			return;
		}

		setFormData((prev) => ({
			...prev,
			location,
			address,
		}));
		// Clear address error when valid location is selected
		if (errors.address) {
			setErrors((prev) => ({ ...prev, address: "" }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		} else if (formData.description.length > 2000) {
			newErrors.description =
				"Description must be less than 2000 characters";
		}

		if (!formData.category) {
			newErrors.category = "Category is required";
		}

		if (formData.photos.length < MIN_PHOTOS_PER_REPORT) {
			newErrors.photos = `At least ${MIN_PHOTOS_PER_REPORT} photo is required`;
		}

		if (!formData.address.trim()) {
			newErrors.address = "Address is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			console.log("Form submitted:", formData);
			// TODO: Submitting to backend side
			alert("Report submitted successfully!");
		}
	};

	return (
		<div className="report-form-container">
			<h2>Submit a Report</h2>
			<p className="form-subtitle">Report an issue in your area</p>

			<form onSubmit={handleSubmit} className="report-form">
				<section className="form-section">
					<h3>Location Information</h3>

					<div className="form-group">
						<label htmlFor="address">Address</label>
						<input
							type="text"
							id="address"
							name="address"
							value={formData.address}
							readOnly
							placeholder="Click on the map below to select a location"
							className={errors.address ? "error" : ""}
						/>
						{errors.address && (
							<span className="error-message">
								{errors.address}
							</span>
						)}
						<p className="field-hint">
							Click on the map to select a location and auto-fill
							the address
						</p>
					</div>

					<ReportMapView
						onLocationSelect={handleLocationSelect}
						height="350px"
					/>
				</section>

				<section className="form-section">
					<h3>Report Details</h3>

					<div className="form-group">
						<label htmlFor="category">Category</label>
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleInputChange}
							className={errors.category ? "error" : ""}
						>
							<option value="">Select a category</option>
							{REPORT_CATEGORIES.map((cat) => (
								<option key={cat.value} value={cat.value}>
									{cat.label}
								</option>
							))}
						</select>
						{errors.category && (
							<span className="error-message">
								{errors.category}
							</span>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleInputChange}
							placeholder="Brief title for the issue"
							maxLength={200}
							className={errors.title ? "error" : ""}
						/>
						{errors.title && (
							<span className="error-message">
								{errors.title}
							</span>
						)}
						<p className="field-hint">Maximum 200 characters</p>
					</div>

					<div className="form-group">
						<label htmlFor="description">
							Detailed Description
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Provide a detailed description of the issue (max 2000 characters)"
							rows={6}
							maxLength={2000}
							className={errors.description ? "error" : ""}
						/>
						<div className="char-counter">
							{formData.description.length}/2000 characters
						</div>
						{errors.description && (
							<span className="error-message">
								{errors.description}
							</span>
						)}
					</div>
				</section>

				<section className="form-section">
					<h3>Photos</h3>
					<p className="field-hint">
						Upload at least {MIN_PHOTOS_PER_REPORT} photo, maximum{" "}
						{MAX_PHOTOS_PER_REPORT} photos
					</p>

					<div className="photo-upload-area">
						<input
							type="file"
							id="photo-upload"
							accept="image/*"
							multiple
							onChange={handlePhotoUpload}
							style={{ display: "none" }}
						/>
						<label htmlFor="photo-upload" className="upload-button">
							Add Photos
						</label>
						{errors.photos && (
							<span className="error-message">
								{errors.photos}
							</span>
						)}
					</div>

					{formData.photos.length > 0 ? (
						<div className="photo-preview-grid">
							{formData.photos.map((file, index) => (
								<div key={index} className="photo-preview">
									<img
										src={URL.createObjectURL(file)}
										alt={`Preview ${index + 1}`}
									/>
									<button
										type="button"
										className="remove-photo"
										onClick={() => removePhoto(index)}
									>
										✕
									</button>
								</div>
							))}
						</div>
					) : (
						<div className="no-photos">
							<p>No photos added yet</p>
						</div>
					)}
				</section>

				<section className="form-section">
					<h3>Privacy Options</h3>

					<div className="checkbox-group">
						<label className="checkbox-label">
							<input
								type="checkbox"
								checked={formData.anonymous}
								onChange={handleCheckboxChange}
							/>
							<span>Submit this report anonymously</span>
						</label>
						<p className="field-hint">
							If checked, your name will not be visible in the
							public report list
						</p>
					</div>
				</section>

				<div className="form-actions">
					<button type="submit" className="submit-button">
						Submit Report
					</button>
				</div>
			</form>
		</div>
	);
};

export default ReportForm;
