const SessionManager = require('../../SessionManager');
const Sounds = require('../../Sounds')
var newContext = 'question'
const ContextMap = require('../../ContextMap')
var Game = require('../../models/Game')
const Errors = require('../../ErrorMessages')

var execute = function(args, assistant){
    let user = assistant.deviceProfile.user;
    user.setContext(newContext, ContextMap[newContext].previous);
    SessionManager.sendData(user.sessionCode, 'setStatus', newContext);
    user.save();
    
    
    Game.findById(user.game).then(function(game){
        var nextPlayerUp = game.getNextUpPlayer();
        assistant
            .play(Sounds.forward)
            .say(nextPlayerUp)
            .pause('300ms')
            .say("You're up")
            .reprompt.say("I need an answer")
            .setContext('guess', 1)
            .finish();
    })


}

var validateInput = function(args,assistant){
    if(!assistant.deviceProfile)
        return Errors.NeedToConnect
    if(!assistant.deviceProfile.user)
        return Errors.NeedToConnect
    return null;
}

var PlayIntent = {
    execute: execute,
    validateInput: validateInput
}

module.exports = PlayIntent;