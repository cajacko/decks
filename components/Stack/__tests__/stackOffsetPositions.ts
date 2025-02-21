import { OffsetPosition } from "@/components/Card/Card.types";
import {
  getOffsetPosition,
  withStackOffsetPositions,
} from "../stackOffsetPositions";

const generateOffsetPositions = (count: number): OffsetPosition[] =>
  Array.from({ length: count }, (_, index) => ({
    rotate: index,
    x: index,
    y: index,
  }));

describe("getOffsetPosition", () => {
  it("should return the first position when nothing is passed", () => {
    expect(getOffsetPosition(generateOffsetPositions(5), undefined)).toEqual({
      rotate: 0,
      x: 0,
      y: 0,
    });
  });

  it("should return the first position when 0 is passed", () => {
    expect(getOffsetPosition(generateOffsetPositions(5), 0)).toEqual({
      rotate: 0,
      x: 0,
      y: 0,
    });
  });

  it("should return the second position when 1 is passed", () => {
    expect(getOffsetPosition(generateOffsetPositions(5), 1)).toEqual({
      rotate: 1,
      x: 1,
      y: 1,
    });
  });

  it("should return the third position when 2 is passed", () => {
    expect(getOffsetPosition(generateOffsetPositions(5), 2)).toEqual({
      rotate: 2,
      x: 2,
      y: 2,
    });
  });

  it("should return the first position when 5 is passed and there are 5 positions", () => {
    expect(getOffsetPosition(generateOffsetPositions(5), 5)).toEqual({
      rotate: 0,
      x: 0,
      y: 0,
    });
  });

  it("should return the second position when 6 is passed and there are 5 positions", () => {
    expect(getOffsetPosition(generateOffsetPositions(5), 6)).toEqual({
      rotate: 1,
      x: 1,
      y: 1,
    });
  });
});

describe("withStackOffsetPositions", () => {
  let stackOffsetPositions = withStackOffsetPositions(4);

  beforeEach(() => {
    stackOffsetPositions = withStackOffsetPositions(4);

    stackOffsetPositions.onUpdateCardList(["1", "2", "3", "4", "5"]);

    stackOffsetPositions.getCardOffsetPosition("1");
    stackOffsetPositions.getCardOffsetPosition("2");
    stackOffsetPositions.getCardOffsetPosition("3");
    stackOffsetPositions.getCardOffsetPosition("4");
    stackOffsetPositions.getCardOffsetPosition("5");
  });

  it("should return the correct index for the card id", () => {
    expect(stackOffsetPositions.getCardOffsetPosition("1")).toEqual(0);
    expect(stackOffsetPositions.getCardOffsetPosition("2")).toEqual(1);
    expect(stackOffsetPositions.getCardOffsetPosition("3")).toEqual(2);
    expect(stackOffsetPositions.getCardOffsetPosition("4")).toEqual(3);
    expect(stackOffsetPositions.getCardOffsetPosition("5")).toEqual(0);
  });

  it("should return the same index for the same card id", () => {
    expect(stackOffsetPositions.getCardOffsetPosition("1")).toEqual(
      stackOffsetPositions.getCardOffsetPosition("1"),
    );
  });

  it("should return undefined for a card id that is not in the list", () => {
    expect(stackOffsetPositions.getCardOffsetPosition("6")).toEqual(undefined);
  });

  it("should replace a missing item with the new card id", () => {
    stackOffsetPositions.onUpdateCardList(["1", "2", "4", "5", "6"]);

    expect(stackOffsetPositions.getCardOffsetPosition("1")).toEqual(0);
    expect(stackOffsetPositions.getCardOffsetPosition("2")).toEqual(1);
    expect(stackOffsetPositions.getCardOffsetPosition("4")).toEqual(3);
    expect(stackOffsetPositions.getCardOffsetPosition("5")).toEqual(0);

    // The new item
    expect(stackOffsetPositions.getCardOffsetPosition("6")).toEqual(2);
  });

  it("should maintain card positions when some of the cards are removed", () => {
    stackOffsetPositions.onUpdateCardList(["1", "4", "5"]);

    expect(stackOffsetPositions.getCardOffsetPosition("1")).toEqual(0);
    expect(stackOffsetPositions.getCardOffsetPosition("2")).toEqual(undefined);
    expect(stackOffsetPositions.getCardOffsetPosition("3")).toEqual(undefined);
    expect(stackOffsetPositions.getCardOffsetPosition("4")).toEqual(3);
    expect(stackOffsetPositions.getCardOffsetPosition("5")).toEqual(0);
  });
});
