import fs from "fs";
import * as cheerio from "cheerio";

const baseUrl = "https://deadbydaylight.wiki.gg";
const charactersUrl = "https://deadbydaylight.wiki.gg/Characters";
const perksUrl = "https://deadbydaylight.wiki.gg/Perks";
const outputFolder = "./src/assets/";

scrapeCharacters();
scrapePerks();

async function scrapeCharacters() {
  const response = await fetch(charactersUrl);
  const html = await response.text();

  fs.writeFileSync(
    outputFolder + "survivors.json",
    JSON.stringify(getSurvivors(html), null, 2)
  );

  fs.writeFileSync(
    outputFolder + "killers.json",
    JSON.stringify(getKillers(html), null, 2)
  );
}

async function scrapePerks() {
  const response = await fetch(perksUrl);
  const html = await response.text();

  fs.writeFileSync(
    outputFolder + "survivor_perks.json",
    JSON.stringify(getSurvivorPerks(html), null, 2)
  );

  fs.writeFileSync(
    outputFolder + "killer_perks.json",
    JSON.stringify(getKillerPerks(html), null, 2)
  );
}

function getSurvivors(html) {
  const $ = cheerio.load(html);

  const survivorsDiv = $("dl + div").eq(1);
  const results = getCharactersFromTable($, survivorsDiv);

  console.log("Survivors: ", results.length);
  return results;
}

function getKillers(html) {
  const $ = cheerio.load(html);

  const killersDiv = $("dl + div").eq(0);
  const results = getCharactersFromTable($, killersDiv);

  console.log("Killers: ", results.length);
  return results;
}

function getCharactersFromTable($, characterDiv) {
  const portraits = $(characterDiv).find(".charPortraitWrapper");
  const results = [];
  for (const portrait of portraits) {
    const $portrait = $(portrait);
    const name = $portrait.find(".charPortraitImage a").attr("title")?.trim();

    let iconUrl = $portrait.find("img").attr("src")?.trim() || null;
    if (iconUrl && iconUrl.includes("?")) {
      iconUrl = baseUrl + iconUrl.split("?")[0];
    }

    if (name && iconUrl) {
      results.push({ name, iconUrl });
    }
  }
  return results;
}

function getSurvivorPerks(html) {
  const $ = cheerio.load(html);

  const survivorPerkTable = $("table").eq(1);
  const results = getPerks($, survivorPerkTable);

  console.log("Survivor perks: ", results.length);
  return results;
}

function getKillerPerks(html) {
  const $ = cheerio.load(html);

  const survivorPerkTable = $("table").eq(2);
  const results = getPerks($, survivorPerkTable);

  console.log("Killer perks: ", results.length);
  return results;
}

function getPerks($, perkTable) {
  const results = [];
  const rows = perkTable.find("tr").slice(1);

  for (const row of rows) {
    const $row = $(row);

    const img = $row.find("img").attr("src");
    const iconUrl = baseUrl + img.split("?")[0];
    const name =
      $row.find("td").eq(1).text().trim() || $row.find("img").attr("alt");

    if (name) {
      results.push({
        name,
        iconUrl: iconUrl || null,
      });
    }
  }

  return results;
}
