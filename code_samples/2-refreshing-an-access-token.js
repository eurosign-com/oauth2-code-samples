/**
 * This sample file is intended to help you understand how to get an access token (and a new refresh token) from a
 * previously saved refresh token.
 * The refresh token is a one-time use token: when a new access token is issued from a refresh token, this refresh token
 * is deactivated, and you will have to use the new refresh token to get an access token again.
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
 * Gets an access token from a refresh token
 * @param clientId - Your application's ID ('Client ID')
 * @param clientSecret - Your applications's secret ('Client Secret')
 * @param refreshToken - The refresh token, provided earlier when you performed the request to get the access token (see
 * 1-obtaining-an-access-token.js)
 * @return {Promise<AccessTokenResponse>}
 */
async function refreshAccessToken(clientId, clientSecret, refreshToken) {
    const data = new FormData();
    data.append('grant_type', 'refresh_token');
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    data.append('refresh_token', refreshToken);

    // Perform a POST request to Eurosign with the required parameters
    const eurosignResponse = await fetch('https://app.eurosign.com/oauth/token', {
        method: 'POST',
        body: data,
    });

    const responseJson = await eurosignResponse.json();

    if (!eurosignResponse.ok) {
        // If Eurosign responded with an error (usually due to a bad refresh token or bad client credentials)
        // responseJson.error contains the error code
        // responseJson.error_description contains a detailed error message
        throw new Error(responseJson.error_description);
    }

    return responseJson;
}

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
// You should have saved this refresh token when you got the first access token for this user (see 1-obtaining-an-access-token.js)
const refreshToken = 'REFRESH_TOKEN';

(async function () {
    const accessTokenResponse = await refreshAccessToken(clientId, clientSecret, refreshToken);

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
    console.log(accessTokenResponse.refresh_token); // A new refresh token that you can use to refresh the access token later
})();
