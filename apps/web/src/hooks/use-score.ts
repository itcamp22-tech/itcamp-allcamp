import { useState } from "react";
import { useAdmin } from "../contexts/admin-context";

export interface CategoryScore {
  re: number;
  drop: number;
  pro: number;
  tire: number;
}

export interface Score {
  re: CategoryScore;
  drop: CategoryScore;
  pro: CategoryScore;
  tire: CategoryScore;
}

export function useScore() {
  const [score, setScore] = useState<Score>({
    re: {
      re: 10,
      drop: 1,
      pro: 1,
      tire: 1,
    },
    drop: {
      re: 2,
      drop: 15,
      pro: 4,
      tire: 1,
    },
    pro: {
      re: 3,
      drop: 2,
      pro: 8,
      tire: 0,
    },
    tire: {
      re: 0,
      drop: 0,
      pro: 0,
      tire: 0,
    },
  });

  const { ownValue, setOwnValue, otherValue, setOtherValue } = useAdmin();

  const getCalculatedTotal = (category: keyof Score) => {
    const data = score[category];
    let total = 0;
    for (const [key, value] of Object.entries(data)) {
      if (key === category) {
        total += value * ownValue;
      } else {
        total += value * otherValue;
      }
    }
    return total;
  };

  return { score, setScore, getCalculatedTotal, ownValue, setOwnValue, otherValue, setOtherValue };
}
