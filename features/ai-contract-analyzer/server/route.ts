import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ContractType } from "../schema";
import pdf from "pdf-parse/lib/pdf-parse";
import mammoth from "mammoth";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ContractAnalysis } from "@/types/type";

const app = new Hono();

// Helper function to extract JSON from AI response
function extractJSON(text: string): ContractAnalysis {
    try {
        // First, try direct parsing
        return JSON.parse(text);
    } catch (e) {
        // If that fails, try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        
        // Try to find JSON object without code blocks
        const objectMatch = text.match(/\{[\s\S]*\}/);
        if (objectMatch) {
            return JSON.parse(objectMatch[0]);
        }
        
        throw new Error("No valid JSON found in response");
    }
}

// start to POST api for:- Upload pdf doc
app.post(
    "/",
    zValidator("form", ContractType),
    async (c) => {
        try {
            const { doc } = c.req.valid("form");

            if (!doc) {
                return c.json(
                    {
                        success: false,
                        message: "Contract doc is required!"
                    },
                    400
                )
            }

            const arrayBuffer = await doc.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            let extractedText = "";

            if (doc.type === "application/pdf") {
                try {
                    const data = await pdf(buffer);
                    extractedText = data.text;
                } catch (parseError) {
                    console.error("Failed to parse PDF document", parseError);
                    return c.json(
                        {
                            success: false,
                            message: "The uploaded PDF appears to be corrupted or uses features we do not support. Please upload a different file.",
                            code: 422,
                        },
                        422
                    );
                }
            } else if (
                doc.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                try {
                    const result = await mammoth.extractRawText({ buffer: buffer });
                    extractedText = result.value;
                } catch (parseError) {
                    console.error("Failed to parse DOCX document", parseError);
                    return c.json(
                        {
                            success: false,
                            message: "We could not read that DOCX file. Please make sure it is not encrypted or corrupted.",
                            code: 422,
                        },
                        422
                    );
                }
            } else {
                return c.json(
                    {
                        success: false,
                        message: "Unsupported file type. Only PDF and DOCX are allowed.",
                        code: 415,
                    },
                    415
                );
            }

            const apiKey = process.env.GOOGLE_API_KEY;

            if (!apiKey) {
                return c.json({
                    success: false,
                    message: "Missing Google API key.",
                    code: 500,
                }, 500);
            }

            const model = new ChatGoogleGenerativeAI({
                model: "gemini-2.5-flash",
                apiKey,
                temperature: 0.7 // Reduced for more consistent JSON output
            });

            const prompt = `
You are an advanced contract analysis AI capable of analyzing any type of contract including employment agreements, service contracts, NDAs, leases, purchase agreements, partnership agreements, licensing contracts, and more.

Analyze the following contract document and return ONLY a valid JSON object with no additional text, code blocks, or formatting.

The JSON must have exactly this structure:
{
    "contract_type": "Specific type of contract (e.g., Employment Agreement, Service Contract, NDA, Lease, etc.)",
    "parties": [
        {
            "name": "Party name",
            "role": "Their role (e.g., Employer, Service Provider, Landlord, Buyer, etc.)",
            "contact_info": "Contact details if available or null"
        }
    ],
    "effective_date": "Contract start date (YYYY-MM-DD or as stated) or null",
    "duration": "Contract duration or term or null",
    "key_terms": {
        "scope_of_work": "Description of services, products, or subject matter or null",
        "deliverables": ["List of deliverables or obligations if applicable"],
        "territory": "Geographical scope or jurisdiction or null"
    },
    "obligations": {
        "party_name_1": ["obligation1", "obligation2"],
        "party_name_2": ["obligation1", "obligation2"]
    },
    "payment_terms": {
        "amount": "Total amount, rate, or compensation structure or null",
        "currency": "Currency if specified or null",
        "schedule": "Payment frequency and timing or null",
        "method": "Accepted payment methods or null",
        "invoicing": "Invoicing requirements or null",
        "penalties": "Late payment penalties or interest or null",
        "expenses": "Reimbursable expenses if any or null"
    },
    "important_dates": [
        {
            "date": "YYYY-MM-DD or description",
            "description": "Event description",
            "type": "milestone/deadline/renewal/termination"
        }
    ],
    "termination_clauses": [
        {
            "type": "termination type (e.g., for cause, convenience, mutual)",
            "notice_period": "Required notice period or null",
            "conditions": "Conditions for termination"
        }
    ],
    "renewal_terms": "Auto-renewal clause or renewal process if applicable or null",
    "confidentiality": {
        "applies": true or false,
        "duration": "Duration of confidentiality obligation or null",
        "scope": "What information is protected or null"
    },
    "intellectual_property": {
        "ownership": "Who owns IP created under contract or null",
        "licenses": "Any licenses granted or null",
        "restrictions": "Usage restrictions or null"
    },
    "liability_and_indemnification": {
        "liability_cap": "Limitation of liability amount or terms or null",
        "indemnification": "Indemnification obligations or null",
        "insurance": "Required insurance coverage or null"
    },
    "warranties_and_representations": ["warranty1", "warranty2"],
    "dispute_resolution": {
        "method": "Arbitration, mediation, litigation or null",
        "jurisdiction": "Governing law and venue or null",
        "governing_law": "Applicable laws or null"
    },
    "special_clauses": [
        {
            "title": "Clause name",
            "description": "Brief description of unique or important clauses"
        }
    ],
    "risks": [
        {
            "category": "financial/legal/operational/reputational",
            "description": "Risk description",
            "severity": "high/medium/low",
            "mitigation": "Suggested mitigation if any or null"
        }
    ],
    "compliance_requirements": ["Any regulatory or compliance obligations"],
    "amendments": "Process for contract amendments or null",
    "notices": "How notices must be delivered between parties or null",
    "missing_elements": ["List any critical elements that seem to be missing"],
    "red_flags": ["Any concerning terms or unusual provisions"],
    "text_analysis": "## Contract Analysis Summary\\n\\n### Contract Overview\\n**Type:** [Contract Type]\\n**Parties:** [List parties]\\n\\n### Key Findings\\n[Comprehensive analysis with proper markdown]\\n\\n### Strengths\\n- [Positive aspects]\\n\\n### Concerns\\n- [Issues or risks]\\n\\n### Recommendations\\n- [Actionable advice]\\n\\n### Summary\\n[Final assessment and overall recommendation]"
}

Contract Content:
"""${extractedText.substring(0, 12000)}"""

CRITICAL INSTRUCTIONS:
1. Return ONLY raw JSON - no markdown, no code blocks, no json wrapper
2. Start your response with { and end with }
3. Adapt the analysis to the specific contract type - not all fields will apply to every contract
4. If a field doesn t apply to this contract type, use null or an empty array/object as appropriate
5. Extract all dates in YYYY-MM-DD format when possible
6. Identify the contract type accurately (employment, service, NDA, lease, sale, partnership, etc.)
7. Flag any missing critical information for that contract type
8. Highlight unusual, concerning, or non-standard provisions

Return only the JSON object - nothing before or after it.
`;

            const result = await model.invoke(prompt);

            // Extract and parse JSON from the response
            let analysisData;
            try {
                analysisData = extractJSON(result.content as string);
            } catch (parseError) {
                console.error("Failed to parse AI response:", result.content);
                return c.json(
                    {
                        success: false,
                        message: "Failed to parse contract analysis. Please try again.",
                        code: 500,
                    },
                    500
                );
            }

            return c.json({
                success: true,
                message: "Contract analyzed successfully",
                data: analysisData,
            }, 200);

        } catch (error) {
            console.log("Error to Analyzing a doc", error);

            return c.json(
                {
                    success: false,
                    message: "Failed to analyze document",
                },
                500
            )
        }
    }
);

export default app;