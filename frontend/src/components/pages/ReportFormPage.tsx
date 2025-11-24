import {
  startTransition,
  useActionState,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import Form from "../form/Form";
import PageTitle from "../titles/PageTitle";
import SubTitle from "../titles/SubTitle";
import Input from "../input/Input";

import ReportCardContainer from "../containers/ReportCardContainer";
import Select from "../selects/Select";
import TextArea from "../textarea/TextArea";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import {
  MAX_PHOTOS_PER_REPORT,
  MIN_PHOTOS_PER_REPORT,
  REPORT_CATEGORIES,
} from "../../constants";
import { submitReport } from "../../action/reportAction";
import { MapWindow } from "../map/MapWindow";
import ContentContainer from "../containers/ContentContainer";
import CheckInput from "../input/variants/CheckInput";
import FileInput from "../input/variants/FileInput";

export default function ReportFormPage() {
  const navigate = useNavigate();
  const [selectedAdress, setSelectedAddress] = useState<string>("");
  const [location, setLocation] = useState<[number, number] | null>(null);

  const [addressError, setAddressError] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<boolean>(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const [state, formAction, isPending] = useActionState(submitReport, null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const categoryValue = formData.get("category")?.toString() ?? "";
    const titleValue = formData.get("title")?.toString() ?? "";
    const descriptionValue = formData.get("description")?.toString() ?? "";

    const addressHasError = selectedAdress === "";
    const categoryHasError = categoryValue === "";
    const titleHasError = titleValue === "";
    const descriptionHasError = descriptionValue === "";

    if (
      photos.length < MIN_PHOTOS_PER_REPORT ||
      photos.length > MAX_PHOTOS_PER_REPORT
    ) {
      setPhotoError(true);
    }

    setAddressError(addressHasError);
    setCategoryError(categoryHasError);
    setTitleError(titleHasError);
    setDescriptionError(descriptionHasError);

    if (
      addressHasError ||
      categoryHasError ||
      titleHasError ||
      descriptionHasError ||
      photoError
    )
      return;

    formData.append("address", selectedAdress);
    photos.forEach((file) => {
      formData.append("photos", file);
    });

    if (location) {
      formData.append("latitude", location[0].toString());
      formData.append("longitude", location[1].toString());
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state === null) {
      return;
    }
    
    if (state.success) {
      alert("Report submitted successfully!");
      setSelectedAddress("");
      setLocation(null);
      setPhotos([]);
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      // Show error message if submission failed
      const errorMessage = (state.data as any)?.message || "Failed to submit report. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  }, [state, navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAddressError(false);
      setCategoryError(false);
      setDescriptionError(false);
      setTitleError(false);
      setPhotoError(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [addressError, categoryError, descriptionError, titleError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    const combinedFiles = [...photos, ...newFiles];

    if (combinedFiles.length > MAX_PHOTOS_PER_REPORT) {
      return;
    }

    setPhotos(combinedFiles);
  };

  return (
    <ContentContainer
      width="xl:w-1/2 sm:w-1/2 "
      gap="xl:gap-4 sm:gap-2"
      padding="p-5"
    >
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
            required
            value={selectedAdress}
            showError={addressError}
            pending={isPending}
            onChange={() => {}}
          />

          <p className="opacity-50">
            Click on the map to select a location and auto-fill the address
          </p>

          <MapWindow
            scrollWheelZoom={false}
            setAdress={setSelectedAddress}
            setLocation={setLocation}
            className="min-h-[350px] w-full"
            isReport={true}
          />
        </ReportCardContainer>

        <ReportCardContainer>
          <SubTitle>Report Information</SubTitle>
          <p className="opacity-50">
            Please provide all relevant information about the issue
          </p>

          <Input
            name="title"
            type="text"
            id="title"
            hasLabel
            label="Title"
            placeholder="Enter a title"
            required
            showError={titleError}
            pending={isPending}
          />

          <Select
            id="category"
            name="category"
            className=""
            hasLabel
            label="Category"
            placeholder="Select a category"
            required
            options={REPORT_CATEGORIES}
            showError={categoryError}
            pending={isPending}
          />

          <TextArea
            id="description"
            name="description"
            hasLabel
            label="Description"
            placeholder="Provide a detailed description of the issue (max 2000 characters)"
            required
            showError={descriptionError}
            pending={isPending}
          />
        </ReportCardContainer>

        <ReportCardContainer>
          <SubTitle>Photos</SubTitle>
          <p className="opacity-50">
            Upload at least {MIN_PHOTOS_PER_REPORT} photo, maximum
            {MAX_PHOTOS_PER_REPORT} photos
          </p>

          <FileInput
            name="report_photos"
            id="photo-upload"
            accept="image/*"
            multiple
            hasLabel
            label="Photos"
            placeholder="Upload photos"
            required
            showError={photoError}
            onChange={handleFileChange}
            pending={isPending}
          />

          {photos.length > 0 ? (
            <div className="flex gap-2">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(photo)}
                  alt={photo.name}
                  className="w-32 h-32 object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="opacity-50">No photos uploaded yet</p>
          )}
        </ReportCardContainer>

        <ReportCardContainer>
          <SubTitle>Privacy options</SubTitle>

          <div className="flex flex-row gap-3 items-center justify-center">
            <CheckInput id="anonymous" name="anonymous" />
            <p className="opacity-50">
              If checked, your name will not be visible in the public report
              list
            </p>
          </div>
        </ReportCardContainer>

        <PrimaryButton pending={isPending} type="submit">
          Submit Report
        </PrimaryButton>
      </Form>
    </ContentContainer>
  );
}
