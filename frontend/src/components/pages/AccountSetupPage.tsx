import React, { useEffect, useState } from "react";

import { setupUser, setupTechnician } from "../../api/adminService";
import { categoryService } from "../../api/categoryService";
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
    category_ids: [] as string[],
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
    const fetchCategories = async () => {
      if (token) {
        try {
          const response = await categoryService.getAllCategories();
          if (response.success && Array.isArray(response.data)) {
            console.log("Fetched categories:", response.data);
            setCategories(response.data);
          } else {
            console.error("Failed to load categories:", response.data);
          }
        } catch (err) {
          console.error("Failed to load categories", err);
        }
      }
    };

    fetchCategories();
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

    const categoryValid = !isTechnician || formData.category_ids.length > 0; // category required only for TECHNICIAN

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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentIds = prev.category_ids;
      if (checked) {
        return { ...prev, category_ids: [...currentIds, value] };
      } else {
        return {
          ...prev,
          category_ids: currentIds.filter((id) => id !== value),
        };
      }
    });
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
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Technical Offices <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md max-h-48 overflow-y-auto bg-white">
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No categories available
                  </p>
                ) : (
                  categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        value={String(cat.id)}
                        checked={formData.category_ids.includes(String(cat.id))}
                        onChange={handleCategoryChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {cat.category || "Unnamed Category"}
                    </label>
                  ))
                )}
              </div>
            </div>
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
          <PrimaryButton
            pending={isPending}
            type="submit"
            disabled={!canSubmit}
          >
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
