import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { api_prod_details, update_prod_status, api_prod_delete, api_featured_prod } from "../../api/product";
import styles from "./ProdDetail.module.css";

const ProdDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api_prod_details(id);
                setProduct(response.data);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: error.response?.data?.message || "Error desconocido",
                    footer: "Soporte técnico: arcancode@gmail.com",
                });
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return <div className={styles.loader}>Cargando...</div>;
    }

    const toggleStatus = async () => {
        try {
            await update_prod_status(id);
            setProduct((prev) => ({ ...prev, isActive: !prev.isActive }));
            Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                text: product.isActive ? "Producto pausado" : "Producto reactivado",
            });
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el estado." });
        }
    };

    const toggleFeatured = async () => {
        try {
            await api_featured_prod(id);
            setProduct((prev) => ({ ...prev, isFeatured: !prev.isFeatured }));
            Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                text: product.isFeatured ? "Producto destacado" : "Producto no destacado",
            });
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el estado." });
        }
    };

    const deleteProduct = async () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api_prod_delete(id);
                    Swal.fire("Eliminado", "El producto ha sido eliminado.", "success").then(() => navigate("/catalog"));
                } catch {
                    Swal.fire("Error", "No se pudo eliminar el producto.", "error");
                }
            }
        });
    };

    return (
        <div className={`${styles.productDetail} ${product.isActive ? styles.active : styles.inactive} ${product.isFeatured ? styles.featured : ""}`}>
            <div className={styles.headerDetail}>
                <NavLink to="/catalog" className={styles.backLink}>Volver</NavLink>
                <h2>{product.name}</h2>
            </div>

            <div className={styles.infoContainer}>
                <div className={styles.divLeft}>
                    <div className={styles.imageContainer}>
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className={styles.actionsContainer}>
                        <NavLink to={`/prod-edit/${id}`}><button className={styles.editButton}>Editar</button></NavLink>
                        <button className={styles.pauseButton} onClick={toggleStatus}>{product.isActive ? "Pausar" : "Reactivar"}</button>
                        <button className={styles.deleteButton} onClick={deleteProduct}>Eliminar</button>
                        <button className={styles.featuredButton} onClick={toggleFeatured}>{product.isFeatured ? "Quitar Destacado" : "Destacar"}</button>
                    </div>
                </div>

                <div className={styles.divRight}>
                    <div className={styles.infoInside}>
                        <p><strong>Descripción:</strong> {product.description}</p>
                        <p><strong>Precio:</strong> ${product.price?.toFixed(2)}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>Destacado:</strong> {product.isFeatured ? "Sí" : "No"}</p>
                        <p><strong>Activo:</strong> {product.isActive ? "Sí" : "No"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdDetail;
