
import { ContractAnalysis } from "@/types/type";
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner";



type ResponseType = {
    success : boolean,
    message : string,
    data : ContractAnalysis
}


export const useUpload = () => {
    return useMutation({
        mutationFn : async (formData : FormData) => {
            try {
                const res = await axios.post<ResponseType>("/api/ai-contract-analyzer" , formData);

                if (res.status === 200) {
                    console.log("the res" , res.data);
                    toast.success(res.data.message)
                }

                return res.data
            } catch (error) {
                console.log("Error to upload document or pdf" , error);

                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 400 || 500 || 415) {
                        toast.error(error.response?.data.message)
                    }
                }
            }
        }
    })
}