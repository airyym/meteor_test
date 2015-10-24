PlayerList = new Mongo.Collection('players');

if(Meteor.isClient)
{
  Template.leaderboard.helpers
  ({
      'player': function()
      {
        return PlayerList.find({}, {sort: {score:-1, name: 1}});
      }
      ,
      'playerCount': function()
      {
        return PlayerList.find().count();
      }
      ,
      'selectedClass' : function()
      {
        var playerId = this._id;
        var selectedPlayer = Session.get('selectedPlayer');
        if(playerId == selectedPlayer)
          return "selected";
      }
      ,
      'showSelectedPlayer' : function()
      {
        var selectedPlayer = Session.get('selectedPlayer');
        return PlayerList.findOne(selectedPlayer);
      }


  });

  Template.leaderboard.events
  ({
      'click .player' : function()
      {
        var playerId = this._id;
        Session.set("selectedPlayer", playerId);
      }
      ,
      'click .increment' : function()
      {
        var selectedPlayer = Session.get('selectedPlayer');
        PlayerList.update(selectedPlayer, {$inc: {score:5}});
      }
      ,
      'click .decrement' : function()
      {
        var selectedPlayer = Session.get('selectedPlayer');
        PlayerList.update(selectedPlayer, {$inc: {score:-5}});
      },

      'click .remove' : function()
      {
        if(confirm('Do you want to remove this player?'))
        {
          var selectedPlayer = Session.get("selectedPlayer");
          PlayerList.remove(selectedPlayer);
        }
      }

  });

  Template.addPlayerForm.events
  ({
      'submit form': function(event)
      {
          event.preventDefault();
          var playerNameVar = event.target.playerName.value;
          var playerScoreVar = parseInt(event.target.playerScore.value);
          PlayerList.insert({
              name : playerNameVar,
              score : playerScoreVar
          });

          event.target.playerName.value = "";
          event.target.playerScore.value = 0;
      }

  });


}

if(Meteor.isServer)
{
  console.log("Hello Server");
}