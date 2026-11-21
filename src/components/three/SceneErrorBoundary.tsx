"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  onError: () => void;
  fallback?: ReactNode;
}

/**
 * A crash inside the 3D layer must never take the page down (Security.md §5): the canvas
 * disappears and every scene switches to its DOM fallback.
 */
export default class SceneErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
