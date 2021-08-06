// Get the business hours for scheduler
const businessHours = {start: 9, end: 18 }
var val, dateKey
function initiate(now=moment()) {
    // display the date using moment.js
    $('#currentDay').text(now.format('dddd, MMMM Do'))
    // current hour is stored in now 
    var hour = now.hour()
    // local storage vales in object for scheduler data
    var localStor = localStorage.getItem('schedulerData') || "{}"
    val = JSON.parse(localStor)
    dateKey = now.format('YYYYMMDD')
    if (!(dateKey in val)) val[dateKey] = {}
    // make a container 
    var cont = $('.container')
    for (let hr = businessHours.start; hr < businessHours.end; hr++) {
        let time = moment(hr, 'H')
        let block = hour > hr ? 'past' : hour < hr ? 'future' : 'present'
        let inputText = val[dateKey][hr] || ''
        let schedulerRows = $(`
        <div id='time-slot-${hr}' class='time-block row'>
        <span class='hour time-column col-1'>
        <span class='hour-display'>${time.format('hA')}</span>
        </span>
        <span class='info-column col ${block}'>
        <textArea id='event-input-${hr}' data-hr=${hr} 
        type="text" class='event-input'>${inputText}</textArea>
        </span>
        <span id='save-button-${hr}' data-hr=${hr} class='saveBtn col-1'>
        </span>
        </div>
        `)
        cont.append(schedulerRows)
    }
    // when save is clicked store locally based on input of that hour and store as string
    cont.on('click', e => {
        if (e.target.matches('.saveBtn')) {
            var button = e.target
            var hr = button.dataset.hr
            var inputValue = $(`#event-input-${hr}`)[0].value
            val[dateKey][hr] = inputValue
            localStorage.setItem('schedulerData', JSON.stringify(val))
        }
    })
    localStorage.setItem('schedulerData', JSON.stringify(val))
    setTimer(now)
}
initiate()
var startTimer
function setTimer(now=moment()) {
    // updating display starting current until the next hour timer
    var startHour = now.clone().endOf('hour').add(1, 'second')
    var timeHourNow = startHour - now
    startTimer = setInterval(function() {
        clearInterval(startTimer)
        renderNewDisplay(startHour)
    },timeHourNow)
}
// function that renders new display based on time and updates the rows to different shade
function renderNewDisplay(now=moment()) {
    var hour = now.hour()
    var blocks = $('.info-column')
    console.log(blocks);
    for (let i = 0, hr = businessHours.start; i < blocks.length; i++, hr++) {
        let blocks = $(blocks[i])
        blocks.removeClass(['past', 'present', 'future'])
        blocks.addClass(hour > hr ?'past'
        : hour < hr ? 'future' : 'present')
    }
    setTimer(now)
}