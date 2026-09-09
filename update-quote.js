// update-quote.js
// Picks a random quote from quotes.json and rewrites the
// "Thought of the Day" badge in README.md to match.
//
// Only needed if you enable the update-quote.yml workflow.
// With the workflow disabled, README.md keeps the fixed quote
// "Risk is better than regret." and this script is never run.

const fs = require("fs");

const README_PATH = "README.md";
const QUOTES_PATH = "quotes.json";

function buildBadgeUrl(quote) {
  const encoded = encodeURIComponent(quote.replace(/-/g, "‑"));
  return `https://img.shields.io/badge/-${encoded}-000000?style=for-the-badge&labelColor=441350&color=c56a90`;
}

function main() {
  const quotes = JSON.parse(fs.readFileSync(QUOTES_PATH, "utf8"));
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const badgeUrl = buildBadgeUrl(quote);

  const readme = fs.readFileSync(README_PATH, "utf8");

  const sectionRegex =
    /(## 🌟 Tʜᴏᴜɢʜᴛ ᴏғ ᴛʜᴇ Dᴀʏ 🌟\s*\n\s*\n<p align="center">\s*\n\s*<img src=")[^"]+("\/>)/;

  if (!sectionRegex.test(readme)) {
    console.error("Could not find the Thought of the Day section in README.md");
    process.exit(1);
  }

  const updated = readme.replace(sectionRegex, `$1${badgeUrl}$2`);
  fs.writeFileSync(README_PATH, updated);
  console.log(`Updated quote to: "${quote}"`);
}

main();
