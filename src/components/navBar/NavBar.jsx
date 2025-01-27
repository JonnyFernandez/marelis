import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";



const NavBar = () => {
    const { isAuthenticated, logout, user } = useAuth()


    const exit = async () => {
        logout()
    }




    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to='/'> <b>Port Control</b> </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {isAuthenticated && <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">

                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to='/'>Inicio</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Componentes
                            </a>
                            <ul className="dropdown-menu">
                                <li className="nav-item">
                                    <NavLink className="dropdown-item" to='/'>Calculadora</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="dropdown-item" to='/'>Presupuesto</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'/'}>Venta Local</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'/'}>Gestion de Producto</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'/'}>Reporte de ventas</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'/'}>Estadisticas</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'/'}>Reporte de Stock</NavLink>
                                </li>

                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Usuario
                            </a>
                            <ul className="dropdown-menu">

                                <li>
                                    {
                                        user?.type === "admin"
                                            ? <NavLink className="dropdown-item" to={'/prod-management'}>Gestion de Usuarios</NavLink>
                                            : ''
                                    }
                                </li>

                                {
                                    user
                                        ? <li>
                                            <button className="dropdown-item" onClick={exit}>Salir</button>
                                        </li>
                                        : <li>
                                            <button className="dropdown-item" >Login</button>
                                        </li>
                                }

                            </ul>
                        </li>
                    </ul>
                </div>}

            </div>

        </nav>

    )
}

export default NavBar