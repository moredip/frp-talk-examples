inputEventToVal = (e) -> $(e.target).val()

$ ->
  $sliderA = $('.slider.a')
  valuesForA = $sliderA.find('input').asEventStream('input',inputEventToVal)
     .visualize('before parse')
     .map(parseFloat)
     .visualize('after parse')

  valuesForA
    .visualize("slider A")
    .assign($sliderA.find(".label"), "text")

