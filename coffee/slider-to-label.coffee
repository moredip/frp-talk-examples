eventToVal = (e) -> $(e.target).val()

$ ->
  inputStream = 
    $("input")
      .asEventStream("input",eventToVal)
      .toProperty( $("input").val() )
  inputStream
    .log()
    .visualize('raw input')
    .map( parseFloat )
    .visualize('to float')
    .assign( $('.label'), 'text' )

