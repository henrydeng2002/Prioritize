import { Credentials } from "@aws-sdk/types";
import {
    SignUpCommand,
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    AuthFlowType
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoIdentityClient, GetCredentialsForIdentityCommand, GetIdCommand } from "@aws-sdk/client-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { ReadableStream } from 'web-streams-polyfill';
globalThis.ReadableStream = ReadableStream;
const path = require('path');

// AWS configuration options
const options = {
    cognitoRegion: "us-east-2",
    dynamoDBRegion: "us-east-2",
    successActionStatus: 201,
    clientId: "2jcbetorgrgqu5h1f13umlsms5",
    userPoolId: "us-east-2_5RXDGyG2c"
}

let credentials: Credentials = {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: ''
}

var tokens = {
    AccessToken: '',
    IdToken: '',
    RefreshToken: ''
}

// TODO: write signout function
// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GlobalSignOut.html
const AWSHelper = {

    // signup function
    // returns boolean value based on if signup was successful
    signUp: async function ({ username, password, email }) {
        const client = new CognitoIdentityProviderClient({ region: options.cognitoRegion });

        const command = new SignUpCommand({
            ClientId: options.clientId,
            Username: username,
            Password: password,
            UserAttributes: [{ Name: "email", Value: email }],
        });

        // TODO: check exception type
        // https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html
        var response = await client.send(command).catch(
            (error) => { console.log(error); return false; }
        );
        return true;
    },

    // email signup confirmation
    confirmSignUp: async function ({ username, code }) {
        const client = new CognitoIdentityProviderClient({ region: options.cognitoRegion });

        const command = new ConfirmSignUpCommand({
            ClientId: options.clientId,
            Username: username,
            ConfirmationCode: code,
        });

        var response = await client.send(command).catch(
            (error) => { console.log(error); return false; }
        );
        return true;
    },

    // async signin function
    // returns true if signin is successful
    // TODO: update error handling
    signIn: async function ({ username, password }) {
        const client = new CognitoIdentityProviderClient({region: options.cognitoRegion});

        // initiates an auth command to the cognito identity provider client
        // uses the user provided username and password
        const command = new InitiateAuthCommand({
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
            ClientId: options.clientId,
        });
        // gets response and stores the tokens locally
        var response = await client.send(command).catch(
            (error) => { console.log(error); return false; }
            );
        tokens.AccessToken = response.AuthenticationResult.AccessToken;
        tokens.IdToken = response.AuthenticationResult.IdToken;
        tokens.RefreshToken = response.AuthenticationResult.RefreshToken;

        console.log(tokens);

        const client2 = new CognitoIdentityClient({region: options.cognitoRegion});
        // gets identityID of the user from the identity pool and stores it locally
        const idcommand = new GetIdCommand({
            IdentityPoolId: 'us-east-2:30fbd1c1-10d5-4a22-bd12-33a47ecc92b4',
            Logins: {
                "cognito-idp.us-east-2.amazonaws.com/us-east-2_5RXDGyG2c": tokens.IdToken
            }
        });
        var response2 = await client2.send(idcommand).catch(
            (error) => { console.log(error); return false; }
            );
        // console.log(response2);

        // gets the access keys from the identity pool using the identity id
        const idcommand2 = new GetCredentialsForIdentityCommand({
            IdentityId: response2.IdentityId,
            Logins: {
                "cognito-idp.us-east-2.amazonaws.com/us-east-2_5RXDGyG2c": tokens.IdToken
            }
        });
        var response3 = await client2.send(idcommand2).catch(
            (error) => { console.log(error); return false; }
            );
        // stores response locally
        // is this a good idea? probably not
        // does it work? yes
        // will i change it? maybe later
        credentials.accessKeyId = response3.Credentials.AccessKeyId;
        credentials.secretAccessKey = response3.Credentials.SecretKey;
        credentials.sessionToken = response3.Credentials.SessionToken;
        
        // return success
        return true;
    }
}

export default AWSHelper; 