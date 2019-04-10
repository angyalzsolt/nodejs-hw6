/*
*
* Author: Zsolt Gyula Angyal
* Title: Homework assignment#6
* Description: Hello World API with cluster 
* Date: 2019.04.10
*
*/

// Dependencies
const server = require('./lib/server');
const cluster = require('cluster');
const os = require('os');

// Declare the app
let app = {};

// Init function
app.init = (callback)=>{
	// If we're on the master
	if(cluster.isMaster){
		console.log(`Master ${process.pid} is running`);

		// Fork workers
		for(let i=0; i<os.cpus().length; i++){
			cluster.fork();
		};

		cluster.on('exit', (worker, code, singnal)=>{
			console.log(`Worker ${worker.process.pid} died`);
		});
	} else {
		// If we're not on the master thread, start the HTTP server
		server.init();
		console.log(`Worker ${process.pid} started`);
	}
}

// Self invoking only if required directly
if(require.main === module){
	app.init(()=>{});
};

// Export the app
module.exports = app;