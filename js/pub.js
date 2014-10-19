pubnubClient = window.initPubnub();

var pickRandomColor = function(){
  return tinycolor({
    h: Math.random() * 360,
    s: 0.6,
    l: 0.6
  });
};

var publishStreamToPubnub = function(stream,channelName){
  stream.map( function(value){
    return { 
      channel: channelName,
      message: value 
    };
  })
  .assign( pubnubClient, "publish" );
}

$( function(){
  var colors = $('#change-color')
    .asEventStream('click', pickRandomColor)
    .toProperty( pickRandomColor() );

  colors.assign( $("body"), "css", "background-color" )

  
  var sendClicks = $('#send-color').asEventStream('click');
  colors.sampledBy(sendClicks)
    .map( function(color){ return color.toString("rgb"); } )
    .log();

  publishStreamToPubnub(colors,PUBNUB_CHANNEL);
});
