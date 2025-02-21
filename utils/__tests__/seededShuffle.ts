import seededShuffle, {
  generateSeed,
  withSeededShuffleSort,
  mulberry32,
} from "../seededShuffle";

describe("generateSeed", () => {
  it("should generate unique seed values", () => {
    const seed1 = generateSeed();
    const seed2 = generateSeed();
    expect(seed1).not.toBe(seed2);
  });

  it("should generate string-based seeds", () => {
    expect(typeof generateSeed()).toBe("string");
  });
});

describe("mulberry32 PRNG", () => {
  it("should return the same value when called with the same seed", () => {
    const rng = mulberry32(123);

    expect(rng()).toBe(0.7872516233474016);
  });

  it("should produce consistent output for the same seed", () => {
    const rng1 = mulberry32(123);
    const rng2 = mulberry32(123);

    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
  });

  it("should return a number between 0 and 1", () => {
    const randomValue = mulberry32(456)();
    expect(randomValue).toBeGreaterThanOrEqual(0);
    expect(randomValue).toBeLessThan(1);
  });
});

describe("seededShuffle", () => {
  it("should always give the same order for the same array length and seed", () => {
    const array = [1, 2, 3, 4, 5];

    expect(seededShuffle(array, "test-seed")).toEqual([2, 3, 1, 5, 4]);
    expect(seededShuffle(array, "test-seed")).toEqual([2, 3, 1, 5, 4]);
    expect(seededShuffle(array, "test-seed")).toEqual([2, 3, 1, 5, 4]);
  });

  it("should produce the same shuffled order for the same seed", () => {
    const array = [1, 2, 3, 4, 5];
    const seed = "test-seed";

    const shuffled1 = seededShuffle(array, seed);
    const shuffled2 = seededShuffle(array, seed);

    expect(shuffled1).toEqual(shuffled2);
  });

  it("should produce different shuffles for different seeds", () => {
    const array = [1, 2, 3, 4, 5];

    const shuffled1 = seededShuffle(array, "seed1");
    const shuffled2 = seededShuffle(array, "seed2");

    expect(shuffled1).not.toEqual(shuffled2);
  });

  it("should return an array of the same length", () => {
    const array = [1, 2, 3, 4, 5];
    const seed = "test-seed";

    const shuffled = seededShuffle(array, seed);
    expect(shuffled.length).toBe(array.length);
  });

  it("should contain the same elements as the original array", () => {
    const array = [1, 2, 3, 4, 5];
    const seed = "test-seed";

    const shuffled = seededShuffle(array, seed);
    expect(new Set(shuffled)).toEqual(new Set(array));
  });
});

describe("withSeededShuffleSort", () => {
  it("should always give the same order for the same array length and seed", () => {
    const array = [1, 2, 3, 4, 5];

    expect([...array].sort(withSeededShuffleSort("test-seed"))).toEqual([
      2, 3, 1, 5, 4,
    ]);

    expect([...array].sort(withSeededShuffleSort("test-seed"))).toEqual([
      2, 3, 1, 5, 4,
    ]);

    expect([...array].sort(withSeededShuffleSort("test-seed"))).toEqual([
      2, 3, 1, 5, 4,
    ]);
  });

  it("should produce the same shuffled order for the same seed", () => {
    const array = [1, 2, 3, 4, 5];
    const seed = "test-seed";

    const shuffled1 = [...array].sort(withSeededShuffleSort(seed));
    const shuffled2 = [...array].sort(withSeededShuffleSort(seed));

    expect(shuffled1).toEqual(shuffled2);
  });

  it("should produce different shuffles for different seeds", () => {
    const array = [1, 2, 3, 4, 5];

    const shuffled1 = [...array].sort(withSeededShuffleSort("seed1"));
    const shuffled2 = [...array].sort(withSeededShuffleSort("seed2"));

    expect(shuffled1).not.toEqual(shuffled2);
  });
});

describe("withSeededShuffleSort and seededShuffle", () => {
  it("should produce the same order for the same seed", () => {
    const array = [1, 2, 3, 4, 5];
    const seed = "test-seed";

    const shuffled1 = seededShuffle(array, seed);
    const shuffled2 = [...array].sort(withSeededShuffleSort(seed));

    expect(shuffled1).toEqual(shuffled2);
  });
});
