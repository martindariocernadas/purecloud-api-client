// Purecloud Remote Manager : SECURE IVR SESSION

// Custom function : login + get active calls + transfer w/data
// Calls : makeSecureIVRSession(flowId, userData);
function getActiveCallsAndMakeTransfer( flowId, userData ) {
	console.log('getActiveCallsAndMakeTransfer');

	// Split redirect Uri
	const redirectUri = setupClientAndTokenUri();
	// Authenticate with PureCloud
	console.log('Login implicit grant w/redirectUri:', redirectUri);
	client.loginImplicitGrant(clientId, redirectUri)
		.then(() => {
			console.log('Logged in');
			// Get authenticated user's info
			return usersApi.getUsersMe();
		})
		.then((userMe) => {
			console.log('userMe: ', userMe);
			me = userMe;
			//
			console.log('authData token: ', usersApi.apiClient.authData.accessToken );
			const token = usersApi.apiClient.authData.accessToken;
			// Get active conversations
			return conversationsApi.getConversationsCalls();
		})
		.then((activeCalls) => {
			console.log('<promise> active conversations calls: ', activeCalls);
			console.log('total pages: ', activeCalls.total );
			//
			conversationList = activeCalls.entities;
			console.log('conversation list: ', conversationList);
		})
		.then(() => {
			// Now, lets transfer to IVR in a secure way
			console.log('make secure ivr session...');
			makeSecureIVRSession(flowId, userData);
		})
		.catch((err) => console.error(err));

	console.log('Finish (setup+active calls+make transfer)');
}

// Custom function : login + get active calls + transfer w/data
// Calls : makeSecureIVRSession(flowId, userData);
function getActiveCallsAndMakeTransferByName( flowName, userData ) {
	console.log('getActiveCallsAndMakeTransferByName');

	// Split redirect Uri
	const redirectUri = setupClientAndTokenUri();
	// Authenticate with PureCloud
	console.log('Login implicit grant w/redirectUri:', redirectUri);
	client.loginImplicitGrant(clientId, redirectUri)
		.then(() => {
			console.log('Logged in');
			// Get authenticated user's info
			return usersApi.getUsersMe();
		})
		.then((userMe) => {
			console.log('userMe: ', userMe);
			me = userMe;
			//
			console.log('authData token: ', usersApi.apiClient.authData.accessToken );
			const token = usersApi.apiClient.authData.accessToken;
			// Get active conversations
			return conversationsApi.getConversationsCalls();
		})
		.then((activeCalls) => {
			console.log('<promise> active conversations calls: ', activeCalls);
			console.log('total pages: ', activeCalls.total );
			//
			conversationList = activeCalls.entities;
			console.log('conversation list: ', conversationList);
		})
		.then(() => {
			// Now, lets transfer to IVR in a secure way
			console.log('make secure ivr session...');

			// Architect API instance
			var apiInstance = new platformClient.ArchitectApi();
			// flowType = inboundcall, inboundemail, inboundshortmessage, outboundcall, 
			//            inqueuecall, speech, securecall, surveyinvite, workflow
			var flowType = 'securecall'; // String | Type

			var opts = {
				'pageNumber': 1, // Number | Page number
				'pageSize': 1, // Number | Page size
				'sortBy': "id", // String | Sort by
				'sortOrder': "asc", // String | Sort order
				'name': flowName, // String | Name
				'deleted': false, // Boolean | Include deleted
				'includeSchemas': false, // Boolean | Include variable schemas
			};
			apiInstance.getFlows(flowType, opts)
				.then(function(data) {
					console.log(`getFlows success! data: ${JSON.stringify(data, null, 2)}`);
					if(typeof data.entities === 'undefined' ||
						 typeof data.entities[0] === 'undefined') {
							 console.log(`Empty result... No flow.`);
							 $('#messages').text('Empty result');
					} else {
						var flowId = 0;
						data.entities.some((flow) => {
							console.info('<flow.id>:', flow.id );
							flowId = flow.id;
							// make transfer!
							makeSecureIVRSession(flowId, userData);
						});
						$('#messages').text('FlowID of ' + name + ' = ' + flowId);
						return flowId;
					};
				})
				.catch(function(err) {
					console.log('There was a failure calling getFlows');
					console.error(err);
				});
		})
		.catch((err) => console.error(err));

	console.log('Finish (setup+active calls+make transfer)');
}

