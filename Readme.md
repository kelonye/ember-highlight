## Enable highlighting sections on canvas, image .. etc for cropping, .. et cetera.

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