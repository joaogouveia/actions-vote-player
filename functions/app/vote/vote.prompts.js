// Import the Dialogflow module from the Actions on Google client library.
const {
    List, Image, Table
  } = require('actions-on-google');

var pluralize = require('pluralize')
const util = require('../../util/util')

global.ssmlRate = "112%"

let introPlayerListSpeechs = [`Os jogadores de fifa disponíveis para você escolher são.`,
                      `Esses são os jogadores disponíveis atualmente.`,
                      `Os jogadores atuais para você escolher são.`,
                      `Você pode escolher dentre os seguintes jogadores.`,
                      `<s>Esses são os jogadores disponíveis.</s> <s>Qual você acha que manda melhor?</s>`];

let introVoteResultSpeechs = [`O resultado parcial da votação é.`,
  `Até o momento o resultado da votação é.`,
  `Certo, este é o resultado parcial da votação`,];
    
exports.askForPlayertoVote = () => {
  let speechs = [`<speak><prosody rate="${ssmlRate}" pitch="medium">mas qual jogador você acha que manda melhor?</prosody></speak>`,
                `<speak><prosody rate="${ssmlRate}" pitch="medium">mas em quem você gostaria de votar?</prosody></speak>`];
  return util.getSingleRandom(speechs);
}

exports.askForPlayertoKnow = () => {
  let speechs = [`<speak><prosody rate="${ssmlRate}" pitch="medium">mas de qual jogador você quer saber?</prosody></speak>`,
                `<speak><prosody rate="${ssmlRate}" pitch="medium">mas sobre qual jogador você quer saber?</prosody></speak>`];
  return util.getSingleRandom(speechs);
}

exports.getPlayerListIntro = () => {
  return `<speak><prosody rate="${ssmlRate}" pitch="-1st">${util.getSingleRandom(introPlayerListSpeechs)}</prosody></speak>`;
}
  
exports.buildListPlayers = (snapshot) => {
    let items = {};
    snapshot.forEach((player) => {
      console.info(`player.id => ${player.get('nome')} com ${player.get('votos')} votos`);
      items[player.id] = {
        title: player.get('nome'),
        // image: new Image({
        //   url: player.get('img'),
        //   alt: player.get('nome'),
        // }),
      };
    });
    console.info({items: items});
    return new List ({items: items});
}
  
exports.buildListPlayersAudio = (snapshot) => {
  let ssmlText = `<speak><prosody rate="${ssmlRate}" pitch="medium">${util.getSingleRandom(introPlayerListSpeechs)} </prosody><break time="600ms" />`;
  ssmlText += `<prosody rate="${ssmlRate}" pitch="-1st">`;
  let count = 1;
  snapshot.forEach((player) => {
    console.info(`player.id => ${player.get('nome')} com ${player.get('votos')} votos`);
    console.info(`snapshot ${snapshot.size} e player ${player}`);
    if (snapshot.size === count){ 
      ssmlText += `ou ${player.get('nome')}`
    } else {
      ssmlText += `${player.get('nome')},<break time="300ms" /> `
    }
    count++;
  });
  ssmlText += '</prosody>';
  ssmlText += '</speak>';
  return ssmlText;
}
  
exports.getPlayerResultIntro = (playerName) => {
  let introSpeechs = [`Aqui está o resultado parcial do jogador ${playerName}.`,
                      `Este é o resultado parcial do jogador ${playerName}`];
  return util.getSingleRandom(introSpeechs);
}

exports.buildTableResultsForPlayer = (player) => {
    let table = {};
    table.dividers = true;
    table.columns = ["Posição", "Jogador", "Votos"];
    table.rows = [] 
    console.info(`player.id => ${player.get('nome')} com ${player.get('votos')} votos`);
    table.rows[0] = [`${player.position.toString()}º`, player.get('nome'), player.get('votos').toString()];
    console.info(table);
    
    return new Table (table);
}
  
exports.buildResultsAudioForPlayer = (player) => {
    let ssmlText = `<speak>`;
    console.info(`player.id => ${player.get('nome')} com ${player.get('votos')} votos`);
    ssmlText += `<prosody rate="${ssmlRate}" pitch="-1st">`;
    ssmlText += `O jogador ${player.get('nome')} está atualmente em <say-as interpret-as="ordinal">${player.position}</say-as> com <say-as interpret-as="unit">${player.get('votos')} ${pluralize('voto', player.get('votos'))}</say-as>.`
    ssmlText += '</prosody>';
    ssmlText += '</speak>';
    return ssmlText;
}
  
exports.buildTableResults = (snapshot) => {
    let table = {};
    table.dividers = true;
    table.columns = ["Posição", "Jogador", "Votos"];
    table.rows = [] 
  
    let pos = 0;
    snapshot.forEach((player) => {
      console.info(`player.id => ${player.get('nome')} com ${player.get('votos')} votos`);
      pos += 1;
      table.rows[pos-1] = [`${pos.toString()}º`, player.get('nome'), player.get('votos').toString()];
    });
  
    console.info(table);
    return new Table (table);
}
  
exports.getVoteResultsIntro = () => {
  return util.getSingleRandom(introVoteResultSpeechs);
}

exports.buildResultsAudio = (snapshot) => {
  let ssmlText = `<speak><prosody rate="${ssmlRate}" pitch="medium">${util.getSingleRandom(introVoteResultSpeechs)}</prosody><break time="600ms" />`;
  
  let pos = 1;
  snapshot.forEach((player) => {
    ssmlText += `<prosody rate="${ssmlRate}" pitch="-1st">`;
    console.info(`player.id => ${player.get('nome')} com ${player.get('votos')} votos`);
    console.info(`snapshot ${snapshot.size} e player ${player}`);
    if (snapshot.size === pos){ 
      ssmlText += ` e `
    }
    ssmlText += `em <say-as interpret-as="ordinal">${pos}</say-as> está o jogador ${player.get('nome')} com <say-as interpret-as="unit">${player.get('votos')} ${pluralize('voto', player.get('votos'))}</say-as>.<break time="400ms"/>`
    ssmlText += '</prosody>';
    pos++;
  });
  
  ssmlText += '</speak>';
  return ssmlText;
}

exports.getVoteConfirmationPrompt = (playerName) => {
  return `<speak><prosody rate="${ssmlRate}" pitch="medium">Seu voto foi para o jogador ${playerName}</prosody></speak>`;
}

exports.getNextStepsAfterVote = () => {
  return `<speak><prosody rate="${ssmlRate}" pitch="medium">Você pode continuar votando <break time="150ms"/> ou saber como está o resultado parcial</prosody></speak>`;
}

exports.playerCantBeVoted = () =>{
  return `<speak><prosody rate="${ssmlRate}" pitch="-1st">Desculpe, <break time="150ms"/> mas é impossível votar em Angelo Assis como melhor jogador de FIFA! KKKKK</prosody></speak>`;
}