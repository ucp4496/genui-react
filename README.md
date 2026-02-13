# GenUI

GenUI is an interactive proof-of-concept that demonstrates how a user interface can be dynamically modified using natural language. This project includes a mock warehouse data entry system designed to be intentionally simple so that UI changes driven by GenUI are easy to see, test, and iterate on.

The goal is to explore how users can shape and personalize software in real time, with no manual UI editing required.

---

## Getting Started

### 1. Clone The Repo
Clone this repo however you would like!

### 2. Install Dependencies
Run a standard install for React projects:

```bash
npm install
```

### Create an OpenAI API Key
GenUI uses OpenAI to generate UI overrides.

1. Go to OpenAI and create an API key.
2. In your terminal, export the key:

```bash
export OPENAI_API_KEY=[your key here]
```

(You can add this to your shell config if you don’t want to repeat it every session.)

---

## Running the Project

You’ll need two terminals open.

### Terminal 1 – Start the React App
```bash
npm run dev
```

### Terminal 2 – Start the GenUI Override Server
```bash
cd aiAPI
node overrideServer.cjs
```

---

## Testing It Out

Once both servers are running:

1. Open the local port shown in your React terminal.
2. Use the GenUI interface to modify the mock data entry UI.
3. Watch the layout and components update dynamically based on your prompts.

This setup is intentionally lightweight so you can focus on experimenting, iterating, and seeing how far natural-language UI customization can go.

---

## Notes

- This is a prototype environment meant for experimentation and research.
- The data entry system is mock-only and exists purely to visualize UI changes.
- If something breaks, try stopping both servers, deleting everything inside of the overrides folder, and then restarting both servers

---

Happy testing! ✨
