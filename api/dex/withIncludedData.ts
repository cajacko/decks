/* eslint-disable no-restricted-syntax */

import Papa from "papaparse";
import pLimit from "p-limit";
import Case from "case";

type Row = Record<string, string>;

export type DataValue = string | boolean | undefined | null;

export type Data = Record<string, DataValue>;

export type Deck = {
  props: Data;
  data: Data[] | null;
};

export type Fetch = (url: string) => Promise<Response>;

const limit = pLimit(5);

function processRow(row: Row): Data {
  const data: Data = {};

  for (const key in row) {
    let value: DataValue = row[key];

    // Don't process a number, what if it's meant to be a string?
    switch (value) {
      case "FALSE":
      case "false":
        value = false;
        break;
      case "TRUE":
      case "true":
        value = true;
        break;
      case "":
        value = undefined;
        break;
      case "null":
      case "NULL":
        value = null;
        break;
    }

    data[Case.camel(key)] = value;
  }

  return data;
}

function parseCsvString(csv: string): Data[] {
  const { data: rows } = Papa.parse<Row>(csv, {
    skipEmptyLines: true,
    header: true,
  });

  return rows.map(processRow);
}

async function fetchCsv({
  fetch,
  url,
}: {
  url: string;
  fetch: Fetch;
}): Promise<Data[]> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch sheet (${url}): ${res.statusText}`);
  }

  const csv = await res.text();

  return parseCsvString(csv);
}

async function fetchDeckData({
  gid,
  sheetsCsvUrl,
  fetch,
}: {
  sheetsCsvUrl: string;
  gid: string;
  fetch: Fetch;
}): Promise<Data[]> {
  return fetchCsv({ url: `${sheetsCsvUrl}&gid=${gid}`, fetch });
}

async function fetchDecks({
  sheetsCsvUrl,
  fetch,
}: {
  sheetsCsvUrl: string;
  fetch: Fetch;
}): Promise<Deck[]> {
  const rows = await fetchCsv({ url: sheetsCsvUrl, fetch });
  const promises: Promise<Deck>[] = [];

  rows.forEach((props) => {
    const gid: string | null = typeof props.gid === "string" ? props.gid : null;

    if (gid) {
      promises.push(
        limit(() =>
          fetchDeckData({
            sheetsCsvUrl,
            gid,
            fetch,
          }).then((data): Deck => ({ props, data })),
        ),
      );
    } else {
      promises.push(Promise.resolve({ props, data: null }));
    }
  });

  // Only one promise is run at once
  const result = await Promise.all(promises);

  return result;
}

export default function withIncludedData(fetch: Fetch) {
  if (!process.env.EXPO_PUBLIC_INCLUDED_DATA) {
    throw new Error(
      "❌ Please provide EXAMPLE_DECKS_GOOGLE_SHEET_URL in .env file",
    );
  }

  const SHEET_CSV_URL = process.env.EXPO_PUBLIC_INCLUDED_DATA;

  async function fetchIncludedData(): Promise<Deck[]> {
    return fetchDecks({ sheetsCsvUrl: SHEET_CSV_URL, fetch });
  }

  return {
    fetchIncludedData,
  };
}
