$(document).ready(function(){

  var freshBox = true;

  if(sessionStorage.getItem('history')){
    freshBox = false;
    var data = JSON.parse(sessionStorage.getItem('history'));
    // console.log("Retrieval");
    // console.log(data);

    for (var i = 0; i < data.length; i++) {
      var type = data[i].substr(0,data[i].indexOf(':')); // "72"
      var value = data[i].substr(data[i].indexOf(':') + 1); // "tocirah sneab"
      // console.log(type);
      // console.log(value);
      var childNode = "<p class='"+ type + "Text'><span>" + value + "</span></p>";
      $('#chatbox').append(childNode);
    }
  }
  else{
    var childNode = "<p class='botText'><span>Hi! I am your Chatbot, may I get your name, phone number and email address (in order with a ',' as separator) before we can start.</span></p>";
      $('#chatbox').append(childNode);
  }

  function animateMessage(){
    setTimeout(function(){
      $("#chatbox .update").removeClass('update');
    },250);
  }

  var idleTime;
  var timing = 20000;
  var qAsked = false;
  var userRespond = false
  function intervalMessage(){
     // console.log('Idle system');
     if(freshBox || (!qAsked && userRespond)){
      var data = "Hello again, did we solve your problem";
      var childNode = "<p class='botText update'><span>"+data+"</span></p>";
      $('#chatbox').append(childNode);
      freshBox = false
      storeJSON(data,"bot");
      animateMessage();
      scrollBottom('chatbox');
      qAsked = true;
     }
  }

  function autoOpen(){
      $('#chatbox-btn').trigger("click");
  }

  var openAuto = setTimeout(autoOpen,timing);


  function resetInterval(){
    if($('#chatbox-btn').hasClass('show')){
      clearInterval(idleTime);
      return setInterval(intervalMessage,timing);
    }
  }


  scrollBottom('chatbox');

  $("#textInput").keyup(function(e) {
    idleTime = resetInterval(idleTime);
    if (e.which == 13) {
      userRespond = true;
      qAsked = false;
      scrollBottom('chatbox');
      getBotResponse();
    }
  });

  $('#chatbox-btn').on("click", function(){
      $(this).toggleClass('show');
      var target = $('.chatbox-frame');
      target.toggleClass('show');
      scrollBottom('chatbox');

      if($(this).hasClass('show')){
        idleTime = setInterval(intervalMessage,timing);
        clearTimeout(openAuto);
      }
      else{
        clearInterval(idleTime);
        openAuto = setTimeout(autoOpen,timing);
      }


      if(freshBox){
        // console.log("fresh")
        $('.botText').addClass('update');
        setTimeout(function(){
          $('.botText').removeClass('update');
        },700)
      }
  });

});

function scrollBottom(elementId){
  var objDiv = document.getElementById(elementId);
    if(objDiv.scrollTop != objDiv.scrollHeight){
      setTimeout(function(){
      // console.log("scrolled");
      objDiv.scrollTop = objDiv.scrollHeight;
    },50);
  }
}

function storeJSON(data, type){
  var myData = [];
  if(sessionStorage.getItem('history')){
    var prevData = JSON.parse(sessionStorage.getItem('history'));

    for (var i = 0; i < prevData.length; i++) {
      myData.push(prevData[i])
    }

    myData.push(type + ":" + data);
    // console.log("Before storing");
    // console.log(myData);
    sessionStorage.setItem('history',JSON.stringify(myData))
  }
  else{
    myData.push("bot: Hi! I am your Chatbot, may I get your name, phone number and email address (in order with a ',' as separator) before we can start.");
    myData.push(type + ":" + data)
    sessionStorage.setItem('history',JSON.stringify(myData));
  }
  // console.log(myData);
}

function getBotResponse() {
  var rawText = $("#textInput").val();
  storeJSON(rawText,"user");
  var userHtml = '<p class="userText update"><span>' + rawText + "</span></p>";
  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  setTimeout(function(){
    $("#chatbox .update").removeClass('update');
  },250);
  document
    .getElementById("userInput")
    .scrollIntoView({ block: "start", behavior: "smooth" });


  // Sending the request
  $.get("/get", { msg: rawText }).done(function(data) {
    var botHtml = '<p class="botText update"><span>' + data + "</span></p>";
    storeJSON(data,"bot");
    $("#chatbox").append(botHtml);
    document
      .getElementById("userInput")
      .scrollIntoView({ block: "start", behavior: "smooth" });
    scrollBottom('chatbox');
    setTimeout(function(){
      $("#chatbox .update").removeClass('update');
    },250);
  });
}