const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span"),
    eventModal = document.getElementById('event-modal'),
    eventDateElement = document.getElementById('eventDate'),
    eventForm = document.getElementById('eventForm'),
    eventNameInput = document.getElementById('event_name'),
    eventStartInput = document.getElementById('event_start'),
    eventEndInput = document.getElementById('event_end'),
    closeBtn = document.querySelector('.modal-close-btn');

// Initialize calendar
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

    const renderCalendar = () => {
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
            lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
            lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
            lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    
        let liTag = "";
        for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }
        for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
            // adding active class to li if the current day, month, and year matched
            let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                && currYear === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}">${i}</li>`;
        }
        for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
        }
        currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
        daysTag.innerHTML = liTag;
    }
    

renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

function openModal(day) {
    const selectedDate = new Date(currYear, currMonth, day);
    eventDateElement.textContent = `${months[currMonth]} ${day}, ${currYear}`;
    eventModal.style.display = 'block';
    // You can also add additional logic here to handle events for the selected date
}

daysTag.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI' && !event.target.classList.contains('inactive')) {
        const selectedDay = parseInt(event.target.innerText);
        openModal(selectedDay);
    }
});

function closeModal() {
    eventModal.style.display = 'none';
}

eventForm.addEventListener('submit', handleFormSubmit);

closeBtn.addEventListener('click', closeModal);

function handleFormSubmit(event) {
    event.preventDefault();

    const eventName = eventNameInput.value.trim();
    const eventStart = eventStartInput.value;
    const eventEnd = eventEndInput.value;

    if (eventName && eventStart && eventEnd) {
        alert(`Event "${eventName}" added from ${eventStart} to ${eventEnd}`);
        eventNameInput.value = '';
        eventStartInput.value = '';
        eventEndInput.value = '';
        closeModal();
    } else {
        alert('Please fill out all fields.');
    }
}

// New modal related functions

function initializeEventModal() {
    // Initialize the event modal
    EVENT_MODAL = new bootstrap.Modal(document.getElementById('event-modal'));
}

function openEventModal({ id, day }) {
    const submit_button = document.querySelector("#submit_button");
    const modal_title = document.querySelector(".modal-title");
  
}

function updateEventFromModal(id) {
    // Pick the modal field values using document.querySelector().value,
    // and assign it to each field in CALENDAR_EVENTS.
    CALENDAR_EVENTS[id] = {
      name: document.querySelector('#event_name').value,
      day: document.querySelector('#event_day').value,
      time: document.querySelector('#event_time').value,
      modality: document.querySelector('#event_modality').value,
      location: document.querySelector('#event_location').value,
      url: document.querySelector('#event_url').value,
      attendees: document.querySelector('#event_attendees').value,
    };


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

initializeEventModal(); // Call the function to initialize the event modal
