import { useActionState, useEffect, useState } from "react";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import PageTitle from "../titles/PageTitle";
import Input from "../input/Input";
import Form from "../form/Form";
import { loginAction } from "../../action/loginAction";
import { useAuth } from "../providers/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function RegisterPage() {
	const [state, formAction, isPending] = useActionState(loginAction, null);

	const { login } = useAuth();
	const navigate = useNavigate();

	const [usernameError, setUsernameError] = useState<boolean>(false);
	const [passwordError, setPasswordError] = useState<boolean>(false);
	const [emailError, setEmailError] = useState<boolean>(false);
	const [nameError, setNameError] = useState<boolean>(false);
	const [surnameError, setSurnameError] = useState<boolean>(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const usernameValue = formData.get("username")?.toString() ?? "";
		const passwordValue = formData.get("password")?.toString() ?? "";
		const emailValue = formData.get("email")?.toString() ?? "";
		const nameValue = formData.get("name")?.toString() ?? "";
		const surnameValue = formData.get("surname")?.toString() ?? "";

		const emailValidation =
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u.test(
				emailValue
			);

		const usernameHasError = usernameValue === "";
		const passwordHasError = passwordValue === "";
		const emailHasError = emailValue === "";
		const nameHasError = nameValue === "";
		const surnameHasError = surnameValue === "";

		setUsernameError(usernameHasError);
		setPasswordError(passwordHasError);
		setNameError(nameHasError);
		setSurnameError(surnameHasError);

		if (!emailValidation) {
			setEmailError(true);
			return;
		}

		setEmailError(emailHasError);

		if (
			usernameHasError ||
			passwordHasError ||
			emailHasError ||
			nameHasError ||
			surnameHasError
		)
			return;

		formAction(formData);
	};

	useEffect(() => {
		if (state === null) {
			return;
		}
		if (state.success === true) {
		}
		if (state.success === false) {
			console.log(state.data);
		}
	}, [state]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setUsernameError(false);
			setPasswordError(false);
			setEmailError(false);
			setNameError(false);
			setSurnameError(false);
		}, 3000);

		return () => clearTimeout(timeout);
	}, [usernameError, passwordError, emailError, nameError, surnameError]);

	return (
		<div className="flex flex-col gap-4 w-1/4 ">
			<PageTitle>Registration</PageTitle>
			<p className="opacity-50 text-sm w-full">
				Hi! Welcome to Participium! We hope you will have a good time
				here. Please fill out the form below to register.
			</p>
			<Form className="gap-4" onSubmit={handleSubmit}>
				<Input
					placeholder="Place your username here..."
					type="text"
					hasLabel
					label="Username"
					id="username"
					required
					name="username"
					showError={usernameError}
					pending={isPending}
				/>
				<div className="flex flex-row gap-4">
					<Input
						placeholder="Place your name here..."
						type="text"
						hasLabel
						label="Name"
						id="name"
						required
						name="name"
						showError={nameError}
						pending={isPending}
					/>
					<Input
						placeholder="Place your surname here..."
						id="surname"
						type="text"
						hasLabel
						label="Surname"
						required
						showError={surnameError}
						name="surname"
						pending={isPending}
					/>
				</div>
				<Input
					placeholder="Place your email here..."
					type="email"
					hasLabel
					label="Email"
					id="email"
					required
					name="email"
					showError={emailError}
					pending={isPending}
				/>
				<Input
					placeholder="Place your password here..."
					type="password"
					hasLabel
					label="Password"
					id="Password"
					required
					name="password"
					showError={passwordError}
					pending={isPending}
				/>

				<PrimaryButton
					pending={isPending}
					className="w-full"
					type="submit"
				>
					Register
				</PrimaryButton>
				<Link className="text-center underline" to="/">
					<span className="opacity-50 text-sm text-center">
						Already have an account? Back to login
					</span>
				</Link>
			</Form>
		</div>
	);
}
