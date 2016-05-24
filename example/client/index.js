var highlight = require('ember-highlight');

Em.TEMPLATES['components/highlight-image'] = Em.HTMLBars.template(highlight.template);
Em.TEMPLATES['index'] = Em.HTMLBars.template(require('./template'));

App = Em.Application.create();

App.HighlightImageComponent = Em.Component.extend(highlight.mixin, {

  setup: function(){

    $(this.get('targetElement')).one('load', this.send.bind(this, 'onsetup'));          

  }.on('didInsertElement'),

});