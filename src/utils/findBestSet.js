function findBestSet(sets) {
  if (sets.length === 0) {
    return null;
  }

  return sets.reduce((bestSet, currentSet) => {
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
  });
}

export default findBestSet;
