import React, { useEffect, useState } from "react";

import {
  setupUser,
  setupTechnician,
  getCategories,
} from "../../api/adminService";
import { externalCompanyService } from "../../api/externalcompanyService";
import { useAuth } from "../providers/AuthContext";
import ContentContainer from "../containers/ContentContainer";
import Form from "../form/Form";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import TextInput from "../input/variants/TextInput";
import EmailInput from "../input/variants/EmailInput";
import PageTitle from "../titles/PageTitle";
import Select from "../selects/Select";
import SubTitle from "../titles/SubTitle";

export function AccountSetupPage() {
  const { token } = useAuth();

  // ----- FORM STATE -----
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    role: "",
    email: "",
    category_id: "",
    external_company_id: "", // 👈 Added for External Maintainer
  });

  // ----- CATEGORY STATE -----
  const [categories, setCategories] = useState<
    { id: number; category: string }[]
  >([]);

  // ----- EXTERNAL COMPANIES -----
  const [companies, setCompanies] = useState<
    { id: number; company_name: string }[]
  >([]);

  const [password, setPassword] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ========================================
  // FETCH CATEGORIES (for TECHNICIAN role)
  // ========================================
  useEffect(() => {
    if (!token) return;

    getCategories(token)
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Failed to load categories", err));
  }, [token]);

  // ========================================
  // FETCH COMPANIES (for EXTERNAL_MAINTAINER)
  // ========================================
  useEffect(() => {
    if (formData.role !== "EXTERNAL_MAINTAINER") return;

    externalCompanyService
      .getAllCompanies()
      .then((res) => {
        setCompanies(res.data || []);
      })
      .catch((err) => console.error("Failed to load companies", err));
  }, [formData.role]);

  // ========================================
  // FORM VALIDATION
  // ========================================
  useEffect(() => {
    const isTechnician = formData.role === "TECHNICIAN";
    const isExternal = formData.role === "EXTERNAL_MAINTAINER";

    const categoryValid =
      !isTechnician || formData.category_id !== ""; // category required only for TECHNICIAN

    const externalCompanyValid =
      !isExternal || formData.external_company_id !== ""; // company required only for EXTERNAL MAINTAINER

    setCanSubmit(
      formData.name !== "" &&
        formData.surname !== "" &&
        formData.username !== "" &&
        formData.role !== "" &&
        formData.email !== "" &&
        categoryValid &&
        externalCompanyValid
    );
  }, [formData]);

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE SUBMIT
  // ========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsPending(true);
    setServerError(null);
    setPassword(null);

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      let generatedPassword;

      if (formData.role === "TECHNICIAN") {
        generatedPassword = await setupTechnician(formData, token);
      } else {
        // OFFICER or EXTERNAL_MAINTAINER
        generatedPassword = await setupUser(formData, token);
      }

      setPassword(generatedPassword);
    } catch (error: any) {
      console.error("Error setting up user:", error);
      setServerError(error.message || "An error occurred during setup.");
    } finally {
      setIsPending(false);
    }
  };

  // ========================================
  // RENDER COMPONENT
  // ========================================
  return (
    <ContentContainer
      width="xl:w-1/2 sm:w-1/2 "
      gap="xl:gap-4 sm:gap-2"
      padding="p-5"
    >
      <PageTitle>Account Setup</PageTitle>

      <div className="flex flex-col rounded-xl shadow-xl border border-gray-600 p-8 gap-3">
        <Form onSubmit={handleSubmit} gap="gap-4">
          <div className="flex flex-row gap-5">
            <TextInput
              required
              id="name"
              name="name"
              placeholder="Type the name here..."
              hasLabel
              label="Name"
              value={formData.name}
              onChange={handleChange}
            />

            <TextInput
              required
              id="surname"
              name="surname"
              placeholder="Type the surname here..."
              hasLabel
              label="Surname"
              value={formData.surname}
              onChange={handleChange}
            />
          </div>

          <TextInput
            required
            id="username"
            name="username"
            placeholder="Type the username here..."
            hasLabel
            label="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <EmailInput
            required
            id="email"
            name="email"
            placeholder="Type the email here..."
            hasLabel
            label="Email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* ROLE SELECTION */}
          <Select
            required
            id="role"
            name="role"
            hasLabel
            placeholder="Select role here"
            label="Role"
            options={[
              { value: "OFFICER", label: "Officer" },
              { value: "TECHNICIAN", label: "Technician" },
              { value: "EXTERNAL_MAINTAINER", label: "External maintainer" },
            ]}
            value={formData.role}
            onChange={handleChange}
          />

          {/* CATEGORY INPUT (TECHNICIAN ONLY) */}
          {formData.role === "TECHNICIAN" && (
            <Select
              required
              id="category_id"
              name="category_id"
              hasLabel
              placeholder="Select Technical Office"
              label="Technical Office"
              options={categories.map((cat) => ({
                value: String(cat.id),
                label: cat.category || "Unnamed Category",
              }))}
              value={formData.category_id}
              onChange={handleChange}
            />
          )}

          {/* COMPANY INPUT (EXTERNAL MAINTAINER ONLY) */}
          {formData.role === "EXTERNAL_MAINTAINER" && (
            <Select
              required
              id="external_company_id"
              name="external_company_id"
              hasLabel
              placeholder="Select External Company"
              label="External Company"
              options={companies.map((company) => ({
                value: String(company.id),
                label: company.company_name,
              }))}
              value={formData.external_company_id}
              onChange={handleChange}
            />
          )}

          {/* SERVER ERROR */}
          {serverError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
              {serverError}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <PrimaryButton pending={isPending} type="submit" disabled={!canSubmit}>
            Create Account
          </PrimaryButton>
        </Form>

        {/* PASSWORD DISPLAY */}
        {password && (
          <div className="shadow-xl bg-amber-200 rounded p-4 flex flex-col">
            <SubTitle>Password generated</SubTitle>
            <p className="opacity-50 text-center">
              Please save this password securely. It will not be shown again.
            </p>

            <code className="text-center mt-2 text-xl">{password}</code>
          </div>
        )}
      </div>
    </ContentContainer>
  );
}
