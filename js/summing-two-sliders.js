var inputEventToVal = function(e){ 
  return $(e.target).val();
};

var summer = function(a,b){
  return a + b;
};

$( function(){
  var sliderAValues = 
    $('.slider.a input')
    .asEventStream('input',inputEventToVal)
    .map( parseInt );

  var sliderBValues = 
    $('.slider.b input')
    .asEventStream('input',inputEventToVal)
    .map( parseInt );

  sliderAValues
    .visualize('slider a')
    .assign( $('.slider.a .label'), 'text' );

  sliderBValues
    .visualize('slider b')
    .assign( $('.slider.b .label'), 'text' );

  //var combinedStream = sliderAValues.merge(sliderBValues);
  var combinedStream = Bacon.combineWith( summer, sliderAValues, sliderBValues )
  combinedStream
    .visualize( 'both sliders' )
    .assign( $('span.sum'), 'text' );
});
