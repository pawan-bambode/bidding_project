const autocannon = require("autocannon");
require("dotenv").config();

function startBench(){
 const url = "http://localhost:" + process.env.PORT || 3034;
 const args = process.argv.slice(2);
 const numConnections = 1000;
 const maxConnectionRequests =  1000;
 const instance = autocannon({
 url,
 connections:numConnections,
 duration:10,
 maxConnectionRequests,
 headers :{
  "content-type":"application/json",
 },
 requests : [{
 method:"GET",
 path:"/"
 }]
 },finishedBench);
 
 autocannon.track(instance);
 function finishedBench(err,res){
 }
 }
 startBench();