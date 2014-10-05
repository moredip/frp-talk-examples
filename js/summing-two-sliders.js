var inputEventToVal = function(e){ 
  return $(e.target).val();
};

var summer = function(a,b){
  return a + b;
};

var streamFromSlider = function($slider){
  return $slider
    .asEventStream( "input", inputEventToVal )
    .toProperty( $slider.val() )
    .map( parseFloat );
};

$( function(){
  var $sliderA = $(".slider.a input"),
      $labelA = $(".slider.a .label"),
      $sliderB = $(".slider.b input"),
      $labelB = $(".slider.b .label"),
      $summedLabel = $('.sum .label');

  var streamA = streamFromSlider($sliderA);
  streamA.visualize("stream a");
  streamA.assign( $labelA, "text" );

  var streamB = streamFromSlider($sliderB);
  streamB.visualize("stream b");
  streamB.assign( $labelB, "text" );

  var combinedStream = Bacon.combineWith( summer, streamA, streamB );
  combinedStream.visualize("combined");

  combinedStream.assign( $(".sum .label"), "text" );
});
