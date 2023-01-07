import "whatwg-fetch";
/**
 * Mock ResizeObserver
 */
global.ResizeObserver = require("resize-observer-polyfill");

/**
 * Mock IntersectionObserver
 */
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
global.IntersectionObserver = mockIntersectionObserver;
