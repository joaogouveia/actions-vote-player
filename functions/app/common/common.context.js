

const noInput = (conv) => {
    // Use the number of reprompts to vary response
    const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
    if (repromptCount === 0) {
      conv.ask(`<speak><prosody rate="medium" pitch="medium">Você pode dizer qual projeto gostaria de trabalhar <break time="100ms"/>, pedir o resultado da votação <break time="100ms"/>ou se perguntar quais são os projetos existentes. </prosody></speak>`);
    } else if (repromptCount === 1) {
      conv.ask(`<speak><prosody rate="medium" pitch="medium">Por favor, diga o que deseja.</prosody></speak>`);
    } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
      conv.close(`<speak><prosody rate="medium" pitch="medium">Me desculpe,<break time="200ms"/> mas estamos tendo problemas. </prosody>` +
        `<prosody rate="medium" pitch="medium">Vamos tentar novamente mais tarde.</prosody><prosody rate="medium" pitch="medium">Até mais.</prosody></speak>`);
    }
};

const intents = {'actions_intent_NO_INPUT': noInput};

exports.commonMatchIntent = (conv, ...args) => {
    // utils.clearConversationData(conv);
    return intents[conv.intent](conv, ...args);
};