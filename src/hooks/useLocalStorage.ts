'use client';

import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  schema?: z.ZodType<T>
): [T, (value: T | ((prev: T) => T)) => void] {
  // Lazy initializer — reads localStorage once on mount, no effect needed
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        if (schema) {
          const result = schema.safeParse(parsed);
          if (result.success) {
            return result.data;
          }
        } else {
          return parsed as T;
        }
      }
    } catch {
      // If reading fails, use default
    }
    return defaultValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prevValue) => {
          const valueToStore =
            value instanceof Function ? value(prevValue) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch {
        // If saving fails, silently ignore
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
