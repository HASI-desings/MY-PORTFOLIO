import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonState = "idle" | "loading" | "success" | "error";

interface Common {
  variant?: ButtonVariant;
  size?: "md" | "lg";
  state?: ButtonState;
  /** Shown after the label (arrow ↗, etc.). */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type AsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };
type AsLink = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string; external?: boolean };

const OWN_PROPS = new Set([
  "variant",
  "size",
  "state",
  "icon",
  "className",
  "children",
  "external",
]);

/** Everything except the Button's own props, safe to spread onto the DOM element. */
function domProps(props: object) {
  return Object.fromEntries(Object.entries(props).filter(([k]) => !OWN_PROPS.has(k)));
}

/**
 * One button for the whole site, with every state from Design.md §10: default, hover,
 * focus-visible, pressed, disabled, loading ("…" pulse), success, error. Renders a real <a>
 * for links so they are never blocked as pop-ups (Security.md §8).
 */
export default function Button(props: AsButton | AsLink) {
  const { variant = "outline", size = "md", state = "idle", icon, className, children } = props;
  const classes = cn(
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    state !== "idle" && `is-${state}`,
    className,
  );
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {state === "loading" ? (
        <span className="btn__dots" aria-hidden="true">
          …
        </span>
      ) : icon ? (
        <span className="btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (typeof props.href === "string") {
    const external = props.external;
    return (
      <a
        {...(domProps(props) as AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-busy={state === "loading" || undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...(domProps(props) as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
      aria-busy={state === "loading" || undefined}
    >
      {content}
    </button>
  );
}
