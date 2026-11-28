function isValidActiveWorkout(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.name === "string" &&
    typeof value.startTime === "number" &&
    Array.isArray(value.exercises)
  );
}

function isValidId(value) {
  return typeof value === "string" || typeof value === "number";
}

function isValidRoutineExercise(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    isValidId(value.id) &&
    typeof value.name === "string"
  );
}

function isValidRoutine(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    isValidId(value.id) &&
    typeof value.name === "string" &&
    Array.isArray(value.exercises) &&
    value.exercises.every(isValidRoutineExercise)
  );
}

function isValidRoutines(value) {
  return Array.isArray(value) && value.every(isValidRoutine);
}

function isValidCompletedSet(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    isValidId(value.id) &&
    typeof value.weight === "number" &&
    Number.isFinite(value.weight) &&
    value.weight >= 0 &&
    Number.isInteger(value.reps) &&
    value.reps >= 1
  );
}

function isValidCompletedExercise(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    isValidId(value.id) &&
    typeof value.name === "string" &&
    Array.isArray(value.sets) &&
    value.sets.every(isValidCompletedSet)
  );
}

function isValidCompletedWorkout(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    isValidId(value.id) &&
    typeof value.name === "string" &&
    typeof value.date === "string" &&
    Number.isFinite(value.duration) &&
    value.duration >= 0 &&
    Array.isArray(value.exercises) &&
    value.exercises.every(isValidCompletedExercise)
  );
}

function isValidCompletedWorkouts(value) {
  return Array.isArray(value) && value.every(isValidCompletedWorkout);
}

export { isValidActiveWorkout, isValidRoutines, isValidCompletedWorkouts };
