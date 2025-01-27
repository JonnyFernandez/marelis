
import AuthProvider from './context/AuthContext'
// import './App.css'
import ProdProvider from './context/ProdContext'
import { Login, Register, Home } from './pages/index'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoutes"
import { NavBar } from './components'


function App() {


  return (
    <AuthProvider>
      <ProdProvider>

        <BrowserRouter>
          <main >
            <NavBar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/local-sale" element={<h1>venta local</h1>} />
                <Route path="/repor" element={<h1>Reporte</h1>} />
                <Route path="/order/:id" element={<h1>Order id</h1>} />

              </Route>

            </Routes>
          </main>
        </BrowserRouter>
      </ProdProvider>
    </AuthProvider>
  )
}

export default App