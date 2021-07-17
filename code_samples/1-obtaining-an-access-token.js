/**
 * This sample file is intended to help you understand how to get an access token (and a refresh token) for your users.
 * The access token is valid for one hour and allows you to perform actions on behalf the user through the Eurosign API.
 */

// Required if you want to use Javascript's fetch and formData with NodeJS (see package.json)
const fetch = require('node-fetch');
const FormData = require('form-data');
// End of NodeJS requirements

/**
 * @typedef {Object} AccessTokenResponse
 * @property {string} access_token - The access token, which must be used to perform API requests in the name of the user
 * @property {int} expires_in - The number of seconds before the access token expires
 * @property {string} token_type - The token type (Eurosign uses 'Bearer' tokens, so this property is always 'Bearer')
 * @property {string} scope - The access token scope, space-separated
 * @property {string} refresh_token - The refresh token, which has a longer lifetime than the access token, and can be
 * used to obtain a new access token without requiring the user to go through the authorization process again
 */

/**
 * Gets an access token from an authorization code
 * @param clientId - Your application's ID ('Client ID')
 * @param clientSecret - Your applications's secret ('Client Secret')
 * @param userAuthorizationCode - The user's authorization code, provided to your redirect URI after the user has
 * authorized your application to access their account
 * @return {Promise<AccessTokenResponse>}
 */
async function obtainAccessToken(clientId, clientSecret, userAuthorizationCode) {
    const data = new FormData();
    data.append('grant_type', 'authorization_code');
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    data.append('code', userAuthorizationCode);

    // Perform a POST request to Eurosign with the required parameters
    const eurosignResponse = await fetch('https://app.eurosign.com/oauth/token', {
        method: 'POST',
        body: data,
    });

    const responseJson = await eurosignResponse.json();

    if (!eurosignResponse.ok) {
        // If Eurosign responded with an error (usually due to a bad authorization code or bad client credentials)
        // responseJson.error contains the error code
        // responseJson.error_description contains a detailed error message
        throw new Error(responseJson.error_description);
    }

    return responseJson;
}

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
// The authorization code is provided to your redirect URI after the user has authorized your application to access
// their account, as: http://www.your/redirect/uri?code=THE_AUTHORIZATION_CODE
const authorizationCode = 'YOUR_USER_AUTHORIZATION_CODE';

(async function () {
    const accessTokenResponse = await obtainAccessToken(clientId, clientSecret, authorizationCode);

    console.log(accessTokenResponse); // Something like:
    // {
    //     access_token: '123456789abcdef123456789abcdef123456789a',
    //     expires_in: 3600,
    //     token_type: 'Bearer',
    //     scope: 'signature_request.read signature_request.write signature_request.send',
    //     refresh_token: 'abcdef123456789abcdef123456789abcdef1234'
    // }

    console.log(accessTokenResponse.access_token); // The access token
    console.log(accessTokenResponse.expires_in); // The number of seconds before the access token expires
    console.log(accessTokenResponse.token_type); // Always 'Bearer'
    console.log(accessTokenResponse.refresh_token); // The refresh token (see 2-refreshing-an-access-token.js)
})();
