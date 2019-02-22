const repository = require('../../data/players.repository');
const votePrompt = require('./vote.prompts');

const getPlayerList = async (conv) => {
    let players = await repository.getPlayers('nome', 'asc');  
    let list = votePrompt.buildListPlayers(players);
    let audio = votePrompt.buildListPlayersAudio(players);
    if (conv.screen){
        conv.ask(votePrompt.getPlayerListIntro());
        conv.ask(list);
    } else {
        conv.ask(audio);
    } 
};
  
const votePlayer = async (conv, {player}, option) => {
    console.info(`option - ${option}  /  player - ${player}`);
    player = player || option;
    console.info(`selecionado - ${player} `);
    if (player){
        if(player == "angeloassis"){
            conv.ask(votePrompt.playerCantBeVoted());
        }else{
            let playerVoted = await repository.votePlayer(player);
            if (!playerVoted.exists) {
                console.info('No such document!');
                conv.ask(votePrompt.askForPlayertoVote());
            } else {
                conv.ask(votePrompt.getVoteConfirmationPrompt(playerVoted.get('nome')));
                conv.ask(votePrompt.getNextStepsAfterVote());
            }
        }
    } else {
        conv.ask(votePrompt.askForPlayertoVote());
    }
};
  
  
const playerResult = async (conv, {player}, option) => {
    console.info(`2option - ${option}  /  player - ${player}`);
    player = player || option;
    console.info(`2selecionado - ${player} `);
    if (player){
        let snapshot = await repository.getPlayer(player);
        if(snapshot != null){
            let tableResult = votePrompt.buildTableResultsForPlayer(snapshot);
            let audioResult = votePrompt.buildResultsAudioForPlayer(snapshot);
            if (conv.screen){
                conv.ask(votePrompt.getPlayerResultIntro(snapshot.get('nome')));
                conv.ask(tableResult);
            }else{
                conv.ask(audioResult);
            }
        }else{
            conv.ask(votePrompt.askForPlayertoKnow());
        }
    }else{
        conv.ask(votePrompt.askForPlayertoKnow());
    }
};
  
const voteResult = async (conv) => {
    let players = await repository.getPlayers('votos', 'desc');  
    let tableResult = votePrompt.buildTableResults(players);
    let audioResult = votePrompt.buildResultsAudio(players);
    if (conv.screen){
        conv.ask(votePrompt.getVoteResultsIntro());
        conv.ask(tableResult);
    }else{
        conv.ask(audioResult);
    }
};

  


const intents = {'player_list': getPlayerList,
    'vote_player' : votePlayer, 
    'player_result' : playerResult,
    'vote_result' : voteResult};

exports.votingMatchIntent = (conv, ...args) => {
    // utils.clearConversationData(conv);
    return intents[conv.intent](conv, ...args);
};