import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import Dashboard from "../components/Dashboard";

const sampleRoutines = [
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

beforeEach(() => {
  localStorage.clear();

  localStorage.setItem("routines", JSON.stringify(sampleRoutines));
});

test("enables starting a workout after selecting a routine", async () => {
  const user = userEvent.setup();

  render(<Dashboard />);

  const startButton = screen.getByRole("button", {
    name: "Start Workout",
  });

  expect(startButton).toBeDisabled();

  await user.click(screen.getByRole("button", { name: "Push Day" }));

  expect(startButton).toBeEnabled();
});

test("starts the selected workout", async () => {
  const user = userEvent.setup();

  render(<Dashboard />);

  await user.click(screen.getByRole("button", { name: "Push Day" }));

  await user.click(screen.getByRole("button", { name: "Start Workout" }));

  expect(
    screen.getByRole("heading", {
      name: "Current Workout",
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("heading", {
      name: "Push Day",
    }),
  ).toBeInTheDocument();

  expect(
    screen.queryByRole("heading", {
      name: "Dashboard",
    }),
  ).not.toBeInTheDocument();
});

test("falls back to default routines when stored data is invalid", () => {
  localStorage.setItem("routines", "not valid JSON");

  render(<Dashboard />);

  expect(
    screen.getByRole("button", {
      name: "Legs",
    }),
  ).toBeInTheDocument();
});

test("falls back to default routines when stored routines are not an array", () => {
  localStorage.setItem("routines", JSON.stringify("hello"));

  render(<Dashboard />);

  expect(
    screen.getByRole("button", {
      name: "Legs",
    }),
  ).toBeInTheDocument();
});

test("ignores a stored active workout with the wrong data shape", () => {
  localStorage.setItem("activeWorkout", JSON.stringify("hello"));

  render(<Dashboard />);

  expect(screen.queryByText(/unfinished workout:/i)).not.toBeInTheDocument();
});

test("falls back when a stored routines array contains invalid items", () => {
  localStorage.setItem("routines", JSON.stringify(["hello"]));

  render(<Dashboard />);

  expect(
    screen.getByRole("button", {
      name: "Legs",
    }),
  ).toBeInTheDocument();
});

const routinesWithInvalidExercise = [
  {
    id: "routine-1",
    name: "Push Day",
    exercises: ["Bench Press"],
  },
];

test("falls back when a routine contains invalid exercises", () => {
  localStorage.setItem("routines", JSON.stringify(routinesWithInvalidExercise));

  render(<Dashboard />);

  expect(
    screen.getByRole("button", {
      name: "Legs",
    }),
  ).toBeInTheDocument();
});
