import Workout from "./Workout";
import { useEffect, useState } from "react";

function Dashboard() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null);

  const [newRoutineName, setNewRoutineName] = useState("");
  const [editedRoutineName, setEditedRoutineName] = useState("");
  const [newRoutineExercise, setNewRoutineExercise] = useState("");
  const [workoutSearch, setWorkoutSearch] = useState("");

  const [completedWorkouts, setCompletedWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem("completedWorkouts");

    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });

  const [routines, setRoutines] = useState(() => {
    const savedRoutines = localStorage.getItem("routines");

    return savedRoutines
      ? JSON.parse(savedRoutines)
      : [
          {
            id: 1,
            name: "Chest & Back",
            exercises: [
              {
                id: crypto.randomUUID(),
                name: "Incline Bench Press",
              },
              {
                id: crypto.randomUUID(),
                name: "Incline Dumbbell Row",
              },
              {
                id: crypto.randomUUID(),
                name: "Pec Deck",
              },
              {
                id: crypto.randomUUID(),
                name: "Lat Pulldown",
              },
            ],
          },
          {
            id: 2,
            name: "Legs",
            exercises: [
              {
                id: crypto.randomUUID(),
                name: "Barbell Back Squat",
              },
              {
                id: crypto.randomUUID(),
                name: "Seated Leg Curl",
              },
              {
                id: crypto.randomUUID(),
                name: "Seated Leg Extension",
              },
              {
                id: crypto.randomUUID(),
                name: "Romanian Deadlift",
              },
            ],
          },
          {
            id: 3,
            name: "Arms",
            exercises: [
              {
                id: crypto.randomUUID(),
                name: "EZ Bar Curls",
              },
              {
                id: crypto.randomUUID(),
                name: "Tricep Pulldowns",
              },
              {
                id: crypto.randomUUID(),
                name: "Preacher Curls",
              },
              {
                id: crypto.randomUUID(),
                name: "Overhead Tricep Extensions",
              },
            ],
          },
        ];
  });

  const selectedRoutine = routines.find((routine) => {
    return routine.id === selectedRoutineId;
  });

  const filteredWorkouts = completedWorkouts.filter((workout) => {
    return workout.name
    .toLowerCase()
    .includes(workoutSearch.toLocaleLowerCase());
  });

  useEffect(() => {
    localStorage.setItem(
      "completedWorkouts",
      JSON.stringify(completedWorkouts)
    );
  }, [completedWorkouts]);

  useEffect(() => {
    localStorage.setItem("routines", JSON.stringify(routines));
  }, [routines]);

  function handleFinishWorkout(completedWorkout) {
    setCompletedWorkouts([
      ...completedWorkouts,
      completedWorkout,
    ]);

    setWorkoutStarted(false);
    setWorkoutStartTime(null);
  }

  function startWorkout() {
    if (!selectedRoutine) {
      return;
    }

    setWorkoutStartTime(Date.now());
    setWorkoutStarted(true);
  }

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

  function removeCompletedWorkout(id) {
    const updatedCompletedWorkouts = completedWorkouts.filter(
      (workout) => {
        return workout.id !== id;
      }
    );

    setCompletedWorkouts(updatedCompletedWorkouts);
  }

  function addNewRoutineName() {
    if (!newRoutineName.trim()) {
      return;
    }

    setRoutines([
      ...routines,
      {
        id: crypto.randomUUID(),
        name: newRoutineName.trim(),
        exercises: [],
      },
    ]);

    setNewRoutineName("");
  }

  function renameRoutine() {
    if (!selectedRoutine || !editedRoutineName.trim()) {
      return;
    }

    const updatedRoutines = routines.map((routine) => {
      if (routine.id === selectedRoutine.id) {
        return {
          ...routine,
          name: editedRoutineName.trim(),
        };
      }

      return routine;
    });

    setRoutines(updatedRoutines);
    setEditedRoutineName("");
  }

  function addExerciseToRoutine() {
    if (!selectedRoutine || !newRoutineExercise.trim()) {
      return;
    }

    const updatedRoutines = routines.map((routine) => {
      if (routine.id === selectedRoutine.id) {
        return {
          ...routine,
          exercises: [
            ...routine.exercises,
            {
              id: crypto.randomUUID(),
              name: newRoutineExercise.trim(),
            },
          ],
        };
      }

      return routine;
    });

    setRoutines(updatedRoutines);
    setNewRoutineExercise("");
  }

  function removeExerciseFromRoutine(exerciseId) {
    if (!selectedRoutine) {
      return;
    }

    const updatedRoutines = routines.map((routine) => {
      if (routine.id === selectedRoutine.id) {
        return {
          ...routine,
          exercises: routine.exercises.filter((exercise) => {
            return exercise.id !== exerciseId;
          }),
        };
      }

      return routine;
    });

    setRoutines(updatedRoutines);
  }

  function deleteRoutine(id) {
    const updatedRoutines = routines.filter((routine) => {
      return routine.id !== id;
    });

    setRoutines(updatedRoutines);

    if (id === selectedRoutineId) {
      setSelectedRoutineId(null);
    }
  }

  return workoutStarted ? (
    <Workout
      name={selectedRoutine.name}
      completedWorkouts={completedWorkouts}
      routineExercises={selectedRoutine.exercises}
      onFinish={handleFinishWorkout}
      startTime={workoutStartTime}
    />
  ) : (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="form-row">
        <input
          type="text"
          value={newRoutineName}
          placeholder="Routine name"
          onChange={(event) =>
            setNewRoutineName(event.target.value)
          }
        />

        <button
          type="button"
          onClick={addNewRoutineName}
        >
          Add Routine
        </button>
      </div>

      <div className="routine-list">
        <h3>Routines</h3>

        {routines.map((routine) => (
          <div className="routine-row" key={routine.id}>
            <button
              className={
                routine.id === selectedRoutineId
                  ? "routine-button selected"
                  : "routine-button"
              }
              type="button"
              onClick={() =>
                setSelectedRoutineId(routine.id)
              }
            >
              {routine.name}
            </button>

            <button
              className="delete-button"
              type="button"
              onClick={() => deleteRoutine(routine.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <p>
        Selected routine:{" "}
        {selectedRoutine ? selectedRoutine.name : "None"}
      </p>

      {selectedRoutine && (
        <div>
          <h3>Edit {selectedRoutine.name}</h3>

          <div className="form-row">
            <input
              type="text"
              value={editedRoutineName}
              placeholder="New routine name"
              onChange={(event) =>
                setEditedRoutineName(event.target.value)
              }
            />

            <button
              type="button"
              onClick={renameRoutine}
            >
              Rename Routine
            </button>
          </div>

          <div className="form-row">
            <input
              type="text"
              value={newRoutineExercise}
              placeholder="Exercise name"
              onChange={(event) =>
                setNewRoutineExercise(event.target.value)
              }
            />

            <button
              type="button"
              onClick={addExerciseToRoutine}
            >
              Add Exercise
            </button>
          </div>

          <h3>Exercises</h3>

          {selectedRoutine.exercises.length === 0 ? (
            <p>No exercises added yet.</p>
          ) : (
            selectedRoutine.exercises.map((exercise) => (
              <div className="exercise-row" key={exercise.id}>
                <span>{exercise.name}</span>

                <button
                  className="delete-button"
                  type="button"
                  onClick={() =>
                    removeExerciseFromRoutine(exercise.id)
                  }
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <button
        type="button"
        onClick={startWorkout}
        disabled={!selectedRoutine}
      >
        Start Workout
      </button>

      {selectedWorkout ? (
        <div>
          <h3>{selectedWorkout.name}</h3>

          {selectedWorkout.exercises.map((exercise) => (
            <div key={exercise.id}>
              <h4>{exercise.name}</h4>

              {exercise.sets.map((set, index) => (
                <div key={set.id}>
                  <p>
                    Set {index + 1}: {set.weight}kg ×{" "}
                    {set.reps} reps
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
           onChange={(event) => setWorkoutSearch(event.target.value)}
           />

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
                    Duration:{" "}
                    {formatDuration(workout.duration)}
                  </p>

                  <p>
                    Exercises: {workout.exercises.length}
                  </p>

                  <p>Sets: {totalSets}</p>

                  <p>Total volume: {totalVolume.toLocaleString()}kg</p>

                  <p>
                    {new Date(workout.date).toLocaleString()}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkout(workout)
                    }
                  >
                    View Workout
                  </button>

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() =>
                      removeCompletedWorkout(workout.id)
                    }
                  >
                    Delete Workout
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;