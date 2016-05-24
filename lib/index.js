/**
 * Module dependencies.
 */
var ember = require('ember');

// template

exports.template = require('./template');

// mixin

exports.mixin = Em.Mixin.create({

  classNames: ['component-highlight'],

  targetElement: '.component-highlight-target',

  width: 200,
  height: 85,

  min_width: 30,
  min_height: 30,

  canResize: 'XY',

  teardown: function(){

  }.on('willDestroyElement'),


  'is-x': function(){
    return this.get('canResize') === 'X';
  }.property('canResize'),


  'is-y': function(){
    return this.get('canResize') === 'Y';
  }.property('canResize'),


  contrain: function(top, left, width, height){

    var $el = this.$();
    var $tool = $el.find('.resize-container');
    var toolHeight = $tool.height();
    var toolWidth = $tool.width();

    var $target = $(this.get('targetElement'));
    var max_width = $target.width();
    var max_height = $target.height();
    var rect = $target[0].getBoundingClientRect();

    var min_height = this.get('min_height');
    var min_width = this.get('min_width');

    // console.log(rect);
    // console.log('top left width height %s %s %s %s', top, left, width, height);
    // console.log('');

    // LEFT
    if (rect.right - toolWidth < left){
      left = rect.right - toolWidth;
      width = toolWidth;
    }
    if (rect.left > left){
      left = rect.left;
      width = toolWidth;
    }

    // TOP
    if (rect.bottom - toolHeight < top){
      top = rect.bottom - toolHeight;
      width = toolHeight;
    }
    if (rect.top > top){
      top = rect.top;
      width = toolHeight;
    }

    // min width, height
    if (height < min_height){
      height = min_height;
    }
    if (width < min_width){
      width = min_width;
    }

    return {top: top, left: left, width: width, height: height};

  },


  getInitialPosition: function(){

    var min_height = this.get('height');
    var min_width = this.get('width');
    var $target = $(this.get('targetElement'));
    var max_width = $target.width();
    var max_height = $target.height();

    return {
      left: $target.position().left + (max_width/2)-(min_width/2),
      top: $target.position().top + (max_height/2)-(min_height/2),
    };

  },


  actions: {

    onsetup: function(){

      var min_height = this.get('height');
      var min_width = this.get('width');
      var $el = this.$();
      var $tool = $el.find('.resize-container');

      this.set('eventState', {});
      this.set('tool', $tool);

      $tool.width(min_width);
      $tool.height(min_height);

      var pos = this.getInitialPosition();

      $tool.css({
        left: pos.left,
        top: pos.top,
      });

      $tool.css({
        display: 'inline-block',
      });

      $el.on('mousedown touchstart', '.resize-handle', this.send.bind(this, 'startResize'));
      $el.on('mousedown touchstart', '.resize-container', this.send.bind(this, 'startMoving'));

    },

    startResize: function(e){
      e.preventDefault();
      e.stopPropagation();
      
      this.send('saveEventState', e);

      $(document).on('mousemove touchmove', this.send.bind(this, 'resizing'));
      $(document).on('mouseup touchend', this.send.bind(this, 'endResize'));
    },

    endResize: function(e){
      e.preventDefault();

      $(document).off('mouseup touchend');
      $(document).off('mousemove touchmove');
    },

    startMoving: function(e){
      e.preventDefault();
      e.stopPropagation();
      
      this.send('saveEventState', e);

      $(document).on('mousemove touchmove', this.send.bind(this, 'moving'));
      $(document).on('mouseup touchend', this.send.bind(this, 'endMoving'));
    },

    endMoving: function(e){
      e.preventDefault();

      $(document).off('mouseup touchend');
      $(document).off('mousemove touchmove');
    },

    resizing: function(e){

      // console.log('resizing', e);

      var $tool = this.get('tool');
      var eventState = this.get('eventState');
      var mouse = {};
      var width;
      var height;
      var left;
      var top;
      var offset = $tool.offset();
      var touch = {};
      if (e.originalEvent && e.originalEvent.touches) touch = e.originalEvent.touches[0];

      mouse.x = (e.clientX || e.pageX || touch.clientX) + $(window).scrollLeft(); 
      mouse.y = (e.clientY || e.pageY || touch.clientY) + $(window).scrollTop();

      // Position image differently depending on the corner dragged and constraints
      if( $(eventState.evnt.target).hasClass('resize-handle-se') ){
        width = mouse.x - eventState.container_left;
        height = mouse.y  - eventState.container_top;
        left = eventState.container_left;
        top = eventState.container_top;
      } else if($(eventState.evnt.target).hasClass('resize-handle-sw') ){
        width = eventState.container_width - (mouse.x - eventState.container_left);
        height = mouse.y  - eventState.container_top;
        left = mouse.x;
        top = eventState.container_top;
      } else if($(eventState.evnt.target).hasClass('resize-handle-nw') ){
        width = eventState.container_width - (mouse.x - eventState.container_left);
        height = eventState.container_height - (mouse.y - eventState.container_top);
        left = mouse.x;
        top = mouse.y;
      } else if($(eventState.evnt.target).hasClass('resize-handle-ne') ){
        width = mouse.x - eventState.container_left;
        height = eventState.container_height - (mouse.y - eventState.container_top);
        left = eventState.container_left;
        top = mouse.y;
      }

      var box = this.contrain(top, left, width, height);
      $tool.offset({'left': box.left, 'top': box.top});

      if (-1 !== this.get('canResize').search('X')) $tool.width(box.width);
      if (-1 !== this.get('canResize').search('Y'))  $tool.height(box.height);

    },

    moving: function(e){

      // console.log('moving', e);
      
      e.preventDefault();
      e.stopPropagation();
      
      var $tool = this.get('tool');
      var eventState = this.get('eventState');
      var mouse = {};
      var touch = {};
      if (e.originalEvent && e.originalEvent.touches) touch = e.originalEvent.touches[0];

      mouse.x = (e.clientX || e.pageX || touch.clientX) + $(window).scrollLeft(); 
      mouse.y = (e.clientY || e.pageY || touch.clientY) + $(window).scrollTop();

      var left = mouse.x - ( eventState.mouse_x - eventState.container_left );
      var top = mouse.y - ( eventState.mouse_y - eventState.container_top );
      var box = this.contrain(top, left);

      // update tool position
      $tool.offset({
        'left': box.left,
        'top': box.top, 
      });

      //// watch for pinch zoom gesture while moving
      // var touches = e.originalEvent.touches;
      // if(eventState.touches && eventState.touches.length > 1 && touches.length > 1){

      //   var width = eventState.container_width, height = eventState.container_height;
      //   var a = eventState.touches[0].clientX - eventState.touches[1].clientX;
      //   a = a * a; 
      //   var b = eventState.touches[0].clientY - eventState.touches[1].clientY;
      //   b = b * b; 
      //   var dist1 = Math.sqrt( a + b );
        
      //   a = e.originalEvent.touches[0].clientX - touches[1].clientX;
      //   a = a * a; 
      //   b = e.originalEvent.touches[0].clientY - touches[1].clientY;
      //   b = b * b; 
      //   var dist2 = Math.sqrt( a + b );

      //   var ratio = dist2 /dist1;

      //   width = width * ratio;
      //   height = height * ratio;

      //   $tool.width(width);
      //   $tool.height(height);
      
      // }
      
    },

    saveEventState: function(e){

      var $tool = this.get('tool');
      var eventState = this.get('eventState');

      // save the initial event details and container state
      eventState.container_width = $tool.width();
      eventState.container_height = $tool.height();
      eventState.container_left = $tool.offset().left; 
      eventState.container_top = $tool.offset().top;
      eventState.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
      eventState.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

      // this is a fix for mobile safari
      // for some reason it does not allow a direct copy of the touches property
      if (typeof e.originalEvent.touches !== 'undefined'){
        eventState.touches = [];
        $.each(e.originalEvent.touches, function(i, ob){
          eventState.touches[i] = {};
          eventState.touches[i].clientX = 0+ob.clientX;
          eventState.touches[i].clientY = 0+ob.clientY;
        });
      }

      eventState.evnt = e;

      this.set('eventState', eventState);
    
    },

  },

});
