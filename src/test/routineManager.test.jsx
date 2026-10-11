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


test("submits a trimmed routine name and clears the input", async () => {
  const user = userEvent.setup();
  const onAddRoutine = vi.fn();

  render(
    <RoutineManager
      routines={sampleRoutines}
      selectedRoutine={null}
      onSelectRoutine={vi.fn()}
      onAddRoutine={onAddRoutine}
      onRenameRoutine={vi.fn()}
      onAddExercise={vi.fn()}
      onRemoveExercise={vi.fn()}
      onDeleteRoutine={vi.fn()}
    />
  );

  const routineInput = screen.getByRole("textbox", {
    name: "Routine name",
  });

  await user.type(routineInput, " Pull Day ");

  await user.click(
    screen.getByRole("button", { name: "Add Routine" })
  );

  expect(onAddRoutine).toHaveBeenCalledWith("Pull Day")
  expect(routineInput).toHaveValue("")
}); 


test("disables Add Routine when the name is blank", () => {
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

  const addRoutineButton = screen.getByRole("button", { name: "Add Routine" });

  expect(addRoutineButton).toBeDisabled();
});


test("submits a trimmed routine rename and clears the input", async () => {
  const user = userEvent.setup();
  const onRenameRoutine = vi.fn();

  render(
    <RoutineManager
      routines={sampleRoutines}
      selectedRoutine={sampleRoutines[0]}
      onSelectRoutine={vi.fn()}
      onAddRoutine={vi.fn()}
      onRenameRoutine={onRenameRoutine}
      onAddExercise={vi.fn()}
      onRemoveExercise={vi.fn()}
      onDeleteRoutine={vi.fn()}
    />
  );

  const renameInput = screen.getByRole("textbox", {
    name: "New routine name",
  });

  await user.type(renameInput, " Chest Day ");

  await user.click(
    screen.getByRole("button", { name: "Rename Routine" })
  );

  expect(onRenameRoutine).toHaveBeenCalledWith("Chest Day");

  expect(renameInput).toHaveValue("");
});



test("submits a trimmed exercise name and clears the input", async () => {
  const user = userEvent.setup();
  const onAddExercise = vi.fn();

  render(
    <RoutineManager
      routines={sampleRoutines}
      selectedRoutine={sampleRoutines[0]}
      onSelectRoutine={vi.fn()}
      onAddRoutine={vi.fn()}
      onRenameRoutine={vi.fn()}
      onAddExercise={onAddExercise}
      onRemoveExercise={vi.fn()}
      onDeleteRoutine={vi.fn()}
    />
  );

  const exerciseInput = screen.getByRole("textbox", {
    name: "Exercise name",
  });

  await user.type(exerciseInput, "  Bench Press  ");

  await user.click(
    screen.getByRole("button", { name: "Add Exercise" })
  );

  expect(onAddExercise).toHaveBeenCalledWith("Bench Press");
  expect(exerciseInput).toHaveValue("");
});