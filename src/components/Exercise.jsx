function Exercise({
  name,
  id,
  onRemove,
  sets,
  onAddSet,
  onUpdateWeight,
  onUpdateReps,
  onRemoveSet,
  previousExercise,
}) {
  const bestSet =
    previousExercise?.sets.length > 0
      ? previousExercise.sets.reduce(
          (bestSet, currentSet) => {
            if (currentSet.weight > bestSet.weight) {
              return currentSet;
            }

            if (
              currentSet.weight === bestSet.weight &&
              currentSet.reps > bestSet.reps
            ) {
              return currentSet;
            }

            return bestSet;
          }
        )
      : null;

  const targetWeight = bestSet
    ? bestSet.reps < 12
      ? bestSet.weight
      : bestSet.weight + 2.5
    : null;

  const targetReps = bestSet
    ? bestSet.reps < 12
      ? bestSet.reps + 1
      : 8
    : null;

  return (
    <div className="exercise">
      <h4>{name}</h4>

      {previousExercise && (
        <div>
          <p>Previous:</p>

          {previousExercise.sets.map((set, index) => (
            <p key={set.id}>
              Set {index + 1}: {set.weight}kg × {set.reps} reps
            </p>
          ))}
        </div>
      )}

      {bestSet && (
        <div>
          <p>
            Previous best: {bestSet.weight}kg ×{" "}
            {bestSet.reps} reps
          </p>

          <p>
            Target: {targetWeight}kg × {targetReps} reps
          </p>
        </div>
      )}

      <button
        className="delete-button"
        type="button"
        onClick={() => onRemove(id)}
      >
        Remove Exercise
      </button>

      {sets.map((set, index) => (
        <div className="set-row" key={set.id}>
          <span className="set-number">
            Set {index + 1}
          </span>

          <label className="set-field">
            <span>Weight (kg)</span>

            <input
              type="number"
              min={"0"}
              step={"0.5"}
              value={set.weight}
              aria-invalid={set.weight === "" || set.weight < 0}
              onChange={(event) =>
                onUpdateWeight(
                  id,
                  set.id,
                  event.target.value === ""
                    ? ""
                    : Number(event.target.value)
                )
              }
            />
          </label>

          <label className="set-field">
            <span>Reps</span>

            <input
              type="number"
              min={"1"}
              step={"1"}
              value={set.reps}
              aria-invalid={set.reps === "" || set.reps < 1 || !Number.isInteger(set.reps)}
              onChange={(event) =>
                onUpdateReps(
                  id,
                  set.id,
                  event.target.value === ""
                    ? ""
                    : Number(event.target.value)
                )
              }
            />
          </label>

          <button
            className="delete-button"
            type="button"
            onClick={() => onRemoveSet(id, set.id)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onAddSet(id)}
      >
        Add Set
      </button>
    </div>
  );
}

export default Exercise;