// Optional Custom function : setup + Login + load storage w/conversation list
function loadConversationList() {
	console.log('loadConversationList');

	// Split redirect Uri
	const redirectUri = setupClientAndTokenUri();
	// Authenticate with PureCloud
	console.log('Login implicit grant w/redirectUri:', redirectUri);
	// Authenticate with PureCloud
	client.loginImplicitGrant(clientId, redirectUri)
		.then(() => {
			console.log('Logged in');
			// Get authenticated user's info
			return usersApi.getUsersMe();
		})
		.then((userMe) => {
			console.log('userMe: ', userMe);
			me = userMe;
			//
			console.log('authData token: ', usersApi.apiClient.authData.accessToken );
                        const token = usersApi.apiClient.authData.accessToken;
			// Load conversation list
			conversationList = JSON.parse(localStorage.getItem('conversationList'));
			console.log('Local storage: ',  JSON.parse(localStorage.getItem('conversationList')) );
		})
		.catch((err) => console.error(err));

	console.log('Finish (loadConversationList)');
}

// Optional Custom function : make secure ivr session by default
function transferIVRSession() {
	console.log('transferIVRSession (defaults)');

	loadConversationList();
	let flowId = secureIdentificationFlow;
	makeSecureIVRSession( flowId, defaultUserData);

	console.log('Finish (use defaults)');
}

// Optional Custom function : make secure ivr session to a given flow
// ***OBSOLETE***
function transferIVRSessionToFlowId(newFlowId, newUserData) {
	console.log('transferIVRSession:', newFlowId, newUserData);

	loadConversatinList();
	makeSecureIVRSession(newFlowId, newUserData);

	console.log('Finish (paraemtric)');
}

// Custom function : make secure ivr session
function makeSecureIVRSession(flowId, userData) {
	console.log('makeSecureIVRSession (flowId,userData)');
	if(typeof flowId !== 'string') {
		console.log('Parameter #1 is not a string');
		return;
	}
	if(typeof userData !== 'string') {
		console.log('Parameter #2 is not a string');
		return;
	}

	let thisConversation = searchMyActiveConversation( );
	if ( thisConversation === {} || thisConversation === null || thisConversation === 0) {
		console.log('No connected conversation found!');
		return;
	}

	console.log('Returned this conversation: ', thisConversation, thisConversation.id );
	let callId = thisConversation.id;
	let customerId =  getCustomerParticipantId( thisConversation );
	console.log('Customer/External Participant-Id found:' , customerId );
	let agentId = getAgentParticipantId( thisConversation );
	console.log('Agent/User Participant-Id found:' , agentId );

	// Create request body inside opts field ( opts.body )
	let opts = { "body" : {
			"sourceParticipantId":  agentId ,
		   	"flowId":  flowId ,
		   	"userData":  userData ,
		   	"disconnect": false
			}
		  };
	let stringBody = JSON.stringify(opts);
	console.log('Options:', opts);

	// Invoke API
	console.log('POST params:' , '(' + callId + ' , ' +  customerId  + ' , '+  opts + ')' );
	conversationsApi.postConversationParticipantSecureivrsessions(callId, customerId, opts)
	.then(() => {
		console.log('Secure Transfer initiated...');
	})
	.catch((err) => console.error(err));

	console.log('Finish');
}

// Determines if a conversation is disconnected by checking to see if all participants are disconnected
function isConversationDisconnected(conversation) {
	let isConnected = false;
	conversation.participants.some((participant) => {
		if (participant.state !== 'disconnected') {
			isConnected = true;
			return (!isConnected);
		}
	});

	return !isConnected;
}

// Determines if a conversation has been dropped by checking its state
function isConversationDropped(conversation) {
	let isDropped = false;
	// Participant : { "id", "address", "startTime", "connectedTime", "endTime", "state": "disconnected", 
	// "direction", "disconnectType", "held", "user", "queue", "attributes","recordingState", "none",
	// "purpose": "user", ... }

	// Participant.state: "none", "held", "connected", ...
	if( conversation.state === 'disconnected') {
		console.info('Disconnected state: ', conversation.state);
		isDropped = true;
		return (true);
	}
	// Participant.purpose: "agent"
	if ( typeof conversation.participants === 'undefined' ) {
		return (false);
	}

	conversation.participants.some((participant) => {
			console.debug('Participant: ', participant.id );
			if (participant.purpose === 'agent' || participant.purpose === 'external' ) {
				console.info('Purpose:', participant.purpose);
				if ( typeof participant.calls === 'undefined' ) {
			                return (false);
			        }
				participant.calls.some((call) => {
					console.info('Call: ', call.id );
					// Drop event notification!
					if (call.state === 'disconnected' ) {
						console.info('Disconnect type: ', call.disconnectType);
						isDropped = true;
						return (isDropped);
					}
				})
			}
		});
	return (isDropped);
}

