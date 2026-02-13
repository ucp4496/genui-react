import React from "react";

// Recursive so nested overrides work
const overrides = import.meta.glob("./overrides/**/*.{ts,tsx}", { eager: true });


export function getOverrideAwareModule<T>(name: string, fallback: T): T {
  const match = Object.entries(overrides).find(([p]) =>
    p.endsWith(`/${name}.ts`) || p.endsWith(`/${name}.tsx`)
  );

  if (match) {
    const mod = match[1] as any;
    // support either default export OR named export
    return (mod?.default ?? mod?.draftDefaults ?? mod) as T;
  }

  return fallback;
}

export function getOverrideAwareComponent<TProps = any>(
  name: string,
  fallback: React.FC<TProps>
): React.FC<TProps> {
  const match = Object.entries(overrides).find(([p]) =>
    p.endsWith(`/${name}.tsx`) || p.endsWith(`${name}.tsx`) || p.endsWith(`/${name}.ts`) || p.endsWith(`${name}.ts`)
  );

  if (match) {
    const mod = match[1] as any;
    if (mod?.default) {
      console.log(`🟣 Using override for ${name} from: ${match[0]}`);
      return mod.default;
    }
  }

  console.log(`⚪ Using default for ${name}`);
  return fallback;
}
