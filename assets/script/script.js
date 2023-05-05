// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

// Dictionary is used to store data
var myDay = {};

$(function () {
  // Generate Time Blocks (ensure all DOM are rendered before the next steps)
  // Load any previous data from LocalStorage
  // Show the descriptions to the corresponding textarea elements.
  init();

  // Display the current date in the header of the page.
  getHeaderDate();

  // Listener for click events on the save button.
  $(".saveBtn").on("click", function() {
    var textValue = $(this).siblings('.description').val();
    var timeIndex = $(this).parent().attr('id')
    myDay[timeIndex] = textValue;
    saveReminders();
  } );

  // Color code the block by the hour
  $(".time-block").each( function () {
    // hours are in 24 format
    var currentHour = dayjs().format("HH");
    var blockHour = $(this).attr('id').split('-')[1];
    
    currentHour = parseInt(currentHour);
    blockHour = parseInt(blockHour);
    
    currentHour += 12;  // for test purpose

    // clear all color-coding classes
    $(this).removeClass('future')
    $(this).removeClass('past')
    $(this).removeClass('present')

    // add clss for color coding according to the hour
    if( currentHour < blockHour ) {
      $(this).addClass('future')
    } else if(currentHour === blockHour) {
      $(this).addClass('present')
    } else {
      $(this).addClass('past')
    }
  } );

});

// display current date
function getHeaderDate() {
  var currentHeaderDate = dayjs().format('MMMM D. YYYY (dddd)');
  $("#currentDay").text(currentHeaderDate);
}

// saves data to localStorage
function saveReminders() {
  localStorage.setItem("myDay", JSON.stringify(myDay));
}

// sets any data in localStorage to the view
function displayReminders() {
  for( var hourId in myDay) {
    $(`#${hourId}`).children('.description').val(myDay[hourId]);
  }
}

// Generate TimeSlots and sets any existing localStorage data to the view if it exists
function init() {
  generateTimeSlots();
  var storedDay = JSON.parse(localStorage.getItem("myDay"));
  if (storedDay) {
      myDay = storedDay;
      displayReminders();
  }
}

function generateTimeSlots() {
  var timeBlocksStr = "";

  // iterate from 9am to 5pm
  for(var hour24=9;hour24<=17;hour24++) {
    hour = hour24 % 12;
    if (hour==0) hour=12;

    if(hour24 > 12) hour = `${hour}PM`;
    else hour = `${hour}AM`;
    
    var timeBlocksStr = `${timeBlocksStr}
      <div id="hour-${hour24}" class="row time-block">
        <div class="col-2 col-md-1 hour text-center py-3">${hour}</div>
        <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>
    `
  }
  $('.container-lg').html(timeBlocksStr);
}