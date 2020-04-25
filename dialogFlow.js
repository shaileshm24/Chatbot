
const express = require('express');
const {WebhookClient, Card} = require('dialogflow-fulfillment');

const getEmail = require('./Controller/Email.js');
const router = express.Router();

router.post('/', express.json(), (request, response) => {
   
    const agent = new WebhookClient({ request, response });
  

    function welcome(agent) {
        
        agent.add(new Card({
            title: 'Title: this is a card title',
            imageUrl: 'https://developers.google.com/actions/assistant.png',
            text: 'This is the body text of a card.  You can even use line\n  breaks and emoji! 💁',
            buttonText: 'This is a button',
            buttonUrl: 'https://assistant.google.com/'
          }));
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }
    function bye(agent) {
       
            agent.add(`Are you sure you want to leave`);
        
        
    }
    const intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('User_Email_Input', getEmail);
    agent.handleRequest(intentMap);
});


module.exports = router;
