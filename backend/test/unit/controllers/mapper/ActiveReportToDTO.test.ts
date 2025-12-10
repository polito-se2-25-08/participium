import { mapActiveReportToDTO } from "../../../../src/controllers/mapper/ActiveReportToDTO";
import { ActiveReport } from "../../../../src/controllers/interface/ActiveReport";

describe("ActiveReportToDTO", () => {
  const mockReport: ActiveReport = {
    id: 1,
    title: "Test Report",
    description: "Description",
    latitude: "45.0",
    longitude: "7.0",
    timestamp: "2023-01-01",
    anonymous: true,
    user_id: 1,
    status: "IN_PROGRESS",
    category_id: 1,
    category: { category: "Roads" },
    photos: [],
    User: {
      name: "John",
      surname: "Doe",
      username: "johndoe",
      profile_picture: "pic.jpg",
    },
  };

  it("should hide reporter details if report is anonymous and user is CITIZEN", () => {
    const result = mapActiveReportToDTO(mockReport, "CITIZEN");
    expect(result.reporterName).toBe("Anonymous");
    expect(result.reporterSurname).toBe("");
    expect(result.reporterUsername).toBe("anonymous");
    expect(result.reporterProfilePicture).toBe("");
  });

  it("should show reporter details if report is anonymous but user is OFFICER", () => {
    const result = mapActiveReportToDTO(mockReport, "OFFICER");
    expect(result.reporterName).toBe("John");
    expect(result.reporterSurname).toBe("Doe");
    expect(result.reporterUsername).toBe("johndoe");
    expect(result.reporterProfilePicture).toBe("pic.jpg");
  });

  it("should show reporter details if report is anonymous but user is TECHNICIAN", () => {
    const result = mapActiveReportToDTO(mockReport, "TECHNICIAN");
    expect(result.reporterName).toBe("John");
  });

  it("should show reporter details if report is anonymous but user is ADMIN", () => {
    const result = mapActiveReportToDTO(mockReport, "ADMIN");
    expect(result.reporterName).toBe("John");
  });

  it("should show reporter details if report is NOT anonymous, even for CITIZEN", () => {
    const notAnonymousReport = { ...mockReport, anonymous: false };
    const result = mapActiveReportToDTO(notAnonymousReport, "CITIZEN");
    expect(result.reporterName).toBe("John");
  });
});
