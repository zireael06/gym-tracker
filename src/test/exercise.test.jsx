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