var Bacon = require('baconjs').Bacon,
    Cuddles = require('cuddles')(Bacon,true),
    request = require('request'),
    querystring = require('querystring'),
    JSONStream = require('JSONStream');
   
var artistName = process.argv[2] || "Aphex Twin";

searchForArtist(artistName)
  .take(1)
  .flatMap(artistsRelatedTo)
  .map(".toUpperCase")
  .map(appendNewLine)
  .pipeInto(process.stdout);

function searchForArtist(artistName){
  var artistsStream = request.get(urlForArtistSearch(artistName))
      .pipe(JSONStream.parse("artists.items"));

  return Cuddles.nodeToBacon(artistsStream)
    .flatMap(Bacon.fromArray)
    .map(".id");
}

function artistsRelatedTo(artist){
  var artistsStream = 
    request.get(urlForArtistsRelatedTo(artist))
      .pipe(JSONStream.parse("artists.*"));

   return Cuddles.nodeToBacon( artistsStream )
    .map( ".name" );
}

function urlForArtistsRelatedTo(artistId){
  return "https://api.spotify.com/v1/artists/"+artistId+"/related-artists";
}

function urlForArtistSearch(searchString){
  return "https://api.spotify.com/v1/search?" + querystring.stringify({
    type: "artist",
    q: searchString
  });
}

function appendNewLine(str){
  return str+"\n";
}
