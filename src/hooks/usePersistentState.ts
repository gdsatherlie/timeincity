import { Dispatch, SetStateAction, useEffect, useState } from "react";

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) {
      return defaultValue;
    }
    return JSON.parse(stored) as T;
  } catch (error) {
    console.warn(`Failed to read localStorage key ${key}:`, error);
    return defaultValue;
  }
}

export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => getStoredValue(key, defaultValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to persist localStorage key ${key}:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
