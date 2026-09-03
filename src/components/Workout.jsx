import Exercise from "./Exercise";
import { useEffect, useState } from "react";

function Workout({
  name,
  routineExercises,
  completedWorkouts,
  onFinish,
  startTime,
}) {
  const [newExerciseName, setNewExerciseName] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  const previousWorkout = completedWorkouts.findLast((workout) => {
    return workout.name === name;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - startTime) / 1000
      );

      setElapsedTime(seconds);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  const [exercises, setExercises] = useState(
    routineExercises.map((exercise) => {
      return {
        id: crypto.randomUUID(),
        name: exercise.name,
        sets: [],
      };
    })
  );

  function addExercise() {
    if (!newExerciseName.trim()) {
      return;
    }

    setExercises([
      ...exercises,
      {
        id: crypto.randomUUID(),
        name: newExerciseName.trim(),
        sets: [],
      },
    ]);

    setNewExerciseName("");
  }

  function removeExercise(id) {
    const updatedExercises = exercises.filter((exercise) => {
      return exercise.id !== id;
    });

    setExercises(updatedExercises);
  }

  function addSetToExercise(exerciseId) {
    const updatedExercises = exercises.map((exercise) => {
      return exercise.id === exerciseId
        ? {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: crypto.randomUUID(),
                weight: 0,
                reps: 0,
              },
            ],
          }
        : exercise;
    });

    setExercises(updatedExercises);
  }

  function updateSetWeight(exerciseId, setId, newWeight) {
    const updatedExercises = exercises.map((exercise) => {
      return exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set) => {
              return set.id === setId
                ? {
                    ...set,
                    weight: newWeight,
                  }
                : set;
            }),
          }
        : exercise;
    });

    setExercises(updatedExercises);
  }

  function updateSetReps(exerciseId, setId, newReps) {
    const updatedExercises = exercises.map((exercise) => {
      return exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set) => {
              return set.id === setId
                ? {
                    ...set,
                    reps: newReps,
                  }
                : set;
            }),
          }
        : exercise;
    });

    setExercises(updatedExercises);
  }

  function removeSetFromExercise(exerciseId, setId) {
    const updatedExercises = exercises.map((exercise) => {
      return exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.filter((set) => {
              return set.id !== setId;
            }),
          }
        : exercise;
    });

    setExercises(updatedExercises);
  }

  function finishWorkout() {
    const completedWorkout = {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
      duration: elapsedTime,
      exercises,
    };

    onFinish(completedWorkout);
  }

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return (
    <div className="workout">
      <h2>Current Workout</h2>
      <h3>{name}</h3>

      <p>
        Workout: {formattedMinutes}:{formattedSeconds}
      </p>

      {exercises.map((exercise) => {
        const previousExercise = previousWorkout?.exercises.find(
          (previousExercise) => {
            return previousExercise.name === exercise.name;
          }
        );

        return (
          <Exercise
            key={exercise.id}
            name={exercise.name}
            id={exercise.id}
            onRemove={removeExercise}
            sets={exercise.sets}
            onAddSet={addSetToExercise}
            onUpdateWeight={updateSetWeight}
            onUpdateReps={updateSetReps}
            onRemoveSet={removeSetFromExercise}
            previousExercise={previousExercise}
          />
        );
      })}

      <div className="form-row">
        <input
          type="text"
          value={newExerciseName}
          placeholder="Exercise name"
          onChange={(event) =>
            setNewExerciseName(event.target.value)
          }
        />

        <button type="button" onClick={addExercise}>
          Add Exercise
        </button>
      </div>

      <button type="button" onClick={finishWorkout}>
        Finish Workout
      </button>
    </div>
  );
}

export default Workout;