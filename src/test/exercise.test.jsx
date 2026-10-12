import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Exercise from "../components/Exercise";


const sampleSets = [
  {
    id: "set-1",
    weight: 50,
    reps: 10,
  },
];

const previousExercise = {
  id: "previous-exercise-1",
  name: "Bench Press",
  sets: [
    {
      id: "previous-set-1",
      weight: 70,
      reps: 12,
    },
    {
      id: "previous-set-2",
      weight: 80,
      reps: 8,
    },
    {
      id: "previous-set-3",
      weight: 80,
      reps: 6,
    },
  ],
};

test("calls onAddSet with the exercise ID", async () => {
  const user = userEvent.setup();
  const onAddSet = vi.fn();

  render(
    <Exercise
      name="Bench Press"
      id="exercise-1"
      sets={[]}
      onRemove={vi.fn()}
      onAddSet={onAddSet}
      onUpdateWeight={vi.fn()}
      onUpdateReps={vi.fn()}
      onRemoveSet={vi.fn()}
      previousExercise={null}
    />
  );

  await user.click(
    screen.getByRole("button", { name: "Add Set" })
  );

  expect(onAddSet).toHaveBeenCalledWith("exercise-1")
});



test("calls onRemoveSet with the exercise and set IDs", async () => {
  const user = userEvent.setup();
  const onRemoveSet = vi.fn();

  render(
    <Exercise
      name="Bench Press"
      id="exercise-1"
      sets={sampleSets}
      onRemove={vi.fn()}
      onAddSet={vi.fn()}
      onUpdateWeight={vi.fn()}
      onUpdateReps={vi.fn()}
      onRemoveSet={onRemoveSet}
      previousExercise={null}
    />
  );

  await user.click(
    screen.getByRole("button", { name: "Remove" })
  );

  expect(onRemoveSet).toHaveBeenCalledWith("exercise-1", "set-1");

});


test("calls onUpdateWeight with the new weight as a number", () => {
  const onUpdateWeight = vi.fn();

  render(
    <Exercise
      name="Bench Press"
      id="exercise-1"
      sets={sampleSets}
      onRemove={vi.fn()}
      onAddSet={vi.fn()}
      onUpdateWeight={onUpdateWeight}
      onUpdateReps={vi.fn()}
      onRemoveSet={vi.fn()}
      previousExercise={null}
    />
  );

  const weightInput = screen.getByRole("spinbutton", {
    name: "Weight (kg)",
  });

  fireEvent.change(weightInput, {
    target: { value: "60" },
  });

  expect(onUpdateWeight).toHaveBeenCalledWith("exercise-1", "set-1", 60);
});



test("calls onUpdatedReps with the new rep as a number", () => {
  const onUpdatedReps = vi.fn();

  render(
    <Exercise
      name="Bench Press"
      id="exercise-1"
      sets={sampleSets}
      onRemove={vi.fn()}
      onAddSet={vi.fn()}
      onUpdateWeight={vi.fn()}
      onUpdateReps={onUpdatedReps}
      onRemoveSet={vi.fn()}
      previousExercise={null}
    />
  );

  const repsInput = screen.getByRole("spinbutton", {
    name: "Reps",
  });

  fireEvent.change(repsInput, {
    target: { value: "12" },
  });

  expect(onUpdatedReps).toHaveBeenCalledWith("exercise-1", "set-1", 12);
});



test("shows the previous best set and next target", () => {
  render(
    <Exercise
      name="Bench Press"
      id="exercise-1"
      sets={[]}
      onRemove={vi.fn()}
      onAddSet={vi.fn()}
      onUpdateWeight={vi.fn()}
      onUpdateReps={vi.fn()}
      onRemoveSet={vi.fn()}
      previousExercise={previousExercise}
    />
  );

  expect(
    screen.getByText("Previous best: 80kg × 8 reps")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Target: 80kg × 9 reps")
  ).toBeInTheDocument();
});



test("increases the target weight after reaching 12 reps", () => {
  const completedRepTarget = {
    id: "previous-exercise-2",
    name: "Bench Press",
    sets: [
      {
        id: "previous-set-4",
        weight: 80,
        reps: 12,
      },
    ],
  };

  render(
    <Exercise
      name="Bench Press"
      id="exercise-1"
      sets={[]}
      onRemove={vi.fn()}
      onAddSet={vi.fn()}
      onUpdateWeight={vi.fn()}
      onUpdateReps={vi.fn()}
      onRemoveSet={vi.fn()}
      previousExercise={completedRepTarget}
    />
  );

  expect(
    screen.getByText("Previous best: 80kg × 12 reps")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Target: 82.5kg × 8 reps")
  ).toBeInTheDocument();
});



test("calls onRemove with the exercise ID", async () => {
  const user = userEvent.setup();
  const onRemove = vi.fn();

  render(
    <Exercise
      name="Bench Press"
      id="exercise-1"
      sets={[]}
      onRemove={onRemove}
      onAddSet={vi.fn()}
      onUpdateWeight={vi.fn()}
      onUpdateReps={vi.fn()}
      onRemoveSet={vi.fn()}
      previousExercise={null}
    />
  );
  
  await user.click(
    screen.getByRole("button", { name: "Remove Exercise" })
  );

  expect(onRemove).toHaveBeenCalledWith("exercise-1")
});