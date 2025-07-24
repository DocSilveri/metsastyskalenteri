import { MAAKUNNAT } from "../config.js";
import { capitalize } from "lodash";
import { NavBarDropDownView } from "./navBarDropDownView.js";

class HuntingAreaDropdownView extends NavBarDropDownView {
  constructor() {
    super();
    this.element = document.querySelector("#metsastysAlueNavbarDropDownItems");

    this.subElementClass = "riista-alue";
    this.init();
  }

  addHandlerMaakuntaCheckBoxChange(handler) {
    const mainElement = document.querySelector("#maakunnat-dropdown-items");
    mainElement.addEventListener("change", (e) => {
      handler(this.findChecked());
    });
  }

  addHandlerAllAreasCheckBoxChange(handler) {
    const mainElement = document.querySelector("#kaikkiAlueetCheckBox");
    mainElement.addEventListener("change", (e) => {
      const checkStatus = mainElement.checked;
      handler(checkStatus);
    });
  }

  createData2Render() {
    const collector = [];

    const maakunnat = new Set(MAAKUNNAT);

    maakunnat.forEach((maakunta) => {
      const checkboxId = createCHeckBoxIdFromAreaName(maakunta);
      this.id2text[checkboxId] = maakunta;

      collector.push(this.createItem(checkboxId, maakunta, "riista-alue"));
    });

    const data = [
      this.createItem("kaikkiAlueetCheckBox", "Kaikki maakunnat"),
      this.divider,
      this.createGroupDiv("maakunnat-dropdown-items", collector),
    ];

    this.render(data);
  }
}

const createCHeckBoxIdFromAreaName = function (area) {
  // esim. Pohjois-Pohjanmaa -> pohjoisPohjanmaaCheckBox
  const areaParts = area.toLowerCase().split("-");

  const camelCasedArea =
    areaParts.length > 1
      ? areaParts[0] + capitalize(areaParts[1])
      : areaParts[0];
  return camelCasedArea + "CheckBox";
};

export default new HuntingAreaDropdownView();
