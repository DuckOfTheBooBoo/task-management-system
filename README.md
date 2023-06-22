# Task Management System

## Installation

### Docker

---

1. Download the [Dockerfile](https://raw.githubusercontent.com/DuckOfTheBooBoo/task-management-system/master/Dockerfile) and [docker-compose.yaml](https://raw.githubusercontent.com/DuckOfTheBooBoo/task-management-system/master/docker-compose.yaml)
2. Execute  `docker compose up -d` (Docker compose plugin) or `docker-compose up -d` (docker compose standalone)
3. Access the web using port 8080 or the port you've specified


## Api Specification

---

### Sign Up
- Method: POST
- Endpoint: `/api/auth/signup`
- Headers:
    - Content-Type: application/json
#### Body: 
```json
{
    "username": "username",
    "password": "password"
}
```

<!-- TODO: Make unsuccessful message -->

#### Response:

```json
{
    "status": "success/fail",
    "message": "User successfully created./?"
}
```

---

### Log In
- Method: POST
- Endpoint: `/api/auth/login`
- Headers:
    - Content-Type: application/json
#### Body: 
```json
{
    "username": "username",
    "password": "password"
}
```

### Response

```json
{
    "status": "success/fail",
    "message": "Successfully verified the credentials/?"
}
```

---

### Log Out
- Method: POST
- Endpoint: `/api/auth/login`
- Headers:
    - Authorization: Bearer ${token}

#### Response

```json
{
    "status": "success/?",
    "message": "Successfully logged out"
}
```

---

### Verify Token
- Method: POST
- Headers:
    - Authorization: Bearer (token)
- Endpoint: `/api/verifyToken`

```json
{
    "status": "success/fail",
    "message": "Token is valid/Incorrect or expired token/No token provided"
}
```

### Get all tasks for specific user
- Method: GET
- Headers:
    - Authorization: Bearer (token)
- Endpoint: `/api/task`

<!-- TODO: specify the success and fail message -->
```json
{
    "status": "success/fail",
    "message": "/?",
    "data": [
        {
            "task_id": "(task_id)",
            "description": "task description",
            "status": "Not Completed/Done",
            "createdAt": "date of created",
            "updatedAt": "date of updated",
            "UserId": "(user_id)"
        }
    ]
}
```

### Create a task for specific user
- Method: POST
- Headers:
    - Authorization: Bearer (token)
    - Content-Type: application/json
- Endpoint: `/api/task`

#### Body

```json
{
    "description": "(task description)"
}
```

#### Response

```json
{
    "status": "success/fail",
    "message": "Successfully created task/?"
}
```

### Update a task for specific user
- Method: PUT
- Headers:
    - Authorization: Bearer (token)
    - Content-Type: application/json
- Endpoint: `/api/task`

#### Body

```json
{
    "taskId": "(task id)",
    "description": "new description",
    "status": "new status (In Progress/done)"
}
```

#### Response

```json
{
    "status": "success/fail",
    "message": "Successfully updated the task/Unable to update the task: (reason)"
}
```

---

### Delete a task for specific user
- Method: DELETE
- Headers:
    - Authorization: Bearer (token)
    - Content-Type: application/json
- Endpoint: `/api/task`

#### Body
```json
{
    "taskId": "(task id)"
}
```

#### Response
```json
{
    "status": "success/fail",
    "message": "Successfully deleted the task/Unable to delete task (reason)"
}
```
