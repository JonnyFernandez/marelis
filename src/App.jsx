
import AuthProvider from './context/AuthContext'
// import './App.css'
import ProdProvider from './context/ProdContext'
import { Register, Login, Home, Calculator, Butget, SalesReport, StockReport, Statistics, OrderDetail, AddProduct, Category, Distributor, Catalog } from './pages/index'
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
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />

                <Route path="/calculator" element={<Calculator />} />
                <Route path="/butget" element={<Butget />} />
                <Route path="/prod" element={<AddProduct />} />
                <Route path="/sales-report" element={<SalesReport />} />
                <Route path="/stock-report" element={<StockReport />} />
                <Route path="/statistics-report" element={<Statistics />} />
                <Route path="/order-detail/:id" element={<OrderDetail />} />
                <Route path="/category" element={<Category />} />
                <Route path="/distributor" element={<Distributor />} />
                <Route path="/catalog" element={<Catalog />} />

              </Route>

            </Routes>
          </main>
        </BrowserRouter>
      </ProdProvider>
    </AuthProvider>
  )
}

export default App