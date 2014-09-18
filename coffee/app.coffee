$ ->
  stream = $('.slider-to-label .slider input')
    .asEventStream('input')
    .map( (e)-> $(e.target).val() )

  stream.visualize("raw slider values")

  parsedStream = stream.map( (x)-> parseFloat(x) )
  parsedStream.visualize("parsed slider values")

  roundedStreams = parsedStream.map( (x)-> x.toFixed(1) )
  roundedStreams.visualize("rounded slider values")

  roundedStreams.assign($(".slider-to-label .label"), "text")

