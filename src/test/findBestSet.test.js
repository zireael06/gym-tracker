import { expect, test } from "vitest";
import findBestSet from "../utils/findBestSet";

test("returns null when there are no sets", () => {
  const bestSet = findBestSet([]);

  expect(bestSet).toBeNull();
});

test("returns the set with the highest weight", () => {
  const bestSet = findBestSet([
    { id: "set-1", weight: 80, reps: 12 },
    { id: "set-2", weight: 85, reps: 6 },
    { id: "set-3", weight: 80, reps: 14 },
  ]);

  expect(bestSet).toEqual({
    id: "set-2",
    weight: 85,
    reps: 6,
  });
});

test("uses reps as a tie-breaker when weights are equal", () => {
  const bestSet = findBestSet([
    { id: "set-1", weight: 80, reps: 8 },
    { id: "set-2", weight: 80, reps: 11 },
    { id: "set-3", weight: 75, reps: 15 },
  ]);

  expect(bestSet).toEqual({
    id: "set-2",
    weight: 80,
    reps: 11,
  });
});
