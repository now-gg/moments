// const CLIENT_ID_PER = "826959163585-nkv5q8jue8d4c3ck4a1buh8d1l3op7b8.apps.googleusercontent.com"
const CLIENT_ID_DEV = "631912626478-do5ioe4vdv8pibdftq7416iia764fnth.apps.googleusercontent.com"
const REDIRECT_URI = "https://stagingngg.net/video/edit"
const CLIENT_ID = CLIENT_ID_DEV;
// Create form to request access token from Google's OAuth 2.0 server.
export function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  const form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  const params = {
    'client_id': CLIENT_ID,
    'redirect_uri': REDIRECT_URI,
    'response_type': 'token',
    'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
    'include_granted_scopes': 'true',
    'state': 'pass-through value'
  };

  // Add form parameters as hidden input values.
  for (const p in params) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p as keyof typeof params]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}