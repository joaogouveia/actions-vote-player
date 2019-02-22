const {BasicCard, Button, Image} = require('actions-on-google');
const functions = require('firebase-functions');

exports.getSingleRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

exports.getMultipleRandom = (arr) => arr.filter(() => Math.random() > 0.5);

function hasValue(val){
    return val !== false && val !== undefined && val !== "" && val !== null; 
};

//AOG Util

exports.createBasicCard = (title, subtitle,text, display, imageData, buttonsData ) => {

    var cardItens = {};

    if(!hasValue(text) && !hasValue(imageData.url)){
        console.error("Erro Basiccard Create - Context Welcome");
    }
  
 
    hasValue(title) ? cardItens['title'] = title : null;
    hasValue(subtitle) ? cardItens['subtitle'] = subtitle : null;
    hasValue(display) ? cardItens['display'] = display : null;
    hasValue(text) ? cardItens['text'] = text : null;

    if(hasValue(imageData)){
        cardItens['image'] = imageData;
    }
  
    if(hasValue(buttonsData)){
        cardItens['buttons'] = buttonsData;
    }

return new BasicCard(cardItens);

};

exports.createButtons = (buttons) => {
    var buttonsArray = [];
    for(let index in buttons){
        buttonsArray.push(new Button(
            {title:buttons[index].title,url:buttons[index].uri}
        ));
    }    
    return buttonsArray;
};
    
exports.createImage = (imageURI,accessibilityText)  => {
    return new Image({
                    url:imageURI,
                    alt: accessibilityText,
                })   
};
