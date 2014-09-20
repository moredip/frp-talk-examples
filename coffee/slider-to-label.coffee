eventToVal = (e) -> $(e.target).val()

$ ->
  prepTab "slider-to-label", ->
    $workArea = $(".slider-to-label")
    inputStream = $workArea.find("input").asEventStream("input",eventToVal)
    inputStream
      .visualize('raw input')
      .map( parseFloat )
      .visualize('to float')

