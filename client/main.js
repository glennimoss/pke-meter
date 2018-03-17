import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

import { Value } from '../imports/coll.js';

Meteor.subscribe('value');

var meterBlobs = [];
var numLights;

Template.body.helpers({
  isControl: () => window.location.pathname == '/control'
});

Template.main.rendered = function () {
  var cols = $(".column");
  for (let i=0; i<cols.length; i++) {
    meterBlobs.push(cols[i].querySelectorAll(".meter-blob"));
  }
  numLights = meterBlobs[0].length;

  requestAnimationFrame(animateMeter);

  /*
  sound = document.getElementById("sound");
  sound.addEventListener('canplaythrough', function () {
    sound.play();
  });
  */

  /*
  sound = new Audio('/pke.mp3');
  sound.addEventListener('ended', function () {
    sound.currentTime = 0;
    sound.play();
  });
  document.body.addEventLister('touchstart', function () {
    alert('sound playing');
    sound.play();
    alert('sound played');
  });
  */

}

var sound;
Template.control.rendered = function () {
  var slider = document.querySelector("input");
  slider.addEventListener("input", () => {
    setMeter(slider.value);
  });
}

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

var slideSpeed = 500;
function animateMeter (timestamp) {
  var thing = Value.findOne();
  var meterLevel = thing && +thing.val;

  for (let i=0; i<meterBlobs.length; i++) {
    var thresh = numLights - meterLevel + 2*Math.sin(timestamp/125 + i);
    var slide = numLights - Math.floor((timestamp%slideSpeed)/slideSpeed*(meterLevel+2));
    var slideIn = Math.floor(timestamp/slideSpeed)%2;
    var topThresh, bottomThresh;
    if (slideIn) {
      topThresh = Math.max(thresh, slide);
      bottomThresh = numLights;
    } else {
      topThresh = thresh;
      bottomThresh = slide;
    }

    for (let j=numLights-1; j>=0; j--) {
      if (j < topThresh || j > bottomThresh) {
        meterBlobs[i][j].classList.remove('active');
      } else {
        meterBlobs[i][j].classList.add('active');
      }
    }
  }

  requestAnimationFrame(animateMeter);
}

var valId;
global.setMeter = (val) => {
  if (!valId) {
    valId = Value.findOne()._id;
  }
  Value.update(valId, {$set: {val: val}});
}
