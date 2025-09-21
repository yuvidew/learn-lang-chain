import { useState } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

export const useChat = () => {
    const [loading, setLoading] = useState(false);
    const [out, setOut] = useState("");

    const onSubmit = async (prompt: string) => {
        setLoading(true);
        try {
            const res = await axios.post(
                "/api/chat",
                { prompt }, // ✅ send JSON object, not raw string
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (res.status === 200) {
                console.log("the response" , res.data);
                setOut(res.data); // adjust depending on API response shape
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong");
            } else {
                toast.error("Unexpected error");
            }
        } finally {
            setLoading(false); // ✅ reset loading
        }
    };

    return {
        loading,
        out,
        onSubmit,
    };
};
