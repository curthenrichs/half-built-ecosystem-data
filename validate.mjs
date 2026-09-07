/* Shape check for ecosystem.json, dependency free, run with
   `node validate.mjs`. This duplicates the rules in the island's
   validateDocument (half-built-ui packages/astro/src/scripts/
   ecosystem.ts) on purpose: the two live in different repos with no
   dependency between them, and the island refusing bad data protects
   readers while this protects the person editing the file. Keep the
   two in step by hand when the schema changes. */
import { readFileSync } from "node:fs";

const FAMILIES = new Set(["half-built", "adjacent"]);
const problems = [];

let doc;
try {
  doc = JSON.parse(readFileSync(new URL("./ecosystem.json", import.meta.url), "utf8"));
} catch (err) {
  console.error("ecosystem.json does not parse:", err.message);
  process.exit(1);
}

if (doc.version !== 1) problems.push(`version must be 1, found ${JSON.stringify(doc.version)}`);
if (typeof doc.updated !== "string") problems.push("updated must be a string");
if (!Array.isArray(doc.entries) || doc.entries.length === 0) {
  problems.push("entries must be a non-empty array");
} else {
  const seen = new Set();
  doc.entries.forEach((entry, i) => {
    const at = `entries[${i}]`;
    if (typeof entry.key !== "string" || entry.key === "") problems.push(`${at}.key must be a non-empty string`);
    else if (seen.has(entry.key)) problems.push(`${at}.key duplicates ${entry.key}`);
    else seen.add(entry.key);
    if (typeof entry.label !== "string" || entry.label === "") problems.push(`${at}.label must be a non-empty string`);
    if (entry.href !== null && typeof entry.href !== "string") problems.push(`${at}.href must be a string or null`);
    if (!Number.isFinite(entry.priority)) problems.push(`${at}.priority must be a number`);
    if (!FAMILIES.has(entry.family)) problems.push(`${at}.family must be one of ${[...FAMILIES].join(", ")}`);
  });
}

if (problems.length > 0) {
  console.error("ecosystem.json is not valid:");
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log(`ecosystem.json is valid, ${doc.entries.length} entries`);
