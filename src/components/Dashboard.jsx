import Workout from "./Workout";
import WorkoutHistory from "./WorkoutHistory";
import RoutineManager from "./RoutineManager";
import { useEffect, useState } from "react";

function Dashboard() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null);
  
  const [savedWorkout, setSavedWorkout] = useState(() => {
    const saved = localStorage.getItem("activeWorkout");
    return saved ? JSON.parse(saved) : null;
  });


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
    setSavedWorkout(null);
    setWorkoutStarted(false);
    setWorkoutStartTime(null);
  }

  function startWorkout() {
    if (savedWorkout || !selectedRoutine || selectedRoutine.exercises.length === 0) {
      return;
    }
    setSavedWorkout(null);
    setWorkoutStartTime(Date.now());
    setWorkoutStarted(true);
  }


  function resumeWorkout() {
    if (!savedWorkout) {
      return;
    }
    setWorkoutStartTime(savedWorkout.startTime)
    setWorkoutStarted(true)
    }

  function discardWorkout() {
    const confirmed = window.confirm(
      "Discard this unfinished workout? Its sets will be lost."
    );
    
    if (!confirmed) {
      return;
    }

    localStorage.removeItem("activeWorkout")
    setSavedWorkout(null);
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
      name={savedWorkout ? savedWorkout.name : selectedRoutine.name}
      completedWorkouts={completedWorkouts}
      routineExercises={savedWorkout ? savedWorkout.exercises : selectedRoutine.exercises}
      onFinish={handleFinishWorkout}
      startTime={workoutStartTime}
      savedWorkout={savedWorkout}
    />
  ) : (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {savedWorkout && (
        <div>
          <p>Unfinished workout: {savedWorkout.name}</p>
          <button
           type="button"
           onClick={resumeWorkout}
           >
            Resume Workout
          </button>
          <button
           type="button"
           className="delete-button"
           onClick={discardWorkout}
           >
            Discard Workout
          </button>
        </div>
      )}



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
        disabled={savedWorkout || !selectedRoutine || selectedRoutine.exercises.length === 0}
      >
        Start Workout
      </button>

      {selectedRoutine && selectedRoutine.exercises.length === 0 && (
        <p>Add an exercise to this routine before starting.</p>
      )}

      <WorkoutHistory
        completedWorkouts={completedWorkouts}
        onDeleteWorkout={removeCompletedWorkout}
      />

    </div>
  );
}

export default Dashboard;