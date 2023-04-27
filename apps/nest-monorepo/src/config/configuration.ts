export default () => ({
  cognito: {
    userPoolId: process.env.USER_POOL_ID ?? '',
    clientId: process.env.CLIENT_ID ?? '',
  },
});
