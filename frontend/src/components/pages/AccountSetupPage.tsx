import React, { useEffect, useState } from "react";

import { setupUser } from "../../api/adminService";
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
	const [formData, setFormData] = useState({
		name: "",
		surname: "",
		username: "",
		role: "",
		email: "",
	});

	const [password, setPassword] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);
	const [canSubmit, setCanSubmit] = useState(false);

	useEffect(() => {
		setCanSubmit(
			formData.name !== "" &&
				formData.surname !== "" &&
				formData.username !== "" &&
				formData.role !== "" &&
				formData.email !== ""
		);
	}, [formData]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		setIsPending(true);
		e.preventDefault();
		if (!token) {
			console.error("No authentication token found");
			return;
		}
		try {
			const password = await setupUser(formData, token);
			setPassword(password);
		} catch (error) {
			console.error("Error setting up user:", error);
		} finally {
			setIsPending(false);
		}
	};

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
							id={"name"}
							name={"name"}
							placeholder="Type the name here..."
							hasLabel
							label="Name"
							value={formData.name}
							onChange={handleChange}
						/>
						<TextInput
							required
							id={"surname"}
							name={"surname"}
							placeholder="Type the surname here..."
							hasLabel
							label="Surname"
							value={formData.surname}
							onChange={handleChange}
						/>
					</div>
					<TextInput
						required
						id={"username"}
						name={"username"}
						placeholder="Type the usrname here..."
						hasLabel
						label="Username"
						value={formData.username}
						onChange={handleChange}
					/>

					<EmailInput
						required
						id={"email"}
						name={"email"}
						placeholder="Type the email here..."
						hasLabel
						label="Email"
						value={formData.email}
						onChange={handleChange}
					/>
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
						]}
						value={formData.role}
						onChange={handleChange}
					/>

					<PrimaryButton
						pending={isPending}
						type="submit"
						disabled={!canSubmit}
					>
						Create Account
					</PrimaryButton>
				</Form>

				{password && (
					<div className="shadow-xl bg-amber-200 rounded p-4 flex flex-col">
						<SubTitle>Password generated</SubTitle>
						<p className="opacity-50 text-center">
							Please save this password securely. It will not be
							shown again.
						</p>

						<code className="text-center mt-2 text-xl">
							{password}
						</code>
					</div>
				)}
			</div>
		</ContentContainer>
	);
}
