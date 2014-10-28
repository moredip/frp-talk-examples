var inputEventToVal = function(e){ 
  return $(e.target).val();
};

$( function(){
  var $slider = $('.slider input'),
      $label = $('.slider .label');

  var stream = $slider
    .asEventStream( 'input', inputEventToVal )
    .visualize("raw value")
    .map( parseFloat )
    .visualize("parsed")
    .map( function(x){
      return Math.round(x*100);
    })
    .visualize("as percentage")
    .map( function(x){
      return ""+x+"%";
    });

  stream.assign( $label, "text" );
});
