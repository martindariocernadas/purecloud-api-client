// Purecloud Remote Manager : COMMON VARIABLES AND CONSTANTS


// This client ID expects the redirect URL to be http://localhost:8080/
const clientId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const redirectUri = window.location.href;

// Flow = DUMMY - default
const defaultFlowName = 'DUMMY_FLOW';
const defaultFlowId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const defaultUserData = 'DUMMY';

// Flow = "Identificacion Cliente"
const secureIdentificationFlow = 'xxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxxxxx';

// Set purecloud objects
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
const conversationsApi = new platformClient.ConversationsApi();
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const presenceApi = new platformClient.PresenceApi();
const stationsApi = new platformClient.StationsApi();

// Set PureCloud settings
client.setEnvironment('mypurecloud.com');
client.setPersistSettings(true, 'purecloud_app');
client.setDebugLog(console.log, 25);

var conversationList = {};
var me, webSocket, conversationsTopic, notificationChannel;

// ESB connector
const urlESB   ='http://<esb.address>:8153/JsonXmlConector';
const urlESB_d ='http://<esb.address>:8153/JsonXmlConector';
const urlESB_p ='http://<esb.address>:8153/JsonXmlConector';
