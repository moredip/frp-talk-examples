eventToVal = (e) -> $(e.target).val()

validate = (s)->
  s.length > 5

messageToDisplay = (isValid)->
  if isValid
    "seems legit"
  else
    "not enough characters"


$ ->
  inputStream = $("input").asEventStream("input",eventToVal)
  inputStream
    .log()
    .visualize('raw input')
    .map( (s) -> s.toUpperCase() )
    .visualize('up cased')

  length = inputStream
    .map( validate )
    .map( messageToDisplay )
    .assign( $(".label"), "text" )

