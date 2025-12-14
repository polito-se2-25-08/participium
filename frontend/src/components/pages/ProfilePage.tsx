import { useUser } from "../providers/AuthContext";
import PageTitle from "../titles/PageTitle";

import ContentContainer from "../containers/ContentContainer";
import AdminProfilePage from "./ProfilePage/AdminProfilePage";
import CitizenProfilePage from "./ProfilePage/CitizenProfilePage";
import OfficerProfilePage from "./ProfilePage/OfficerProfilePage";

import TechnitianProfilePage from "./ProfilePage/TechnitianProfilePage";

import UserReports from "./componets/UserReports";
import ExternalMaintainerProfilePage from "./ProfilePage/ExternalMantainerProfilePage";

export function ProfilePage() {
  const { user } = useUser();

  return (
    <ContentContainer
      width="xl:w-3/4 sm:w-1/2 "
      gap="xl:gap-4 sm:gap-2"
      padding=""
    >
      <PageTitle>Your Profile</PageTitle>

      <div className="flex flex-col w-full">
        {user.role === "ADMIN" && <AdminProfilePage />}
        {user.role === "CITIZEN" && (
          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-1/2">
              <CitizenProfilePage />
            </div>
            <UserReports />
          </div>
        )}
        {user.role === "EXTERNAL_MAINTAINER" && (
          <ExternalMaintainerProfilePage />
        )}

        {user.role === "OFFICER" && <OfficerProfilePage />}
        {user.role === "TECHNICIAN" && <TechnitianProfilePage />}
      </div>
    </ContentContainer>
  );
}
