/*jshint strict:false, browser:true, devel:true, indent:2, onevar:false, white:true */

/*
  akva grid js
  twitter: @robertpiira
*/


var grids = [
  {
    gridName: 'desktop-and-above',
    breakpoints: {from: {size: 75, unit: 'em'}, to: null},
    columnCount: 6,
    lineHeight: {size: 1.5, unit: 'em'},
    gutterWidth: {size: 1.5, unit: 'em'},
    outerGutterWidth: {size: -2, unit: '%'},
    width: {size: 92, unit: '%'},
    borderTheme: {color: 'blue', style: 'solid'},
    maxWidth: {size: 1000, unit: 'px'},
    opacity: 0.5,
    zindex: '1'
  },
  {
    gridName: 'mobile-and-tablet',
    breakpoints: {from: null, to: {size: 85, unit: 'em'}},
    columnCount: 4,
    lineHeight: {size: 1.5, unit: 'em'},
    gutterWidth: {size: 1.5, unit: 'em'},
    outerGutterWidth: {size: -2, unit: '%'},
    width: null,
    borderTheme: {color: 'purple', style: 'dashed'},
    maxWidth: {size: 1000, unit: 'px'},
    opacity: 0.5,
    zindex: '1'
  }
];

(function (grids, $) {

  'use strict';

  var debug = {
    grid: true,
    code: true
  };

  var els = {
    wrapper:    '.akva-grid',
    inner:      '.akva-inner',
    columns:    '.akva-cols',
    column:     '.akva-col',
    baseline:   '.akva-baseline',
    line:       '.akva-baseline-unit'
  };

  var log = function () {
    if (debug.code) {
      if (window.console && window.console.log && window.console.log.apply) {
        window.console.log.apply(console, ['akva: ', arguments]);
      }
    }
  };

  var Grid = function Grid(o) {
    this.gridName = o.gridName;
    this.columnCount = o.columnCount;
    this.breakpoints = (o.breakpoints) ? {from: (o.breakpoints.from) ? o.breakpoints.from.size + o.breakpoints.from.unit: null, to: (o.breakpoints.to) ? o.breakpoints.to.size + o.breakpoints.to.unit: null} : null;
    this.lineHeight = (o.lineHeight) ? ((o.lineHeight.size) ? o.lineHeight.size : null) + o.lineHeight.unit : null;
    this.gutterWidth = (o.gutterWidth) ? ((o.gutterWidth.size) ? o.gutterWidth.size : 0) + o.gutterWidth.unit : 0;
    this.outerGutterWidth = (o.outerGutterWidth) ? ((o.outerGutterWidth.size) ? o.outerGutterWidth.size : 0) + o.outerGutterWidth.unit : 0;
    this.width = (o.width) ? ((o.width.size) ? o.width.size : 'auto') + o.width.unit : null;
    this.borderTheme = (o.borderTheme) ? {color: o.borderTheme.color, style: o.borderTheme.style} : null;
    this.maxWidth = (o.maxWidth) ? ((o.maxWidth.size) ? o.maxWidth.size : 'auto') + o.maxWidth.unit : 'auto';
    this.opacity = (o.opacity) ? o.opacity : 1;
    this.zindex = (o.zindex) ? o.zindex : 1;

    // Handle visibility of grids with matchMedia
    var isVisible = true;
    var query;

    if (this.breakpoints) {

      query = {
        from: (this.breakpoints.from) ? '(min-width:' + this.breakpoints.from + ')' : '',
        and: (this.breakpoints.from && this.breakpoints.to) ? ' and ' : '',
        to: (this.breakpoints.to) ? '(max-width:' + this.breakpoints.to + ')' : '',
        id: o.gridName
      };

      var setVisibility = function (query) {
        isVisible = (query.matches) ?  true : false;
      };

      var handleWindowWidthChange = function (query, id) {
        if (query.matches) {
          $(els.wrapper + '-' + id).show();
        } else {
          $(els.wrapper + '-' + id).hide();
        }
      };

      (function addQueries() {
        var id  = query.id;
        var q   = query.from + query.and + query.to;
        var mq  = window.matchMedia(q);
        
        mq.addListener(function () {
          handleWindowWidthChange(mq, id);
        });

        setVisibility(mq);
        
      }());

      // On load visibility state
      this.isVisible = isVisible;
    }
    
  };

  Grid.prototype = {

    init: function () {

      log('Prototype init: ' + this.gridName + ' grid', this);
      this.build();

    },

    build: function () {
      var wrapper = this.createWrapper();
      var columns = this.createColumns();

      wrapper.find(els.inner).append(columns);

      $('body').append(wrapper);
    },

    createWrapper: function () {
      var wrapper = $('<div class="' + els.wrapper.slice(1) + '" />').css({
        maxWidth: this.maxWidth,
        opacity: this.opacity,
        zIndex: this.zindex
      }).addClass('akva-grid-' + this.gridName);
      
      var inner = $('<div class="' + els.inner.slice(1) + '" />');

      if (this.outerGutterWidth) {
        inner.css({
          'margin-left': this.outerGutterWidth,
          'margin-right': this.outerGutterWidth
        });
      }

      if (!this.isVisible) {
        wrapper.hide();
      }

      wrapper.append(inner);

      return wrapper;
      
    },

    createColumns: function () {
      log('creating ' + this.columnCount + ' columns for ' + this.gridName);
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

    }

  };

  var akva = {

    instances: [],

    init: function () {
      this.addGrids(grids);
      this.initGrids();
    },

    addGrids: function (grids) {
      var that = this;

      $.each(grids, function (i) {
        var o = new Grid(grids[i]);
        that.instances.push(o);
      });
    },

    initGrids: function () {
      $.each(this.instances, function (i, o) {
        o.init();
      });
    }

  };

  akva.detect = function () {
    if (window.location.hash.indexOf('#akva') > -1 || debug.grid === true) {
      akva.init();
    }
  }();

}(grids, jQuery));


