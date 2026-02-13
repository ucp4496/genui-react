import React from "react";

// Default components
import DefaultHeader from "@/components/default/Header";
import DefaultButton from "@/components/default/Button";
import DefaultText from "@/components/default/Text";
import { getOverrideAwareComponent } from "@/ComponentResolver";


// New default components (data entry app)
import DataEntryShell from "./components/default/DataEntryShell";

export type UIComponent = {
  type: string;
  props?: Record<string, any>;
};

export type RenderCtx = {
  state: Record<string, any>;
  actions: Record<string, (...args: any[]) => any>;
};

const fallbackRegistry: Record<string, React.FC<any>> = {
  Header: DefaultHeader,
  Button: DefaultButton,
  Text: DefaultText,
  DataEntryShell: DataEntryShell,
};

const Renderer: React.FC<{ schema: UIComponent[]; ctx?: RenderCtx }> = ({ schema, ctx }) => {
  return (
    <div>
      {schema.map((comp, i) => {
        const fallback = fallbackRegistry[comp.type];
        if (!fallback) {
          console.warn(`❌ No fallback registered for type: ${comp.type}`);
          return null;
        }

        const Comp = getOverrideAwareComponent(comp.type, fallback);
        return <Comp key={i} {...comp.props} ctx={ctx} />;
      })}
    </div>
  );
};

export default Renderer;
