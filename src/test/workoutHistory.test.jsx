import { render, screen } from "@testing-library/react";
import WorkoutHistory from "../components/WorkoutHistory";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

const sampleWorkouts = [
  {
    id: "workout-1",
    name: "Leg Day",
    date: "2026-09-20T10:00:00.000Z",
    duration: 1200,
    exercises: [],
  },
  {
    id: "workout-2",
    name: "Upper Body",
    date: "2026-09-21T10:00:00.000Z",
    duration: 900,
    exercises: [],
  },
];

test("shows a message when there are no completed workouts", () => {
  render(
    <WorkoutHistory
      completedWorkouts={[]}
      onDeleteWorkout={() => {}}
    />
  );

  expect(
    screen.getByText("No workouts completed yet.")
  ).toBeInTheDocument();
});



test("disables Clear Search when the search input is empty", () => {
  render(
    <WorkoutHistory
      completedWorkouts={[]}
      onDeleteWorkout={() => {}}
    />
  );

  const clearButton = screen.getByRole("button", {
    name: "Clear Search",
  });

  expect(clearButton).toBeDisabled();
});



test("enables Clear Search and clears the input when clicked", async () => {
    const user = userEvent.setup();

    render(
    <WorkoutHistory
        completedWorkouts={[]}
        onDeleteWorkout={() => {}}
    />
    );
    
    const searchInput = screen.getByRole("textbox", {
        name: "Search workouts",
    });
    
    const clearButton = screen.getByRole("button", {
        name: "Clear Search",
    });
    
    await user.type(searchInput, "Legs");

    expect(clearButton).toBeEnabled();
    expect(searchInput).toHaveValue("Legs");

    await user.click(clearButton);

    expect(searchInput).toHaveValue("");
    expect(clearButton).toBeDisabled();
});



test("shows only workouts matching the search", async () => {
  const user = userEvent.setup();

  render(
    <WorkoutHistory
      completedWorkouts={sampleWorkouts}
      onDeleteWorkout={() => {}}
    />
  );

  const searchInput = screen.getByRole("textbox", {
    name: "Search workouts",
  });

  await user.type(searchInput, "leg");

  expect(
    screen.getByRole("heading", { name: "Leg Day" })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole("heading", { name: "Upper Body" })
  ).not.toBeInTheDocument();
});


test("shows a message when no workouts match the search", async () => {
  const user = userEvent.setup();

  render(
    <WorkoutHistory
      completedWorkouts={sampleWorkouts}
      onDeleteWorkout={() => {}}
    />
  );

  const searchInput = screen.getByRole("textbox", {
    name: "Search workouts",
  })

  await user.type(searchInput, "cardio");

  expect(
    screen.getByText("No matching workouts found.")
  ).toBeInTheDocument();
});


test("shows the newest workout first by default", () => {
  render(
    <WorkoutHistory
      completedWorkouts={sampleWorkouts}
      onDeleteWorkout={() => {}}
    />
  );

  const workoutHeadings = screen.getAllByRole("heading", {
    level: 4,
  });

  expect(workoutHeadings[0]).toHaveTextContent("Upper Body");
  expect(workoutHeadings[1]).toHaveTextContent("Leg Day");
});


test("shows the oldest workout first when oldest is selected", async () => {
  const user = userEvent.setup();

  render(
    <WorkoutHistory
      completedWorkouts={sampleWorkouts}
      onDeleteWorkout={() => {}}
    />
  );

  const sortSelect = screen.getByRole("combobox", {
    name: "Sort workouts",
  });

  await user.selectOptions(sortSelect, "oldest");

  const workoutHeadings = screen.getAllByRole("heading", {
    level: 4,
  });

  expect(workoutHeadings[0]).toHaveTextContent("Leg Day");
  expect(workoutHeadings[1]).toHaveTextContent("Upper Body");
});