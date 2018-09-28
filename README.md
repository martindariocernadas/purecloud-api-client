Online Documentation for every SDK of PureCloud API Client
----------------------------------------------------------

https://developer.mypurecloud.com/api/rest/client-libraries/


Java Script specific documentarion
----------------------------------

https://developer.mypurecloud.com/api/rest/client-libraries/javascript/


Client-side usage
-----------------

Reference the SDK in your HTML document. For convenience, all modules are bundled together.

<!-- Include the full library -->
<script src="https://sdk-cdn.mypurecloud.com/javascript/30.0.0/purecloud-platform-client-v2.min.js"></script>


API Classes List
----------------


    AlertingApi
    AnalyticsApi
    ArchitectApi
    AttributesApi
    AuthorizationApi
    BillingApi
    ContentManagementApi
    ConversationsApi
    ExternalContactsApi
    FaxApi
    GeneralDataProtectionRegulationApi
    GeolocationApi
    GreetingsApi
    GroupsApi
    IdentityProviderApi
    IntegrationsApi
    LanguagesApi
    LicenseApi
    LocationsApi
    MobileDevicesApi
    NotificationsApi
    OAuthApi
    OrganizationApi
    OrganizationAuthorizationApi
    OutboundApi
    PresenceApi
    QualityApi
    RecordingApi
    ResponseManagementApi
    RoutingApi
    ScriptsApi
    SearchApi
    StationsApi
    SuggestApi
    TelephonyProvidersEdgeApi
    TokensApi
    UserRecordingsApi
    UsersApi
    UtilitiesApi
    VoicemailApi
    WebChatApi
    WorkforceManagementApi



Source code:
------------
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="  crossorigin="anonymous"></script>
<script src="https://sdk-cdn.mypurecloud.com/javascript/30.0.0/purecloud-platform-client-v2.min.js"></script>


Query Search API example:
------------------------

Search all secure flows:   GET/api/v2/flows?type=securecall
Search one specific flow by name: GET /api/v2/flows?type=securecall&name=Identification
IMPORTANT: DO NOT USE SPACES IN NAME or just replace by %20.


{
  "entities": [
    {
      "id": "70e58192-6719-4342-b557-ba333f5bb570",
      "name": "Identifiation",
      "description": "Identifiation",
      "type": "SECURECALL",
      "lockedUser": {
        "id": "...",
        "name": "...",
        "selfUri": "..."
      },
      "active": true,
      "system": false,
      "deleted": false,
      "publishedVersion": {
        ...
      },
      "currentOperation": {
        "id": "...",
        "complete": true,
        "user": {
        },
        "errorDetails": [],
        "actionName": "VALIDATE",
        "actionStatus": "SUCCESS"
      },
      "selfUri": "/api/v2/flows/70e58192-6719-4342-b557-ba333f5bb570"
    }
  ],
  "pageSize": 25,
  "pageNumber": 1,
  "total": 1,
  "selfUri": "/api/v2/flows?pageSize=25&pageNumber=1",
  "firstUri": "/api/v2/flows?pageSize=25&pageNumber=1",
  "lastUri": "/api/v2/flows?pageSize=25&pageNumber=1",
  "pageCount": 1
}



Documentation of the javascript SDK for this API:
-------------------------------------------------


https://developer.mypurecloud.com/api/rest/client-libraries/javascript/ArchitectApi.html#getFlows
