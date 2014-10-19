(function() {
  var BaconViz, MARBLE_RADIUS, RGB_REGEX, TIME_RANGE_MS, colorForData, colorScale, createCurrValueMarbleWithin, inspect, isColorString, prepRootNode, refreshCurrValueMarble, refreshMarbles, trimEventData;

  BaconViz = this.BaconViz != null ? this.BaconViz : this.BaconViz = {};

  MARBLE_RADIUS = 30;

  TIME_RANGE_MS = 10 * 1000;

  RGB_REGEX = /^rgb\([\.\d]+,\s?[\.\d]+,\s?[\.\d]+\)$/;

  isColorString = function(str) {
    return !!RGB_REGEX.exec(str);
  };

  inspect = function(val) {
    try {
      return JSON.stringify(val);
    } catch (_error) {
      return null;
    }
  };

  createCurrValueMarbleWithin = function(container) {
    var marble;
    marble = container.append("svg:g").attr("class", "curr-value marble");
    marble.style("visibility", "hidden");
    marble.append("circle").attr("r", MARBLE_RADIUS);
    marble.append("text").attr("alignment-baseline", "middle").attr("text-anchor", "middle");
    return marble;
  };

  prepRootNode = function(root) {
    var container, currValueMarble, height, marbleGroup, width;
    height = (MARBLE_RADIUS * 2) + 14;
    width = root.attr("width");
    root.attr("height", height);
    container = root.append("g");
    container.append('line').attr("x1", 0).attr("y1", height / 2).attr("x2", width - MARBLE_RADIUS).attr("y2", height / 2).attr("class", "marble-line");
    currValueMarble = createCurrValueMarbleWithin(container);
    currValueMarble.attr("transform", "translate(" + (width - MARBLE_RADIUS - 5) + "," + (height / 2) + ")");
    marbleGroup = container.append("g");
    return {
      marbleGroup: marbleGroup,
      currValueMarble: currValueMarble
    };
  };

  refreshCurrValueMarble = function(currValueMarble, latestEvent) {
    return currValueMarble.style("visibility", "visible").select("text").text(latestEvent.displayText);
  };

  colorScale = d3.scale.category10();

  colorForData = function(d, i) {
    return d3.rgb(d.displayColor ? d.displayColor : colorScale(i));
  };

  refreshMarbles = function(_arg) {
    var eventData, fadeScale, height, marbleGroup, marbles, newMarble, x, yCenter;
    marbleGroup = _arg.marbleGroup, eventData = _arg.eventData, x = _arg.x, height = _arg.height;
    fadeScale = x.copy().range([0, 1]);
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
    marbles.select("circle").style("fill", colorForData).style("stroke", function(d, i) {
      return colorForData(d, i).darker();
    });
    return marbles.select("text").text(function(d) {
      return d.displayText;
    });
  };

  trimEventData = function(_arg) {
    var ageLimit, event, eventData, now, timeRange, trimmedEventData, _i, _len;
    timeRange = _arg.timeRange, now = _arg.now, eventData = _arg.eventData;
    ageLimit = now - timeRange;
    trimmedEventData = [];
    for (_i = 0, _len = eventData.length; _i < _len; _i++) {
      event = eventData[_i];
      if (event.timestamp > ageLimit) {
        trimmedEventData.push(event);
      }
    }
    return trimmedEventData;
  };

  BaconViz.createMarbleChartWithin = function(rootSvgNode, containerWidth) {
    var addNewMarble, currValueMarble, eventData, height, marbleGroup, now, root, tick, timeRange, updateInterval, width, x, _ref;
    updateInterval = 50;
    timeRange = TIME_RANGE_MS;
    now = new Date();
    root = d3.select(rootSvgNode);
    root.attr("width", containerWidth - (MARBLE_RADIUS * 2));
    _ref = prepRootNode(root), marbleGroup = _ref.marbleGroup, currValueMarble = _ref.currValueMarble;
    width = root.attr("width");
    height = root.attr("height");
    eventData = [];
    x = d3.time.scale().domain([now - timeRange, now]).range([0, width - MARBLE_RADIUS]);
    tick = function() {
      var latestEvent;
      now = new Date();
      x.domain([now - timeRange, now]);
      eventData = trimEventData({
        eventData: eventData,
        timeRange: timeRange,
        now: now
      });
      refreshMarbles({
        marbleGroup: marbleGroup,
        eventData: eventData,
        x: x,
        height: height
      });
      if (eventData.length) {
        latestEvent = eventData[eventData.length - 1];
        refreshCurrValueMarble(currValueMarble, latestEvent);
      }
      return marbleGroup.attr("transform", null).transition().duration(updateInterval).ease("linear").attr("transform", "translate(" + x(now - timeRange - updateInterval) + ")").each("end", tick);
    };
    tick();
    addNewMarble = function(baconEvent) {
      var displayColor, displayText, event;
      if (isColorString(baconEvent.value())) {
        displayText = void 0;
        displayColor = baconEvent.value();
      } else {
        displayColor = void 0;
        displayText = inspect(baconEvent.value());
      }
      event = {
        backingEvent: baconEvent,
        displayText: displayText,
        displayColor: displayColor,
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
    $streamsContainer = $('.streams');
    $newStream = $("<section class=\"marble-stream\">\n  <h2/>\n  <svg class=\"marbles\"/>\n</section>");
    $newStream.find('h2').text(streamName);
    $newStream.appendTo($streamsContainer);
    $svg = $newStream.find("svg");
    chart = BaconViz.createMarbleChartWithin($svg[0], $newStream.width());
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
