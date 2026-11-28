import { expect, test } from "vitest";
import {
  isValidActiveWorkout,
  isValidRoutines,
  isValidCompletedWorkouts,
} from "../utils/storageValidators";

test("returns true for a valid active workout", () => {
  const activeWorkout = {
    name: "Push Day",
    startTime: 1000,
    exercises: [],
  };
  expect(isValidActiveWorkout(activeWorkout)).toBe(true);
});

test("returns false for an invalid active workout", () => {
  const activeWorkout = {
    name: "Push Day",
    startTime: "1000",
    exercises: [],
  };

  expect(isValidActiveWorkout(activeWorkout)).toBe(false);
});

test("returns true for valid routines", () => {
  const routines = [
    {
      id: "routine-1",
      name: "Push Day",
      exercises: [
        {
          id: "exercise-1",
          name: "Bench Press",
        },
      ],
    },
  ];
  expect(isValidRoutines(routines)).toBe(true);
});

test("returns false for invalid routines", () => {
  const routines = [
    {
      id: "routine-1",
      name: "Push Day",
      exercises: ["Bench Press"],
    },
  ];
  expect(isValidRoutines(routines)).toBe(false);
});

test("returns true for valid completed workouts", () => {
  const completedWorkouts = [
    {
      id: "workout-1",
      name: "Push Day",
      date: "2026-11-28T10:00:00.000Z",
      duration: 600,
      exercises: [
        {
          id: "exercise-1",
          name: "Bench Press",
          sets: [
            {
              id: "set-1",
              weight: 80,
              reps: 10,
            },
          ],
        },
      ],
    },
  ];
  expect(isValidCompletedWorkouts(completedWorkouts)).toBe(true);
});

test("returns false for invalid completed workouts", () => {
  const completedWorkouts = [
    {
      id: "workout-1",
      name: "Push Day",
      date: "2026-11-28T10:00:00.000Z",
      duration: 600,
      exercises: [
        {
          id: "exercise-1",
          name: "Bench Press",
          sets: [
            {
              id: "set-1",
              weight: 80,
              reps: "",
            },
          ],
        },
      ],
    },
  ];
  expect(isValidCompletedWorkouts(completedWorkouts)).toBe(false);
});
