$ ->
  stream = $('.slider-to-label .slider input')
    .asEventStream('input')
    .map( (e)-> $(e.target).val() )

  stream.visualize("slider values")

  stream.assign($(".slider-to-label .label"), "text")

