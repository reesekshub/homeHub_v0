const CALENDAR_EVENTS = [
  {
    name: "Running",
    day: "wednesday",
    time: "09:00",
    modality: "In-person",
    location: "Boulder",
    url: "",
    attendees: "Alice, Jack, Ben",
  },
];

const CALENDAR_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let EVENT_MODAL;

/********************** PART B: 6.1: CREATE CALENDAR *************************/

function createBootstrapCard(day) {
  // @TODO: Use `document.createElement()` function to create a `div`
  var card = document.createElement("div");
  // Let's add some bootstrap classes to the div to upgrade its appearance
  // This is the equivalent of <div class="col-sm m-1 bg-white rounded px-1 px-md-2"> in HTML
  card.className = "col-sm m-1 bg-white rounded px-1 px-md-2";

  // This the equivalent of <div id="monday"> in HTML
  card.id = day.toLowerCase();
  return card;
}
function createTitle(day) {
  // Create weekday as the title.
  // @TODO: Use `document.createElement()` function to create a `div` for title
  const title = document.createElement("div");
  title.className = "h6 text-center position-relative py-2";
  title.innerHTML = day;
  return title;
}

function createEventIcon(card) {
  // Use document.createElement() function to create an icon element
  const icon = document.createElement("i");
  // Add classes to the icon for styling with Bootstrap
  icon.className =
    "bi bi-calendar-plus btn position-absolute translate-middle start-100 rounded p-0 btn-link";
  // Adding an event listener to the click event of the icon to open the modal
  // The below line of code sets the onclick attribute to openEventModal with the appropriate day
  icon.setAttribute("onclick", `openEventModal({day: '${card.id}'})`);
  return icon;
}

function createEventDiv() {
  // Use document.createElement() function to create a div element
  const eventsDiv = document.createElement("div");

  // Add a class to the div container for styling or identifying it
  eventsDiv.classList.add("event-container");

  return eventsDiv;
}

/* The function initializeCalendar() initializes the Calendar for your events and it gets called `onload` of your page.
  We will complete the TODOs to render the Calendar in the next few steps. */
function initializeCalendar() {
  // You will be implementing this function in section 2: Create Modal
  initializeEventModal();

  // Get the div of the calendar which we created using its id. Either use document.getElementById() or document.querySelector()
  const calendarElement = document.getElementById("calendar");

  // Check if calendarElement exists
  if (!calendarElement) {
    console.error("Calendar element not found.");
    return;
  }
  // Iterating over each CALENDAR_DAYS
  CALENDAR_DAYS.forEach((day) => {
    // Create a bootstrap card for each weekday
    var card = createBootstrapCard(day);

    // Check if card is a valid Node
    if (!card || !(card instanceof Node)) {
      console.error("Invalid card element:", card);
      return;
    }
    // Add card to the calendarElement
    calendarElement.appendChild(card);
    // Create title for each card
    var title = createTitle(day);
    // Check if title is a valid Node
    if (!title || !(title instanceof Node)) {
      console.error("Invalid title element:", title);
      return;
    }
    // Add title to the card
    card.appendChild(title);
    // Create event icon for each card
    var icon = createEventIcon(card);
    // Check if icon is a valid Node
    if (!icon || !(icon instanceof Node)) {
      console.error("Invalid icon element:", icon);
      return;
    }
    // Add icon to the title
    title.appendChild(icon);
    // Create a div for events
    var eventsDiv = createEventDiv();

    // Check if eventsDiv is a valid Node
    if (!eventsDiv || !(eventsDiv instanceof Node)) {
      console.error("Invalid eventsDiv element:", eventsDiv);
      return;
    }
    // Add eventsDiv to the card
    card.appendChild(eventsDiv);
    // Do a console.log(card) to verify the output on your console
    console.log(card);
  });
  // Uncomment this after you implement the updateDOM() function
  updateDOM();
}
// end of initializeCalendar()
/********************** PART B: 6.2: CREATE MODAL ****************************/

function initializeEventModal() {
  // Create a modal using JS. The id will be `event-modal`:
  // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
  EVENT_MODAL = new bootstrap.Modal(document.getElementById("event-modal"));
}

