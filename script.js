// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

var myDay = {};


$(function () {
  // Generate Time Blocks
  // Load any previous data from LocalStorage
  // Show the descriptions to the corresponding textarea elements.
  init();

  // Display the current date in the header of the page.
  getHeaderDate();


  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  $(".saveBtn").on("click", function() {
    
    var textValue = $(this).siblings('.description').val();
    var timeIndex = $(this).parent().attr('id')

    myDay[timeIndex] = textValue;

    saveReminders();

  } );

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?

  $(".time-block").each( function () {
      var currentHour = dayjs().format("HH");
      var blockHour = $(this).attr('id').split('-')[1];
      
      currentHour = parseInt(currentHour);
      blockHour = parseInt(blockHour);
      
      currentHour += 10;  // for test purpose

      $(this).removeClass('future')
      $(this).removeClass('past')
      $(this).removeClass('present')

      if( currentHour < blockHour ) {
        $(this).addClass('future')
      } else if(currentHour === blockHour) {
        $(this).addClass('present')
      } else {
        $(this).addClass('past')
      }
  } );

});


function getHeaderDate() {
  var currentHeaderDate = dayjs().format('dddd, MMMM Do');
  $("#currentDay").text(currentHeaderDate);
}


// saves data to localStorage
function saveReminders() {
  localStorage.setItem("myDay", JSON.stringify(myDay));
  // console.log(JSON.stringify(myDay));
}

// sets any data in localStorage to the view
function displayReminders() {
  // myDay.forEach(function (_thisHour) {
  //     $(`#${_thisHour.id}`).val(_thisHour.reminder);
  // })
  for( var hourId in myDay) {
    $(`#${hourId}`).children('.description').val(myDay[hourId]);
  }
}

// sets any existing localStorage data to the view if it exists
function init() {

  createTimeSlots();

  var storedDay = JSON.parse(localStorage.getItem("myDay"));

  if (storedDay) {
      myDay = storedDay;
      // console.log(myDay);
      // displayReminders only if previous data exists
      displayReminders();
  }
  // saveReminders();
}

function createTimeSlots() {
  
  var timeBlocksStr = "";

  // for(var hour24=0;hour24<24;hour24++) {
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
  // console.log(timeBlocksStr);

  $('.container-lg').html(timeBlocksStr);
  

}