import { startTransition, useActionState, useEffect, useState } from "react";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import PageTitle from "../titles/PageTitle";
import Input from "../input/Input";
import Form from "../form/Form";
import { loginAction } from "../../action/loginAction";
import { useAuth } from "../providers/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage() {
	const [state, formAction, isPending] = useActionState(loginAction, null);

	const { login } = useAuth();
	const navigate = useNavigate();

	const [usernameError, setUsernameError] = useState<boolean>(false);
	const [passwordError, setPasswordError] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const usernameValue = formData.get("username")?.toString() ?? "";
		const passwordValue = formData.get("password")?.toString() ?? "";

		const usernameHasError = usernameValue === "";
		const passwordHasError = passwordValue === "";

		setUsernameError(usernameHasError);
		setPasswordError(passwordHasError);

		if (usernameHasError || passwordHasError) return;

		startTransition(() => {
			formAction(formData);
		});
	};

	useEffect(() => {
		console.log(state);
		if (state === null) {
			return;
		}
		if (state.success === true) {
			const token = state.data.token;
			const user = state.data.user;
			login(user, token);
			navigate("/dashboard");
		}
		if (state.success === false) {
			console.log(state.data);
		}
	}, [state]);

	useEffect(() => {
		if (!usernameError && !passwordError) return;
		const timeout = setTimeout(() => {
			setUsernameError(false);
			setPasswordError(false);
		}, 3000);

		return () => clearTimeout(timeout);
	}, [usernameError, passwordError]);

	return (
		<div className="flex flex-col gap-4 w-1/4 ">
			<PageTitle>Participium</PageTitle>
			<p className="opacity-50 text-sm w-full">
				Your city, your voice — Help keep Turin clean and efficient by
				reporting issues you see around you. Just select a spot on the
				map, add a short description and photo, and send your report to
				the municipality.
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
				<Input
					placeholder="Place your password here..."
					id="password"
					type="password"
					hasLabel
					label="Password"
					required
					showError={passwordError}
					name="password"
					pending={isPending}
				/>

				<PrimaryButton
					className="w-full"
					type="submit"
					pending={isPending}
				>
					Login
				</PrimaryButton>
				<Link className="text-center underline" to="/register">
					<span className="opacity-50 text-sm text-center">
						Create new account
					</span>
				</Link>
			</Form>
		</div>
	);
}
