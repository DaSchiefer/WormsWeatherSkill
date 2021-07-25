const lib = require("../helpFunctions.js");
const error_message = "Derzeit gibt es Probleme auf diese Daten zuzugreifen, versuchen sie es später erneut.";
// Handler der aufgerufen wird wenn die Temperatur abgefragt wird
exports.TemperaturHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'TemperaturIntent');
    },
    async handle(handlerInput) {
        let speechOutput = "";
        //Auswahl der Data API
        await lib.getRemoteData()
            .then((response) => {
                speechOutput = "Derzeit haben wir " + lib.germanNumber(response.temp.out.c) + " Grad Celsius";
            })
            .catch((err) => {
                err.message = error_message;
                speechOutput = err.message;
            });

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();

    }
};
// Handler der aufgerufen wird wenn die Luftfeuchtigkeit abgefragt wird
exports.HumidityHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HumidityIntent');
    },
    async handle(handlerInput) {
        let speechOutput = "";

        await lib.getRemoteData()
            .then((response) => {
                speechOutput = "Die Luftfeuchtigkeit beträgt derzeit " + response.hum.out + "%.";
            })
            .catch((err) => {
                err.message = error_message;
                speechOutput = err.message;
            });

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();

    }
};
// Handler der aufgerufen wird wenn der Luftdruck abgefragt wird
exports.BaroHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'BaroIntent');
    },
    async handle(handlerInput) {
        let speechOutput = "";

        await lib.getRemoteData()
            .then((response) => {
                speechOutput = "Der Luftdruck beträgt derzeit " + lib.germanNumber(response.baro, 2) + " hPa";
            })
            .catch((err) => {
                err.message = error_message;
                speechOutput = err.message;
            });

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();

    }
};
// Handler der aufgerufen wird wenn die Windgeschwindigkeitabgefragt wird
exports.WindSpeedHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'WindSpeedIntent');
    },
    async handle(handlerInput) {
        let speechOutput = 'This is the default message.';

        await lib.getRemoteData()
            .then((response) => {
                speechOutput = "Die Windgeschwindigkeit beträgt derzeit " + lib.germanNumber(response.wind.speed.kmh) + " km/h";
            })
            .catch((err) => {
                err.message = error_message;
                speechOutput = err.message;
            });

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();

    }
};