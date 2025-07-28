# Microservices_SocialMedia
 JWT Auth & Microservices Flow – Revision Points 
# 1. Token Generation (Identity Service)
After login/register, you generate:
accessToken (JWT, short-lived)
refreshToken (random hex, long-lived, saved in DB)
Created using:
js
Copy code 
jwt.sign({ userId, username }, secret, { expiresIn: "60m" });


# 2. Client Stores and Sends Tokens
Stores both tokens (usually in localStorage or cookies). 

Sends accessToken in headers:

http
Copy code
Authorization: Bearer <accessToken>


# 3. API Gateway Handles Request
Uses validateToken middleware:

Extracts token from Authorization header.

Verifies token using jwt.verify().

Attaches decoded payload to req.user:

js
Copy code
{ userId, username, iat, exp }

# 4. API Gateway Forwards to Post Service
Forwards request to internal services (e.g., post service).

Includes x-user-id in the headers:

http
Copy code
x-user-id: <userId>


# 5. Post Service Uses authenticateRequest Middleware
Reads x-user-id from headers.

Attaches it to req.user = { userId }.

Assumes the API Gateway has already authenticated the request.


# 6. Access Token Expires
When expired, client gets 401 Unauthorized.

Does not mean user is logged out — refresh token is still valid.

# 7. Client Calls /refresh Endpoint
Sends:

http
Copy code
POST /api/auth/refresh
{
  "refreshToken": "<oldRefreshToken>"
}
refreshTokenUser controller in identity-service:

Validates token from DB.
Fetches user.
Generates new access + refresh tokens.
Deletes old refresh token.
Responds with new tokens.


# 8. Client Stores New Tokens and Continues
Replaces stored tokens.
Retries the failed API call with new accessToken.
