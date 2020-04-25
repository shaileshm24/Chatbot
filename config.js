//require('dotenv').config();
const config ={};

   config.primarySkillAPI =  "http://localhost:(port number)";
   config.udemyCourseAPI = "https://www.udemy.com/api-2.0/courses/?search=";
   config.authorization = "udemy credentials (bearer token)";
   config.udemyWebURL = "https://www.udemy.com";

module.exports =  config;