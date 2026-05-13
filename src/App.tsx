import { createBrowserRouter, RouterProvider } from "react-router-dom"
import IndexPage from "./pages"
import NotFound from "./pages/notFound"
import LoginPage from "./pages/login"
import ProtectedRoute from "./comonents/protectedRoute"
import AdminSystemCOnfigScreen from "./comonents/adminSystemConfig"
import AdminLayout from "./comonents/adminLayout"
import SessionPage from "./comonents/session"
import AttendancePage from "./comonents/attendance"
import Scanner from "./comonents/scanner"

function App() {
  const router = createBrowserRouter([
    {
      path: '/:lgaUniqueLink',
      Component: IndexPage
    },
    {
      path: '/admin-login',
      element: <LoginPage mode="login" />
    },
    // {
    // path: '/admin-register',
    //  element: <LoginPage mode="register" />
    //},
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <SessionPage /> },
        { path: 'attendance', element: <AttendancePage /> },
        { path: 'settings', element: <AdminSystemCOnfigScreen /> },
        { path: 'scanner', element: <Scanner /> },
      ]
    },
    {
      path: '/*',
      Component: NotFound
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
