require('bootstrap/dist/css/bootstrap.min.css');
require('webpack-jquery-ui');
require('webpack-jquery-ui/css');
require('./css/style.css');
require('popper.js').default;
require('bootstrap/dist/js/bootstrap.min.js');
import 'jquery';
import 'min-jquery';
import 'jquery-tablesort';
import $ from 'jquery';
global.jQuery = $;
global.$ = $;
import 'popper.js';
global.Popper = Popper;
import 'mustache';
import Mustache from 'mustache';
global.Mustache = Mustache;
var bootstrapButton = $.fn.button.noConflict()
$.fn.bootstrapBtn = bootstrapButton
import Model from './model';
import View from './view';
import Controller from './controller';
import { save, load } from './helpers';
const state = load();

const model = new Model(state || undefined);
model.on('change', state => save(state));

const view = new View();
const controller = new Controller(model, view); 
