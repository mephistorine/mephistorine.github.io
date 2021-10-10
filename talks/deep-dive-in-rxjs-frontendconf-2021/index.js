function play(movieId, cancelButton, callback) {
  var movieTicket,
    playError,
    tryFinish = function() {
      if (playError) {
        callback(null, playError);
      } else if (movieTicket && player.initialized) {
        callback(null, movieTicket);
      }
    };
  
  cancelButton.addEventListener("click", function() {
    playError = "cancelled"
  })
  
  if (!player.initialized) {
    player.init(function(error) {
      playError = error;
      tryFinish();
    })
  }
  
  authorizeMovie(function(error, ticket) {
    playError = error;
    movieTicket = ticket;
    tryFinish();
  })
}
