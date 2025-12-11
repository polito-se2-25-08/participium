import { Report } from "../models/Report";
import { RejectionReportInsert } from "../models/RejectionReport";
import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";
import { ActiveReportDTO } from "../dto/ActiveReport";
import { mapActiveReportsToDTO } from "../controllers/mapper/ActiveReportToDTO";
import { ActiveReport } from "../controllers/interface/ActiveReport";
import { UserReport } from "../controllers/interface/UserReports";

export const createReport = async (
	reportData: Partial<Report> & { photos: string[] }
): Promise<Report> => {
	const { photos, ...reportFields } = reportData;

	const { data, error } = await supabase
		.from("Report")
		.insert([reportFields])
		.select()
		.single();

	if (error) {
		throw new AppError(
			`Failed to create report: ${error.message}`,
			500,
			"DB_INSERT_ERROR"
		);
	}

	// Insert photos into Report_Photo table
	if (photos.length > 0) {
		const photoInserts = photos.map((photo: string) => ({
			report_id: data.id,
			report_photo: photo,
		}));

		const { error: photoError } = await supabase
			.from("Report_Photo")
			.insert(photoInserts);

		if (photoError) {
			throw new AppError(
				`Failed to save report photos: ${photoError.message}`,
				500,
				"DB_INSERT_ERROR"
			);
		}
	}

	return data;
};

