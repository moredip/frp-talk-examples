pubnubClient = window.initPubnub();

var pickRandomColor = function(){
  return tinycolor({
    h: Math.random() * 360,
    s: 0.6,
    l: 0.6
  });
};

var publishStreamToPubnub = function(stream,channelName){
  stream.onValue( function(value){
    pubnubClient.publish({
      channel: channelName,
      message: value 
    });
   });
}

$( function(){
  var changeColorClicks = $("#change-color").asEventStream('click'),
      sendColorClicks = $("#send-color").asEventStream('click');

  var randomColors = changeColorClicks
    .map( pickRandomColor )
    .toProperty( pickRandomColor() );

  randomColors.assign( $("body"), "css", "background-color" )

  var colorMessages = randomColors
    .sampledBy(sendColorClicks)
    .map( function(color){ return color.toString("rgb"); } )
    .log();

  publishStreamToPubnub(colorMessages,PUBNUB_CHANNEL);
});
