function createNewEvent() {
    const title = dquery('#eventName').value;
    if (title) {
        calendar.addEvent({
            title: title,
            start: (currentInfo) ? currentInfo.dateStr : new Date().toISOString()
        });
        currentInfo = null;
        animateCloseModal(dquery("#modal"));
    }
}

function editEvent() {
    const title = dquery("#editEventName").value;
    if (currentInfo && title) {
        currentInfo.event.setProp('title', title);
    }
    animateCloseModal(dquery("#editModal"));
    currentInfo = null;
}

function deleteEvent() {
    if (currentInfo) {
        currentInfo.event.remove();
    }
    animateCloseModal(dquery("#editModal"));
    currentInfo = null;
}

function generateAI() {
    if (!prompting) {
        prompting = true;
        dquery("#ai-button").classList.add("disabled")
        fetch("/api/generate", headers={
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: dquery("#prompt").value})
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    calendar.addEvent({
                        title: response.name,
                        start: response.time
                    })
                    animateCloseModal(dquery("#aiModal"));
                }
                dquery("#ai-button").classList.remove("disabled");
                prompting = false;
            })
    }
}

var prompting = false; // to ensure that multiple requests don't get sent before previous ones are finished
var calendar;
var currentInfo;
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        events: [
            { title: 'Sample Event', start: '2024-11-23T10:00:00' }
        ],
        allDaySlot: false,
        timeFormat: 'h:mm a',
        dateClick: function(info) {
            currentInfo = info
            animateOpenModal(dquery("#modal"))
        },
        eventClick: function(info) {
            currentInfo = info;
            animateOpenModal(dquery("#editModal"));
            dquery("#editEventName").value = info.event.title;
        },
        editable: true
    });
    calendar.render();
});