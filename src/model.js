import { fromPairs } from "lodash";
import metsästysaikaData from "../metsastysajat.json";
import scrapeinfo from "../scrapeinfo.json";
import { isSameDay, isBefore, isAfter, parse } from "date-fns";
import { range, capitalize } from "lodash";
import {
  MAAKUNNAT,
  MAAKUNTA_GENETIIVIT,
  MERIALUEET,
  METSAHANHI_MUUMAA,
} from "./config.js";
import { te } from "date-fns/locale";

class Model {
  constructor() {
    this.scrapeinfo = scrapeinfo["last_update"];
    console.log(this.scrapeinfo);
    this.rawdata = metsästysaikaData;
    this.data = {};
    //this.gameAnimals = Object.keys(this.data);
    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.allDaysOfYear = [];
    this.createAllDaysOfYear();
    this.renameAnimals();
    this.gameAnimals = Object.keys(this.data);
    //console.log(this.data);
    this.standardizeHuntingAreas();
    this.selected = {
      animal_groups: [],
      areas: [],
    };
  }

  /**
   * Populates the allDaysOfYear array with Date objects for every day
   * of the current year. Iterates over each month and each day within
   * the month, adding a Date object for each day to the allDaysOfYear array.
   */

  createAllDaysOfYear() {
    const months = range(1, 13);
    months.forEach((month) => {
      const monthEnd = new Date(this.currentYear, month, 0);
      const days = range(1, monthEnd.getDate() + 1);
      days.forEach((day) => {
        this.allDaysOfYear.push(new Date(this.currentYear, month - 1, day));
      });
    });
  }

  /**
   * Renames game animal keys in the raw data by extracting the name after "eli",
   * capitalizing it, and using it as the key. If the key does not include "eli",
   * it remains unchanged. The revised keys and corresponding data are stored in
   * the `data` attribute.
   */

  renameAnimals() {
    //console.log(this.rawdata);
    const rawGameAnimalNames = Object.keys(this.rawdata);
    //console.log(rawGameAnimalNames);
    const revisedKeyData = {};

    rawGameAnimalNames.forEach((gameAnimal) => {
      //console.log(gameAnimal);
      if (gameAnimal.includes(" eli ")) {
        const animalName = gameAnimal.split(" eli ")[1];
        revisedKeyData[capitalize(animalName)] = this.rawdata[gameAnimal];
        //console.log(capitalize(animalName));
      } else {
        revisedKeyData[gameAnimal] = this.rawdata[gameAnimal];
      }
    });

    this.data = revisedKeyData;
  }

  /**
   * Standardizes the hunting area definitions for each game animal by parsing
   * them into a set of standard terms. These terms can then be translated or
   * interpreted by the software. For each hunting area of a game animal, the
   * standard names are generated and stored in the `standardNames` attribute of
   * the hunting area.
   */

  standardizeHuntingAreas() {
    // Väännetään metsästysaluiista standarditermit, joita softa voi kääntää

    this.gameAnimals.forEach((gameAnimal) => {
      const debugAnimal = false;

      this.data[gameAnimal]["metsastysalueet"].forEach((huntingArea) => {
        const huntingAreaDefinition = huntingArea["metsastysalue"];

        const definitionAreas = parseHuntingArea(
          huntingAreaDefinition,
          gameAnimal
        );

        // Infotekstissä voi olla myös poikkeuksia, filtteröidään ne pois
        const infoText = huntingArea["metsastysajat"]["info"];
        if (infoText && infoText.includes("maakun")) {
          const exceptions = parseHuntingArea(infoText, gameAnimal);
          huntingArea.standardNames = definitionAreas.filter((area) => {
            return !exceptions.includes(area);
          });
          //console.log(infoText, definitionAreas, huntingArea.standardNames);
        } else {
          huntingArea.standardNames = definitionAreas;
        }
        if (gameAnimal == debugAnimal) {
          console.log(gameAnimal, huntingArea);
        }
      });
      //console.log(this.data[gameAnimal]);

      //console.log(collector);
    });
    //console.log(new Set(collector));
  }

  /**
   * Checks if a given date is within the hunting times for a given game animal.
   * @param {string} gameAnimal - the name of the game animal
   * @param {Date} date - the date to check
   * @returns {string | null} a string containing information about the hunting areas
   *                          where hunting is allowed on the given date, or null if
   *                          there are no hunting areas where hunting is allowed.
   * @throws {Error} if the game animal is not found in the data.
   */
  checkDate(gameAnimal, date) {
    if (!this.data[gameAnimal]) {
      throw new Error(`Game animal ${gameAnimal} not found`);
    }
    const huntingAreas = this.data[gameAnimal]["metsastysalueet"];
    //console.log(huntingAreas);

    const collector = [];
    huntingAreas.forEach((huntingArea) => {
      const huntingTimes = huntingArea["metsastysajat"];
      //console.log(huntingTimes);
      if (
        huntingTimes["start"] ||
        huntingTimes["end"] ||
        !huntingTimes["info"] === "Rauhoitettu"
      ) {
        // Poista mahdolliset kellonajat
        const startTime = huntingTimes["start"].split(" ")[0];
        const endTime = huntingTimes["end"].split(" ")[0];

        const start = parse(startTime, "dd.MM.yyyy", new Date());
        const end = parse(endTime, "dd.MM.yyyy", new Date());
        //console.log(start, "-", end);
        if (
          (isSameDay(date, start) || isAfter(date, start)) &&
          (isSameDay(date, end) || isBefore(date, end))
        ) {
          collector.push(huntingArea);
        }
      }
    });
    if (collector.length) {
      return collector;
      //return createInfoString(collector, gameAnimal);
    } else {
      //console.log(gameAnimal, date);
      return null;
    }
  }
}

