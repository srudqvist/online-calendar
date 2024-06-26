/**
 * Calendar Management
 *
 * This JavaScript file handles the management of the calendar interface.
 * It imports functions from various utility files to assist in calendar management.
 * Upon the DOMContentLoaded event, it initializes the calendar and sets up event listeners for navigation buttons.
 * It dynamically generates the calendar grid based on the selected month and year.
 * The user can navigate between months and years using the provided buttons.
 * Event listeners are attached to date and time buttons to handle user interactions.
 * The calendar also interacts with other components such as user details and scheduling.
 * Error handling and scaling of elements are implemented throughout the script.
 *
 * External Dependencies:
 * - formatAMPM.js: Provides the formatAMPM function for formatting time.
 * - getEventInfo.js: Provides the getEventInfo function for fetching event information.
 * - getMeetingsForCalendar.js: Provides the getScheduledMeetingsByDate function for fetching scheduled meetings.
 * - scaleElements.js: Provides functions for scaling elements.
 *
 * Functions:
 * - generateCalendar(year, month, availableDays): Generates the calendar grid based on the specified year, month, and available days.
 * - calculateTimeSlots(startTime, endTime, durationMinutes): Calculates the number of time slots based on the start and end times and duration.
 * - generateTimeSlotButtons(numTimeSlots, startTime, endTime, duration): Generates time slot buttons for the calendar.
 * - highlightDate(element): Highlights the selected date in the calendar and retrieves scheduled meetings for that date.
 * - grayOutTimeButtons(takenTimes): Disables time buttons that are already taken.
 * - highlightButton(buttonId): Highlights the selected time button.
 * - updateCalendar(): Updates the calendar based on the selected year and month.
 * - switchMonth(offset): Switches to the previous or next month based on the provided offset.
 * - switchYear(offset): Switches to the previous or next year based on the provided offset.
 *
 */

import { formatAMPM } from "../utils/formatAMPM.js";
import { getEventInfo } from "./getEventInfo.js";
import { getScheduledMeetingsByDate } from "./getMeetingsForCalendar.js";
import { scaleUpElement, resetScaleElement } from "../utils/scaleElements.js";

