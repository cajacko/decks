export default function getHasChanges(a: unknown, b: unknown) {
  // If both values are falsy, they are considered equal
  // We had some issues with null/ undefined and it was a bit tricky to sync these efforts
  if (!a && !b) return false;

  return a !== b;
}
