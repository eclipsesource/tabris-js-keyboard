let tabris = require('tabris');
let Keyboard = require('tabris-keyboard');

let text  = '';

let label = new tabris.TextView({
  left: 16, top: 16, right: 16
}).appendTo(tabris.ui.contentView);

let keyboard = new Keyboard({
}).on('input', (keyboard, key) => processInput(key)).appendTo(tabris.ui.contentView);

keyboard.show();
processInput('');

function processInput(key) {
  if (key === 'remove') {
    text = text.substr(0, text.length - 1);
  } else {
    text += key;
  }
  label.text = text;
}
