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

$( function(){
  var stream = streamFromPubnub(PUBNUB_CHANNEL);
  stream.visualize('pub stream');
});
