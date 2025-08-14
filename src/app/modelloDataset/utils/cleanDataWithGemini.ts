import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface CleanedRow {
  customer_id: string;
  sesso: string;
  età: number;
  data_iscrizione: string;
  tipo_abbonamento: string;
  prezzo_abbonamento: number;
  ultima_presenza: string;
  media_presenze_sett: number;
  giorni_da_ultima_presenza: number;
  churn: number;
}

const masterSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      customer_id: { type: Type.STRING, description: "CUST0001..." },
      sesso: { type: Type.STRING, description: "M o F, '' se sconosciuto" },
      età: { type: Type.INTEGER, description: "Numero, 0 se sconosciuto" },
      data_iscrizione: { type: Type.STRING, description: "YYYY-MM-DD o ''" },
      tipo_abbonamento: { type: Type.STRING, description: "mensile|trimestrale|annuale|''" },
      prezzo_abbonamento: { type: Type.NUMBER, description: "float, 0 se sconosciuto" },
      ultima_presenza: { type: Type.STRING, description: "YYYY-MM-DD o ''" },
      media_presenze_sett: { type: Type.NUMBER, description: "float, 0 se sconosciuto" },
      giorni_da_ultima_presenza: { type: Type.INTEGER, description: "int, 0 se sconosciuto" },
      churn: { type: Type.INTEGER, description: "0 o 1" },
    },
    required: [
      "customer_id","sesso","età","data_iscrizione","tipo_abbonamento",
      "prezzo_abbonamento","ultima_presenza","media_presenze_sett",
      "giorni_da_ultima_presenza","churn",
    ],
  },
};

const getCleaningPrompt = (data: any[]) => `
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
- Output must be a valid JSON array of objects, nothing else.
- Match the master dataset columns and order exactly.
- All dates must be YYYY-MM-DD (ISO) or "" if unknown.
- Use "." as decimal separator.
- Numeric fields must be numbers, not strings.
- No null/undefined values. Use defaults:
  - 'sesso', 'tipo_abbonamento', 'data_iscrizione', 'ultima_presenza' => ""
  - 'età', 'prezzo_abbonamento', 'media_presenze_sett', 'giorni_da_ultima_presenza', 'churn' => 0
- Values must be realistic.
- customer_id must follow CUST0000; if missing, generate unique.

Input:
Dataset may have different columns, formats, extra index, messy values.

TASK:
- Map columns to the master structure.
- Normalize values as above.
- Reorder columns exactly as the master.
- Remove any extra columns.

MESSY INPUT DATA (first 50 rows):
${JSON.stringify(data.slice(0, 50))}
`;

export async function cleanDataWithGemini(data: any[]): Promise<CleanedRow[]> {
  if (!data || data.length === 0) return [];

  const prompt = getCleaningPrompt(data);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: masterSchema,
      },
    });

    interface MyGenerateContentResponse extends GenerateContentResponse {
      structured_output?: CleanedRow[];
    }

    const resp = response as MyGenerateContentResponse;
    const cleaned: CleanedRow[] = resp.structured_output?.length
      ? resp.structured_output
      : JSON.parse((response?.text ?? "[]").replace(/^```json\s*/i, "").replace(/```$/i, ""));

    const ORDER: (keyof CleanedRow)[] = [
      "customer_id","sesso","età","data_iscrizione","tipo_abbonamento",
      "prezzo_abbonamento","ultima_presenza","media_presenze_sett",
      "giorni_da_ultima_presenza","churn"
    ];

    const normalized: CleanedRow[] = cleaned.map(row => {
      const out: Partial<CleanedRow> = {};
      ORDER.forEach((k) => {
        let v = row?.[k];
        if (v === null || v === undefined || v === "") {
          if (["sesso","data_iscrizione","tipo_abbonamento","ultima_presenza"].includes(k)) v = "";
          else v = 0;
        }
        if (["età","prezzo_abbonamento","media_presenze_sett","giorni_da_ultima_presenza","churn"].includes(k)) {
          v = Number(v) || 0;
        }
        if (k === "customer_id" && (!v || !/^CUST\d{4,}$/.test(String(v)))) {
          v = `CUST${Math.floor(Math.random()*9999).toString().padStart(4,'0')}`;
        }
        out[k] = v as CleanedRow[keyof CleanedRow];
      });
      return out as CleanedRow;
    });

    return normalized;

  } catch (error: any) {
    console.error("Error during Gemini API call:", error);
    if (error instanceof Error && /JSON/i.test(error.message)) {
      throw new Error("The AI returned an invalid data format.");
    }
    throw new Error("AI cleaning failed");
  }
}
