var tabris = require('tabris');
var Keyboard = require('tabris-keyboard');

var page = new tabris.Page({
  title: 'Keyboards',
  topLevel: true
});

var keyboard = new Keyboard().appendTo(page);
keyboard.show();
page.open();
