import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
  Nexus Data Schema
  Unifying data from Firestore to DynamoDB via AppSync.
*/
const schema = a.schema({
  UserProfile: a
    .model({
      id: a.string().required(),
      displayName: a.string(),
      email: a.string().required(),
      avatarUrl: a.string(),
      preferences: a.json(),
    })
    .authorization((allow) => [allow.owner()]),

  Conversation: a
    .model({
      userId: a.string().required(),
      modelId: a.string().required(), // Magadot, Orion, etc.
      messages: a.json().required(), // Storing as JSON for flexibility, similar to Firestore
      metadata: a.json(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
