import { useState, useEffect, useCallback } from "react";

export const usePersistentState = (key, initialState) => {
  const [state, setState] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);
  return [state, setState];
};

export const useComplexPersistentState = (key, initialState) => {
  let retrieve;
  try {
    retrieve = JSON.parse(localStorage.getItem(key));
  }
  catch(err) {
    retrieve = initialState;
  }
  if (typeof retrieve !== 'object' || retrieve === null)
    retrieve = initialState
  const [state, setState] = useState(retrieve);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
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

