import uuid from "./uuid";

/**
 * Generates a random seed using UUIDs.
 * @returns A new random seed string.
 */
export function generateSeed(): string {
  return uuid();
}

/**
 * Mulberry32 PRNG - Fast and simple pseudo-random number generator.
 * @param seed The seed number.
 * @returns A function that generates a pseudo-random number between 0 and 1.
 */
export function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getSeedNumber(seed: number | string): number {
  if (typeof seed === "string") {
    return [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }

  return seed;
}

/**
 * Returns a comparator function that can be used in `.sort()`
 * and always returns the same order with the same seed.
 * @param seed The seed value (number or string).
 * @returns A comparator function for `.sort()`.
 */
export function withSeededShuffleSort<T>(
  seed: number | string,
): (a: T, b: T) => number {
  const seedNumber: number = getSeedNumber(seed);
  const rng = mulberry32(seedNumber);
  const indexMap = new Map<T, number>();

  return (a: T, b: T) => {
    if (!indexMap.has(a)) indexMap.set(a, rng());
    if (!indexMap.has(b)) indexMap.set(b, rng());

    return indexMap.get(a)! - indexMap.get(b)! || 0;
  };
}

/**
 * Fisher-Yates shuffle using a seeded PRNG.
 * @param array The array to shuffle.
 * @param seed The seed value (number or string).
 * @returns A new shuffled array.
 */
export default function seededShuffle<T>(
  array: T[],
  seed: number | string,
): T[] {
  return [...array].sort(withSeededShuffleSort(seed));
}
