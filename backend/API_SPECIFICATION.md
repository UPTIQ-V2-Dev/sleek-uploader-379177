# API Specification

## Database Models

### Prisma Schema

```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  Token           Token[]
}

model Token {
  id          Int       @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
}

model File {
  id          Int      @id @default(autoincrement())
  filename    String
  originalName String
  mimeType    String
  size        Int
  url         String
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

---

EP: POST /v1/auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Email already taken", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-27T11:30:45Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-03T10:30:45Z"}}}

---

EP: POST /v1/auth/login
DESC: Authenticate user and return tokens.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"401":"Invalid email or password", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-27T11:30:45Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-03T10:30:45Z"}}}

---

EP: POST /v1/auth/logout
DESC: Logout user and blacklist refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: 

---

EP: POST /v1/auth/refresh-tokens
DESC: Refresh authentication tokens using refresh token.
IN: body:{refreshToken:str!}
OUT: 200:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}
ERR: {"401":"Invalid or expired refresh token", "404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-27T11:30:45Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-03T10:30:45Z"}}

---

EP: POST /v1/auth/forgot-password
DESC: Send password reset email to user.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: 

---

EP: POST /v1/auth/reset-password
DESC: Reset user password using reset token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"401":"Invalid or expired reset token", "422":"Invalid password format", "500":"Internal server error"}
EX_REQ: curl -X POST "/v1/auth/reset-password?token=abc123" -H "Content-Type: application/json" -d '{"password":"newPassword123"}'
EX_RES_204: 

---

EP: POST /v1/auth/send-verification-email
DESC: Send email verification to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/send-verification-email -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: 

---

EP: POST /v1/auth/verify-email
DESC: Verify user email using verification token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"401":"Invalid or expired verification token", "500":"Internal server error"}
EX_REQ: curl -X POST "/v1/auth/verify-email?token=abc123"
EX_RES_204: 

---

EP: GET /v1/users
DESC: Get paginated list of users (admin only).
IN: headers:{Authorization:str!}, query:{name?:str, role?:str, sortBy?:str, limit?:int, page?:int}
OUT: 200:{results:arr[{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "500":"Internal server error"}
EX_REQ: curl -X GET "/v1/users?page=1&limit=10" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: POST /v1/users
DESC: Create a new user (admin only).
IN: headers:{Authorization:str!}, body:{name:str!, email:str!, password:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already taken", "401":"Unauthorized", "403":"Insufficient permissions", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-27T10:35:45Z","updatedAt":"2025-10-27T10:35:45Z"}

---

EP: GET /v1/users/:userId
DESC: Get user by ID (own data or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:30:45Z"}

---

EP: PATCH /v1/users/:userId
DESC: Update user data (own data or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{name?:str, email?:str, password?:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already taken", "401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X PATCH /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"John Smith"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Smith","role":"USER","isEmailVerified":true,"createdAt":"2025-10-27T10:30:45Z","updatedAt":"2025-10-27T10:35:45Z"}

---

EP: DELETE /v1/users/:userId
DESC: Delete user account (own data or admin access).
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{message:str}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /v1/users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"message":"User deleted successfully"}

---

EP: POST /api/upload
DESC: Upload a file to cloud storage.
IN: headers:{Authorization:str!}, body:multipart/form-data{file:file!}
OUT: 201:{success:bool, message:str, fileId:str, fileUrl:str}
ERR: {"400":"No file provided", "401":"Unauthorized", "413":"File too large", "415":"Unsupported file type", "500":"Internal server error"}
EX_REQ: curl -X POST /api/upload -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -F "file=@document.pdf"
EX_RES_201: {"success":true,"message":"File uploaded successfully","fileId":"file_abc123","fileUrl":"https://storage.example.com/files/file_abc123.pdf"}

---

EP: GET /api/files
DESC: Get user's uploaded files with pagination.
IN: headers:{Authorization:str!}, query:{page?:int, limit?:int, type?:str}
OUT: 200:{results:arr[{id:int, filename:str, originalName:str, mimeType:str, size:int, url:str, createdAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET "/api/files?page=1&limit=10" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"filename":"file_abc123.pdf","originalName":"document.pdf","mimeType":"application/pdf","size":1024000,"url":"https://storage.example.com/files/file_abc123.pdf","createdAt":"2025-10-27T10:30:45Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: DELETE /api/files/:fileId
DESC: Delete uploaded file by ID.
IN: headers:{Authorization:str!}, params:{fileId:int!}
OUT: 200:{message:str}
ERR: {"401":"Unauthorized", "403":"Access denied", "404":"File not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /api/files/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"message":"File deleted successfully"}

---

EP: POST /v1/mcp
DESC: Handle MCP POST requests with authentication.
IN: headers:{Authorization:str!}, body:{method:str!, params:obj}
OUT: 200:{result:obj}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"method":"tools/list","params":{}}'
EX_RES_200: {"result":{"tools":[{"name":"user_management","description":"User management tool"}]}}

---

EP: GET /v1/mcp
DESC: Handle MCP GET requests with authentication.
IN: headers:{Authorization:str!}, query:{method:str!, params?:str}
OUT: 200:{result:obj}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X GET "/v1/mcp?method=tools/list" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"result":{"tools":[{"name":"user_management","description":"User management tool"}]}}

---

EP: DELETE /v1/mcp
DESC: Handle MCP DELETE requests with authentication.
IN: headers:{Authorization:str!}, body:{method:str!, params:obj}
OUT: 200:{result:obj}
ERR: {"401":"Unauthorized", "400":"Invalid MCP request", "500":"Internal server error"}
EX_REQ: curl -X DELETE /v1/mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"method":"tools/remove","params":{"toolId":"user_management"}}'
EX_RES_200: {"result":{"success":true,"message":"Tool removed successfully"}}

---

EP: GET /v1/docs
DESC: Serve API documentation (Swagger UI).
IN: 
OUT: 200:html
ERR: {"500":"Internal server error"}
EX_REQ: curl -X GET /v1/docs
EX_RES_200: [HTML content for Swagger UI]