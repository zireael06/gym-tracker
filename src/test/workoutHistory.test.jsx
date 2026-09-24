import { render, screen } from "@testing-library/react";
import WorkoutHistory from "../components/WorkoutHistory";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

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