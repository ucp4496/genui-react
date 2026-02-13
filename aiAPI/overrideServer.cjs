require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(cors());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const overridesPath = path.join(__dirname, "../src/overrides");
const defaultsPath = path.join(__dirname, "../src/components/default");

if (!fs.existsSync(overridesPath)) {
  fs.mkdirSync(overridesPath, { recursive: true });
}

function collectFiles(dir, baseDir, prefixRelToSrc) {
  const out = {};

  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      Object.assign(out, collectFiles(fullPath, baseDir, prefixRelToSrc));
      continue;
    }

    if (!stat.isFile()) continue;

    // Path relative to the folder you're collecting (e.g., defaultsPath or overridesPath)
    const relFromBase = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    // We want keys that look like "src/components/default/Whatever.tsx"
    const relPath = `src/${prefixRelToSrc}/${relFromBase}`;

    out[relPath] = fs.readFileSync(fullPath, "utf-8");
  }

  return out;
}

function getEffectiveFiles() {
  const effective = {};

  // 1) Defaults (recursive, files only)
  Object.assign(
    effective,
    collectFiles(defaultsPath, defaultsPath, "components/default")
  );

  // 2) Overrides (recursive, files only) - overwrite defaults if same key exists
  Object.assign(
    effective,
    collectFiles(overridesPath, overridesPath, "overrides")
  );

  return effective;
}

app.post("/override", async (req, res) => {
  const { instructions } = req.body;

  const effectiveFiles = getEffectiveFiles();

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `
            You are part of the GenUI project, which is a way for users to be able to customize their interfaces. The user provides a prompt, and then you will edit the code to make the user interface align with their desired changes. You edit the code by rewriting components, and then that code gets outputted to a file that lives in an "overrides"; if there is an overwritten file, that file gets displayed instead of the default. This ensures that your changes are persistent, yet the original version never gets permanently written over.
            
            You are a React code editor. You can rewrite components OR the root App file. Based on the file contents, rewrite the correct file that the user wants (generally, global changes occur in the root App file). Output only JSON mapping file names to code. 
            
            Any style changes should use Tailwind classes if possible. Remove conflicting class names to ensure the override reflects the new styles clearly, but retain class names that are not conflicting (so for example if color is changed, keep all of the positioning classes). 
            
            Import rule: Do not use relative imports between override files (e.g. ./RecordCard). If an override component needs another component, use getOverrideAwareComponent("Name", DefaultComponent) so it will load an override if present, otherwise use the default. Use the @/format as given in the base files.

            In React controlled inputs, empty strings are valid values. Do not use ?? to provide fallback display text for string fields (because "" ?? "x" stays ""). If you need a fallback for empty strings, use || OR a placeholder. Defaults for form fields must be set in the draft initializer (container/actions), not inside the overlay component.
            
            When generating overrides, understand whether the override instruction should takes precedence over the original logic. Based on the instructions, you might want to preserve old props, defaults, or conditions, or not. Generally speaking, if the user wants a static value changed where props might override them (such as default text), do not include props as a possible value. If the user wants something changed that should not affect or be affected by props values (such as coloring or sizing), keep the props in the original file as is. However, the override should always be a complete replacement of the original file’s logic, and never just a wrapper around it. If variables are declared in the original file, keep them and use them in the overwritten file, unless user instructions indicate otherwise. 
            
            Generally, do not change anything that does not need to be changed based on the user's instructions. Try to keep the files as close to the original as possible!

            The goal of the user's overrides is to help them use the sample application they have been given. Never allow them to replace the entire page with things that are not related to the app, and do not allow them to remove components off of the page.

            SAFETY / SCOPE CONSTRAINTS (MANDATORY): You are editing a study application. Your job is ONLY to make changes that help the user complete the study tasks inside the existing app. You must NOT: replace the entire page with unrelated content (e.g. cats, memes, aesthetic-only pages), remove core app components or workflows (DataEntryShell, RecordList, AddEntryOverlay, correctness/status display, GenUI toggle), bypass or auto-complete the task for the user (no “auto-fill everything”, allow the user to “one-click finish all records”, or remove required fields. If the user requests any forbidden change, DO NOT comply. Instead, keep the application structure intact, and make the smallest helpful change that still respects their intent within the app's context. For example, if they ask “replace everything with a cute cat,” interpret it as “add a small cat-themed icon or subtle style accent” without removing or replacing app functionality.

            ALLOWED CHANGE TYPES: styling tweaks (colors, spacing, font sizes) as long as the app remains intentionally difficult and the task flow remains intact, adding helper UI inside existing components (labels, hints, tooltips) that does not remove required effort, adding optional buttons that perform single, legitimate sub-actions (e.g. paste required note into the Notes field) but DO NOT create “do everything” macros. Also, do default values changes ONLY via DraftDefaults / config modules (not by deleting fields or hiding components).

            STRUCTURE PRESERVATION RULE:
            The page must always render the same core app shell and record-entry workflow. Do not delete, replace, or hide major sections. If unsure whether a change removes functionality, do not do it.
            `,
        },
        {
          role: "user",
          content: `Here are the current files:\n${JSON.stringify(
            effectiveFiles,
            null,
            2
          )}\n\nInstructions: ${instructions}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const json = JSON.parse(response.choices[0].message.content);

    for (const [fileName, code] of Object.entries(json)) {
      // ✅ Normalize file paths so we only write to overrides folder
      let cleanName = fileName
        .replace(/^src\/overrides\//, "") // strip "src/overrides/"
        .replace(/^src\//, "");           // strip "src/"

      const target = path.join(overridesPath, cleanName);

      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, code, "utf-8");
      console.log(`✅ Wrote override: ${target}`);
    }


    res.json({ success: true, files: Object.keys(json) });
  } catch (err) {
    console.error("❌ Override failed:", err);
    res.status(500).json({ error: "Failed to generate overrides" });
  }
});

app.listen(3001, () =>
  console.log("✅ Override server running at http://localhost:3001")
);
