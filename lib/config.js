/*
*
* Create and export variables
*
*
*/

let environments = {};

environments.development = {
	'httpPort': 3000,
	'httpsPort': 3001,
	'envname': 'development'
};

environments.production = {
	'httpPort': 5000,
	'httpsPort': 5001,
	'envname': 'production'
};

let currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.developent;

module.exports = environmentToExport;