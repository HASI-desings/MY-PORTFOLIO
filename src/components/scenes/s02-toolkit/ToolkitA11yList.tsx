"use client";

import { toolkit } from "@/content/toolkit";
import { useExperience } from "@/store/experience";

/**
 * Keyboard + screen-reader mirror of the 3D tools: a visually hidden list of real buttons.
 * Focusing one lifts its 3D tile and shows its label, exactly like hover (Rules.md §6.4).
 */
export default function ToolkitA11yList() {
  const setHoveredTool = useExperience((s) => s.setHoveredTool);
  return (
    <ul className="sr-only" aria-label="Tools I use">
      {toolkit.map((tool) => (
        <li key={tool.id}>
          <button
            type="button"
            onFocus={() => setHoveredTool(tool.id)}
            onBlur={() => setHoveredTool(null)}
            aria-label={`${tool.name} — ${tool.group}. ${tool.line}`}
          >
            {tool.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
