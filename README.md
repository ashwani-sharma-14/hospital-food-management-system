# Hospital Food Management System

This is a **Hospital Food Management System** built using **Next.js**. The project aims to streamline food management processes within a hospital, allowing administrators to manage patients' food delivery tasks, pantry staff assignments, and delivery personnel efficiently.

## 🛠️ **Technologies Used**

- **Next.js** (React Framework for Server-Side Rendering and Static Site Generation)
- **TypeScript**
- **Tailwind CSS** (for styling)
- **Node.js** (for server-side logic)
- **JWT (JSON Web Token)** for authentication
- **Cookies** for session management
- **Jose** (for token verification)

## ✨ **Features**

### Admin Dashboard

- Assign tasks to pantry staff.
- View and manage food delivery tasks.
- Manage patients and delivery personnel.

### Pantry Dashboard

- View assigned food tasks.
- Mark tasks as completed.

### Delivery Dashboard

- View delivery assignments.
- Mark deliveries as completed.

### Authentication

- Secure login using **JWT**.
- Role-based access control for different types of users (Admin, Pantry Staff, Delivery Personnel).

## 📁 **Project Structure**

```
hospitalfoodmanagmentsystem
├── .env
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
├── README.md
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── sign-in
│   │   │   │   └── page.tsx
│   │   │   └── sign-up
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── admin
│   │   │   │   └── route.ts
│   │   │   ├── assign-task
│   │   │   │   └── route.ts
│   │   │   ├── create-diet-chart
│   │   │   │   └── route.ts
│   │   │   ├── delivery-tasks
│   │   │   │   └── route.ts
│   │   │   ├── pantry-tasks
│   │   │   │   └── route.ts
│   │   │   ├── patient
│   │   │   │   └── route.ts
│   │   │   ├── sign-in
│   │   │   │   └── route.ts
│   │   │   └── sign-up
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components
│   │   └── ui
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── Layout.tsx
│   │       ├── radio-group.tsx
│   │       ├── toast.tsx
│   │       └── toaster.tsx
│   ├── hooks
│   │   └── use-toast.ts
│   ├── lib
│   │   ├── dbConnection.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   ├── model
│   │   ├── Delivery.ts
│   │   ├── DietChat.ts
│   │   ├── Patient.ts
│   │   ├── Task.ts
│   │   └── User.ts
│   ├── pages
│   │   ├── dashboard
│   │   │   ├── AdminDashBoard.tsx
│   │   │   ├── DeliveryDashBoard.tsx
│   │   │   ├── index.tsx
│   │   │   ├── PantryDashBoard.tsx
│   │   │   └── patientDetails
│   │   │       └── index.tsx
│   │   ├── NavBar
│   │   │   └── index.tsx
│   │   └── _app.tsx
│   ├── schemas
│   │   ├── patientSchema.ts
│   │   ├── signInSchema.ts
│   │   └── signUpSchema.ts
│   ├── styles
│   │   └── globals.css
│   └── types
│       └── next-auth.d.ts
├── tailwind.config.ts
└── tsconfig.json
```

## ⚙️ **Setup and Installation**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ashwani-sharma-14/hospital-food-management-system.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd hospital-food-management-system
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` File:** Add the following environment variables:

   ```env
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   The app will be available at [**http://localhost:3000**](http://localhost:3000).

## 🛡️ **Authentication**

- The app uses **JWT** for authentication.
- Users are authenticated through cookies.
- Different dashboards are rendered based on the user's role (Admin, Pantry Staff, Delivery Personnel).

### 🔐 **Login Credentials**

| Role         | Email                        | Password       |
| ------------ | -----------------------------| -------------- |
| Manager      | [hospital_manager@xyz.com]   | Password\@2025 |
| Pantry Staff | [hospital_pantry@xyz.com]    | Password\@2025 |
| Delivery     | [hospital_delivery@xyz.com]  | Password\@2025 |

## 🧪 **How to Use**

### Admin Role

1. Log in as an Admin.
2. Navigate to the Dashboard.
3. Assign tasks to pantry staff and delivery personnel.

### Pantry Staff Role

1. Log in as Pantry Staff.
2. View the list of assigned tasks.
3. Mark tasks as completed.

### Delivery Personnel Role

1. Log in as Delivery Personnel.
2. View the list of deliveries.
3. Mark deliveries as completed.

## 🐞 **Error Handling**

- Handles token verification errors.
- Redirects users to the login page if the session expires.

## 📚 **Future Improvements**

- Add a **patient food preferences** feature.
- Implement **real-time notifications** for task updates.
- Add **analytics and reports** for admin users.

## 📄 **License**

This project is licensed under the MIT License.

---

### 📧 **Contact**

For any queries or contributions, contact:

- **Ashwani Sharma**
- **Email:** [ashwanisharma5541@gmail.com](mailto:ashwanisharma5541@gmail.com)
- **LinkedIn:** [Ashwani Sharma](https://www.linkedin.com/in/ashwani-sharma-36b428273)

# hospital-food-management-system