function openEventModal({ id, day }) {
  const submit_button = document.querySelector("#submit_button");
  const modal_title = document.querySelector(".modal-title");

  let event = CALENDAR_EVENTS[id];

  if (!event) {
    event = {
      name: "",
      day: day,
      time: "",
      modality: "",
      location: "",
      url: "",
      attendees: "",
    };

    modal_title.innerHTML = "Create Event";
    submit_button.innerHTML = "Create Event";
    id = CALENDAR_EVENTS.length; // Set the id to be the length of the CALENDAR_EVENTS
  } else {
    modal_title.innerHTML = "Update Event";
    submit_button.innerHTML = "Update Event";
  }

  document.querySelector("#event_name").value = event.name;
  document.querySelector("#event_day").value = event.day;
  document.querySelector("#event_time").value = event.time;
  document.querySelector("#event_modality").value = event.modality;
  document.querySelector("#event_location").value = event.location;
  document.querySelector("#event_url").value = event.url;
  document.querySelector("#event_attendees").value = event.attendees;

  updateLocationOptions(event.modality);

  const form = document.querySelector("#event-modal form");
  form.setAttribute("action", `javascript:updateEventFromModal(${id})`);

  EVENT_MODAL.show();
}

function updateEventFromModal(id) {
  // Pick the modal field values using document.querySelector().value,
  // and assign it to each field in CALENDAR_EVENTS.
  CALENDAR_EVENTS[id] = {
    name: document.querySelector("#event_name").value,
    day: document.querySelector("#event_day").value,
    time: document.querySelector("#event_time").value,
    modality: document.querySelector("#event_modality").value,
    location: document.querySelector("#event_location").value,
    url: document.querySelector("#event_url").value,
    attendees: document.querySelector("#event_attendees").value,
  };

  // Update the DOM to display the newly created event and hide the event modal
  updateDOM();
  EVENT_MODAL.hide();
}

// Function to update location options based on the selected modality
function updateLocationOptions(modality_value) {
  const location = document.getElementById("location-field");
  const remoteUrl = document.getElementById("remote-field");
  const remoteUrlInput = document.getElementById("event_url");

  if (modality_value === "in-person") {
    location.style.display = "block";
    remoteUrl.style.display = "none";
    remoteUrlInput.removeAttribute("required"); // No URL required for in-person events
  } else if (modality_value === "remote") {
    location.style.display = "none";
    remoteUrl.style.display = "block";
    remoteUrlInput.setAttribute("required", ""); // URL required for remote events
  }
}

/********************** PART B: 6.3: UPDATE DOM ******************************/

function createEventElement(id) {
  // Create a new div element.
  var eventElement = document.createElement("div");
  // Adding classes to the <div> element.
  eventElement.classList = "event row border rounded m-1 py-1";
  // Set the id attribute of the eventElement to be the same as the input id.
  eventElement.id = `event-${id}`;
  return eventElement;
}

function createTitleForEvent(event) {
  var title = document.createElement("div");
  title.classList.add("col", "event-title");
  title.innerHTML = event.name;
  return title;
}

function updateDOM() {
  const events = CALENDAR_EVENTS;
  events.forEach((event, id) => {
    let eventElement = document.querySelector(`#event-${id}`);
    if (eventElement === null) {
      // Create a new event element
      eventElement = createEventElement(id);
      document
        .querySelector(`#${event.day} .event-container`)
        .appendChild(eventElement);
    } else {
      // Clear the existing event element
      eventElement.innerHTML = "";
    }

    // Add the title to the event element
    const title = createTitleForEvent(event);
    eventElement.appendChild(title);

    // Set the onclick attribute to open the modal with the current event
    eventElement.setAttribute("onclick", `openEventModal({id: ${id}})`);
  });

  // Call updateTooltips function to update tooltips
  updateTooltips();
}

/********************** PART C: 1. Display Tooltip ***************************/

function updateTooltips() {
  const eventElements = document.querySelectorAll(".event");

  // Iterate over each event element
  eventElements.forEach((eventElement) => {
    // Initialize Bootstrap tooltip for the event element
    new bootstrap.Tooltip(eventElement, {
      // Customize tooltip placement and trigger behavior as needed
      placement: "top",
      trigger: "hover",
      // Set the tooltip title dynamically based on event data
      title: () => {
        const eventId = eventElement.id.split("-")[1]; // Extract event ID from the element ID
        const event = CALENDAR_EVENTS[eventId]; // Get event data from CALENDAR_EVENTS

        // Construct the tooltip content using event data
        return `
            <div>Name: ${event.name}</div>'
            
            <div>Time: ${event.time}</div>
            <div>Location: ${event.location}</div>
          `;
      },
    });
  });
}
