var IntentExecution = require('./IntentExecutor');
var DeviceProfile = require('../models/DeviceProfile')

var GoogleRequestParser = function(googleArgs, _res){
    //attach or create Device related to request
    var context = googleArgs.result.parameters;
    context.intent = googleArgs.result.action
    var deviceData = {id: context.platformUserId, platform: 'google'}
    DeviceProfile.findOne(deviceData).populate('user') //We can probably make this cleaner; load device in GoogleAssistant constructor?
        .then(function(deviceProfile){
            if (!deviceProfile){
                deviceProfile = new DeviceProfile(deviceData);
                deviceProfile.save();
            }
            new IntentExecution(context, new GoogleAssistant(_res,deviceProfile));            
        })
}

var GoogleAssistant = function(_res, _deviceProfile){
    var res = _res;
    var useSSML = true;

    this.deviceProfile = _deviceProfile;

    var responseData = {
        speech: "",
        displayText: "",
        data: {"google":{"is_ssml":useSSML}},
        contextOut: [],
        source: "",
        followupEvent: {}
    };

    var resStatus = 200;

    this.say = function(speech){
        responseData.speech += speech;
        return this;
    }

    this.setContext = function(contextName) {
        let context = {
            name: contextName,
        }
        responseData.contextOut.push(context)
        return this;
    }

    this.data = function(_data){
        responseData.data = _data;
        return this;
    }

    this.error = function(errorCode){
        resStatus = errorCode;
        return this;
    }

    this.finish = function(){

        res.status(resStatus).send(responseData);
    }

    this.setUser = function(user){
        this.deviceProfile.user = user._id;
        this.deviceProfile.save();
    }
}

module.exports = GoogleRequestParser;


const correctURL = "https://storage.googleapis.com/trivia-df1da.appspot.com/sounds/correct-chime.wav";
const wrongURL = "https://storage.googleapis.com/trivia-df1da.appspot.com/sounds/wrong.mp3";