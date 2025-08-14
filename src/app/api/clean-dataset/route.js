import { NextResponse } from "next/server";
import Papa from "papaparse";
import { cleanDataWithGemini } from "../../modelloDataset/utils/cleanDataWithGemini";

export const runtime = "nodejs"; // assicura ambiente Node

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "File mancante" }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim(),
    });

    if (parsed.errors?.length) {
      console.warn("CSV parse warnings:", parsed.errors.slice(0, 3));
    }

    const rows = (parsed.data || []).filter(
      (r) => Object.values(r).some((v) => String(v ?? "").trim() !== "")
    );

    const cleaned = await cleanDataWithGemini(rows);
    return NextResponse.json(cleaned);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Errore" }, { status: 500 });
  }
}
