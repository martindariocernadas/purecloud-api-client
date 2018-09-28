// Purecloud Remote Manager : CHECK AGENT BY EMAIL

// Custom function : Login + Check agent presence by email
function statusUser(email){
        console.log('statusUser');

        // API Instances of search & presence
        let APIsearch = new platformClient.SearchApi();
        let APIpresence = new platformClient.PresenceApi();

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

                var body = {
                    "pageSize": "1",
                    "pageNumber": 1,
                    "types": [
                      "users"
                    ],
                    "sortOrder": "SCORE",
                    "query": [
                      {
                        "type": "EXACT",
                        "fields": [
                          "email"
                        ],
                        "value": email,
                        "operator": "AND"
                      }
                    ]
                  };

                let opts = { 'profile': false};
                return APIsearch.postSearch(body, opts);
        })
        .then((data) => {
                  console.log('searchData: ', data);

                  let userId = data.results[0].guid;
                  APIpresence.getUserPresence(userId, 'PURECLOUD')
                          .then(function(data) {
                              let presence = data.presenceDefinition.systemPresence;
                              console.log(presence);
                              $('#messages').text('Agent is : ' + presence);
                          })
                          .catch(function(err) {
                            	console.log('There was a failure calling getUserPresence');
                            	console.error(err);
                          });
          })
          .catch((err) => console.error(err));
}


//-------------------------------------------------------------------------------
