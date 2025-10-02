import z from "zod";

export const ContractType = z.object({
    doc: z
        .instanceof(File, { message: "A valid contract file (PDF/DOCX) is required." })
        .refine(
            (file) =>
                ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type),
            { message: "Only PDF and DOCX files are allowed." }
        ),

});