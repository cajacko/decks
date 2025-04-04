#!/usr/bin/env ts-node

import fs from "fs";
import fetch from "node-fetch";
import dotenvFlow from "dotenv-flow";
import withIncludedData from "../api/dex/withIncludedData";

dotenvFlow.config();

const { fetchIncludedData } = withIncludedData(fetch as any);

async function init() {
  const decks = await fetchIncludedData();

  fs.writeFileSync(
    "constants/exampleDecks/includedData.json",
    JSON.stringify(decks, null, 2),
  );

  console.log(
    "✅ Prebuilt decks saved to constants/exampleDecks/exampleDecks.json",
  );
}

init().catch((err) => {
  console.error("❌ Error fetching included data:", err);
  process.exit(1);
});
