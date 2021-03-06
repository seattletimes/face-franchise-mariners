require("component-responsive-frame/child");
var $ = require('jquery');
var scriptURL = 'https://script.google.com/macros/s/AKfycbyMhiCaH7aKpm52W98405WsZFfWvGFFVuFEfWjRLpWc7rB3F1Jw67Atgi4kFMbshH_-dQ/exec';
var votes = require("../../data/predictions.sheet.json");

var width = $(".entry").width();
var obj = {};
var catObj = {};
var savedPicks = [];



function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    console.log(v);
    return v ? v[2] : null;
}

function submitHandler(e, entry){
    // var title = $( entry ).attr( "data-title" );
    var category = $( entry ).attr( "data-category" );
    var player = $( entry ).attr( "data-player" );
    var thisMovie = $( entry ).attr( "data-id" );
    savedPicks.push((thisMovie + "|" + category));


    var formData = new FormData();


    if ( obj.hasOwnProperty(thisMovie) ) {
      obj[thisMovie] = (obj[thisMovie] + 1);
    } else {
      obj[thisMovie] = 1;
    }

    if ( catObj.hasOwnProperty( category ) ) {
      catObj[category] = (catObj[category] + 1);
    } else {
      catObj[category] = 1;
    }


    // formData.append("vote", title);
    formData.append("category", category);
    formData.append("player", player);

    console.log(category);

    showVoteTallies(category);


    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = "votesPick="+savedPicks + "; expires=" + d.toGMTString() + ";";
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message));

    getCookie("votesPick");
}


$( ".completeEntry" ).click(function(a) {
  var thisEntry = $(this).find('.entry');
  submitHandler(a, thisEntry);
  highlightChosenFadeOthers(thisEntry);
});


///////////////////////

$.each(votes, function(index, element) {
    var thisMovie = element.category + element.player;

    if ( obj.hasOwnProperty(thisMovie) ) {
      obj[thisMovie] = (obj[thisMovie] + 1);
    } else {
      obj[thisMovie] = 1;
    }

    if ( catObj.hasOwnProperty( element.category ) ) {
      catObj[element.category] = (catObj[element.category] + 1);
    } else {
      catObj[element.category] = 1;
    }
});


function highlightChosenFadeOthers( chosenEntry ){
  // $( chosenEntry ).closest('.catGroup').find('.img img').css("opacity","0.4");
  $( chosenEntry ).closest('.catGroup').find('.knockout').addClass('darken');
  $( chosenEntry ).closest('.catGroup').find(".completeEntry").css("pointer-events","none");
  // $( chosenEntry ).closest('.catGroup').find(".crit_pics").show();
  // $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.img img').css('opacity','1');
  $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.knockout').addClass('voted');
  $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.knockout').append('<div class="youVote"><i class="fa fa-star" aria-hidden="true"></i>Your Vote</div>');
}


function showVoteTallies(selectedCategory) {
  var catTotal = catObj[selectedCategory];
  console.log(catObj);
  console.log(obj);
  catTotal = (catTotal === undefined) ? 0 : catTotal;
  $('#category-holder').find(`*[data-head-category="${ selectedCategory }"]`).prev('.pollHeads').find('.numVotes').append(`${catTotal} votes`);

  for(var propertyName in obj) {
    if( propertyName.includes(selectedCategory) ){
      var value = obj[propertyName];


      var percentage = (value / catTotal) * 100;
      var perVotes = Math.round(percentage);


      // I work for the bar chart lines.
      // $('#category-holder').find(`*[data-id="${ propertyName }"]`).css("background-size",`${percentage}% 100%`);
      $('#category-holder').find(`*[data-id="${ propertyName }"]`).closest('.completeEntry').find('.perVotes').empty().append(`${perVotes}<span class="percentSign">%</span>`);
    }
  }
}

if (getCookie("votesPick")) {
  var pickedArray = getCookie("votesPick");
  savedPicks.push(pickedArray);
  var pickedSplitArray = pickedArray.split(",");



  $.each(pickedSplitArray, function(index, element) {
    var movAndCat = element.split("|");

    console.log(movAndCat);

    showVoteTallies(movAndCat[1]);
    highlightChosenFadeOthers( $(`*[data-id="${ movAndCat[0] }"]`)  );
  });

} else {
  console.log("Vote with reckless abandon");
}
