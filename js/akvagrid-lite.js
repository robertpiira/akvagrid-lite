/*jshint strict:false, browser:true, devel:true, indent:2, onevar:false, white:true */

/*
  akva grid js
  twitter: @robertpiira
*/

  
var grids = {

  settings: {
    maxWidth: {size: 1000, unit: 'px'},
    opacity: 0.5,
    zindex: '1'
  },

  grids:
  [
    {
      type: 'grid',
      gridName: 'desktop',
      bpFrom: {size: 75, unit: 'em'},
      bpTo: {size: 95, unit: 'em'},
      columnCount: 11,
      lineHeight: {size: 1.5, unit: 'em'},
      gutterWidth: {size: 1.5, unit: 'em'},
      width: {size: 92, unit: '%'},
      borderTheme: {color: 'blue', style: 'solid'}
    },
    {
      type: 'grid',
      gridName: 'tablet',
      bpFrom: {size: 45, unit: 'em'},
      bpTo: {size: 75, unit: 'em'},
      columnCount: 5,
      lineHeight: {size: 1.5, unit: 'em'},
      gutterWidth: {size: 1.5, unit: 'em'},
      width: null,
      borderTheme: {color: 'purple', style: 'dashed'}
    }
  ]

};





(function (grids, $) {

  'use strict';

  var debug = {
    grid: true,
    code: true
  };

  var els = {
    wrapper:    '.akva-grid',
    columns:    '.akva-cols',
    column:     '.akva-col',
    baseline:   '.akva-baseline',
    line:       '.akva-baseline-unit'
  };

  // Grid contructor
  var Grid = function (o) {
    this.gridName = o.gridName;
    this.columnCount = o.columnCount;
    this.bpFrom = o.bpFrom.size + o.bpFrom.unit;
    this.bpTo = o.bpTo.size + o.bpTo.unit;
    this.lineHeight = (o.lineHeight) ? ((o.lineHeight.size) ? o.lineHeight.size : 0) + o.lineHeight.unit : null;
    this.gutterWidth = (o.gutterWidth) ? ((o.gutterWidth.size) ? o.gutterWidth.size : 0) + o.gutterWidth.unit : null;
    this.width = (o.width) ? ((o.width.size) ? o.width.size : 'auto') + o.width.unit : null;
    this.borderTheme = (o.borderTheme) ? {color: o.borderTheme.color, style: o.borderTheme.style} : null;

    this.log = function () {
      if (debug.code) {
        if (window.console && window.console.log && window.console.log.apply) {
          window.console.log.apply(console, ['akva: ', arguments]);
        }
      }
    };

  };

  Grid.prototype = {

    init: function () {

      this.log('init: ' + this.gridName + ' grid');

      this.build();
    
    },

    build: function () {

      var wrapper = $(els.wrapper);

      var columns = this.createColumns();

      wrapper.append(columns);
      
    },

    createColumns: function () {
      this.log('creating ' + this.columnCount + ' columns for ' + this.gridName);
      var columns = $('<div class="' + els.columns.slice(1) + '" />');
      var column = $('<div class="' + els.column.slice(1) + '" />');
      var columnClone;
      var i = 0;

      if (this.borderTheme) {
        column.css({
          borderColor: this.borderTheme.color,
          borderStyle: this.borderTheme.style
        });
      }

      for (; i < this.columnCount; i++) {
        columnClone = column.clone();
        columns.append(columnClone);
      }

      return columns;

    },

    show: function () {

    },

    hide: function () {

    }

  };

  var akva = {

    instances: [],

    settings: {
      maxWidth: (grids.settings.maxWidth) ? ((grids.settings.maxWidth.size) ? grids.settings.maxWidth.size : 'auto') + grids.settings.maxWidth.unit : 'auto',
      opacity: grids.settings.opacity,
      zindex: grids.settings.zindex
    },

    init: function () {
      this.add(grids.grids);
      this.build();
      this.log(this.instances);
      this.initGrids();
    },

    add: function (grids) {
      var that = this;

      // push only mq filtered grids ?
      $.each(grids, function (i) {
        var o = new Grid(grids[i]);
        that.instances.push(o);
      });
    },

    build: function () {
      var wrapper = $('<div class="' + els.wrapper.slice(1) + '" />').css({
        maxWidth: this.settings.maxWidth,
        opacity: this.settings.opacity,
        zIndex: this.settings.zindex
      });

      $('body').append(wrapper);
    },

    initGrids: function () {
      $.each(this.instances, function (i, o) {
        o.init();
      });
    },

    log: function () {
      if (debug.code) {
        if (window.console && window.console.log && window.console.log.apply) {
          window.console.log.apply(console, ['akva: ', arguments]);
        }
      }
    }

  };

  akva.detect = function () {
    if (window.location.hash.indexOf('#akva') > -1 || debug.grid === true) {
      akva.init();
    }
  }();

}(grids, jQuery));


