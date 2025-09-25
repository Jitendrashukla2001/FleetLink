import { useState } from 'react'
import './App.css'
import Login from './Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './Homepage'
import Vehicles from './Vehicles'
import MainLayout from './MainLayout'
function App() {
  const appRouter=createBrowserRouter([
  {
    path:"/",
    element:<Login></Login>
  },
  {
    element: <MainLayout />,
    children:[
    { path: "/homepage", element: <Homepage /> },
    { path: "/vehicles", element: <Vehicles></Vehicles> },
    ]
  }
])

  return (
    <>
     <main>
      <RouterProvider router={appRouter}></RouterProvider>
     </main>
    </>
  )
}

export default App
