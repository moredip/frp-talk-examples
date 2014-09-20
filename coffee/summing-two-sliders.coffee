inputEventToVal = (e) -> $(e.target).val()

$ ->
  prepTab "summing-two-sliders", ->
    $sliderA = $('.summing-two-sliders .slider.a')
    valuesForA = $sliderA.find('input').asEventStream('input',inputEventToVal)
       .visualize('before parse')
       .map(parseFloat)
       .visualize('after parse')

    valuesForA
      .visualize("slider A")
      .assign($sliderA.find(".label"), "text")