// ----- Supplementary functions --------------

/**
 * Create an info string based on the given hunting areas and game animal.
 * @param {array} huntingAreas - an array of hunting areas
 * @param {string} gameAnimal - the name of the game animal
 * @returns {object} an object containing the info string, an array of standard area names and the game animal name
 */
export const createInfoString = function (huntingAreas, gameAnimal) {
  //console.log(huntingAreas);
  const collector = [];
  const areaSet = new Set();

  huntingAreas.forEach((huntingArea) => {
    const areaText = huntingArea["metsastysalue"];
    const areaInfo = huntingArea["metsastysajat"]["info"];
    const areaStart = huntingArea["metsastysajat"]["start"];
    const areaEnd = huntingArea["metsastysajat"]["end"];
    const durationTemplate = `<u>${areaStart}-${areaEnd}:</u>`;
    const text = areaInfo ? areaText + " " + areaInfo : areaText;
    const template = `${durationTemplate} ${text}`;
    collector.push(template);

    huntingArea.standardNames.forEach((standardName) => {
      areaSet.add(standardName);
    });
  });

  const template = `
  <b>${gameAnimal}</b><br/>
  ${collector.join("<br/>")}`;
  //console.log(template);

  const result = {
    text: template,
    areas: Array.from(areaSet),
    animal: gameAnimal,
  };
  return result;
};

/**
 * Parses a given hunting area definition to identify specific regions
 * mentioned in the text. The function checks for the presence of regional
 * genitive forms and maps them to their corresponding standard region names.
 * If the definition includes exceptions ("lukuun ottamatta"), it processes
 * them separately. Additionally, it checks for specific mentions of
 * "Taivalkoski" and adds "Pohjois-Pohjanmaa" to the list if present.
 *
 * @param {string} definition - The hunting area definition to parse.
 * @returns {Array<string>} An array of region names identified in the
 *                          definition.
 */

const parseMaakunnat = function (definition, gameAnimal, debugToken = false) {
  //console.log(definition);
  /// Maakuntien parsimisfunktio
  const collector = [];
  if (!definition.includes("lukuun ottamatta")) {
    if (definition.includes("muualla kuin")) {
      // console.log(definition);
      return [];
    }
    // console.log("----- PING!!! --------");
    // console.log(definition);
    MAAKUNTA_GENETIIVIT.forEach((maakunta, i) => {
      if (definition.includes(maakunta)) {
        collector.push(MAAKUNNAT[i]);
      }
    });
    if (definition.includes("Taivalkosk")) collector.push("Pohjois-Pohjanmaa");

    if (debugToken) console.log(collector);
    return collector;
  } else {
    if (gameAnimal !== "Metsähanhi") {
      // Koska saakelin metsähanhi pitää käsitellä erikseen
      MAAKUNTA_GENETIIVIT.forEach((maakunta, i) => {
        if (definition.includes(maakunta)) {
          collector.push(MAAKUNNAT[i]);
        }
      });
      if (definition.includes("Taivalkosk"))
        collector.push("Pohjois-Pohjanmaa");
    } else {
      MAAKUNTA_GENETIIVIT.forEach((maakunta, i) => {
        if (definition.includes(maakunta)) {
          collector.push(MAAKUNNAT[i]);
        }
      });
    }
  }

  if (debugToken) console.log(collector);
  return collector;
};

/**
 * Parses a given hunting area definition to determine the applicable regions.
 * The function processes various keywords and phrases within the definition
 * to identify standard geographic areas or legal references, returning an
 * array of standardized region names.
 *
 * @param {string} definition - The hunting area definition to parse.
 * @returns {Array<string>} An array of standardized region names based on the definition.
 *                          If no specific region is identified, returns an array with undefined.
 */

const parseHuntingArea = function (definition, gameAnimal) {
  let debugToken = false;
  // if (gameAnimal === "Metsähanhi") {
  //   console.log("Ping", gameAnimal, definition);
  //   debugToken = true;
  // }

  //console.log(definition);
  // Varsinainen parsimisfunktio
  if (definition.includes("Koko maassa")) {
    return MAAKUNNAT;
  }

  if (definition.includes("Merialueilla")) {
    return MERIALUEET;
  }

  if (definition.includes("Muualla maassa")) {
    return METSAHANHI_MUUMAA;
  }

  if (definition.includes("erikseen merkityllä alueella")) {
    ///console.log(gameAnimal);
    if (gameAnimal === "Haahka") {
      ///console.log("PING");
      return MERIALUEET.filter((alue) => alue !== "Ahvenanmaa");
    }
    return MERIALUEET;
  }

  if (definition.includes("MetsL 10") && !definition.includes("maakun")) {
    return MAAKUNNAT;
  }

  if (definition.includes("MetsL 41")) {
    if (definition.includes("maakun")) {
      return parseMaakunnat(definition, gameAnimal);
    } else return MAAKUNNAT;
  }

  if (definition.includes("MetsL 26")) {
    if (definition.includes("maakun")) {
      return parseMaakunnat(definition, gameAnimal);
    } else {
      // console.log("Ping!", definition);
      return MAAKUNNAT;
    }
  }

  if (definition.includes("Poronhoitoal")) {
    return ["Poronhoitoalue"];
  }

  if (definition.includes("maakun")) {
    // console.log("PING!", definition);
    //console.log(parseMaakunnat(definition));
    return parseMaakunnat(definition, gameAnimal, debugToken);
  }
  //console.log(definition);
  //console.log(gameAnimal, definition);
  return [undefined];
};

export default new Model();
