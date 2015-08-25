/**
 * Module dependencies.
 */
var ember = require('ember');

// mixin

module.exports = Em.Mixin.create({

  classNames: ['component-highlight '],

  targetElement: '.component-highlight-target',

  width: 200,
  height: 85,

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

    var min_height = this.get('height');
    var min_width = this.get('width');

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

      this.set('event_state', {});
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

      $(document).on('mousemove', this.send.bind(this, 'resizing'));
      $(document).on('mouseup', this.send.bind(this, 'endResize'));
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
      var event_state = this.get('event_state');

      var mouse={},width,height,left,top,offset=$tool.offset();
      mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
      mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
      
      // Position image differently depending on the corner dragged and constraints
      if( $(event_state.evnt.target).hasClass('resize-handle-se') ){
        width = mouse.x - event_state.container_left;
        height = mouse.y  - event_state.container_top;
        left = event_state.container_left;
        top = event_state.container_top;
      } else if($(event_state.evnt.target).hasClass('resize-handle-sw') ){
        width = event_state.container_width - (mouse.x - event_state.container_left);
        height = mouse.y  - event_state.container_top;
        left = mouse.x;
        top = event_state.container_top;
      } else if($(event_state.evnt.target).hasClass('resize-handle-nw') ){
        width = event_state.container_width - (mouse.x - event_state.container_left);
        height = event_state.container_height - (mouse.y - event_state.container_top);
        left = mouse.x;
        top = mouse.y;
      } else if($(event_state.evnt.target).hasClass('resize-handle-ne') ){
        width = mouse.x - event_state.container_left;
        height = event_state.container_height - (mouse.y - event_state.container_top);
        left = event_state.container_left;
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
      var event_state = this.get('event_state');
      var mouse = {};
      var touch = event_state.touches[0] || {};

      mouse.x = (e.clientX || e.pageX || touch.clientX) + $(window).scrollLeft(); 
      mouse.y = (e.clientY || e.pageY || touch.clientY) + $(window).scrollTop();
      
      var left = mouse.x - ( event_state.mouse_x - event_state.container_left );
      var top = mouse.y - ( event_state.mouse_y - event_state.container_top );
      var box = this.contrain(top, left);

      // update tool position
      $tool.offset({
        'left': box.left,
        'top': box.top, 
      });

      // // Watch for pinch zoom gesture while moving
      // var touches = e.originalEvent.touches;
      // if(event_state.touches && event_state.touches.length > 1 && touches.length > 1){

      //   var width = event_state.container_width, height = event_state.container_height;
      //   var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
      //   a = a * a; 
      //   var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
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
      var event_state = this.get('event_state');

      // Save the initial event details and container state
      event_state.container_width = $tool.width();
      event_state.container_height = $tool.height();
      event_state.container_left = $tool.offset().left; 
      event_state.container_top = $tool.offset().top;

      event_state.touches = [];

      // This is a fix for mobile safari
      // For some reason it does not allow a direct copy of the touches property
      if (typeof e.originalEvent.touches !== 'undefined'){
        $.each(e.originalEvent.touches, function(i, ob){
          event_state.touches[i] = {};
          event_state.touches[i].clientX = 0+ob.clientX;
          event_state.touches[i].clientY = 0+ob.clientY;
        });
      }

      var touch = event_state.touches[0] || {};

      event_state.mouse_x = (e.clientX || e.pageX || touch.clientX) + $(window).scrollLeft(); 
      event_state.mouse_y = (e.clientY || e.pageY || touch.clientY) + $(window).scrollTop();
      
      event_state.evnt = e;

      this.set('event_state', event_state);
    
    },

  },

});

