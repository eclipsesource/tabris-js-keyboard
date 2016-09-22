import {Page} from 'tabris';
import Keyboard from './widgets/Keyboard';

let page = new Page({
  title: 'Keyboards',
  topLevel: true
});

let keyboard = new Keyboard().appendTo(page);
keyboard.show();
page.open();
