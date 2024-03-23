import { Credentials } from "@aws-sdk/types";
import {
    SignUpCommand,
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    AuthFlowType,
    GetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoIdentityClient, GetCredentialsForIdentityCommand, GetIdCommand } from "@aws-sdk/client-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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

var userAttributes = {
    sub: ''
}

var taskCategories = []

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
        const client = new CognitoIdentityProviderClient({ region: options.cognitoRegion });

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

        const getUserCommand = new GetUserCommand({
            AccessToken: tokens.AccessToken
        })


        var userInfo = await client.send(getUserCommand).catch(
            (error) => { console.log(error); return false; }
        );

        var attributes = userInfo.UserAttributes;
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i].Name === "sub") {
                userAttributes.sub = attributes[i].Value;
            }
        }

        const client2 = new CognitoIdentityClient({ region: options.cognitoRegion });
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
        credentials.accessKeyId = response3.Credentials.AccessKeyId;
        credentials.secretAccessKey = response3.Credentials.SecretKey;
        credentials.sessionToken = response3.Credentials.SessionToken;

        const dynamoDBClient = new DynamoDBClient({
            region: options.dynamoDBRegion,
            credentials: credentials
        })
        const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

        var cats = await docClient.send(new GetCommand({
            TableName: 'taskCategories',
            Key: {
                'userID': userAttributes.sub
            }
        })).catch((error) => { console.log(error); return false; });

        if (cats.Item == undefined) {
            taskCategories = ["Home", "Work"];
            await docClient.send(new PutCommand({
                TableName: 'taskCategories',
                Item: {
                    'userID': userAttributes.sub,
                    'categories': taskCategories
                }
            }))
        } else {
            taskCategories = cats.Item.categories;
        }

        // return success
        return true;
    },

    createCategory: async function (category) {
        const dynamoDBClient = new DynamoDBClient({
            region: options.dynamoDBRegion,
            credentials: credentials
        })
        const docClient = DynamoDBDocumentClient.from(dynamoDBClient);



        if (!taskCategories.includes(category)) {
            taskCategories.push(category)
            await docClient.send(
                new PutCommand({
                    TableName: 'taskCategories',
                    Item: {
                        'userID': userAttributes.sub,
                        'categories': taskCategories,
                    }
                })
            ).catch((error) => { console.log(error); return false; });
        }
    },

    createTask: async function ({ dateTime, category, title, description, time }) {
        const dynamoDBClient = new DynamoDBClient({
            region: options.dynamoDBRegion,
            credentials: credentials
        })
        const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

        var eventID = "" + title + Date().toString();
        console.log(eventID);
        var timeNeeded = 0;
        timeNeeded += (parseInt(time.hours) * 4)
        timeNeeded += (parseInt(time.minutes) / 15)
        await docClient.send(new PutCommand({
            TableName: 'tasks',
            Item: {
                'userID': userAttributes.sub,
                'eventID': eventID,
                'dateTime': dateTime,
                'category': category,
                'title': title,
                'description': description,
                'timeNeeded': timeNeeded
            }
        })).catch((error) => { console.log(error); return false; });

        var currUserTasks = await docClient.send(new GetCommand({
            TableName: 'userTasks',
            Key: {
                'userID': userAttributes.sub
            }
        }))

        var tasks = []
        if (currUserTasks.Item != null) {
            tasks = currUserTasks.Item.taskIDs;
            tasks.push(eventID);
        } else {
            tasks = [eventID];
        }

        await docClient.send(new PutCommand({
            TableName: 'userTasks',
            Item: {
                'userID': userAttributes.sub,
                'taskIDs': tasks
            }
        })).catch((error) => { console.log(error); return false; });
    },

    getTaskCategories: function () {
        return taskCategories;
    },

    getTasks: async function () {
        const dynamoDBClient = new DynamoDBClient({
            region: options.dynamoDBRegion,
            credentials: credentials
        })
        const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

        var tasks = await docClient.send(new GetCommand({
            TableName: 'userTasks',
            Key: {
                'userID': userAttributes.sub
            }
        }))

        var taskIDs = []
        if (tasks.Item != null) {
            taskIDs = tasks.Item.taskIDs;
        } else {
            return null;
        }

        console.log(taskIDs);

        var tasks = [];
        for (var i = 0; i < taskIDs.length; i++) {
            var response = await docClient.send(new GetCommand({
                TableName: 'tasks',
                Key: {
                    'userID': userAttributes.sub,
                    'eventID': taskIDs[i]
                }
            }))

            var timeNeededString = "";
            var hr = (parseInt(response.Item.timeNeeded) - (parseInt(response.Item.timeNeeded) % 4)) / 4
            var min = (parseInt(response.Item.timeNeeded) % 4) * 15
            timeNeededString += hr + " hrs " + min + " mins";

            var dateTimeString = new Date(response.Item.dateTime).toString();

            var task = {
                eventID: response.Item.eventID,
                category: response.Item.category,
                dateTime: response.Item.dateTime,
                description: response.Item.description,
                timeNeeded: response.Item.timeNeeded,
                timeNeededString: timeNeededString,
                title: response.Item.title,
                dateTimeString: dateTimeString
            }
            tasks.push(task)
        }

        tasks.sort(compareDate);
        return tasks;
    },

    updateDue: async function (eventID, due) {
        const dynamoDBClient = new DynamoDBClient({
            region: options.dynamoDBRegion,
            credentials: credentials
        })
        const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
        await docClient.send(new UpdateCommand({
            TableName: "tasks",
            Key: {
                'userID': userAttributes.sub,
                'eventID': eventID,
            },
            UpdateExpression: "set dateTime = :dateTime",
            ExpressionAttributeValues: {
                ":dateTime": due,
            },
        }))
    },

    updateTimeNeeded: async function (eventID, time) {
        const dynamoDBClient = new DynamoDBClient({
            region: options.dynamoDBRegion,
            credentials: credentials
        })
        const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
        var timeNeeded = 0;
        timeNeeded += (parseInt(time.hours) * 4)
        timeNeeded += (parseInt(time.minutes) / 15)
        console.log(eventID);
        await docClient.send(new UpdateCommand({
            TableName: "tasks",
            Key: {
                'userID': userAttributes.sub,
                'eventID': eventID,
            },
            UpdateExpression: "set timeNeeded = :timeNeeded",
            ExpressionAttributeValues: {
                ":timeNeeded": timeNeeded,
            },
        }))
    }
}

function compareDate(a, b) {
    var x = new Date(a.dateTime);
    var y = new Date(b.dateTime);
    if (x < y) {
        return -1;
    } else if (x > y) {
        return 1;
    } else {
        return 0;
    }
}

export default AWSHelper; 