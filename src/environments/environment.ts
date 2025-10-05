// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  emailjs: {
    publicKey: 'v8NtQ6wMpSiBUzfzS',     // p.ej. 'lK5xxxxx...'
    serviceId: 'service_sc07z7g',     // p.ej. 'service_abc123'
    templateId: 'template_9xrxh4i'    // p.ej. 'template_xyz789'
  },
  auth0Domain: 'dev-7tciizrz7pk84r8q.us.auth0.com',
  auth0ClientId:  '0mGm99P2Jv3LhUKXOWPGDcYrhn3upEdg',
  auth0Audience: 'http://localhost:8080',
  auth0Scope: 'openid profile email',
  redirectUri: 'http://localhost:4200',
  apiUrl: 'http://localhost:8080'
  // redirectUri: window.location.origin
};

