import { useState } from "react";

export function useSelection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const onFocus = (index: number) => {
    setSelectedIndex(index);
  };

  const onBlur = () => {
    setSelectedIndex(null);
  };

  return {
    selectedIndex,
    onFocus,
    onBlur,
  };
}
