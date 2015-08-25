
module.exports = Em.Handlebars.compile([

  '<div class="resize-container">',

    '<div class="resize-container-inner">',
      '{{yield}}',
    '</div>',

    '<span {{bind-attr class=":resize-handle :resize-handle-nw is-y:resize-handle-n is-x:resize-handle-w"}}></span>',
    '<span {{bind-attr class=":resize-handle :resize-handle-ne is-y:resize-handle-n is-x:resize-handle-e"}}></span>',
    '<span {{bind-attr class=":resize-handle :resize-handle-se is-y:resize-handle-s is-x:resize-handle-e"}}></span>',
    '<span {{bind-attr class=":resize-handle :resize-handle-sw is-y:resize-handle-s is-x:resize-handle-w"}}></span>',

  '</div>',

].join(''));
