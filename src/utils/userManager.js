import { createUserManager } from 'redux-oidc';

const userManagerConfig = {
  title: 'Test client',
  authority: 'https://aai-dev.egi.eu/oidc',
  client_id: 'b224ccac-9beb-41ce-a702-4b7f1cc5eefc',
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  response_type: 'token id_token',
  scope: 'openid profile',
  filterProtocolClaims: false,
  debug: true
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
