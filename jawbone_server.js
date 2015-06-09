var Future = Npm.require('fibers/future');
var request = Npm.require('request')


Jawbone = {};

OAuth.registerService('jawbone', 2, null, function(query, callback) {

  var response = getTokenResponse(query);
  var accessToken = response.access_token;
  var userData = getUserDate(accessToken);

  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expires_in),
    refreshToken: response.refresh_token,
    id: userData.xid
  };


  // include all fields from jawbone
  // https://jawbone.com/up/developer/endpoints/user
  var whitelisted = ['xid', 'first', 'last', 'image', 'weight', 'height'];

  var fields = _.pick(userData, whitelisted);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {profile: {name: userData.first + ' ' + userData.last }}
  };
});

var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

// returns an object containing:
// - access_token
// - expires_in: lifetime of token in seconds
// - refresh_token
var getTokenResponse = function (query) {

  var config = ServiceConfiguration.configurations.findOne({service: 'jawbone'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var request_params = {
    grant_type: "authorization_code",
    code: query.code,
    client_id: config.client_id,
    client_secret: OAuth.openSecret(config.secret),
    redirect_uri: OAuth._redirectUri('jawbone', config)
  };
  var paramlist = [];
  for (var pk in request_params) {
    paramlist.push(pk + "=" + request_params[pk]);
  };
  var body_string = paramlist.join("&");

  var request_details = {
    method: "POST",
    headers: {'User-Agent': userAgent, 'content-type' : 'application/x-www-form-urlencoded'},
    uri: 'https://jawbone.com/auth/oauth2/token',
    body: body_string
  };

  var fut = new Future();
  request(request_details, function(error, response, body) {
     var responseContent;
    try {
      responseContent = JSON.parse(body);
    } catch(e) {
      error = new Meteor.Error(204, 'Response is not a valid JSON string.');
      fut.throw(error);
    } finally {
      fut.return(responseContent);
    }
  });
  var res = fut.wait();
  return res;
};


// returns user object
var getUserDate = function (accessToken) {

  var fut = new Future();
  var request_user = {
    method: 'GET',
    headers: {'User-Agent': userAgent,  'Content-Type': 'application/json',
              'Authorization' : 'Bearer ' + accessToken},
    uri: "https://jawbone.com/nudge/api/v.1.1/users/@me"
  };

  request(request_user, function(error, response, body) {
    var responseContent;
    try {
      responseContent = JSON.parse(body);
    } catch(e) {
      error = new Meteor.Error(204, 'Response is not a valid JSON string.');
      fut.throw(error);
    } finally {
      fut.return(responseContent);
    }
  });
  var userRes = fut.wait();
  return userRes.data;
};

Jawbone.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
