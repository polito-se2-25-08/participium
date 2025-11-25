import { useUser } from "../providers/AuthContext";
import PageTitle from "../titles/PageTitle";

import ContentContainer from "../containers/ContentContainer";
import AdminProfilePage from "./ProfilePage/AdminProfilePage";
import CitizenProfilePage from "./ProfilePage/CitizenProfilePage";
import OfficerProfilePage from "./ProfilePage/OfficerProfilePage";
import ProfileContentContainer from "../containers/ProfileContentContainer";

export function ProfilePage() {
	const { user } = useUser();

	return (
		<ContentContainer
			width="xl:w-1/2 sm:w-1/2 "
			gap="xl:gap-4 sm:gap-2"
			padding=""
		>
			<ProfileContentContainer>
				<PageTitle>{user.username}</PageTitle>
				{user.role === "ADMIN" && <AdminProfilePage />}
				{user.role === "CITIZEN" && <CitizenProfilePage />}
				{user.role === "OFFICER" && <OfficerProfilePage />}
			</ProfileContentContainer>
		</ContentContainer>
	);
}
