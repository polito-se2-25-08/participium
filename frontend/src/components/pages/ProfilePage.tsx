import { useUser } from "../providers/AuthContext";
import PageTitle from "../titles/PageTitle";

import ContentContainer from "../containers/ContentContainer";
import AdminProfilePage from "./ProfilePage/AdminProfilePage";
import CitizenProfilePage from "./ProfilePage/CitizenProfilePage";
import OfficerProfilePage from "./ProfilePage/OfficerProfilePage";
import ProfileContentContainer from "../containers/ProfileContentContainer";
import TechnitianProfilePage from "./ProfilePage/TechnitianProfilePage";
import SubTitle from "../titles/SubTitle";

export function ProfilePage() {
	const { user } = useUser();

	return (
		<ContentContainer
			width="xl:w-1/2 sm:w-1/2 "
			gap="xl:gap-4 sm:gap-2"
			padding=""
		>
			<PageTitle>Your Profile</PageTitle>
			<ProfileContentContainer>
				<SubTitle fontSize="text-[1.9rem]">{user.username}</SubTitle>
				{user.role === "ADMIN" && <AdminProfilePage />}
				{user.role === "CITIZEN" && <CitizenProfilePage />}
				{user.role === "OFFICER" && <OfficerProfilePage />}
				{user.role === "TECHNICIAN" && <TechnitianProfilePage />}
			</ProfileContentContainer>
		</ContentContainer>
	);
}
