import { format, getWeek } from "date-fns";
import { fi } from "date-fns/locale";

export class CalendarDayView {
  constructor(date) {
    this.date = date;
    this.daynum = date.getDate();
    this.weekday = format(date, "E", { locale: fi }).slice(0, 2);
    this.weeknum = getWeek(date, { weekStartsOn: 1 });
    this.monthnum = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.statusString = "";
    this.id = `day-${this.daynum}-${this.monthnum}-${this.year}`;
  }

  setStatusString(statusString) {
    this.statusString = statusString;
  }

  render() {
    const template = `
        <div class="row" id="day-${this.daynum}-${this.monthnum}-${this.year}">
            <small class="col-1 daynum">${this.daynum}</small>
            <small class="col-1 dayletter">${this.weekday}</small>
            <small class="col hunting-event">${this.statusString}</small>
        </div>
    `;
    return template;
  }

  setAnimals(animalData) {
    animalData.map((animal) => {
      console.log(animal);
    });
  }

  update(newStatus = this.statusString) {
    this.setStatusString(newStatus);
    const dayElement = document.getElementById(this.id);
    const event = dayElement.querySelector(".hunting-event");
    event.innerHTML = this.statusString;
  }
}

//export default new CalendarDayView((date = new Date()));
