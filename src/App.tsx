import { createBrowserRouter, RouterProvider } from "react-router-dom"
import IndexPage from "./pages"
import AdminPage from "./pages/admin"
import NotFound from "./pages/notFound"
import LoginPage from "./pages/login"
import ProtectedRoute from "./comonents/protectedRoute"

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
      path: '/admin-dashboard',
      element: (
        //<ProtectedRoute>
        <AdminPage />
        //</ProtectedRoute>
      )
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
