import Workout from "./Workout";
import WorkoutHistory from "./WorkoutHistory";
import RoutineManager from "./RoutineManager";
import { useEffect, useState } from "react";

function Dashboard() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null);

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

  function removeCompletedWorkout(id) {
    const updatedCompletedWorkouts = completedWorkouts.filter(
      (workout) => {
        return workout.id !== id;
      }
    );

    setCompletedWorkouts(updatedCompletedWorkouts);
  }

  function addNewRoutineName(routineName) {
    if (!routineName) {
      return;
    }

    setRoutines([
      ...routines,
      {
        id: crypto.randomUUID(),
        name: routineName.trim(),
        exercises: [],
      },
    ]);
  }

  function renameRoutine(routineName) {
    if (!selectedRoutine || !routineName) {
      return;
    }

    const updatedRoutines = routines.map((routine) => {
      if (routine.id === selectedRoutine.id) {
        return {
          ...routine,
          name: routineName,
        };
      }

      return routine;
    });

    setRoutines(updatedRoutines);
  }

  function addExerciseToRoutine(exerciseName) {
    if (!selectedRoutine || !exerciseName) {
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
              name: exerciseName,
            },
          ],
        };
      }

      return routine;
    });

    setRoutines(updatedRoutines);
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

      <RoutineManager
        routines={routines}
        selectedRoutine={selectedRoutine}
        onSelectRoutine={setSelectedRoutineId}
        onAddRoutine={addNewRoutineName}
        onRenameRoutine={renameRoutine}
        onAddExercise={addExerciseToRoutine}
        onRemoveExercise={removeExerciseFromRoutine}
        onDeleteRoutine={deleteRoutine}
      />

      <button
        type="button"
        onClick={startWorkout}
        disabled={!selectedRoutine}
      >
        Start Workout
      </button>

      <WorkoutHistory
        completedWorkouts={completedWorkouts}
        onDeleteWorkout={removeCompletedWorkout}
      />

    </div>
  );
}

export default Dashboard;