// Determines my connected conversation
function searchMyActiveConversation() {
	console.info('Search my active conversation');

	// Keys in list
        let keys = Object.keys(conversationList);
        console.log('Keys in list object : ', keys );
	// Default conversation is empty
	let thisConversation = {};

	// Iterate to find my 'connected' conversation
	keys.some(function(key) {
		thisConversation = conversationList[key];
		console.log('Checking...: ', key, thisConversation);
		// Is my user connected?
		if( isMyUserConnected( thisConversation ) ) {
               		console.log('My connected conversation...', thisConversation);
			console.log('Participants involved...', thisConversation.participants );
			// Is there a counterpart?
			let ida = getAgentParticipantId(thisConversation);
			let idc = getCustomerParticipantId(thisConversation);
			console.log('Id of customer and agent :', idc, ' - ', ida );

		        if( idc !== 0 && ida !== 0)  {
        			console.log('Agent/User and Customer/External participants found!');
			 	return (thisConversation);
			} else {
				console.log('...no counterpart');
			}
                }
	});
	// Return
	return (thisConversation);
}

// Determines if my user is connected in a conversation
function isMyUserConnected(conversation) {
        let isConnected = false;
        // Participant : "id", "address", "startTime", "connectedTime", "endTime", "state": "disconnected", 
	// "direction": "disconnectType", "held", "user", "queue", "attributes","recordingState": "none",...
	// Participant.purpose: "agent"
	if ( typeof conversation.participants === 'undefined' ) {
                return (false);
        }

	conversation.participants.some((participant) => {
			console.debug('Participant: ', participant.id );
			if (participant.purpose === 'user' || participant.purpose === 'agent') {
				console.info('My user! ', participant.id );
				if ( typeof participant.calls !== 'undefined' ) {
					participant.calls.some((call) => {
						console.info('Call Id: ', call.id );
						// Connected?
						if (call.state === 'connected' ) {
							console.info('Connected!');
							console.info('Held: ', call.held);
							isConnected = true;
							return (isConnected);
						}
					})
				} else {
					// connected?
					if (participant.state === 'connected' ) {
						console.info('Connected!');
						isConnected = true;
						return (isConnected);
					}
				}
			}
		});
	return (isConnected);
}

// Get Customer Participant Id (in array of participants)
function getCustomerParticipantId(conversation) {
	let idc = 0;
	// Participant : "id", "address", "startTime", "connectedTime", "endTime", "state": "disconnected", 
	// "direction": "disconnectType", "held", "user", "queue", "attributes","recordingState": "none",
	//		 "purpose": "user", ...
	// Participant.purpose: "customer"
	if ( typeof conversation.participants === 'undefined' ) {
	    return ;
	}
	conversation.participants.some((participant) => {
			if (participant.purpose === 'customer' || participant.purpose === 'external'  ) {
				console.info('Customer!', participant.name + '. ' + participant.id );
				if ( typeof participant.calls !== 'undefined' ) {
					participant.calls.some((call) => {
						// Drop event notification!
						if (call.state === 'connected' ) {
							console.info('Connected!');
							console.info('Held: ', call.held);
							idc = participant.id;
							return (idc);
						}
					})
				} else {
					// State of participant
					if (participant.state === 'connected' ) {
						console.info('Connected!');
						idc = participant.id;
						return (idc);
					}
				}
			}
		});
	return (idc);
}


// Get Agend Particpant Id in array of participants
function getAgentParticipantId(conversation) {
	let ida = 0;
	// Participant : "id", "address", "startTime", "connectedTime", "endTime", "state": "disconnected", 
	// "direction": "disconnectType", "held", "user", "queue", "attributes","recordingState": "none",
	// "purpose": "user", ...
	// Participant.purpose: "agent"
	if ( typeof conversation.participants === 'undefined' ) {
                return ;
        }

	conversation.participants.some((participant) => {
			if (participant.purpose === 'agent') {
				console.info('Agent! ', participant.id );
				if ( typeof participant.calls !== 'undefined' ) {
					participant.calls.some((call) => {
						// Drop event notification!
						if (call.state === 'connected' ) {
							console.info('Connected!');
							console.info('Held: ', call.held);
							ida = participant.id;
							return (ida);
						}
					})
				} else {
					// State of participant
					if (participant.state === 'connected' ) {
						console.info('Connected!');
						ida = participant.id;
						return (ida);
					}
				}
			}
		});
	return (ida);
}
