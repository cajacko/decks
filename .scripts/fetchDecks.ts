#!/usr/bin/env ts-node

import fs from "fs";
import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import pLimit from "p-limit";
import Case from "case";
import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const limit = pLimit(5);

if (!process.env.EXAMPLE_DECKS_GOOGLE_SHEET_URL) {
  console.error(
    "❌ Please provide EXAMPLE_DECKS_GOOGLE_SHEET_URL in .env file",
  );

  process.exit(1);
}

const SHEET_CSV_URL = process.env.EXAMPLE_DECKS_GOOGLE_SHEET_URL;

function processRecord(record: Record<string, string>) {
  const newRecord: Record<string, string> = {};

  for (const key in record) {
    let value: any = record[key];

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

    newRecord[Case.camel(key)] = value;
  }

  return newRecord;
}

async function fetchDeck(gid: string) {
  const res = await fetch(`${SHEET_CSV_URL}&gid=${gid}`);

  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.statusText}`);

  const csv = await res.text();

  // Parse CSV to JSON
  const records = parse(csv, {
    columns: true, // use first row as keys
    skip_empty_lines: true,
  });

  return records.map((record: any) => processRecord(record));
}

async function fetchDecks() {
  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.statusText}`);

  const csv = await res.text();

  // Parse CSV to JSON
  const records = parse(csv, {
    columns: true, // use first row as keys
    skip_empty_lines: true,
  });

  const promises: Promise<unknown>[] = [];

  records.forEach((_record: any) => {
    const record = processRecord(_record);

    if (record.gid) {
      promises.push(
        limit(() =>
          fetchDeck(record.gid).then((cards) => ({ ...record, cards })),
        ),
      );
    } else {
      promises.push(Promise.resolve(record));
    }
  });

  // Only one promise is run at once
  const result = await Promise.all(promises);

  fs.writeFileSync(
    "constants/exampleDecks/exampleDecks.json",
    JSON.stringify(result, null, 2),
  );

  console.log(
    "✅ Prebuilt decks saved to constants/exampleDecks/exampleDecks.json",
  );
}

fetchDecks().catch((err) => {
  console.error("❌ Error fetching decks:", err);
  process.exit(1);
});
