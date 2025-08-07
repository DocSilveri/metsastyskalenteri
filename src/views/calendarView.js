import { CalendarMonthView } from "./calendarMonthView.js";
import {
  COL_SPACING,
  ANIMAL_ICONS,
  ANIMAL_GROUPS,
  ICON_EXCEPTIONS,
} from "../config.js";
import { range, toLower, capitalize } from "lodash";

import unidecode from "unidecode";
import { parse } from "date-fns";

export class CalendarView {
  constructor(year) {
    this.months = range(1, 13).map(
      (month) => new CalendarMonthView(month, year)
    );
  }

  render() {
    const template = `
        <div class="row mb-5">
        ${this.months
          .slice(0, 6)
          .map((month) => {
            const template = `
            <div class="col-${COL_SPACING}">${month.render()}</div>
            `;
            return template;
          })
          .join("")}
        </div>
        <div class="row mb-5">
        ${this.months
          .slice(6, 12)
          .map((month) => {
            const template = `
            <div class="col-${COL_SPACING}">${month.render()}</div>
            `;
            return template;
          })
          .join("")}
        </div>
        `;
    return template;
  }
  updateDay(day, data) {
    // Breaks separation by views a bit, but calendarDayView is only used for rendering the calendar itself dynamically
    // and does not create the elements itself.

    const dayEl = document.querySelector(`#${idFromDate(day)}`);
    const dataObj = createInfoObject(data);
    const groups = groupDuplicates(dataObj);
    //console.log(groups);

    dayEl.querySelector(".hunting-event").innerHTML = groups
      .map((group) => {
        const title = titleFromGroup(group);
        const keyAnimal = group[0];
        const icon = findIconClass(keyAnimal);
        const infoText = dataObj[keyAnimal];
        //console.log(day, obj);
        const htmlTemplate = createDayEntry(title, icon, infoText, keyAnimal);
        //console.log(htmlTemplate);
        return htmlTemplate;
      })
      .join("");
    dayEl.querySelectorAll("i").forEach((el) => {
      const tooltip = new bootstrap.Tooltip(el, { html: true });
    });
    // dayEl.setAttribute("data-bs-toggle", "tooltip");
    // dayEl.setAttribute("data-bs-title", data["text"]);
    // const toolTip = new bootstrap.Tooltip(dayEl, {
    //   html: true,
    //});
  }

  changeColorForToday() {
    const today = new Date();
    const todayId = idFromDate(today);
    const todayEl = document.querySelector(`#${todayId}`);
    todayEl.classList.remove("text-bg-white");
    todayEl.classList.remove("text-bg-light");
    todayEl.classList.add("text-bg-info");
  }
}

const titleFromGroup = function (group) {
  // Luo yhdistetty otsikko useamman eläimen listasta
  if (group.length === 1) {
    return group[0];
  }
  if (group.length === 2) {
    return capitalize(toLower(`${group[0]} ja ${group[1]}`));
  }

  const lastAnimal = group.pop();
  return capitalize(toLower(`${group.join(", ")} ja ${lastAnimal}`));
};

const createInfoObject = function (data) {
  // Create a object with game animal as key and info text as value
  const result = {};
  data.forEach((entry) => {
    result[entry["animal"]] = fetchInfoText(entry);
  });

  return result;
};

const groupDuplicates = function (dataObj) {
  // Find entries that have identical info text and return groups
  const keys = Object.keys(dataObj);
  const infoCollector = keys.map(
    (key) => dataObj[key] // Get info text
  );

  const infoSet = new Set(infoCollector);
  const groups = [...infoSet].map((infoText) => {
    const collector = [];
    keys.forEach((key) => {
      if (dataObj[key] === infoText) {
        //console.log(entry);
        collector.push(key);
      }
    });
    return collector;
  });
  return groups;
};

const fetchInfoText = function (entry) {
  const splitted = entry["infotext"]["text"].split("<br/>");
  const infoText = splitted.slice(1).join("<br/>");
  return infoText;
};

const idFromDate = function (date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `day-${day}-${month}-${year}`;
};

const createDayEntry = function (title, icon, infoText, keyAnimal) {
  return `<i class="${icon} ${createIconName(
    keyAnimal
  )} mx-0" data-bs-toggle="tooltip" data-bs-title="<b>${title}</b><br/>${infoText}"><span class="visually-hidden">${title}</span></i>`;
};

const createIconName = function (animalName) {
  const lowerIcon = toLower(animalName);
  if (Object.keys(ICON_EXCEPTIONS).includes(toLower(animalName))) {
    return `${ICON_EXCEPTIONS[lowerIcon]} icon-${unidecode(lowerIcon)}`;
  } else return `${findIconClass(animalName)} icon-${unidecode(lowerIcon)}`;
};

const findIconClass = function (animalName) {
  let icon;
  Object.keys(ANIMAL_GROUPS).forEach((key) => {
    //console.log(key, capitalize(animalName), ANIMAL_GROUPS[key]);
    if (ANIMAL_GROUPS[key].includes(animalName)) {
      icon = ANIMAL_ICONS[key];
    }
  });
  return icon;
};
