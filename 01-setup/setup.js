const commandLineArgs = require('command-line-args');
const replace = require('replace-in-file');
const getUsage = require('command-line-usage');
const proxydir = "./edge-developer-training-backend";
//command line arg names
const USERNAME = 'username';
const PASSWORD = 'password';
const FIREBASE_HOST = 'firebasehostname';
const ENV = 'environment';
const ORG = 'org';

/*
Replace the firebase-hostname in the edge.json file with the one from the command line.
*/
function replaceFirebaseProject(){
  var optionsReplacer = {
    files: './edge-developer-training-backend/edge.json',
    from: /"host" : ".*"/g,
    to: '"host" : "' + options.firebaseproject + '"',
  };

  try {
    const changes = replace.sync(optionsReplacer);
    console.log('Modified files:', changes.join(', '));
  }
  catch (error) {
    console.error('Error occurred trying to update the firebase project ID.');
    //console.error('Error occurred trying to update the firebase project ID:', error);
  }
}

/*
Display the command line help options.
*/
function help(){
  const sections = [
    {
      header: 'Apigee Edge Developer Training Backend Setup',
      content: 'This utility will setup the edge-developer-training-backend proxy and all of the required dependencies: target server, developer, developer app and product.'
    },
    {
      header: 'Synopsis',
      content: [
        '$ setup [bold]{-u} [underline]{apigee-username} [bold]{-p} [underline]{apigee-password} [bold]{-o} [underline]{apigee-org} [bold]{-e} [underline]{apigee-environment} [bold]{-f} [underline]{firebase-hostname}',
        '$ setup [bold]{--help}'
      ]
    },
    {
      header: 'Options',
      optionList: [
        {
          name: USERNAME,
          typeLabel: '[underline]{username}',
          description: 'Apigee Edge username.'
        },
        {
          name: PASSWORD,
          typeLabel: '[underline]{password}',
          description: 'Apigee Edge username.'
        },
        {
          name: ORG,
          typeLabel: '[underline]{apigee org}',
          description: 'Apigee Edge organization name.'
        },
        {
          name: ENV,
          typeLabel: '[underline]{env}',
          description: 'Apigee Edge environment.'
        },
        {
          name: FIREBASE_HOST,
          typeLabel: '[underline]{firebase host}',
          description: 'Firebase hostname.'
        },
        {
          name: 'help',
          description: 'Print this usage guide.'
        }
      ]
    }
  ]
  const usage = getUsage(sections);
  console.log(usage);
  process.exit(0);
}

/*
Executes the maven deployment plugin twice:
1) Deploys the proxy as inactive first.
2) creates the target server, Apigee product, apps, and developer, then redeploys
the proxy and activates it.
*/
function deployProxyAndDependencies(){
  const mvn = require('maven').create({
        cwd: proxydir,
        profiles: [options.environment]
      });

  var mvnArgs = {
    'username': options.username,
    'password': options.password,
    'org': options.org,
    'options': 'inactive'
  };

  //deploy the proxy first but don't activate it.
  mvn.execute(['clean', 'install'], mvnArgs).then(() => {
    //create all the dependencies and deploy and activate the proxy
    mvnArgs = {
      'username': options.username,
      'password': options.password,
      'org': options.org,
      'apigee.config.options': 'create'
    };
    mvn.execute(['clean', 'install'], mvnArgs).then(() => {
      console.log('edge-developer-training-backend successfully configured!');
    });
  });
}

//Main
//Command line arguments
const optionDefinitions = [
  { name: USERNAME, alias: 'u', type: String },
  { name: PASSWORD, alias: 'p', type: String},
  { name: ORG, alias: 'o', type: String},
  { name: ENV, alias: 'e', type: String },
  { name: FIREBASE_HOST, alias: 'f', type: String },
  { name: 'help', alias: 'h', type: String}
]

const options = commandLineArgs(optionDefinitions)
//did the user request help
if(options.hasOwnProperty('help')){
  help();
}
//check if there are any required properties that are missing
if(!options.hasOwnProperty(USERNAME) || !options.hasOwnProperty(PASSWORD) || !options.hasOwnProperty(ORG) || !options.hasOwnProperty(ENV) || !options.hasOwnProperty(FIREBASE_HOST)){
  help();
}

replaceFirebaseProject();
deployProxyAndDependencies();
