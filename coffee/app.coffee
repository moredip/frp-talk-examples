$ ->
  stream = $('.slider-to-label .slider input')
    .asEventStream('input')
    .map( (e)-> $(e.target).val() )
    .visualize("raw slider values")
    .map( (x)-> parseFloat(x) )
    .visualize("parsed slider values")
    .map( (x)-> x.toFixed(1) )
    .visualize("rounded slider values")

  stream.assign($(".slider-to-label .label"), "text")

