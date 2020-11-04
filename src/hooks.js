import { useState, useEffect, useCallback } from "react";

export const usePersistentState = (key, initialState) => {
  const [state, setState] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);
  return [state, setState];
};

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => {
    setState((s) => !s);
  }, [setState]);
  return [state, toggle];
};

