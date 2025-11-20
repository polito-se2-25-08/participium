import { startTransition, useActionState, useEffect, useState } from "react";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import PageTitle from "../titles/PageTitle";
import Input from "../input/Input";
import Form from "../form/Form";
import { loginAction } from "../../action/loginAction";
import { useAuth } from "../providers/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ContentContainer from "../containers/ContentContainer";
import TextInput from "../input/variants/TextInput";
import EmailInput from "../input/variants/EmailInput";
import PasswordInput from "../input/variants/PasswordInput";

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
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u.test(emailValue);

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

    startTransition(() => {
      formAction(formData);
    });
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
    <ContentContainer
      width="xl:w-1/2 sm:w-1/2 "
      gap="xl:gap-4 sm:gap-2"
      padding="p-5"
    >
      <PageTitle>Registration</PageTitle>
      <p className="opacity-50 text-sm w-full">
        Hi! Welcome to Participium! We hope you will have a good time here.
        Please fill out the form below to register.
      </p>
      <Form gap={4} onSubmit={handleSubmit}>
        <TextInput
          placeholder="Place your username here..."
          hasLabel
          label="Username"
          id="username"
          required
          name="username"
          showError={usernameError}
          pending={isPending}
        />
        <div className="flex flex-row gap-4">
          <TextInput
            placeholder="Place your name here..."
            hasLabel
            label="Name"
            id="name"
            required
            name="name"
            showError={nameError}
            pending={isPending}
          />
          <TextInput
            placeholder="Place your surname here..."
            id="surname"
            hasLabel
            label="Surname"
            required
            showError={surnameError}
            name="surname"
            pending={isPending}
          />
        </div>
        <EmailInput
          placeholder="Place your email here..."
          hasLabel
          label="Email"
          id="email"
          required
          name="email"
          showError={emailError}
          pending={isPending}
        />
        <PasswordInput
          placeholder="Place your password here..."
          hasLabel
          label="Password"
          id="Password"
          required
          name="password"
          showError={passwordError}
          pending={isPending}
        />

        <PrimaryButton pending={isPending} className="w-full" type="submit">
          Register
        </PrimaryButton>
        <Link className="text-center underline" to="/">
          <span className="opacity-50 text-sm text-center">
            Already have an account? Back to login
          </span>
        </Link>
      </Form>
    </ContentContainer>
  );
}