export const getAllReports = async (
	userRole: string = "CITIZEN"
): Promise<Report[]> => {
	const { data, error } = await supabase
		.from("Report")
		.select(
			`
      		*,
      		photos:Report_Photo(
				*
			),
      		user:User(
				name, 
				surname
			),
	  		messages:Report_Message(
				*
			)
    	`
		)
		.order("timestamp", { ascending: true });

	if (error) {
		throw new AppError(
			`Failed to fetch reports: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	const remappedData = data ? await remapReports(data, userRole) : [];

	return remappedData;
};

const remapReports = async (
	reports: any[],
	userRole: string = "CITIZEN"
): Promise<Report[]> => {
	const { data: categories, error: errorCategories } = await supabase
		.from("Category")
		.select("*")
		.order("id", { ascending: true });

	if (errorCategories) {
		throw new AppError(
			`Failed to fetch active reports: ${errorCategories.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	// Map category names to reports
	const categoriesReports = reports.map((report) => {
		const foundCategory = categories?.find(
			(cat) => cat.id === report.category_id
		);
		return {
			...report,
			category: foundCategory?.category,
		};
	});

	const { data: users, error: errorUsers } = await supabase
		.from("User")
		.select("*")
		.order("id", { ascending: true });

	if (errorUsers) {
		throw new AppError(
			`Failed to fetch active reports: ${errorUsers.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	// Map category names to reports
	const remappedReports = categoriesReports.map((report) => {
		const foundUser = users?.find((user) => user.id === report.user_id);
		const isAnonymous = report.anonymous;
		const canSeeAnonymous = ["OFFICER", "TECHNICIAN", "ADMIN"].includes(
			userRole
		);
		const shouldHide = isAnonymous && !canSeeAnonymous;

		const safeUser = shouldHide
			? {
					name: "Anonymous",
					surname: "",
					username: "anonymous",
					profile_picture: "",
			  }
			: {
					name: foundUser?.name,
					surname: foundUser?.surname,
					username: foundUser?.username,
					profile_picture: foundUser?.profile_picture,
			  };

		return {
			...report,
			user_id: shouldHide ? "Anonymous" : foundUser?.username,
			user: safeUser,
			name: safeUser.name,
			surname: safeUser.surname,
			reporterName: safeUser.name,
			reporterSurname: safeUser.surname,
			reporterUsername: safeUser.username,
			reporterProfilePicture: safeUser.profile_picture,
		};
	});

	return remappedReports;
};

export const getActiveReports = async (
	userRole: string = "CITIZEN"
): Promise<ActiveReportDTO[]> => {
	const { data, error } = await supabase
		.from("Report")
		.select(
			`
        *,
        category:category_id (
            category 
        ),
        photos:Report_Photo (
            report_photo
        ),
		User:user_id (
			name,
			surname,
			username,
			profile_picture
		)
    	`
		)
		.in("status", ["ASSIGNED", "IN_PROGRESS", "SUSPENDED"])
		.order("timestamp", { ascending: false });

	const activeResports = data as ActiveReport[];

	const mappedData = mapActiveReportsToDTO(activeResports, userRole);

	if (error) {
		throw new AppError(
			`Failed to fetch active reports: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}
	return mappedData;
};

const mapActiveReport = () => {};

export const getFilteredReports = async (
	userId: string,
	category: string[],
	status: string[],
	reportsFrom: string,
	reportsUntil: string,
	userRole: string = "CITIZEN"
): Promise<Report[]> => {
	const query = supabase.from("Report").select("*");

	if (userId) {
		query.eq("userId", userId);
	}

	if (category.length > 0) {
		query.in("category", category);
	}

	if (status.length > 0) {
		query.in("status", status);
	}

	if (reportsFrom) {
		query.gte("timestamp", reportsFrom);
	}

	if (reportsUntil) {
		query.lte("timestamp", reportsUntil);
	}

	const { data, error } = await query.order("timestamp", {
		ascending: false,
	});

	if (error) {
		throw new AppError(
			`Failed to fetch filtered reports: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	const remappedData = data ? await remapReports(data, userRole) : [];

	return remappedData;
};

export const getReportById = async (
	id: number,
	userRole: string = "CITIZEN"
): Promise<Report> => {
	const { data, error } = await supabase
		.from("Report")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new AppError(
			`Failed to fetch report: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	if (!data) {
		throw new AppError(
			`Report with id ${id} not found`,
			404,
			"REPORT_NOT_FOUND"
		);
	}

	const remappedData = data ? await remapReports([data], userRole) : [];

	return remappedData[0];
};

export const updateReportStatus = async (id: number, status: string) => {
	const { data, error } = await supabase
		.from("Report")
		.update({ status })
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new AppError(
			`Failed to update report status: ${error.message}`,
			500,
			"DB_UPDATE_ERROR"
		);
	}

	if (!data) {
		throw new AppError(
			`Report with id ${id} not found`,
			404,
			"REPORT_NOT_FOUND"
		);
	}

	return data;
};

export const approveReport = async (id: number): Promise<Report> => {
	const { data, error } = await supabase
		.from("Report")
		.update({ status: "ASSIGNED" })
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new AppError(
			`Failed to approve report: ${error.message}`,
			500,
			"DB_UPDATE_ERROR"
		);
	}

	if (!data) {
		throw new AppError(
			`Report with id ${id} not found`,
			404,
			"REPORT_NOT_FOUND"
		);
	}

	const remappedData = data ? await remapReports([data], "OFFICER") : [];
	return remappedData[0];
};

export const rejectReport = async (
	id: number,
	motivation: string
): Promise<Report> => {
	// First, update the report status to rejected
	const { data: reportData, error: reportError } = await supabase
		.from("Report")
		.update({ status: "REJECTED" })
		.eq("id", id)
		.select()
		.single();

	if (reportError) {
		throw new AppError(
			`Failed to reject report: ${reportError.message}`,
			500,
			"DB_UPDATE_ERROR"
		);
	}

	if (!reportData) {
		throw new AppError(
			`Report with id ${id} not found`,
			404,
			"REPORT_NOT_FOUND"
		);
	}

	// Insert rejection record
	const rejectionData: RejectionReportInsert = {
		report_id: id,
		motivation: motivation,
	};

	const { error: rejectionError } = await supabase
		.from("Rejection_Report")
		.insert([rejectionData]);

	if (rejectionError) {
		throw new AppError(
			`Failed to save rejection details: ${rejectionError.message}`,
			500,
			"DB_INSERT_ERROR"
		);
	}

	const remappedData = reportData ? await remapReports([reportData], "OFFICER") : [];
	return remappedData[0];
};

export const getReportsByCategoryAndStatus = async (
	category_id: number,
	status: Report["status"]
): Promise<Report[]> => {
	const { data, error } = await supabase
		.from("Report")
		.select("*")
		.eq("category_id", category_id)
		.eq("status", status)
		.order("timestamp", { ascending: false });

	if (error) {
		throw new AppError(
			`Failed to fetch reports by category and status: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	if (!data) {
		return [];
	}

	return data;
};

export const getReportsByTechnician = async (
	category_id: number,
	status?: Report["status"] | Report["status"][]
): Promise<Report[]> => {
	let query = supabase
		.from("Report")
		.select(
			`
      *,
      photos:Report_Photo(*),
      user:User(name, surname),
      messages:Report_Message(*)
    `
		)
		.eq("category_id", category_id)
		.neq("status", "REJECTED")
		.neq("status", "RESOLVED");

	const { data, error } = await query.order("timestamp", {
		ascending: false,
	});

	if (error) {
		throw new AppError(
			`Failed to fetch reports by category and status: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	if (!data) {
		return [];
	}

	const remappedData = await remapReports(data, "TECHNICIAN");
	return remappedData;
};

export const getReportsByUserId = async (
	userId: number
): Promise<UserReport[]> => {
	const { data, error } = await supabase
		.from("Report")
		.select(
			`
        *,
        category:category_id (
            category 
        ),
        photos:Report_Photo (
            report_photo
        ),
		messages:Report_Message(*)
    	`
		)
		.eq("user_id", userId)
		.in("status", ["ASSIGNED", "IN_PROGRESS", "SUSPENDED"])
		.order("timestamp", { ascending: false });

	if (error) {
		throw new AppError(
			`Failed to fetch reports by user id: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	const userReports = data as UserReport[];

	if (!userReports) {
		return [];
	}

	return userReports;
};
