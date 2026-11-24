function readStoredValue(key, fallbackValue, isValid = () => true) {
  const storedValue = localStorage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    return isValid(parsedValue) ? parsedValue : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export default readStoredValue;
