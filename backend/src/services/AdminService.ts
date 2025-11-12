import { generateSalt, hashPassword } from "../utils/encryption";
import AppError from "../utils/AppError";
import { TablesInsert } from "../utils/DatabaseSchema";
import { userRepository } from "../repositories/userRepository";
export const adminService = {
    async createUser(data:
        {
            email: string;
            username: string;
            role: string;
            name: string;
            surname: string;
        }
    )
    {
        const existing = await userRepository.findByUsername(data.username);
            if (existing) throw new AppError("Username taken", 400);

            //generate pass, instead of having the admin set it for each account
            const generateRandomPassword = () => {
                const length = Math.floor(Math.random() * (12 - 8 + 1)) + 8;
                const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
                let password = "";

                // Ensure at least one lowercase, one uppercase, one number, and one special character
                password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
                password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
                password += "0123456789"[Math.floor(Math.random() * 10)];
                password += specialChars[Math.floor(Math.random() * specialChars.length)];

                // Fill the rest of the password length with random characters
                for (let i = password.length; i < length; i++) {
                    const chars = charset + specialChars;
                    password += chars[Math.floor(Math.random() * chars.length)];
                }

                // Shuffle the password to ensure randomness
                password = password.split('').sort(() => Math.random() - 0.5).join('');
                return password;
            };

            const password = generateRandomPassword();

            const salt = generateSalt();
            const hashedPassword = hashPassword(password, salt);

            const newUser: TablesInsert<"User"> = {
                  email: data.email,
                  username: data.username,
                  password: hashedPassword,
                  salt,
                  name: data.name,
                  surname: data.surname,
                  role: data.role,
                  profile_picture: null,
                  email_notification: false,
                };
            //const createdUser = await userRepository.createUser(newUser);
            
            //give the password to the frontend so that the admin can receive the credentials
            newUser.password = password;

            return newUser;
    }
}