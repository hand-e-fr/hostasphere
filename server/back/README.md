# ![hostasphere](https://avatars.githubusercontent.com/u/164780978?s=30 "logo") hand-e.fr

## Hostasphere


## Endpoints

### 1. Register User

**Endpoint**: `/register`

**Method**: `POST`

**Description**: Register a new user.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Responses:**

201 Created: User registered successfully.
```json
{
  "message": "User registered successfully"
}
```

400 Bad Request: Invalid input data.
```json
{
  "error": "Error message"
}
```

500 Internal Server Error: Server error.
```json
{
  "error": "Internal server error"
}
```

### 2. Login User
**Endpoint**: /login

**Method**: POST

**Description**: Authenticate a user and return a JWT token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Responses:

200 OK: Login successful.
```json
{
  "token": "jwt_token_here"
}
```

400 Bad Request: Invalid input data.
```json
{
  "error": "Error message"
}
```

401 Unauthorized: Invalid credentials.
```json
{
  "error": "Invalid credentials"
}
```

500 Internal Server Error: Server error.
```json
{
  "error": "Internal server error"
}
```

### 3. Get User Profile
**Endpoint**: /user/profile

**Method**: GET

**Description**: Retrieve the profile of the authenticated user.

**Headers:**

Authorization: Bearer token
Responses:

200 OK: Profile retrieved successfully.
```json
{
  "email": "user@example.com"
}
```

401 Unauthorized: Invalid or missing token.
```json
{
  "error": "Authorization header is required"
}
```


500 Internal Server Error: Server error.
```json
{
  "error": "Internal server error"
}
```

Authentication
All protected endpoints require a valid JWT token to be passed in the Authorization header as a Bearer token.

Example:

Authorization: Bearer jwt_token_here
Error Handling
Errors are returned in JSON format with an appropriate HTTP status code and an error message.