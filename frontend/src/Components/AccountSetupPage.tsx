import React, { useState } from "react";
import type { setupUserI } from "../interface/setupUser";
import { setupUser } from "../API";

export function AccountSetupPage(){
    const [formData, setFormData] = useState<setupUserI>({
        name: "",
        surname: "",
        username: "",
        role: "",
        email: "",
    });

    const [password, setPassword] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const password = await setupUser(formData);
            console.log("Password: ", password);
            setPassword(password);
        } catch (error) {
            console.error("Error setting up user:", error);
        }
    };

    return (
        <div>
            <h1>Account Setup</h1>
            <form onSubmit={handleSubmit}>
            <div>
                <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>
                Surname:
                <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>
                Role:
                <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <button type="submit">Create Account</button>
            </form>
            {password && (
            <div>
                <h2>Generated Password</h2>
                <p><span>{password}</span></p>
            </div>
            )}
        </div>
    );
};

export default AccountSetupPage;