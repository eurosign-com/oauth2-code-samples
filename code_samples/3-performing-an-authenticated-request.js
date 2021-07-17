/**
 * This sample file is intended to help you perform your first request to the Eurosign API with an access token to
 * authenticate your users.
 */

// Required if you want to use Javascript's fetch and formData with NodeJS (see package.json)
const fetch = require('node-fetch');
// End of NodeJS requirements

/**
 * Retrieves the information of the user authenticated by the access token
 * @param accessToken
 * @return {Promise<Object>}
 */
async function getCurrentUser(accessToken) {
    const eurosignResponse = await fetch('https://api.eurosign.com/v2/current-user', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const responseJson = await eurosignResponse.json();

    if (!eurosignResponse.ok) {
        // If Eurosign responded with an error (usually due to a bad access token or, for some endpoints, bad parameters)
        // responseJson.name contains the error name
        // responseJson.message contains a detailed error message
        // eurosignResponse.status and responseJson.status contain the HTTP status code
        throw new Error(responseJson.message);
    }

    return responseJson;
}

// To obtain an access token for your users, see 1-obtaining-an-access-token.js
const accessToken = 'ACCESS_TOKEN';

(async function () {
    const currentUser = await getCurrentUser(accessToken);

    console.log(currentUser); // Something like:
    // {
    //     uuid: '123456789abcdef123456789abcdef12',
    //     email: 'john.doe@example.com',
    //     emailIsValidated: true,
    //     registerDate: '2021-07-16 15:09:36',
    //     firstname: 'John',
    //     lastname: 'Doe',
    //     language: 'fr-FR',
    //     isActive: true,
    // }
})();
