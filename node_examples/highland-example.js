var highland = require('highland'),
    http = require('http'),
    parseUrl = require('url').parse,
    request = require('request'),
    querystring = require('querystring'),
    JSONStream = require('JSONStream');

var server = http.createServer( function(req,res) {
  var artistName = pluckArtistNameFromUrl(req.url);

  if( artistName.length === 0 ){
    artistName = "Taylor Swift";
  }

  res.write("<html><h1>Artists related to "+artistName+"</h1>");

  resultStream = searchForArtist(artistName)
    .take(1)
    .flatMap(relatedArtistStream)
    .map(formatArtistNameAsHtml);

  resultStream.pipe(res);
  resultStream.fork().done( function(){
    res.end("</html>");
  });

});

var port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);
server.listen(port);
  
function relatedArtistStream(artistId){
  var artistsStream = 
    request.get(urlForArtistsRelatedTo(artistId))
      .pipe(JSONStream.parse("artists.*"));

   return highland( artistsStream )
    .pluck( "name" );
}

function searchForArtist(artistName){
  var artistsStream = request.get(urlForArtistSearch(artistName))
      .pipe(JSONStream.parse("artists.items"));

  return highland(artistsStream)
    .flatMap(highland)
    .pluck("id");
}

function pluckArtistNameFromUrl(url){
  return unescape( parseUrl(url).pathname.split("/")[1] );
}

function formatArtistNameAsHtml(artistName){
  return '<p><a href="/'+artistName+'">'+artistName+'</a></p>';
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
