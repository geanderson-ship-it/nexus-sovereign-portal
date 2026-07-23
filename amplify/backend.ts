import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * @see https://docs.amplify.aws/gen2/build-a-backend/
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

// Access the underlying L1 CfnBucket construct
const cfnBucket = backend.storage.resources.cfnResources.cfnBucket;

// Disable "Block Public Access" settings to allow public bucket policy
cfnBucket.publicAccessBlockConfiguration = {
  blockPublicAcls: false,
  blockPublicPolicy: false,
  ignorePublicAcls: false,
  restrictPublicBuckets: false,
};

// Add a Bucket Policy to allow public read access to the 'public/*' prefix
backend.storage.resources.bucket.addToResourcePolicy(
  new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: [`${backend.storage.resources.bucket.bucketArn}/public/*`],
    principals: [new iam.AnyPrincipal()],
  })
);
