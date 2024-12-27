1. **How to Run the Project Locally**

To run the project locally, follow these steps:

_Server Side:_

- Ensure that you modify the `DB_USER`, `DB_PORT`, and `DB_PASS` with your actual database configurations.
- Set the port number for the server to run on (e.g., 3000, 4000, 5000, etc.).
- Modify the `JWT_SECRET` and `JWT_EXPIRES_IN` with your actual configuration values.
- Run the following commands:
  """
  cd server
  npm run start:dev # for live reloading on every change
  """
  Or if you want to run the server in production mode:
  """
  npm run start
  """
- Ensure the server is listening by visiting `localhost:{port number}` in your browser. You should see a "Hello World" message, confirming the server is up and running and connected to the database.

_Client Side:_

- Run the following commands:
  """
  cd client
  npm run dev # for development mode
  """
  Or for production mode:
  """
  npm run build
  npm run start
  """

2. **The Thought Process Behind Your Database Design and API Structure**

_Database Design:_
The database design for this task management application includes four main entities:

1. **Users**: Stores personal and contact information such as `firstName`, `lastName`, `phoneNumber`, `email`, `password`, and `joinDate`, with a unique ID as the primary key.
2. **Projects**: Stores project details including `name`, `description`, `deadline`, `status`, and `createdAt`, with a unique ID as the primary key.
3. **Tasks**: The core entity of the system. It includes attributes such as `name`, `description`, `deadline`, `priority`, `status`, `createdAt`, `creatorByUserId` (foreign key to "users"), `assignedToUserId` (foreign key to "users"), and `projectId` (foreign key to "projects"), with a unique ID as the primary key.
   - **Relations**:
     - Many-to-One: Multiple tasks can be created by a single user.
     - Many-to-One: Multiple tasks can be assigned to a single user.
     - Many-to-One: Multiple tasks can belong to a single project.
4. **Watchlist**: Contains a foreign key to the "tasks" table with its unique ID. The relationship is Many-to-One, as a task can only be added to the watchlist once.

_API Structure:_
The API follows RESTful principles with endpoints structured for specific actions:

1. **GET** `/tasks`: Retrieves all tasks based on optional query parameters for filtering and pagination (e.g., `filter`, `searchTerm`, `page`, `pageSize`).
2. **GET** `/tasks/{id}`: Retrieves a specific task based on its `id`.
3. **POST** `/tasks`: Creates a new task. This request expects a body containing task details. This endpoint is also used for user login.
4. **PATCH** `/tasks/{id}`: Updates an existing task, using the task ID in the URL and task data in the body.
5. **DELETE** `/tasks/{id}`: Deletes a specific task based on its `id`.
