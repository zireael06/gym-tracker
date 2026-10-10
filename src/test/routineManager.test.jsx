import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import RoutineManager from "../components/RoutineManager";
import userEvent from "@testing-library/user-event";

const sampleRoutines = [
  {
    id: "routine-1",
    name: "Push Day",
    exercises: [],
  },
  {
    id: "routine-2",
    name: "Leg Day",
    exercises: [],
  },
];

test("displays the available routines", () => {
  render(
    <RoutineManager
      routines={sampleRoutines}
      selectedRoutine={null}
      onSelectRoutine={vi.fn()}
      onAddRoutine={vi.fn()}
      onRenameRoutine={vi.fn()}
      onAddExercise={vi.fn()}
      onRemoveExercise={vi.fn()}
      onDeleteRoutine={vi.fn()}
    />
  );

  expect(
    screen.getByRole("button", { name: "Push Day" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: "Leg Day" })
  ).toBeInTheDocument();
});

test("calls onSelectRoutine with the selected routine ID", async () => {
  const user = userEvent.setup();
  const onSelectRoutine = vi.fn();

  render(
    <RoutineManager
      routines={sampleRoutines}
      selectedRoutine={null}
      onSelectRoutine={onSelectRoutine}
      onAddRoutine={vi.fn()}
      onRenameRoutine={vi.fn()}
      onAddExercise={vi.fn()}
      onRemoveExercise={vi.fn()}
      onDeleteRoutine={vi.fn()}
    />
  );

  await user.click(
    screen.getByRole("button", { name: "Leg Day" })
  );

  expect(onSelectRoutine).toHaveBeenCalledTimes(1);
  expect(onSelectRoutine).toHaveBeenCalledWith("routine-2");
});