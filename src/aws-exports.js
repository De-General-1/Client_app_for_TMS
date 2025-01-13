const awsconfig = {
  Auth: {
    region: "your-cognito-region", // e.g. 'us-east-1'
    userPoolId: "your-user-pool-id",
    userPoolWebClientId: "your-user-pool-client-id",
    identityPoolId: "your-identity-pool-id", // Optional, if using Identity Pools
  },
  API: {
    endpoints: [
      {
        name: "your-api-name",
        endpoint: "your-api-endpoint",
      },
    ],
  },
};

export default awsconfig;
