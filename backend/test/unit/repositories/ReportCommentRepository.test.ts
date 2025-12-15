// Mock Supabase
jest.mock("../../../src/utils/Supabase", () => ({
	supabase: {
		from: jest.fn(),
	},
}));

const { supabase } = require("../../../src/utils/Supabase");

describe("ReportCommentRepository", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	/*
	describe("createComment", () => {
		it("should create a comment successfully", async () => {
			const mockComment = {
				report_id: 1,
				sender_id: 1,
				message: "Test comment",
			};

			const mockResponse = {
				id: 1,
				...mockComment,
				created_at: new Date().toISOString(),
			};

			supabase.from.mockReturnValue({
				insert: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						single: jest.fn().mockResolvedValue({
							data: mockResponse,
							error: null,
						}),
					}),
				}),
			});

			const result = await ReportCommentRepository.createComment(
				mockComment
			);

			expect(supabase.from).toHaveBeenCalledWith("Report_Comment");
			expect(result).toEqual(mockResponse);
		});

		it("should throw error if creation fails", async () => {
			const mockComment = {
				report_id: 1,
				sender_id: 1,
				message: "Test comment",
			};

			supabase.from.mockReturnValue({
				insert: jest.fn().mockReturnValue({
					select: jest.fn().mockReturnValue({
						single: jest.fn().mockResolvedValue({
							data: null,
							error: { message: "DB Error" },
						}),
					}),
				}),
			});

			await expect(
				ReportCommentRepository.createComment(mockComment)
			).rejects.toThrow("Failed to create comment: DB Error");
		});
	});

	describe("getCommentsByReportId", () => {
		it("should return comments for a report", async () => {
			const mockComments = [
				{
					id: 1,
					report_id: 1,
					sender_id: 1,
					message: "Comment 1",
					created_at: "2023-01-01T00:00:00Z",
					sender: {
						id: 1,
						name: "John",
						surname: "Doe",
						role: "CITIZEN",
						profile_picture: "pic.jpg",
					},
				},
			];

			supabase.from.mockReturnValue({
				select: jest.fn().mockReturnValue({
					eq: jest.fn().mockReturnValue({
						order: jest.fn().mockResolvedValue({
							data: mockComments,
							error: null,
						}),
					}),
				}),
			});

			const result = await ReportCommentRepository.getCommentsByReportId(
				1
			);

			expect(supabase.from).toHaveBeenCalledWith("Report_Comment");
			expect(result).toEqual(mockComments);
		});

		it("should throw error if fetching fails", async () => {
			supabase.from.mockReturnValue({
				select: jest.fn().mockReturnValue({
					eq: jest.fn().mockReturnValue({
						order: jest.fn().mockResolvedValue({
							data: null,
							error: { message: "DB Error" },
						}),
					}),
				}),
			});

			await expect(
				ReportCommentRepository.getCommentsByReportId(1)
			).rejects.toThrow("Failed to fetch comments: DB Error");
		});

		it("should return empty array if no comments found", async () => {
			supabase.from.mockReturnValue({
				select: jest.fn().mockReturnValue({
					eq: jest.fn().mockReturnValue({
						order: jest.fn().mockResolvedValue({
							data: null,
							error: null,
						}),
					}),
				}),
			});

			const result = await ReportCommentRepository.getCommentsByReportId(
				1
			);

			expect(result).toEqual([]);
		});
	});
  */
});
