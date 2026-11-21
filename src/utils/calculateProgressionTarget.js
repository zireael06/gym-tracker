function calculateProgressionTarget(bestSet) {
    if (bestSet.reps < 12) {
        return {
            weight: bestSet.weight,
            reps: bestSet.reps + 1,
        };
    }

    return {
        weight: bestSet.weight + 2.5,
        reps: 8,
    };
}

export default calculateProgressionTarget;