eventToVal = (e) -> $(e.target).val()

$ ->
  inputStream = $("input").asEventStream("input",eventToVal)
  inputStream
    .log()
    .visualize('raw input')
    .map( parseFloat )
    .visualize('to float')

