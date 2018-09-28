// Purecloud Remote Manager : Notification suscription and persistece of conversations


// After detecting a dropped conversation, check partial survey and POST to service
function updateSatisfactionSurvey( attributes )	{
	 var data = attributes;
	 var url = urlESB;
	 $.post(url,{ body: data }, function(response) {
				data = response;
				console.log('Data loaded:' + data);
				alert("updateSatisfactionSurvey : OK! , loaded:" + data);
	 }).fail(function() {
				alert("updateSatisfactionSurvey : Sorry could not proceed.");
	 });
	 return data;
}

// Custom function : setup + Login + persistent token
function setupNotifications(clientHostname) {
	console.log('setupNotifications');

	// Split redirect Uri
	const redirectUri = setupClientAndTokenUri();
	// Authenticate with PureCloud
	console.log('Login implicit grant w/redirectUri:', redirectUri);
	client.loginImplicitGrant(clientId, redirectUri )
		.then(() => {
			console.log('Logged in');
			// Get authenticated user's info
			return usersApi.getUsersMe();
		})
		.then((userMe) => {
			/*
 			* usersMe type : { id name, division, department, email, state: "active", username, … } 
 			*
 			*/
			console.log('userMe: ', userMe);
			me = userMe;

			// Save token
			console.log('authData token: ', usersApi.apiClient.authData.accessToken );
			const token = usersApi.apiClient.authData.accessToken;
			localStorage.setItem('myApiClient.authData.token', token );

			// Get hostname by param (via IP as 'X-fowarded-for')
			var hostname = clientHostname;
			console.log('hostname: ', clientHostname);
			// Get station id from hostname
			var opts = {
			  'pageSize': 25, // Number | Page size
			  'pageNumber': 1, // Number | Page number
			  'sortBy': "name", // String | Sort by
			  'name': hostname , // String | Name = hostname
			};

			// Get stationId from hostname (options as parameter)
			console.log('options to search: ', opts);
			return stationsApi.getStations(opts);

		})
		.then((station) => {
			console.log(`getStations success! station: ${JSON.stringify(station, null, 2)}`);
			 console.log('My user (me): ', me);

			/* StationEntityListing return type:
			 * "entities": [ {"id","name","status","userId","type","lineAppearanceId","selfUri" } ]
			 */
			if( station.total === 1) {
				// Set association user with station
				let stationId = station.entities[0].id;
				let stationStatus = station.entities[0].status;
				if( stationStatus === 'AVAILABLE' ) {
					console.log(`user + station : ` , me.id + ', ' +  stationId);
					// return type : void (no response body)
			  		return usersApi.putUserStationAssociatedstationStationId(me.id, stationId);
				} else {
					return null;
				}
			}
		})
	  .then(function() {
	    console.log('User´s station association returned successfully!');

			// Create notification channel
			return notificationsApi.postNotificationsChannels();
		})
		.then((channel) => {
			console.log('Notification channel created!: ', channel);
			notificationChannel = channel;

			// Set up web socket
			webSocket = new WebSocket(notificationChannel.connectUri);
			webSocket.onmessage = handleNotification;

			// Subscribe to authenticated user's presence
			userConversationsTopic = `v2.users.${me.id}.conversations`;
			const body = [ { id: userConversationsTopic } ];
			return notificationsApi.putNotificationsChannelSubscriptions(notificationChannel.id, body);
		})
		.then((topicSubscriptions) => {
			console.log('topicSubscriptions is: ', topicSubscriptions);
		})
		.catch((err) => console.error(err));

	console.log('Finish (setup)');
}

// Handle incoming PureCloud notification from WebSocket
function handleNotification(message) {
	// Parse notification string to a JSON object
	const notification = JSON.parse(message.data);
	console.log('handleNotification: ', notification);

	// Discard unwanted notifications
	if (notification.topicName.toLowerCase() === 'channel.metadata') {
		// Heartbeat
		console.info('Ignoring metadata: ', notification);
		return;
	} else if (notification.topicName.toLowerCase() !== userConversationsTopic.toLowerCase()) {
		// Unexpected topic
		console.warn('Unknown notification: ', notification);
		return;
	} else {
		console.info('Conversations notification: ', notification);
	}

	// Update conversation in list, or remove it if disconnected
	if ( isConversationDisconnected(notification.eventBody) ) {
		console.info('Disconnected! Delete this: ', notification.eventBody.id );
		delete conversationList[notification.eventBody.id];
	}
	// Update conversation in list, or remove it if dropped
	else if ( isConversationDropped(notification.eventBody) ) {
		console.info('Dropped! Delete this: ', notification.eventBody.id );
		delete conversationList[notification.eventBody.id];
	}
	else {
		console.info('Conversation Id: ', notification.eventBody.id );
		console.info('Body: ', notification.eventBody );
		conversationList[notification.eventBody.id] = notification.eventBody;
	}
	// set local storage to persist list, in case of reload of page
	localStorage.setItem('conversationList', JSON.stringify(conversationList));
	//
	console.info('List: ', conversationList );
	// Update document message for informational purpose
	$('#messages').text( '>' + JSON.stringify(conversationList) );
}
// Determines if a conversation is disconnected by checking to see if all participants are disconnected
function isConversationDisconnected(conversation) {
	let isConnected = false;
	console.info('IsConversationDisconnected?');
	conversation.participants.some((participant) => {
		if (participant.state !== 'disconnected' && participant.state !== 'terminated') {
			isConnected = true;
			return !isConnected;
		}
	});

	return !isConnected;
}

// Determines if a conversation has been dropped by checking its state
function isConversationDropped(conversation) {
	let isDropped = false;
	// Participant : "id", "address", "startTime", "connectedTime", "endTime", "state": "disconnected", 
	// "direction": "disconnectType", "held", "user", "queue", "attributes","recordingState": "none",
	//		 "purpose": "user", ...
	console.info('IsConversationDropped?');

	// state: "none", "held", "connected", ...
	if( conversation.state === 'disconnected' || conversation.state === 'terminated') {
		console.info('Disconnected/Terminated state: ', conversation.state);
		isDropped = true;
		return (true);
	}
	// Participant : "id", "address", "startTime", "connectedTime", "endTime", "state": "disconnected", 
	// "direction": "disconnectType", "held", "user", "queue", "attributes","recordingState": "none",
	//		 "purpose": "user", ...
	// Participant.purpose: "agent"
	if ( typeof conversation.participants === 'undefined' ) {
		return (false);
	}

	conversation.participants.some((participant) => {
			console.info('Participant: ', participant.id );
			if (participant.purpose === 'agent' || participant.purpose === 'external') {
				console.info('Purpose:', participant.purpose );
				if ( typeof participant.calls  === 'undefined' ) {
					console.info('<no calls>');
			        } else {
					participant.calls.some((call) => {
						console.info('<call.id>:', call.id );
						// Drop event notification!
						if (call.state === 'disconnected' || call.state === 'terminated') {
							console.info('Disconnect type: ', call.disconnectType);
							isDropped = true;
							return (isDropped);
						}
					})
				}
			}
		});
	return (isDropped);
}
