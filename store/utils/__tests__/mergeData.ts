import { mergeMap, Metadata } from "../mergeData";
import { dateToDateString } from "@/utils/dates";

const date1 = dateToDateString(new Date("2023-01-01"));
const date2 = dateToDateString(new Date("2023-01-02"));

describe("mergeMap", () => {
  it("merges missing items", () => {
    expect(
      mergeMap<Metadata, Record<string, Metadata>>(
        {
          id1: {
            dateUpdated: date1,
          },
        },
        {
          id2: {
            dateUpdated: date1,
          },
        },
      ),
    ).toEqual({
      id1: {
        dateUpdated: date1,
      },
      id2: {
        dateUpdated: date1,
      },
    });
  });

  it("Overwrites the draft item with a newer incoming item", () => {
    expect(
      mergeMap<Metadata, Record<string, Metadata>>(
        {
          id1: {
            dateUpdated: date1,
          },
        },
        {
          id1: {
            dateUpdated: date2,
          },
        },
      ),
    ).toEqual({
      id1: {
        dateUpdated: date2,
      },
    });
  });

  it("Keeps the draft item when the incoming is older", () => {
    expect(
      mergeMap<Metadata, Record<string, Metadata>>(
        {
          id1: {
            dateUpdated: date2,
          },
        },
        {
          id1: {
            dateUpdated: date1,
          },
        },
      ),
    ).toEqual({
      id1: {
        dateUpdated: date2,
      },
    });
  });
});
