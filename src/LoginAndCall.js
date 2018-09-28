/* PURECLOUD CALL: local Handlebars */

// Custom function : CALL a phone number
function Call(phoneNumber, locationFrom) {
	console.log('Call: Start');

	if(typeof phoneNumber !== 'string') {
		console.log('Parameter is not a string');
		return;
	}
	if(typeof locationFrom !== 'string') {
		console.log('Parameter is not a string');
		return;
	}
	console.log('phoneNumber: ', phoneNumber );
	console.log('locationFrom: ', locationFrom );

  // Split redirect Uri
	const redirectUri = locationFrom;  // window.location.href or parameter of the caller
	const splitRedirectUri = setupClientAndTokenUri();

	// Authenticate with PureCloud
	console.log('Login implicit grant w/redirectUri:', splitRedirectUri + ' (' + redirectUri + ')');
	client.loginImplicitGrant(clientId, splitRedirectUri )
		.then(() => {
			console.log('Logged in!');

			console.log('usersApi: ', usersApi);
			console.log('usersApi client: ', usersApi.apiClient);

			// Get authenticated user's info
			let me = usersApi.getUsersMe();
			console.log('me: ', me);

			usersApi.apiClient.redirectUri = locationFrom;
			console.log('redirectUrl reset to: ', usersApi.apiClient.redirectUri );

			console.log('token: ', usersApi.apiClient.authData.accessToken );
			const token = usersApi.apiClient.authData.accessToken;

			return me;
		})
		.then((userMe) => {
			console.log('userMe: ', userMe);

			// Create request body
			let body = {
				'phoneNumber': phoneNumber
			};

			// Invoke API
			conversationsApi.postConversationsCalls(body)
			.then(() => {
				console.log('Llamada colocada ok');
			})
			.catch((err) => console.error(err));

		})
		.catch((err) => console.error(err));

	console.log('Finish');
}
