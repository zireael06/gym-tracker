import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Workout from "../components/Workout";
import userEvent from "@testing-library/user-event";


test("prevents finishing a workout with no sets", () => {
  render(
    <Workout
      name="Push Day"
      routineExercises={[
        {
          id: "routine-exercise-1",
          name: "Bench Press",
        },
      ]}
      completedWorkouts={[]}
      onFinish={vi.fn()}
      startTime={Date.now()}
      savedWorkout={null}
      onExit={vi.fn()}
    />
  );

  const finishButton = screen.getByRole("button", {
    name: "Finish Workout",
  });

  expect(finishButton).toBeDisabled();

  expect(
    screen.getByText(
      "Add at least one set before finishing."
    )
  ).toBeInTheDocument();
});



test("finishes a workout when it contains a valid set", async () => {
  const user = userEvent.setup();
  const onFinish = vi.fn();

  const savedWorkout = {
    name: "Push Day",
    startTime: Date.now(),
    exercises: [
      {
        id: "exercise-1",
        name: "Bench Press",
        sets: [
          {
            id: "set-1",
            weight: 80,
            reps: 8,
          },
        ],
      },
    ],
  };

  render(
    <Workout
      name="Push Day"
      routineExercises={[]}
      completedWorkouts={[]}
      onFinish={onFinish}
      startTime={savedWorkout.startTime}
      savedWorkout={savedWorkout}
      onExit={vi.fn()}
    />
  );

  const finishButton = screen.getByRole("button", {
    name: "Finish Workout",
  });

  expect(finishButton).toBeEnabled();

  await user.click(finishButton);

  expect(onFinish).toHaveBeenCalledTimes(1);

  expect(onFinish).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "Push Day",
      exercises: savedWorkout.exercises,
    })
  );
});


test("prevents finishing a workout with an invalid set", () => {
  const onFinish = vi.fn();

  const invalidSavedWorkout = {
    name: "Push Day",
    startTime: Date.now(),
    exercises: [
      {
        id: "exercise-1",
        name: "Bench Press",
        sets: [
          {
            id: "set-1",
            weight: 80,
            reps: 0,
          },
        ],
      },
    ],
  };

  render(
    <Workout
      name="Push Day"
      routineExercises={[]}
      completedWorkouts={[]}
      onFinish={onFinish}
      startTime={invalidSavedWorkout.startTime}
      savedWorkout={invalidSavedWorkout}
      onExit={vi.fn()}
    />
  );

  const finishButton = screen.getByRole("button", {
    name: "Finish Workout",
  });

  expect(finishButton).toBeDisabled();

  expect(
    screen.getByText(
      "Enter a weight of 0 or more and whole-number reps of at least 1 for every set."
    )
  ).toBeInTheDocument();

  expect(
    screen.queryByText(
      "Add at least one set before finishing."
    )
  ).not.toBeInTheDocument();

  expect(onFinish).not.toHaveBeenCalled();
});