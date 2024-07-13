import { useState, useEffect } from "react";

const useDebouncedInput = ({
  seconds = 300, // 300ms
}: {
  seconds: number;
}) => {
  const [value, setValue] = useState<number>(0);
  const [debouncedValue, setDebouncedValue] = useState<number>(0);

  useEffect(() => {
    let id = setTimeout(() => {
      setDebouncedValue(value);
    }, seconds);

    return () => {
      clearTimeout(id);
    };
  }, [value]);

  return { debouncedValue, setValue } as const;
};

export default useDebouncedInput;
