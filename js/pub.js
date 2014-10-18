pubnubClient = window.initPubnub();

var pickRandomColor = function(){
  return tinycolor({
    h: Math.random() * 360,
    s: 0.6,
    l: 0.6
  });
};

$( function(){
  var colors = $('#change-color')
    .asEventStream('click', pickRandomColor)
    .toProperty( pickRandomColor() );

  colors.assign( $("body"), "css", "background-color" )

  
  var sendClicks = $('#send-color').asEventStream('click');
  colors.sampledBy(sendClicks)
    .map( function(color){ return color.toString("rgb"); } )
    .log()
    .map( function(c){
      return { 
        channel: PUBNUB_CHANNEL,
        message: c
      };
    })
    .assign( pubnubClient, "publish" );
});
