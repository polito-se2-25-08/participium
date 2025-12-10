import { supabase } from "../utils/Supabase";
import type { Database, Tables, TablesInsert } from "../utils/DatabaseSchema";
import AppError from "../utils/AppError";
import { userService } from "../services/userService";
export type VerificationCodeRow = Tables<"VerificationCode">;
export type CreateVerificationCodeRow = TablesInsert<"VerificationCode">;
import { sendEmail } from "../controllers/mailController";


export const InitializeVerificationCode = async (
    userId: number,
) : Promise<void> => {

    const { data: dataToCheck, error: errorToCheck } = await supabase
        .from("VerificationCode")
        .select("*")
        .eq("userId", userId)
        .order("expires_at", { ascending: false })
        .limit(1)
        .single();
    
    // If there's an error other than "not found", throw it
    if (errorToCheck && errorToCheck.code !== "PGRST116") {
        throw new AppError(
            `Failed to get verification code: ${errorToCheck.message}`,
            500,
            "DB_SELECT_ERROR"
        );
    }
    
    // If a valid unexpired code exists, don't create a new one
    if (dataToCheck !== null) {
        const lastExpiresAt = new Date(dataToCheck.expires_at);
        const now = new Date();
        if (now < lastExpiresAt) {
            console.log(`Valid code already exists for user ${userId}, not sending new email`);
            return; // Valid code already exists
        }
    }

    console.log(`Creating new verification code for user ${userId}`);
    
    // Delete any existing verification codes for this user to prevent duplicates
    await supabase
        .from("VerificationCode")
        .delete()
        .eq("userId", userId);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    const expiresAt = date.toISOString();
    const verificationCodeFields: CreateVerificationCodeRow = {
        userId: userId,
        code: code,
        expires_at: expiresAt,
    };
    const { data, error } = await supabase
        .from("VerificationCode")
        .insert([verificationCodeFields])
        .select()
        .single();

    if (error) {
        throw new AppError(
            `Failed to create verification code: ${error.message}`,
            500,
            "DB_INSERT_ERROR"
        );
    }
    if (!data) {
        throw new AppError(
          `Failed to create verification code for user_id ${userId}`,
          500,
          "VERIFICATION_CODE_CREATION_FAILED"
        );
    }

    const user = await userService.getUserById(userId);
    await sendEmail([user.email], "Your Verification Code", 
        `Hi ${user.name},\nyour verification code is: ${code}. It will expire in 30 minutes.\n\nBest regards,\nParticipium Team`);
    return;
};

export const getVerificationCode = async (
    userId: number,
): Promise<string | null> => {
    const { data, error } = await supabase
        .from("VerificationCode")
        .select("*")
        .eq("userId", userId)
        .order("expires_at", { ascending: false })
        .limit(1)
        .single();
    if (error) {
        if (error.code === "PGRST116") {
            return null;
        }
        throw new AppError(
            `Failed to get verification code: ${error.message}`,
            500,
            "DB_SELECT_ERROR"
        );
    }
    
    // Check if code is expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    if (now > expiresAt) {
        return null; // Code expired
    }
    
    return data.code;
};

export const deleteVerificationCode = async (
    userId: number,
): Promise<void> => {
    await supabase
        .from("VerificationCode")
        .delete()
        .eq("userId", userId);
};