import { ANIMAL_GROUPINGS } from "../config.js";
import { capitalize, toLower } from "lodash";
import { NavBarDropDownView } from "./navBarDropDownView.js";

class GameAnimalDropdownView extends NavBarDropDownView {
  constructor() {
    super();
    this.element = document.querySelector("#riistaelaimetNavbarDropDownItems");
    this.subElementClass = "riista-ryhma";
    this.init();
  }

  addHandlerGroupCheckBoxChange(handler) {
    const mainElement = document.querySelector("#gameanimals-dropdown-items");
    mainElement.addEventListener("change", (e) => {
      const group = e.target
        .closest(".form-check-input")
        .getAttribute("id")
        .split("CheckBox")[0];
      handler([group]);
    });
  }

  addHandlerAllGroupsCheckBoxChange(handler) {
    const mainElement = document.querySelector("#kaikkiElaimetCheckBox");
    mainElement.addEventListener("change", (e) => {
      const checkStatus = mainElement.checked;
      handler(checkStatus);
    });
  }

  checkItem(key) {
    const id = `${key}CheckBox`;
    const element = document.querySelector(`#${id}`);
    element.checked = true;
  }

  createData2Render() {
    const collector = [];

    ANIMAL_GROUPINGS.forEach((grouping, index) => {
      if (index) collector.push(this.divider); // skip divider for first entry
      grouping.forEach((key) => {
        const name = createNameFromKey(key);
        const id = createIdFromKey(key);
        this.id2text[id] = key;
        collector.push(this.createItem(id, name, this.subElementClass));
      });
    });

    const data = [
      //this.createItem("kaikkiElaimetCheckBox", "Kaikki riistaeläimet"),
      this.createGroupDiv("gameanimals-dropdown-items", collector),
    ];

    this.render(data);
  }
}

const createNameFromKey = function (key) {
  const keyArr = key.split("_");
  keyArr[0] = capitalize(keyArr[0]);
  return keyArr.join(" ");
};

const createIdFromKey = function (key) {
  const keyParts = toLower(key).split("_");

  const camelCasedKey =
    keyParts.length > 1 ? keyParts[0] + capitalize(keyParts[1]) : keyParts[0];
  return camelCasedKey + "CheckBox";
};

export default new GameAnimalDropdownView();
