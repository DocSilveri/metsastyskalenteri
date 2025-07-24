import { CalendarView } from "./views/calendarView.js";
import {
  CURRENTYEAR,
  MAAKUNNAT,
  ANIMAL_GROUPINGS,
  ANIMAL_GROUPS,
} from "./config.js";
import model from "./model.js";
import { createInfoString } from "./model.js";
//import { CalendarMonthView } from "./views/calendarMonthView.js";
import huntingAreaDropdownView from "./views/huntingAreaDropdownView.js";
import gameAnimalDropdownView from "./views/gameAnimalDropdownView.js";

let calendarView;

//getCurrentGameAnimals(riistaElaimet);

const huntingAreaChangeHandler = function (result) {
  model.selected.areas = result;
  updateCalendar();
};

const huntingAreaAllAreasHandler = function (result) {
  if (result) {
    huntingAreaDropdownView.checkAll();
    model.selected.areas = MAAKUNNAT;
  } else {
    huntingAreaDropdownView.unCheckAll();
    model.selected.areas = [];
  }
  updateCalendar();
};

const gameanimalChangeHandler = function (result) {
  console.log(result);
  if (result) {
    gameAnimalDropdownView.unCheckAll();
    gameAnimalDropdownView.checkItem(result);
  }
  model.selected.animal_groups = result;
  updateCalendar();
};

const gameanimalsCheckAllHandler = function (result) {
  if (result) {
    gameAnimalDropdownView.checkAll();
    model.selected.animal_groups = ANIMAL_GROUPINGS;
  } else {
    gameAnimalDropdownView.unCheckAll();
    model.selected.animal_groups = [];
  }
  updateCalendar();
};

const updateCalendar = function () {
  console.log("Updating calendar");
  const maakuntaSet = new Set(model.selected.areas);
  const animalcollector = [];
  model.selected.animal_groups.forEach((group) => {
    animalcollector.push(...ANIMAL_GROUPS[group]);
  });

  model.allDaysOfYear.forEach((day) => {
    // Iterate for every day of the year
    const animalData = animalcollector
      .map((animal) => {
        // Iterate for each animal
        return { animal, result: model.checkDate(animal, day) };
      })
      .map((obj) => {
        // get intersection for selected areas (set comparison)
        const animal = obj["animal"];
        const result = obj["result"];
        const collector = [];

        if (result) {
          result.forEach((area) => {
            collector.push(...area["standardNames"]);
          });
        }

        const areaSet = collector.length > 0 ? new Set(collector) : new Set();
        const interSection = areaSet.intersection(maakuntaSet);

        return {
          animal,
          areaSet,
          result: obj["result"],
          intersection: [...interSection],
        };
      })
      .filter((obj) => {
        //console.log(obj);
        // filter for empty intersections
        if (!obj["intersection"].length) return false;
        return true;
      })
      .map((obj) => {
        const infotext = createInfoString(obj["result"], obj["animal"]);
        return {
          animal: obj["animal"],
          infotext,
        };
      });
    //console.log(animalData);
    calendarView.updateDay(day, animalData);
  });
};

const init = function () {
  console.log("Initializing");
  // create calendar

  const calendarContainer = document.querySelector(".calendar-container");
  calendarContainer.innerHTML = "";
  calendarView = new CalendarView(CURRENTYEAR);
  calendarContainer.innerHTML = calendarView.render();

  // model.allDaysOfYear.forEach((day) => {
  //   const result = model.checkDate("Hirvi", day);
  //   if (result) {
  //     calendarView.updateDay(day, result);
  //   }
  // });

  //
  // ----- INITIALIZE HANDLER FUNCTIONS ----
  //

  huntingAreaDropdownView.addHandlerMaakuntaCheckBoxChange(
    huntingAreaChangeHandler
  );
  huntingAreaDropdownView.addHandlerAllAreasCheckBoxChange(
    huntingAreaAllAreasHandler
  );

  gameAnimalDropdownView.addHandlerGroupCheckBoxChange(gameanimalChangeHandler);
  //gameAnimalDropdownView.addHandlerAllGroupsCheckBoxChange(gameanimalsCheckAllHandler);

  //calendarContainer.innerHTML = "";

  //huntingAreaDropdownView.render();
};

init();
