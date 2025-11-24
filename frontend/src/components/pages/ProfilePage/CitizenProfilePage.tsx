import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../../providers/AuthContext";
import DangerButton from "../../buttons/variants/danger/DangerButton";

import DefautlPridilePicture from "../../../assets/DefaultProfilePicture.png";
import {
	startTransition,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import TextInput from "../../input/variants/TextInput";
import CheckInput from "../../input/variants/CheckInput";
import PrimaryButton from "../../buttons/variants/primary/PrimaryButton";
import Form from "../../form/Form";
import { updateUserAction } from "../../../action/UserAction";

export default function CitizenProfilePage() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { user, updateUser } = useUser();

	const [isHovered, setIsHovered] = useState(false);
	const [telegramUserName, setTelegramUserName] = useState(
		user.telegramUsername ?? ""
	);
	const [enableNotification, setEnableNotification] = useState(
		user.emailNotification ?? false
	);

	const [profilePicture, setProfilePicture] = useState<string>(
		user.profilePicture
			? `data:image/png;base64,` + user.profilePicture
			: DefautlPridilePicture
	);

	const firstState = useRef({
		telegramUserName: telegramUserName,
		enableNotification: enableNotification,
		profilePicture: profilePicture,
	});

	const [hasModified, setHasModified] = useState(false);
	const [firstRender, setFirstRender] = useState(true);

	const inputRef = useRef<HTMLInputElement>(null);

	const [state, formAction, isPending] = useActionState(
		updateUserAction,
		null
	);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				const base64Data = (reader.result as string).split(",")[1];
				setProfilePicture(`data:image/png;base64,` + base64Data);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleClick = () => {
		inputRef.current?.click();
	};

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
			return;
		}
		const modified =
			firstState.current.telegramUserName !== telegramUserName ||
			firstState.current.enableNotification !== enableNotification ||
			firstState.current.profilePicture !== profilePicture;

		setHasModified(modified);
	}, [profilePicture, telegramUserName, enableNotification]);

	useEffect(() => {
		if (!state) return;
		if (state.success) {
			const data = state.data;
			firstState.current.telegramUserName = data.telegramUsername;
			firstState.current.enableNotification = data.emailNotification;
			firstState.current.profilePicture = data.profilePicture;
			updateUser(data);
		}
		if (!state.success) {
			setHasModified(false);
		}
	}, [state]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setHasModified(false);
		const formData = new FormData();
		if (telegramUserName !== firstState.current.telegramUserName) {
			formData.append("telegram_username", telegramUserName);
		}

		if (enableNotification !== firstState.current.enableNotification) {
			formData.append(
				"email_notification",
				enableNotification ? "on" : ""
			);
		}

		if (profilePicture !== firstState.current.profilePicture) {
			formData.append("profile_picture", profilePicture);
		}

		formData.append("user_id", user.id.toString());

		startTransition(() => {
			formAction(formData);
		});
	};

	return (
		<Form gap="gap-4" onSubmit={handleSubmit}>
			<div className="flex justify-center">
				<div
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<img
						className="w-40 h-40 rounded-full hover:scale-105 hover:shadow-lg brightness-100 hover:brightness-80 transition-all transition-filter duration-300 cursor-pointer"
						src={profilePicture}
						alt="user profile picture"
						onClick={handleClick}
					/>
					{isHovered && (
						<div className="absolute inset-0 flex justify-center items-center pointer-events-none xl:mb-8.5 sm:mb-8 ">
							<FontAwesomeIcon
								icon={faUpload}
								className="text-white text-5xl"
							/>
						</div>
					)}

					<input
						type="file"
						accept="image/jpeg,image/png,image/webp,image/avif"
						hidden
						ref={inputRef}
						name="profile_picture"
						onChange={handleChange}
					/>
				</div>
			</div>
			<div className="flex flex-row">
				<div className="flex flex-col w-[40%]">
					<div className="flex">
						<span className="font-semibold w-32 ">Name:</span>
						<span className="flex-1">{user.name}</span>
					</div>

					<div className="flex">
						<span className="font-semibold w-32">Surname:</span>
						<span className="flex-1">{user.surname}</span>
					</div>

					<div className="flex">
						<span className="font-semibold w-32">Username:</span>
						<span className="flex-1">{user.username}</span>
					</div>

					<div className="flex">
						<span className="font-semibold w-32">Email:</span>
						<span className="flex-1">{user.email}</span>
					</div>

					<div className="flex">
						<span className="font-semibold w-32">Role:</span>
						<span className="flex-1">{user.role}</span>
					</div>
				</div>
				<div className="flex flex-col gap-4 w-[60%]">
					<TextInput
						id="telegram"
						name="telegram_username"
						value={telegramUserName}
						onChange={(e) => setTelegramUserName(e.target.value)}
						label="Telegram username"
						hasLabel
						placeholder="Enter your telegram username here..."
					/>
					<CheckInput
						id="email_notification"
						name="email_notification"
						checked={enableNotification}
						value={enableNotification}
						onChange={(e) => {
							setEnableNotification(e.target.checked);
						}}
						label="Enable email notifications"
						hasLabel
					/>
				</div>
			</div>
			<div className="flex flex-row gap-7">
				<DangerButton pending={isPending} onClick={handleLogout}>
					Logout
				</DangerButton>
				<PrimaryButton
					pending={isPending}
					type="submit"
					disabled={!hasModified}
				>
					Save
				</PrimaryButton>
			</div>
		</Form>
	);
}
