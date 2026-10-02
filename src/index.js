require('bootstrap/dist/css/bootstrap.min.css');
require('webpack-jquery-ui');
require('webpack-jquery-ui/css');
require('./css/style.css');
require('bootstrap/dist/js/bootstrap.min.js');
import 'jquery-tablesort';
import Model from './model';
import View from './view';
import Controller from './controller';
import { save, load } from './helpers';

// Bootstrap and jQuery UI both define $.fn.button; keep jQuery UI's.
$.fn.bootstrapBtn = $.fn.button.noConflict();

function start(state) {
  const model = new Model(state);
  model.on('change', save);
  new Controller(model, new View());
}

const state = load();
if (state) {
  start(state);
} else {
  $.getJSON('./json/only_students.json', data => {
    save(data);
    start(data);
  });
}
