import { useState } from "react";

function RoutineManager({
  routines,
  selectedRoutine,
  onSelectRoutine,
  onAddRoutine,
  onRenameRoutine,
  onAddExercise,
  onRemoveExercise,
  onDeleteRoutine,
}) {
  const [newRoutineName, setNewRoutineName] = useState("");
  const [editedRoutineName, setEditedRoutineName] = useState("");
  const [newRoutineExercise, setNewRoutineExercise] = useState("");

  function handleAddRoutine() {
    if (!newRoutineName.trim()) {
      return;
    }

    onAddRoutine(newRoutineName.trim());
    setNewRoutineName("");
  }

  function handleRenameRoutine() {
    if (!selectedRoutine || !editedRoutineName.trim()) {
      return;
    }

    onRenameRoutine(editedRoutineName.trim());
    setEditedRoutineName("");
  }

  function handleAddExercise() {
    if (!selectedRoutine || !newRoutineExercise.trim()) {
      return;
    }

    onAddExercise(newRoutineExercise.trim());
    setNewRoutineExercise("");
  }
  
  return (
    <>
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
                onClick={handleAddRoutine}
                disabled={!newRoutineName.trim()}
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
                            routine.id === selectedRoutine?.id
                            ? "routine-button selected"
                            : "routine-button"
                        }
                        type="button"
                        onClick={() => onSelectRoutine(routine.id)}
                    >
                        {routine.name}
                    </button>

                    <button
                        className="delete-button"
                        type="button"
                        onClick={() => onDeleteRoutine(routine.id)}
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
                        onClick={handleRenameRoutine}
                        disabled={!editedRoutineName.trim()}
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
                        onClick={handleAddExercise}
                        disabled={!newRoutineExercise.trim()}
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
                                onClick={() => onRemoveExercise(exercise.id)}
                            >
                                Remove
                                </button>
                        </div>
                    ))
                )}
            </div>
        )}
    </>
  );

}

export default RoutineManager;