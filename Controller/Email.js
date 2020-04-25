const config = require('../config');
const axios = require ('axios');
const {Image, BrowseCarousel,BrowseCarouselItem,SimpleResponse} = require('actions-on-google');
const {Card} = require('dialogflow-fulfillment');

const getEmail = async (agent)=>{

    try{
    console.log("in Address");
    var data = agent.request_.body.queryResult;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let name = data.queryText.substring(0,data.queryText.lastIndexOf("@")).replace(/\./,' ').toUpperCase();
    console.log('====================================');
    console.log(data.queryText);
    console.log(name)
    console.log('====================================');

    if (name != null){
        if(data.queryText.match(reg) ){
            agent.add(`Welcome ${name}. Happy to help you!`);

        }
        else
        {
            agent.add("Please enter a valid email ID");
        }
    

        var result = await axios.get(config.primarySkillAPI+`/api/skill/${data.queryText}`)
        
        agent.add(`Your primary skill is ${result.data.skill}`);
    

       
        var courses = await axios.get(config.udemyCourseAPI+`${result.data.skill}`+"&ordering=highest-rated",{'headers':{
            "Accept": "application/json, text/plain, */*",
            "Authorization": config.authorization,
            "Content-Type": "application/json;charset=utf-8"
        }});
        
        var temp = JSON.stringify(courses.data.results);
        temp = JSON.parse(temp);
             
        const courseTitle = temp.map(item => {
          let detailOfCoarse= {}
          detailOfCoarse['title']=item.title
          detailOfCoarse['url'] = item.url
          detailOfCoarse['image_480x270']= item.image_480x270
          return detailOfCoarse;
        });
        console.log(courseTitle);
        for (var i=0; i < 5 ;i++){
          console.log("title===============",courseTitle);
            agent.add(new Card({
                    title: courseTitle[i].title,
                    imageUrl: courseTitle[i].image_480x270,
                    text: ``,
                    buttonText: 'Get a course now.',
                    buttonUrl: config.udemyWebURL+courseTitle[i].url
                }));
       }
       if (agent.requestSource === 'ACTIONS_ON_GOOGLE') {
        const conv = agent.conv();
        conv.ask(new SimpleResponse({
            speech: `Welcome ${name}.`+` Happy to help you`,
          text: `Welcome ${name}.`+` Happy to help you`,
        })) ; 
        conv.ask(new SimpleResponse({
            speech: `Your primary skill is ${result.data.skill}`,
          text: `Your primary skill is ${result.data.skill}`,
        })) ; 
        
var arr = []
for (var i=0;i<5;i++){
      arr.push(
      new BrowseCarouselItem({
        title: courseTitle[i].title,
        url: config.udemyWebURL+courseTitle[i].url,
        description: '',
        image: new Image({
          url: courseTitle[i].image_480x270,
          alt: 'Image alternate text',
        }),
        openUrlAction: {
          url: config.udemyWebURL+courseTitle[i].url
        }
      }))}
      conv.ask(new BrowseCarousel({
        items: arr,}));   
  agent.add(conv);      
        }
    
    }
    else if(error){
        console.log(error);
    }
            
    }
    catch(error){
        console.log(error);
        return error;
    }    
}

module.exports = getEmail;