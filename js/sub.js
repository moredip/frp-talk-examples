pubnubClient = window.initPubnub();

var streamFromPubnub = function(channelName){
  stream = Bacon.fromBinder( function(streamSink){
    pubnubClient.subscribe({
      channel: channelName,
      message: streamSink
    });

    return function(){ 
      pubnubClient.unsubscribe({channel:channelName}); 
    };
  });

  return stream;
};

var pickRandomColor = function(){
  return tinycolor({
    h: Math.random() * 360,
    s: 0.6,
    l: 0.6
  });
};

$( function(){
  //var colors = Bacon.interval(800)
    //.map( pickRandomColor )
    //.map( ".toString", "rgb" );
  var colors = streamFromPubnub(PUBNUB_CHANNEL);
  colors.visualize('received colors');
});
