import { expect, test } from "vitest";
import calculateProgressionTarget from "../utils/calculateProgressionTarget";

test("adds one rep when the best set is below 12 reps", () => {
  const progressionTarget = calculateProgressionTarget({
    weight: 80,
    reps: 10,
  });

  expect(progressionTarget).toEqual({
    weight: 80,
    reps: 11,
  });
});

test("increases weight and resets reps when the best set reaches 12 reps", () => {
  const result = calculateProgressionTarget({
    weight: 80,
    reps: 12,
  });

  expect(result).toEqual({
    weight: 82.5,
    reps: 8,
  });
});
