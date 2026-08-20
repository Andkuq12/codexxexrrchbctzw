import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes FIRST
app.post("/api/ai/suggest", async (req, res) => {
  try {
    const { code, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please configure it in the Secrets panel." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
You are an expert Lua developer specializing in the Growlauncher module system.
The user is building a module using a JSON configuration and needs a suggestion or improvement for their code.

Context about their current module state:
${JSON.stringify(context, null, 2)}

Here is the code they want you to review or improve (could be JSON configuration or Lua logic):
\`\`\`
${code}
\`\`\`

Provide a short, actionable suggestion to improve this code. Focus on best practices for Growlauncher modules:
1. Ensure 'alias' follows the 'name!randomInt' pattern.
2. For dropdowns, 'default' must be an integer index, and 'value' must be an escaped JSON array string.
3. For tile_select, use 'pairs()' and deduplicate.
4. Button 'vtype' is 0, and value is 'false' when clicked.
5. Item_picker returns a string name, which needs growtopia.getItemID(value).

Keep your response concise and directly useful. Return your response in Markdown.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ suggestion: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate suggestion." });
  }
});

// AI Module Maker: rebuilds or tidies up the module's `menu` array.
// mode "redesign"  -> AI is free to restructure, add polish elements (dividers, section labels, tooltips), improve wording.
// mode "tidy"      -> AI only reorders / groups / lightly cleans up, must preserve every existing element's core identity (type, alias, key data).
app.post("/api/ai/module-maker", async (req, res) => {
  try {
    const { config, mode } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please configure it in the Secrets panel." });
    }
    if (mode !== "redesign" && mode !== "tidy") {
      return res.status(400).json({ error: "Invalid mode. Use 'redesign' or 'tidy'." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const schemaDocs = `
Growlauncher module schema reference (each item in "menu" is one of these types):
- labelapp: { type, icon, text } — big section header with icon.
- label: { type, text, alias? } — plain text line.
- divider: { type } — visual separator, no other fields.
- tooltip: { type, icon, text, support_text } — icon + title + smaller description below.
- input_int: { type, text, alias, default(number), icon?, placeholder? }
- input_string: { type, text, alias, default(string), icon?, placeholder?, readonly? }
- slider: { type, text, alias, min, max, default(number), icon? }
- dropdown: { type, text, alias, value(JSON array string of options), default(0-based index number), icon? }
- item_picker: { type, text, alias, default(item name string), item, icon? }
- tile_select: { type, text, alias, count(number) }
- simple_display: { type, icon, text, description?, alias, default(JSON array string), setup? }
- button: { type, text, alias, icon? }
- toggle: { type, text, alias, default(boolean), icon?, expandable?, always_expand?, background?, list_child?(array of elements, nested) }
- toggle_button: { type, text, alias, default(boolean), icon? }
- dialog: { type, text, support_text?, fill?, menu(array of elements, nested) }

Rules that MUST be respected:
1. Every "icon" value must be a valid Material Symbols icon name in PascalCase (e.g. "PlayArrow", "Info", "Timer", "SwapHoriz"), sourced from fonts.google.com/icons.
2. Every "alias" value must be a short snake_case base name with NO suffix (e.g. "delay_action", "feature_enabled") — the app appends the "!<id>" part automatically, so never include "!" or any random number yourself.
3. Preserve the exact "type" and "alias" base name of any element that already has one, unless the mode explicitly allows restructuring — never invent new aliases for elements the user already configured, since Lua logic elsewhere depends on those exact names.
4. Keep "sub_name" and "icon" (module-level icon) unless asked to redesign them too.
5. Output ONLY the JSON object matching { "sub_name": string, "icon": string, "menu": [...] } — no markdown fences, no commentary.
`;

    const modeInstruction = mode === "redesign"
      ? `Mode: REDESIGN. Rebuild this module's layout to look more polished and professional. You may reorder, regroup with section headers (labelapp) and dividers, add helpful tooltips, improve text labels for clarity, and improve icon choices — but you must keep every element's "type" and "alias" base name intact (so the existing Lua logic keeps working), and you must not delete elements or invent new aliases.`
      : `Mode: TIDY. Only lightly reorganize and clean up — group related elements with dividers/section labels where it clearly helps, fix inconsistent icons, and improve wording slightly. Do NOT restructure heavily, do NOT remove or merge elements, and keep the overall order mostly the same.`;

    const prompt = `
You are an expert UI/UX designer for the Growlauncher module system (a Lua-based mobile app UI for Growtopia).

${schemaDocs}

${modeInstruction}

Current module configuration:
${JSON.stringify(config, null, 2)}

Return the improved module configuration as a single raw JSON object (no markdown, no code fences, no explanation).
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let text = (response.text || "").trim();
    // Defensive cleanup in case the model wraps the JSON in fences anyway.
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      console.error("AI Module Maker: failed to parse JSON", text);
      return res.status(500).json({ error: "AI mengembalikan format yang tidak valid. Coba lagi." });
    }

    if (!parsed || !Array.isArray(parsed.menu)) {
      return res.status(500).json({ error: "AI mengembalikan struktur module yang tidak lengkap. Coba lagi." });
    }

    res.json({ config: parsed });
  } catch (error) {
    console.error("AI Module Maker Error:", error);
    res.status(500).json({ error: "Gagal membuat ulang module. Coba lagi." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
