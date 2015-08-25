
module.exports = Em.Handlebars.compile([

  '<div class="resize-container">',

    '<div class="resize-container-inner">',
      '{{yield}}',
    '</div>',

    '<span class="resize-handle resize-handle-nw"></span>',
    '<span class="resize-handle resize-handle-ne"></span>',
    '<span class="resize-handle resize-handle-se"></span>',
    '<span class="resize-handle resize-handle-sw"></span>',

  '</div>',

].join(''));
