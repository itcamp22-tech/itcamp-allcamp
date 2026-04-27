import { useAdmin } from "../contexts/admin-context";
import type { Score, CategoryScore } from "../contexts/admin-context";
export type { Score, CategoryScore };

export function useScore() {
  const { score, setScore, ownValue, setOwnValue, otherValue, setOtherValue } = useAdmin();

  const getCalculatedTotal = (category: keyof Score) => {
    const data = score[category];
    let total = 0;
    for (const [key, value] of Object.entries(data)) {
      if (key === category) {
        total += (value as number) * ownValue;
      } else {
        total += (value as number) * otherValue;
      }
    }
    return total;
  };

  return { score, setScore, getCalculatedTotal, ownValue, setOwnValue, otherValue, setOtherValue };
}
