export class NavBarDropDownView {
  constructor() {
    this.divider = `<div class="dropdown-divider"></div>`;
    this.id2text = {}; // This defines what is returned to the controller when an item is checked, define in createData2Render
    //this.element = document.querySelector("#metsastysAlueNavbarDropDownItems"); // reimplement this
    //this.subElementClass = ".riista-alue"; // reimplement this
  }

  init() {
    this.createData2Render();
  }

  findChecked() {
    const checked = [];
    //console.log(...this.subElements);
    this.subElements.forEach((el) => {
      if (el.querySelector("input").checked) {
        const key = this.id2text[el.querySelector("input").id];
        checked.push(key);
      }
    });
    return checked;
  }

  checkAll() {
    this.subElements.forEach((el) => {
      el.querySelector("input").checked = true;
    });
  }

  unCheckAll() {
    this.subElements.forEach((el) => {
      el.querySelector("input").checked = false;
    });
  }

  reset() {
    this.element.innerHTML = "";
  }

  //
  // -- YOU NEED TO REIMPLEMENT THE EVENT HANDLERS ---
  //

  /*
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
    */

  //
  // --- REIMPLEMENT THIS, the following is an example ---
  //

  //   createData2Render() {

  //     const collector = [];

  //     const maakunnat = new Set(MAAKUNNAT);

  //     maakunnat.forEach((maakunta) => {
  //       const checkboxId = createCHeckBoxIdFromAreaName(maakunta);
  //       this.id2Maakunta[checkboxId] = maakunta;

  //       collector.push(this.createItem(checkboxId, maakunta, "riista-alue"));
  //     });

  //     const data = [this.createItem("kaikkiAlueetCheckBox", "Kaikki maakunnat"),
  //       this.divider,
  //       this.createGroupDiv("maakunnat-dropdown-items", collector)
  //     ]

  //     this.render(data);
  //   }

  /**
   * Resets the view and then renders the given data.
   * @param {Array<string>} data - The data to render. Each string is a HTML element.
   */
  render(data) {
    this.reset();
    const template = data.join("");
    this.element.innerHTML = template;
    this.subElements = document.querySelectorAll(`.${this.subElementClass}`);
  }

  /**
   * Creates a dropdown item with a checkbox.
   * @param {string} id - The id of the checkbox.
   * @param {string} text - The text to display next to the checkbox.
   * @param {string} [subClassName] - An additional class name to add to the div element.
   * @returns {string} The HTML of the item as a string.
   */
  createItem(id, text, subClassName = undefined) {
    const template = `
                  <span class="dropdown-item">
                    <div class="form-check ${subClassName ? subClassName : ""}">
                      <input class="form-check-input" type="checkbox" value="" id="${id}">
                      <label class="form-check-label" for="${id}">${text}</label>
                    </div>
                  </span>
                 `;
    return template;
  }

  /**
   * Create a div element with the given id and containing the given data.
   * Data should be an array of strings.
   * @param {string} id - The id of the div element.
   * @param {string[]} data - The contents of the div element.
   * @returns {string} - The HTML of the div element as a string.
   */
  createGroupDiv(id, data) {
    const template = `<div id="${id}">${data.join("")}</div>`;
    return template;
  }
}
