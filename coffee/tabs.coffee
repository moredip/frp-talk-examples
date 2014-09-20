resetPage = ->
  $(".streams").empty()


tabPreppers = {}
getTabPreppersFor = (tabName)->(tabPreppers[tabName] ?= [])

prepTab = (tabName,prepFn)->
  getTabPreppersFor(tabName).push(prepFn)
onTabChange = (tabName)->
  getTabPreppersFor(tabName).forEach (fn)->
    fn()

window.prepTab = prepTab

onHashChange = ->
  newTab = location.hash.split("#")[1];
  return unless newTab?

  resetPage()
  onTabChange(newTab)

  $("nav li")
    .removeClass("selected")
    .filter("."+newTab)
    .addClass("selected")

  $(".tab-contents > article")
    .hide()
    .filter("."+newTab)
      .show()

window.addEventListener("hashchange", onHashChange, false)
$( onHashChange )

