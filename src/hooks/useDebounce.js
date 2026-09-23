import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing fast-changing values like search input.
 * Delay defaults to 500ms per Sprint 8 requirements.
 * 
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} debouncedValue - Value updated after delay
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timer to update debounced value after specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer on value or delay change to reset timer
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
