module.exports = {
  Success: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400, // use it when client-side input fails validation
  UnAuthorized: 401, //  use it when user is unauthenticated
  Forbidden: 403, //  use it when user is authenticated, but it’s not allowed to access a resource
  ServerError: 500,
  ServiceUnavailable: 503, // use it when something unexpected happened on server
};
