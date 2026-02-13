import { useState } from "react";
import Renderer, { type UIComponent } from "./Render";
import DataEntryContainer from "./DataEntryContainer";

const initialSchema: UIComponent[] = [
  { type: "Header", props: { text: "Welcome to GenUI" } },
  { type: "Text", props: { text: "This is the default text component." } },
  { type: "Button", props: { text: "Click Me" } },
];

function AppDefault() {
    return <DataEntryContainer />;
}

export default AppDefault;
