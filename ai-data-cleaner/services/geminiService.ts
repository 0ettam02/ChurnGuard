
import { GoogleGenAI, Type } from "@google/genai";
import { MasterRecord } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const masterSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        customer_id: { type: Type.STRING, description: "The customer's unique identifier, e.g., CUST0001."},
        sesso: { type: Type.STRING, description: "Customer's gender, 'M' or 'F'. Empty string if unknown." },
        età: { type: Type.INTEGER, description: "Customer's age as a number. 0 if unknown." },
        data_iscrizione: { type: Type.STRING, description: "Subscription start date, formatted as YYYY-MM-DD. Empty string if unknown." },
        tipo_abbonamento: { type: Type.STRING, description: "Subscription type: 'mensile', 'trimestrale', 'annuale'. Empty string if unknown." },
        prezzo_abbonamento: { type: Type.NUMBER, description: "Subscription price as a float. 0 if unknown." },
        ultima_presenza: { type: Type.STRING, description: "Last attendance date, formatted as YYYY-MM-DD. Empty string if unknown." },
        media_presenze_sett: { type: Type.NUMBER, description: "Average weekly attendance as a float. 0 if unknown." },
        giorni_da_ultima_presenza: { type: Type.INTEGER, description: "Days since last attendance. 0 if unknown." },
        churn: { type: Type.INTEGER, description: "Churn status: 1 for churned, 0 for not churned. 0 if unknown." },
      },
      required: ["customer_id", "sesso", "età", "data_iscrizione", "tipo_abbonamento", "prezzo_abbonamento", "ultima_presenza", "media_presenze_sett", "giorni_da_ultima_presenza", "churn"]
    }
};

const getCleaningPrompt = (data: any[]): string => `
You are an AI assistant that transforms messy gym membership datasets into a clean, standardized JSON format.

Master dataset structure (columns and order):
customer_id
sesso
età
data_iscrizione
tipo_abbonamento
prezzo_abbonamento
ultima_presenza
media_presenze_sett
giorni_da_ultima_presenza
churn

Requirements:
- The output must be a valid JSON array of objects.
- Each object's properties must match the master dataset structure and order exactly.
- All dates (data_iscrizione and ultima_presenza) must be in ISO format: YYYY-MM-DD.
- Use . as the decimal separator for all numeric values.
- All numeric fields in the JSON must be numbers, not strings.
- Ensure there are no missing or null values. If a value is missing or invalid:
    - For 'sesso', 'tipo_abbonamento': use an empty string "".
    - For 'data_iscrizione', 'ultima_presenza': use an empty string "".
    - For 'età', 'prezzo_abbonamento', 'media_presenze_sett', 'giorni_da_ultima_presenza', 'churn': use 0.
- Values must be realistic for gym memberships (e.g., age, subscription types).
- customer_id: must follow the format CUST0000. If the source ID is a number (e.g., 1, 23), pad it to create the ID (e.g., 1 -> CUST0001, 23 -> CUST0023). If a non-numeric ID is provided, use it as is. If missing, generate a new unique ID in the CUST0000 format.
- sesso: must be 'M' or 'F'.
- tipo_abbonamento: must be one of 'mensile', 'trimestrale', 'annuale'.
- churn: must be 0 or 1.

Input:
You will receive Dataset B. It may have:
- Different column names
- Extra or missing columns
- Messy or inconsistent data formats
- Mixed numeric decimal separators (, or .)
- Extra indexes

Your task:
- Map Dataset B’s columns to the master structure.
- Clean and normalize all data values according to the requirements above.
- Fill any missing fields with the specified defaults.
- Reorder columns exactly according to the master structure.
- Remove any extra index columns from the original data.

IMPORTANT: Your output MUST be a valid JSON array of objects. Do not include any explanatory text, markdown, or anything else besides the JSON array.

MESSY INPUT DATA (Dataset B):
${JSON.stringify(data.slice(0, 50))}

Process the entire dataset provided and return the cleaned JSON.
`;

export const cleanDataWithGemini = async (data: any[], setProcessingMessage: (msg: string) => void): Promise<MasterRecord[]> => {
    if (!data || data.length === 0) {
        return [];
    }
    
    setProcessingMessage('Constructing AI request...');
    const prompt = getCleaningPrompt(data);

    try {
        setProcessingMessage('Sending data to Gemini for cleaning...');
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: masterSchema,
            },
        });
        
        setProcessingMessage('Parsing AI response...');
        const textResponse = response.text.trim();
        
        // Sometimes the model might wrap the JSON in markdown, let's strip it.
        const jsonText = textResponse.replace(/^```json\n/, '').replace(/\n```$/, '');

        const cleanedData = JSON.parse(jsonText) as MasterRecord[];
        
        setProcessingMessage('Data transformation complete!');
        await new Promise(resolve => setTimeout(resolve, 500)); // small delay for user to see the message

        return cleanedData;

    } catch(error) {
        console.error("Error during Gemini API call:", error);
        if (error instanceof Error && error.message.includes('JSON')) {
             throw new Error("The AI returned an invalid data format. This can happen with very unusual datasets. Please check your file for major inconsistencies.");
        }
        throw new Error("The AI failed to process the data. Please try again later.");
    }
};