// Purecloud Remote Manager : CHECK FLOW-ID BY NAME

// Custom function : Login + Check agent presence by email
function flowIdByName(name, type){
        console.log('flowIdByName');

        if(typeof name !== 'string') {
      		console.log('Parameter #1 is not a string');
      		return;
      	}
        if(typeof type !== 'string') {
      		console.log('Parameter #1 is not a string');
      		return;
      	}

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
                */
                console.log('userMe: ', userMe);
                me = userMe;

                // Save token
                console.log('authData token: ', usersApi.apiClient.authData.accessToken );
                const token = usersApi.apiClient.authData.accessToken;
                localStorage.setItem('myApiClient.authData.token', token );

                var apiInstance = new platformClient.ArchitectApi();

                // inboundcall, inboundemail, inboundshortmessage, outboundcall, inqueuecall, speech, securecall, surveyinvite, workflow
                var flowType = type; // String | Type

                var opts = {
                  'pageNumber': 1, // Number | Page number
                  'pageSize': 25, // Number | Page size
                  'sortBy': "id", // String | Sort by
                  'sortOrder': "asc", // String | Sort order
                  'name': name, // String | Name
                  'deleted': false, // Boolean | Include deleted
                  'includeSchemas': false, // Boolean | Include variable schemas
                };
                apiInstance.getFlows(type, opts)
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
}
//-------------------------------------------------------------------------------
