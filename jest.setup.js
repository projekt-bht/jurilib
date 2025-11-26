// Make DOM matchers like toBeInTheDocument available in tests
require('@testing-library/jest-dom');

// Radix UI components rely on ResizeObserver; provide a lightweight stub for jsdom.
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!global.ResizeObserver) {
  global.ResizeObserver = ResizeObserver;
}
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserver;
}
