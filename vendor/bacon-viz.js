(function() {
  var BaconViz, MARBLE_RADIUS, prepRootNode, refreshMarbles;

  BaconViz = this.BaconViz != null ? this.BaconViz : this.BaconViz = {};

  MARBLE_RADIUS = 30;

  prepRootNode = function(rootSvgNode) {
    var container, height, marbleGroup, root, width;
    height = (MARBLE_RADIUS * 2) + 14;
    width = 960;
    root = d3.select(rootSvgNode).attr("width", width).attr("height", height);
    container = root.append("g");
    container.append('line').attr("x1", 0).attr("y1", height / 2).attr("x2", width - MARBLE_RADIUS).attr("y2", height / 2).attr("class", "marble-line");
    marbleGroup = container.append("g");
    return {
      root: root,
      marbleGroup: marbleGroup
    };
  };

  refreshMarbles = function(_arg) {
    var colorScale, eventData, fadeScale, height, marbleGroup, marbles, newMarble, x, yCenter;
    marbleGroup = _arg.marbleGroup, eventData = _arg.eventData, x = _arg.x, height = _arg.height;
    fadeScale = x.copy().range([0, 1]);
    colorScale = d3.scale.category10();
    yCenter = height / 2;
    marbles = marbleGroup.selectAll(".marble").data(eventData);
    newMarble = marbles.enter().append("svg:g").attr("class", "marble");
    newMarble.append("circle").attr("r", MARBLE_RADIUS);
    newMarble.append("text").attr("alignment-baseline", "middle").attr("text-anchor", "middle");
    marbles.exit().remove();
    marbles.attr("transform", function(d) {
      return "translate(" + (x(d.timestamp)) + "," + yCenter + ")";
    }).attr("opacity", function(d) {
      return fadeScale(d.timestamp);
    });
    marbles.select("circle").style("fill", function(d, i) {
      return colorScale(i);
    }).style("stroke", function(d, i) {
      return d3.rgb(colorScale(i)).darker();
    });
    return marbles.select("text").text(function(d) {
      return d.displayValue;
    });
  };

  BaconViz.createMarbleChartWithin = function(rootSvgNode) {
    var addNewMarble, eventData, height, marbleGroup, now, root, tick, timeRange, updateInterval, width, x, _ref;
    updateInterval = 50;
    timeRange = 1000 * 10;
    now = new Date();
    _ref = prepRootNode(rootSvgNode), marbleGroup = _ref.marbleGroup, root = _ref.root;
    width = root.attr("width");
    height = root.attr("height");
    eventData = [];
    x = d3.time.scale().domain([now - timeRange, now]).range([0, width - MARBLE_RADIUS]);
    tick = function() {
      now = new Date();
      x.domain([now - timeRange, now]);
      refreshMarbles({
        marbleGroup: marbleGroup,
        eventData: eventData,
        x: x,
        height: height
      });
      return marbleGroup.attr("transform", null).transition().duration(updateInterval).ease("linear").attr("transform", "translate(" + x(now - timeRange - updateInterval) + ")").each("end", tick);
    };
    tick();
    addNewMarble = function(baconEvent) {
      var displayValue, event;
      displayValue = (function() {
        try {
          return JSON.stringify(baconEvent.value());
        } catch (_error) {
          return null;
        }
      })();
      event = {
        backingEvent: baconEvent,
        displayValue: displayValue,
        timestamp: new Date()
      };
      return eventData.push(event);
    };
    return {
      addNewMarble: addNewMarble
    };
  };

}).call(this);

(function() {
  var visualize;

  visualize = function(streamName) {
    var vis;
    vis = BaconViz.createStreamVisualization(streamName);
    this.subscribe(function(event) {
      return vis.chart.addNewMarble(event);
    });
    return this;
  };

  if ((typeof Bacon !== "undefined" && Bacon !== null) && (Bacon.Observable != null)) {
    Bacon.Observable.prototype.visualize = visualize;
  }

}).call(this);

(function() {
  var BaconViz;

  BaconViz = this.BaconViz != null ? this.BaconViz : this.BaconViz = {};

  BaconViz.createStreamVisualization = function(streamName) {
    var $newStream, $streamsContainer, $svg, chart;
    $streamsContainer = $('article.streams');
    $newStream = $("<section class=\"marble-stream\">\n  <h2/>\n  <svg class=\"marbles\"/>\n</section>");
    $newStream.find('h2').text(streamName);
    $newStream.appendTo($streamsContainer);
    $svg = $newStream.find("svg");
    chart = BaconViz.createMarbleChartWithin($svg[0]);
    return {
      chart: chart
    };
  };

}).call(this);

(function() {
  var createVisualizer, global, openPopup, popuper;

  global = this;

  openPopup = function() {
    var appendContent, popup;
    popup = window.open('', 'Bacon-Viz', 'width=400,height=300');
    if (popup == null) {
      return void 0;
    }
    appendContent = function(content) {
      var p;
      p = popup.document.createElement("p");
      p.innerText = content;
      return popup.document.body.appendChild(p);
    };
    return {
      appendContent: appendContent
    };
  };

  popuper = function() {
    var popup;
    popup = void 0;
    return function() {
      if (popup == null) {
        popup = openPopup();
      }
      return popup;
    };
  };

  createVisualizer = function() {
    var recordBaconEvent, withPopup;
    withPopup = popuper();
    console.log("creating visualizer");
    recordBaconEvent = function(event) {
      return withPopup().appendContent("event! - " + event);
    };
    return {
      recordBaconEvent: recordBaconEvent
    };
  };

  if (global.BaconViz == null) {
    global.BaconViz = {};
  }

  global.BaconViz.createVisualizer = createVisualizer;

}).call(this);
