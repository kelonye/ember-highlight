## Enable highlighting sections on canvas, images .. etc for cropping, .. et cetera.

Adapted from [Resizing and Cropping Images with Canvas](http://tympanus.net/codrops/2014/10/30/resizing-cropping-images-canvas/)

![](https://dl.dropbox.com/u/30162278/ember-highlight.png)

Install
---

    $ component install kelonye/ember-highlight

Sample
---

```js

// register as component
    
var highlight = require('ember-highlight');

Em.TEMPLATES['components/highlight-image'] = require('ember-highlight/lib/template');

App = Em.Application.create();

App.HighlightImageComponent = Em.Component.extend(highlight, {

  setup: function(){

    $(this.get('targetElement')).one('load', this.send.bind(this, 'onsetup'));          

  }.on('didInsertElement'),

});

```

```hbs

<!-- use in route template -->

<div>

  <div>
    <img src='image.jpg' class='component-highlight-target'>
  </div>

  {{#highlight-image}}
  <strong>Crop</strong>
  {{/highlight-image}}

</div>

```

Example
---

    $ make example

License
---

MIT