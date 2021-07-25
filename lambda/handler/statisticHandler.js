const lib = require("../helpFunctions.js");

exports.StatisticHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'StatisticsIntent');
    },
    async handle(handlerInput) {
        let speechOutput = "";
        let myWeather;
        await lib.getRemoteData("statistics")
            .then((response) => {
                myWeather = response;
            })
            let isMax = handlerInput.requestEnvelope.request.intent.slots.MaxMin.resolutions.resolutionsPerAuthority[0].values[0].value.id === 'maximal';
        switch (handlerInput.requestEnvelope.request.intent.slots.WeatherData.value) {
                case "temperatur":
                    speechOutput += "Temperatur " + lib.germanNumber(isMax ? myWeather.maxtempout.value : myWeather.mintempout.value) + " Grad Celsius zuletzt am "+ 
                    (isMax ? myWeather.maxtempout.dates[myWeather.maxtempout.dates.length-1] : myWeather.mintempout.dates[myWeather.mintempout.dates.length-1]);
                    break;
                case "windgeschwindigkeit":
                    speechOutput += "Windgeschwindigkeit " + lib.germanNumber(isMax ? myWeather.maxwindspeed.value : myWeather.minwindspeed.value) + " km/h zuletzt am "+ 
                    (isMax ? myWeather.maxwindspeed.dates[myWeather.maxwindspeed.dates.length-1] : myWeather.minwindspeed.dates[myWeather.minwindspeed.dates.length-1]);
                    break;
                case "luftfeuchtigkeit":
                    speechOutput += "Luftfeuchtigkeit " + lib.germanNumber(isMax ? myWeather.maxhumout.value : myWeather.minhumout.value) + " % zuletzt am "+ 
                    (isMax ? myWeather.maxhumout.dates[myWeather.maxhumout.dates.length-1] : myWeather.minhumout.dates[myWeather.minhumout.dates.length-1]);
                    break;
                case "luftdruck":
                   speechOutput += "Luftdruck " + lib.germanNumber(isMax ? myWeather.maxbaro.value : myWeather.minbaro.value,2 ) + " Hektopascal am "+ 
                    (isMax ? myWeather.maxbaro.dates[myWeather.maxbaro.dates.length-1] : myWeather.minbaro.dates[myWeather.minbaro.dates.length-1]);
            }
               

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();

    }
};