//TODO: update the endpoint
var endpoint = "https://script.google.com/macros/s/AKfycbyMhiCaH7aKpm52W98405WsZFfWvGFFVuFEfWjRLpWc7rB3F1Jw67Atgi4kFMbshH_-dQ/exec";

var ajax = require("./jsonp");
var formUtil = require("./form-utils");
var cookie = require("./cookies");
var placeUser = require("./graph");

// var panel = document.querySelector(".form-panel");
var container = document.querySelector(".category-Holder");
//
// var message = panel.querySelector(".message");
var form = panel.querySelector(".entry");

var storageKey = `face-franchise`;

//do not show form if it has been submitted before
if (cookie.read(storageKey)) {
  container.classList.add("already-sent");
}

var packet = formUtil.package(form);

var stored = localStorage.getItem(storageKey);
if (stored) {
  console.log("I've already been stored");
  placeUser(stored);
}

form.addEventListener("click", function(e) {
  e.preventDefault();
  var self = this;
  if (self.disabled) return;


  self.disabled = true;

  var submission = ajax(endpoint, packet, function(data) {

    cookie.write(storageKey, true);
    var stored = packet.home + "-" + packet.opposing;
    localStorage.setItem(storageKey, stored);
    placeUser(stored);
  });

});

window.clearSent = function() {
  cookie.clear(storageKey);
  localStorage.removeItem(storageKey);
};
