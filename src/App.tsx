import { createBrowserRouter, RouterProvider } from "react-router-dom"
import IndexPage from "./pages"
import AdminPage from "./pages/admin"
import NotFound from "./pages/notFound"
import LoginPage from "./pages/login"
import ProtectedRoute from "./comonents/protectedRoute"
import AdminSystemCOnfigScreen from "./comonents/adminSystemConfig"
import AdminLayout from "./comonents/adminLayout"

function App() {
  const router = createBrowserRouter([
    {
      path: '/:sessionId',
      Component: IndexPage
    },
    {
      path: '/admin-login',
      Component: LoginPage
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminPage />
        },
        {
          path: "dashboard",
          element: <AdminPage />
        },
        {
          path: "system-config",
          element: <AdminSystemCOnfigScreen />
        }
      ]
    },

    // {
    //   path: '/admin-dashboard',
    //   element: (
    //     <ProtectedRoute>
    //       <AdminPage />
    //     </ProtectedRoute>
    //   )
    // },
    // {
    //   path: '/admin-system-config',
    //   element: (
    //     <ProtectedRoute>
    //       <AdminSystemCOnfigScreen />
    //     </ProtectedRoute>
    //   )
    // },
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
