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
                        {user.type === 'admin' ? <li className="nav-item dropdown">
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
                                    <NavLink className="dropdown-item" to='/calculator'>Calculadora</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="dropdown-item" to='/butget'>Presupuesto</NavLink>
                                </li>


                                <li>
                                    <NavLink className="dropdown-item" to={'/sales-report'}>Reporte de ventas</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'/stock-report'}>Reporte de Stock</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'/statistics-report'}>Estadisticas</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'/statistics-report'}>Catalogo</NavLink>
                                </li>

                            </ul>
                        </li> : ''}

                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Gestion de Productos
                            </a>
                            <ul className="dropdown-menu">

                                <li>
                                    <NavLink className="dropdown-item" to={'/prod'}>Ingresar Producto</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'#'}>Categorias y Distibuidores</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'#'}>Actualizar Stock</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to={'#'}>Catalogo</NavLink>
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
                                {user.name ? user.name.toUpperCase() : Usuario}
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