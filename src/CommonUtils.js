// Purecloud Remote Manager : COMMON UTILS

function setupClientAndTokenUri() {
	// Set PureCloud settings
	console.log('Client, mypurecloud.com');
	client.setEnvironment('mypurecloud.com');
	client.setPersistSettings(true, 'purecloud_app');
	client.setDebugLog(console.log, 25);

	// Previous token?
 	const token = localStorage.getItem('myApiClient.authData.token');
	console.log('myApiClient.authData.token: ', token );
	if( typeof token !== 'undefined' && token != null) {
		console.log('Login with token');
		console.log('myApiClient.authData.token: ', token );
		client.setAccessToken(token);
	};

	const redirectUri = window.location.href;
	console.log('redirectUri: ', redirectUri );
	const splitRedirectUri = redirectUri.split('?', 2);
	console.log('split redirectUri: ', splitRedirectUri[0] + ', ' + splitRedirectUri[1]);
	console.log('DOM properties: ', window.location);

	const splitRedirectUriZero = splitRedirectUri[0];
	console.log('returned split redirect Uri: ', splitRedirectUriZero );

	// return base redirect Uri
	return (splitRedirectUriZero);
}
