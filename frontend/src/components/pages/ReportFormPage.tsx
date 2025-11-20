import { useState, type FormEvent } from "react";

import Form from "../form/Form";
import PageTitle from "../titles/PageTitle";
import SubTitle from "../titles/SubTitle";
import Input from "../input/Input";

import { MapWindow } from "../../map/MapWindow";
import ReportCardContainer from "../containers/ReportCardContainer";
import Select from "../selects/Select";
import TextArea from "../textarea/TextArea";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";

export default function ReportFormPage() {
  const [selectedAdress, setSelectedAddress] = useState<string>("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-4 p-5 w-1/2">
      <PageTitle>Submit a Report</PageTitle>
      <p className="opacity-50 text-center">Report an issue in your area</p>

      <Form onSubmit={handleSubmit} className="gap-3">
        <ReportCardContainer>
          <SubTitle>Location Information</SubTitle>
          <Input
            name="address"
            type="text"
            id="address"
            hasLabel
            label="Address"
            placeholder="Click the map below to select a location..."
            disabled
            value={selectedAdress}
            required
          />

          <p className="opacity-50">
            Click on the map to select a location and auto-fill the address
          </p>

          <MapWindow
            scrollWheelZoom={false}
            setAdress={setSelectedAddress}
            className="min-h-[350px] w-full"
          />
        </ReportCardContainer>

        <ReportCardContainer>
          <SubTitle>Report Information</SubTitle>
          <p className="opacity-50">
            Please provide all relevant information about the issue
          </p>

          <Select
            id="category"
            name="category"
            value={"0"}
            className=""
            onChange={() => {}}
            hasLabel
            label="Category"
            placeholder="Select a category"
            required
          />

          <Input
            name="title"
            type="text"
            id="title"
            hasLabel
            label="Title"
            placeholder="Enter a title"
            value={""}
            required
          />

          <TextArea
            value={""}
            onChange={() => {}}
            hasLabel
            label="Description"
            placeholder="Provide a detailed description of the issue (max 2000 characters)"
            required
          />
        </ReportCardContainer>

        {/*
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
				*/}
        <PrimaryButton type="submit">Submit Report</PrimaryButton>
      </Form>
    </div>
  );
}
