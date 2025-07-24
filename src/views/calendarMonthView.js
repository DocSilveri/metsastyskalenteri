import { getWeek, endOfMonth, format, getDate } from "date-fns";
import { fi, enGB } from "date-fns/locale";
import { range, groupBy } from "lodash";

import { CalendarDayView } from "./calendarDayView.js";

export class CalendarMonthView {
  constructor(monthnum, year) {
    this.startdate = new Date(year, monthnum - 1, 1);
    this.enddate = endOfMonth(this.startdate);
    this.monthnum = monthnum;
    this.year = year;
    this.startweeknum = getWeek(this.startdate, { weekStartsOn: 1 });
    this.endweeknum = getWeek(this.enddate, { weekStartsOn: 1 });

    // Joulukuun huomointi, viimeisten päivien viikkonumero voi olla 1
    this.weeks =
      this.endweeknum === 1
        ? [...range(this.startweeknum, 53), 1]
        : range(this.startweeknum, this.endweeknum + 1);

    this.id = `card-month-${format(this.startdate, "MMMM", { locale: enGB })}`;

    this.monthname = format(this.startdate, "MMMM", { locale: fi }).slice(
      0,
      -2
    );
    //console.log(this.monthname);

    // Array with CalendarDayView objects for all days in the month
    this.days = range(1, getDate(this.enddate) + 1).map((day) => {
      const date = new Date(year, monthnum - 1, day);
      return new CalendarDayView(date);
    });

    // Object that gruops the days by weeknumber
    this.daysByWeek = groupBy(this.days, (day) => day.weeknum);
  }

  renderWeek(weeknum) {
    //console.log(`Rendering week ${weeknum}`);
    //console.log(this.days);
    const template = `
    <div class="text-bg-${
      weeknum % 2 === 0 ? "white" : "light"
    } text-nowrap px-2" id="calendar-${this.monthname}--week-${weeknum}">
    ${this.daysByWeek[weeknum].map((day) => day.render()).join("")}
    </div>
    `;
    return template;
  }

  render() {
    //console.log(`Rendering month ${this.monthname}`);
    const template = `
    <div class="card" id="${this.id}">
      <div class="card-header text-capitalize">${this.monthname}</div>
      <div class="card-body">
        ${this.weeks.map((weeknum) => this.renderWeek(weeknum)).join("")}
      </div>
    </div>
    `;
    return template;
  }
}
