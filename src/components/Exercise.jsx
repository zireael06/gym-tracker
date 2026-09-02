
function Exercise({
    name,
    id,
    onRemove,
    sets,
    onAddSet,
    onUpdateWeight,
    onUpdateReps,
    onRemoveSet,
    previousExercise
    }) {

        const bestSet = previousExercise?.sets.length > 0
            ? previousExercise.sets.reduce((bestSet, currentSet) => {
                if (currentSet.weight > bestSet.weight) {
                    return currentSet;
                }

                if (currentSet.weight === bestSet.weight &&
                    currentSet.reps > bestSet.reps
                ){
                    return currentSet;
                }
                return bestSet;
            })
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
                            Set {index + 1}: {set.weight}kg x {set.reps} reps
                        </p>
                    ))}
                </div>
            )}
            
            {bestSet && (
                <div>
                    <p>
                        Previous best: {bestSet.weight}kg x {bestSet.reps} reps
                    </p>


                    <p>
                        Target: {targetWeight}kg x {targetReps} reps
                    </p>
                </div>
            )}

            <button type="button" onClick={() => onRemove(id)}>
                Remove Exercise
            </button>

            {sets.map((set, index) => (
                <p key={set.id}>
                Set {index + 1} - 
                <input
                 type="number"
                 value={set.weight}
                 onChange={(event) =>
                    onUpdateWeight(
                        id,
                        set.id,             
                        event.target.value === "" ? "" : Number(event.target.value)
                    )
                 }
                /> 
                kg x 
                <input type="number"
                value={set.reps}
                onChange={(event) =>
                    onUpdateReps(
                        id,
                        set.id,
                        event.target.value === "" ? "" : Number(event.target.value)
                    )
                 }
                />
                reps
                <button type="button" onClick={() => onRemoveSet(id, set.id)}>
                    Remove 
                </button>

                </p>
            ))}

            <button type="button" onClick={() => onAddSet(id)}>
                Add Set
            </button>
        </div>
    );
}








export default Exercise;