document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("calendar");
  const calendarContent = document.getElementById("contentDiv");
  const nextButton = document.getElementById("nextButton");
  const backButton = document.getElementById("backButton");
  const scheduleButton = document.getElementById("scheduleButton");
  const userDetails = document.getElementById("userDetailsDiv");
  const currentDate = new Date();
  const bannerComponent = document.querySelector("banner-component");
  let availableDays;

  // Next button event listeners
  nextButton.addEventListener("mouseover", () => scaleUpElement(nextButton));
  nextButton.addEventListener("mouseleave", () =>
    resetScaleElement(nextButton),
  );

  nextButton.addEventListener("click", () => {
    if (bannerComponent) {
      bannerComponent.setAttribute("custom-text", "User Details");
      bannerComponent.connectedCallback();
    } else {
      console.log("banner not found");
    }

    userDetails.style.display = "flex";
    calendarContent.style.display = "none";
    const year = document.getElementById("currentYear").innerText;
    const month = document.getElementById("currentMonth").innerText;
    const date = document.getElementsByClassName("selected-date")[0].innerHTML;
    const time = document.getElementsByClassName("selected-time")[0].innerHTML;
    const test = document.getElementById("date-time");
    test.innerText = `${time} ${month} ${date}, ${year}`;
  });

  // Back button event listeners
  backButton.addEventListener("click", () => {
    if (bannerComponent) {
      bannerComponent.setAttribute("custom-text", "Calendar");
      bannerComponent.connectedCallback();
    }

    userDetails.style.display = "none";
    calendarContent.style.display = "flex";
  });

  backButton.addEventListener("mouseover", () => scaleUpElement(backButton));
  backButton.addEventListener("mouseleave", () =>
    resetScaleElement(backButton),
  );

  scheduleButton.addEventListener("mouseover", () =>
    scaleUpElement(scheduleButton),
  );
  scheduleButton.addEventListener("mouseleave", () =>
    resetScaleElement(scheduleButton),
  );

  const timeContainer = document.getElementById("timeDiv");
  const calculateTimeSlots = (startTime, endTime, durationMinutes) => {
    // Convert start time, end time, and duration to minutes
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Calculate time difference in minutes
    const timeDifference = endMinutes - startMinutes;

    // Calculate the number of time slots
    const numTimeSlots = Math.floor(timeDifference / durationMinutes);

    return numTimeSlots;
  };

  // Function to convert time in HH:mm format to minutes
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const timeToHours = (timeInMinutes) => {
    let hours = Math.floor(timeInMinutes / 60);
    let remainingMinutes = timeInMinutes % 60;
    if (remainingMinutes.toString() == "0") {
      remainingMinutes = "00";
    }
    if (hours.toString().length == 1) {
      hours = "0" + hours.toString();
    }
    return `${hours}:${remainingMinutes}`;
  };

  const generateTimeSlotButtons = (
    numTimeSlots,
    startTime,
    endTime,
    duration,
  ) => {
    // Get the times that should be grayed out
    //

    for (let i = 0; i < numTimeSlots; i++) {
      const row = document.createElement("div");
      row.classList.add("time-button-row");
      const button = document.createElement("button");
      const buttonId = "time-button-" + i;
      button.classList.add("center_content");
      button.id = buttonId;
      const buttonMinutes = timeToMinutes(startTime) + duration * i;
      const buttonText = timeToHours(buttonMinutes);

      if (i == 0) {
        const formattedStartTime = formatAMPM(startTime);
        button.innerText = formattedStartTime;
      } else if (i == numTimeSlots) {
        const formattedEndTime = formatAMPM(endTime);
        button.innerText = formattedEndTime;
      } else {
        const formattedTime = formatAMPM(buttonText);
        button.innerText = formattedTime;
      }

      button.addEventListener("mouseover", () => scaleUpElement(button));
      button.addEventListener("mouseleave", () => resetScaleElement(button));

      button.addEventListener("click", () => {
        highlightButton(buttonId);
      });

      row.appendChild(button);
      timeContainer.appendChild(row);
    }
  };

  getEventInfo()
    .then((eventInfo) => {
      const startTime = eventInfo.fetchedStartTime;
      //const startTime = "08:00";
      const endTime = eventInfo.fetchedEndTime;
      let durationMinutes = eventInfo.fetchedDuration;
      //const durationMinutes = parseInt(eventInfo.fetchedDuration.split(" "));

      if (!durationMinutes.includes("h")) {
        durationMinutes = parseInt(eventInfo.fetchedDuration.split(" "));
      } else if (
        durationMinutes.includes("h") &&
        !durationMinutes.includes("min")
      ) {
        durationMinutes = parseInt(eventInfo.fetchedDuration.split(" ")) * 60;
      } else if (
        durationMinutes.includes("h") &&
        durationMinutes.includes("min")
      ) {
        let [hours, minutes, ...xyz] = eventInfo.fetchedDuration.split(" ");
        hours = hours.split("h")[0];
        let totalMin = Math.floor(hours * 60) + Math.floor(minutes);
        durationMinutes = totalMin;
      }

      availableDays = eventInfo.fetchedAvailableDays;
      const numTimeSlots = calculateTimeSlots(
        startTime,
        endTime,
        durationMinutes,
      );

      const generateButtons = generateTimeSlotButtons(
        numTimeSlots,
        startTime,
        endTime,
        durationMinutes,
      );
      // Generate initial calendar
      generateCalendar(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        availableDays,
      );
    })
    .catch((error) => {
      console.log("Error in fetching times, calendar.js 130: ", error);
    });

  function generateCalendar(year, month, availableDays) {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const currentDay = date.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendarTable = document.createElement("table");
    document.getElementById("currentYear").textContent = year;
    document.getElementById("currentMonth").textContent = new Date(
      year,
      month,
      1,
    ).toLocaleString("default", { month: "long" });

    let dayCounter = 1;

    // Create table header with days of the week
    const headerRow = document.createElement("tr");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const longDaysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    daysOfWeek.forEach((day) => {
      const th = document.createElement("th");
      //th.classList.add("gray-out");
      th.textContent = day;
      headerRow.appendChild(th);
    });

    calendarTable.appendChild(headerRow);

    // Create table rows with days
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const td = document.createElement("td");

        if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
          td.textContent = "";
        } else if (year < currentYear) {
          td.textContent = dayCounter;
          td.classList.add("gray-out");
          dayCounter++;
        } else if (
          ((i !== 0 && j > firstDayOfMonth) || dayCounter < daysInMonth) &&
          dayCounter < currentDay &&
          month < currentMonth
        ) {
          td.textContent = dayCounter;
          td.classList.add("gray-out");
          dayCounter++;
        } else {
          if (!availableDays.includes(longDaysOfWeek[j])) {
            td.textContent = dayCounter;
            td.classList.add("gray-out");
            dayCounter++;
          } else {
            td.textContent = dayCounter;
            td.addEventListener("click", () => highlightDate(td));
            td.addEventListener("mouseover", () => scaleUpElement(td));
            td.addEventListener("mouseleave", () => resetScaleElement(td));
            dayCounter++;
          }
        }

        row.appendChild(td);
      }

      calendarTable.appendChild(row);
    }

    calendarContainer.innerHTML = "";
    calendarContainer.appendChild(calendarTable);
  }

  function highlightDate(element) {
    const selectedDates = document.querySelectorAll(".selected-date");
    selectedDates.forEach((date) => date.classList.remove("selected-date"));

    const selectedDate = element.textContent;
    element.innerHTML = `<div class="selected-date">${selectedDate}</div>`;

    // Build the date and get times already taken
    const year = parseInt(selectYear.value);
    const month = parseInt(selectMonth.value) + 1;
    let formattedDate = `${year}-`;

    if (month.toString().length == 1) {
      formattedDate += `0${month}-`;
    } else {
      formattedDate += `${month}-`;
    }

    if (selectedDate.length == 1) {
      formattedDate += `0${selectedDate}`;
    } else {
      formattedDate += selectedDate;
    }

    getScheduledMeetingsByDate(formattedDate)
      .then((takenTimes) => {
        grayOutTimeButtons(takenTimes);
        // Use takenTimes to populate the list of scheduled meetings
      })
      .catch((error) => {
        console.log(`Error in highlightDate: ${error}`);
      });
  }

  function grayOutTimeButtons(takenTimes) {
    const timeButtons = document.querySelectorAll(".time-button-row button");
    timeButtons.forEach((button) => {
      const buttonText = button.innerText.trim();

      if (takenTimes.includes(buttonText)) {
        button.classList.add("gray-out");
        button.disabled = true;
      } else {
        button.classList.remove("gray-out");
        button.disabled = false;
      }
    });
  }

  const highlightButton = (buttonId) => {
    const selectedButtons = document.querySelectorAll(".selected-time");
    selectedButtons.forEach((button) =>
      button.classList.remove("selected-time"),
    );

    const button = document.getElementById(buttonId);
    button.classList.add("selected-time");
  };

  function updateCalendar() {
    const year = parseInt(selectYear.value);
    const month = parseInt(selectMonth.value);
    generateCalendar(year, month, availableDays);
  }

  function switchMonth(offset) {
    const currentMonth = parseInt(selectMonth.value);
    const newMonth = (currentMonth + offset + 12) % 12;
    selectMonth.value = newMonth;
    updateCalendar();
  }

  function switchYear(offset) {
    const currentYear = parseInt(selectYear.value);
    const newYear = currentYear + offset;
    selectYear.value = newYear;
    updateCalendar();
  }

  // Create and append year and month selectors
  const selectYear = document.createElement("select");
  const selectMonth = document.createElement("select");

  for (
    let i = currentDate.getFullYear() - 10;
    i <= currentDate.getFullYear() + 10;
    i++
  ) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    selectYear.appendChild(option);
  }

  for (let i = 0; i < 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = new Date(currentDate.getFullYear(), i, 1).toLocaleString(
      "default",
      {
        month: "long",
      },
    );
    selectMonth.appendChild(option);
  }

  selectYear.addEventListener("change", updateCalendar);
  selectMonth.addEventListener("change", updateCalendar);

  // Append year and month selectors
  calendarContainer.appendChild(selectYear);
  calendarContainer.appendChild(selectMonth);

  // Create and append buttons for switching months and years
  const prevMonthButton = document.getElementById("prevMonth");
  prevMonthButton.addEventListener("click", () => {
    const month = document.getElementById("currentMonth").innerText;

    if (month == "January") {
      switchYear(-1);
    }

    switchMonth(-1);
  });

  prevMonthButton.addEventListener("mouseover", () =>
    scaleUpElement(prevMonthButton),
  );

  prevMonthButton.addEventListener("mouseleave", () =>
    resetScaleElement(prevMonthButton),
  );

  const nextMonthButton = document.getElementById("nextMonth");
  nextMonthButton.addEventListener("click", () => {
    const month = document.getElementById("currentMonth").innerText;
    if (month == "December") {
      switchYear(1);
    }
    switchMonth(1);
  });

  nextMonthButton.addEventListener("mouseover", () =>
    scaleUpElement(nextMonthButton),
  );

  nextMonthButton.addEventListener("mouseleave", () =>
    resetScaleElement(nextMonthButton),
  );

  const prevYearButton = document.getElementById("prevYear");
  prevYearButton.addEventListener("click", () => switchYear(-1));
  prevYearButton.addEventListener("mouseover", () =>
    scaleUpElement(prevYearButton),
  );

  prevYearButton.addEventListener("mouseleave", () =>
    resetScaleElement(prevYearButton),
  );

  const nextYearButton = document.getElementById("nextYear");
  nextYearButton.addEventListener("click", () => switchYear(1));

  nextYearButton.addEventListener("mouseover", () =>
    scaleUpElement(nextYearButton),
  );

  nextYearButton.addEventListener("mouseleave", () =>
    resetScaleElement(nextYearButton),
  );

  // Set initial values for selectors
  selectYear.value = currentDate.getFullYear();
  selectMonth.value = currentDate.getMonth();
});
