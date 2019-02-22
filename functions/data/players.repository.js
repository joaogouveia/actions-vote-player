var db = admin.firestore();


exports.getPlayers = (orderedProperty, sort) => {
    return new Promise((resolve, reject) => {
        db.collection('players').orderBy(orderedProperty, sort).get()
        .then((snapshot) => {
            resolve(snapshot);      
        }).catch((error) => {
            console.error("Error getting documents: ", error);
            reject('Error getting documents: ' + error);
        });
    });
}

exports.votePlayer = (player) => {
    return new Promise((resolve, reject) => {
        db.collection('players').doc(player).get()
        .then((snapshot) => {
            if (snapshot.exists) {
                console.info('votado', snapshot.data());
                db.collection('players').doc(player).update({votos: snapshot.get('votos') + 1});
            }
            resolve(snapshot);
        })
        .catch((err) => {
            console.error("Error getting documents: ", error);
            reject('Error getting documents: ' + error);
        });
    });
}

exports.getPlayer = (playerAsked) => {
    return new Promise((resolve, reject) => {
        db.collection('players').orderBy('votos', 'desc').get()
        .then((snapshot) => {
            var pos = 0;
            snapshot.forEach((player) => {
                pos += 1;
                console.info(`player.id => ${player.get('nome')} em posição ${pos} com ${player.get('votos')} votos`);
                if (player.id === playerAsked){
                    player.position = pos;
                    resolve(player);
                }
            });
            resolve(null);      
        }).catch((error) => {
            console.error("Error getting documents: ", error);
            reject('Error getting documents: ' + error);
        });
    });
}