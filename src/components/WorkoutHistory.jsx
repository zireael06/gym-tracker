import { useState } from "react";

function WorkoutHistory({
  completedWorkouts,
  onDeleteWorkout,
}) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutSearch, setWorkoutSearch] = useState("");

  const filteredWorkouts = completedWorkouts.filter((workout) => {
    return workout.name
      .toLowerCase()
      .includes(workoutSearch.toLowerCase());
  });

  function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function calculateExerciseVolume(exercise) {
    return exercise.sets.reduce((total, set) => {
      return total + set.weight * set.reps;
    }, 0);
  }

  function calculateWorkoutVolume(workout) {
    return workout.exercises.reduce((total, exercise) => {
      return total + calculateExerciseVolume(exercise);
    }, 0);
  }

  return selectedWorkout ? (
    <div>
      <h3>{selectedWorkout.name}</h3>
      <p>Total volume: {calculateWorkoutVolume(selectedWorkout)}kg</p>

      {selectedWorkout.exercises.map((exercise) => (
        <div key={exercise.id}>
          <h4>{exercise.name}</h4>
          <p>Volume: {calculateExerciseVolume(exercise)}kg</p>

          {exercise.sets.map((set, index) => (
            <div key={set.id}>
              <p>
                Set {index + 1}: {set.weight}kg × {set.reps} reps
              </p>
            </div>
          ))}
        </div>
      ))}

      <button
        type="button"
        onClick={() => setSelectedWorkout(null)}
      >
        Back
      </button>
    </div>
  ) : (
    <div>
      <h3>Recent Workouts</h3>

      <input
        type="text"
        value={workoutSearch}
        placeholder="Search Workout"
        onChange={(event) =>
          setWorkoutSearch(event.target.value)
        }
      />
      <button
      type="button"
      onClick={() => setWorkoutSearch("")}
      disabled={!workoutSearch}
      >
        Clear Search
      </button>

      {completedWorkouts.length === 0 ? (
        <p>No workouts completed yet.</p>
      ) : filteredWorkouts.length === 0 ? (
        <p>No matching workouts found.</p>
      ) : (
        filteredWorkouts.map((workout) => {
          const totalSets = workout.exercises.reduce(
            (total, exercise) => {
              return total + exercise.sets.length;
            },
            0
          );

          const totalVolume = calculateWorkoutVolume(workout);

          return (
            <div key={workout.id}>
              <h4>{workout.name}</h4>

              <p>
                Duration: {formatDuration(workout.duration)}
              </p>

              <p>Exercises: {workout.exercises.length}</p>

              <p>Sets: {totalSets}</p>

              <p>
                Total volume: {totalVolume.toLocaleString()}kg
              </p>

              <p>
                {new Date(workout.date).toLocaleString()}
              </p>

              <button
                type="button"
                onClick={() => setSelectedWorkout(workout)}
              >
                View Workout
              </button>

              <button
                className="delete-button"
                type="button"
                onClick={() => onDeleteWorkout(workout.id)}
              >
                Delete Workout
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default WorkoutHistory;