import { beforeEach, expect, test } from "vitest";
import readStoredValue from "../utils/readStoredValue";

beforeEach(() => {
  localStorage.clear();
});

test("returns parsed data when stored JSON is valid", () => {
  localStorage.setItem("activeWorkout", JSON.stringify({ name: "Push Day" }));

  const result = readStoredValue("activeWorkout", null);

  expect(result).toEqual({ name: "Push Day" });
});

test("returns the fallback when the storage key is missing", () => {
  const result = readStoredValue("completedWorkouts", []);

  expect(result).toEqual([]);
});

test("returns the fallback when stored JSON is invalid", () => {
  localStorage.setItem("activeWorkout", "not valid JSON");

  const result = readStoredValue("activeWorkout", null);

  expect(result).toBeNull();
});
