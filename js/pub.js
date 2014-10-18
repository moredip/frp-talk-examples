var initPubnub = function(){
  PUBNUB_SUB_KEY='sub-c-22bc549a-56c8-11e4-a7f8-02ee2ddab7fe';
  PUBNUB_PUB_KEY='pub-c-edbabeb0-ab69-4626-81f8-19b94766b1a9';
  return PUBNUB.init({
    publish_key: PUBNUB_PUB_KEY,
    subscribe_key: PUBNUB_SUB_KEY
  });
}

pubnubClient = initPubnub();

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
  var stream = streamFromPubnub('bacon');
  stream.visualize('pub stream');
});
