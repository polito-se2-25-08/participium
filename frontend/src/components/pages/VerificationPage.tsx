import React, { useActionState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentContainer from "../containers/ContentContainer";
import TextInput from "../input/variants/TextInput";
import { verifyAction } from "../../action/UserAction";
import { useAuth } from "../providers/AuthContext";
import type { ApiResponse } from "../../interfaces/dto/Response";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";

export function VerificationPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Wrapper action that matches useActionState's signature
    const wrappedVerifyAction = async (
        prevState: ApiResponse<{ result: boolean }> | null,
        formData: FormData
    ) => {
        const userId = user?.id;
        if (!userId) {
            return {
                success: false,
                data: { message: "User not logged in" }
            } as ApiResponse<{ result: boolean }>;
        } 
        else
        {    
            // const code = formData.get("code") as string;
            // return await verifyAction(userId, code);
            const testResponse: ApiResponse<{ result: boolean }> = {
                success: true,
                data: { result: true },
            };
            return testResponse;
        }
    };
    
    const [state, formAction, isPending] = useActionState(wrappedVerifyAction, null);
    
    // Handle successful verification
    useEffect(() => {
        if (state?.success && state.data?.result) {
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);
        }
    }, [state, user]);
    
    return (
        <ContentContainer>
            <form action={formAction}>
                <br />
                <p>Your verification code has been sent to your email.</p>
                <br />
                <TextInput 
                    label = "Please enter the verification code below to verify your account."
                    id = "verification-code"
                    name="code" 
                    placeholder="Verification Code"
                    disabled={isPending}
                    required
                />
                {state?.success && state.data && "result" in state.data && !state.data.result && (
                    <p className="error">Error in the verification process</p>
                )}
                {state?.success && state.data && "result" in state.data && state.data.result && (
                    <p className="success">Verification successful! Redirecting to dashboard...</p>
                )}
                <br />
                <PrimaryButton type="submit" disabled={isPending}>
                    {isPending ? "Verifying..." : "Verify"}
                </PrimaryButton>
            </form>
        </ContentContainer>
    );
}