import greeter from './greeter';
import $ = require('jquery');

$(() => {
  $(document.body).html(greeter('World'));
});