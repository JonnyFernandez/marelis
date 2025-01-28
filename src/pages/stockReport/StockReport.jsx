import { useEffect } from 'react';
import Swal from 'sweetalert2'; // Para mostrar errores
import styleRepont from './StockReport.module.css'; // Asegúrate de tener estilos personalizados en este archivo
import { useProd } from '../../context/ProdContext';

const StockReport = () => {
    const { getStockReport, stockReport } = useProd()

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getStockReport();

            } catch (error) {
                console.error('Error fetching stock report:', error.response.data.message);
                const res = error.response.data.message
                localStorage.removeItem('user');

                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: res,
                    footer: 'Soporte técnico: "arcancode@gmail.com"',
                });
            }
        };

        fetchData();
    }, []);

    // Mostrar un mensaje de carga mientras se obtienen los datos
    if (!stockReport) {
        return <div className={styleRepont.loading}>Cargando datos del stock...</div>;
    }

    return (

        <div className={styleRepont.container}>
            <h1 className={styleRepont.title}>Reporte de Stock</h1>

            {/* Tabla de detalles por producto */}
            <div className={styleRepont.tableContainer}>
                <table className={styleRepont.table}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad en Stock</th>
                            <th>Costo Total (con IVA)</th>
                            <th>Precio Total</th>
                            <th>Ganancia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockReport.productDetails?.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.stock}</td>
                                <td>${parseFloat(product.costValue).toLocaleString()}</td>
                                <td>${parseFloat(product.priceValue).toLocaleString()}</td>
                                <td>${parseFloat(product.profitValue).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Resumen de Totales */}
            <div className={styleRepont.summary}>
                <h2>Resumen General</h2>
                <ul>
                    <li>
                        <strong>Total de productos en stock:</strong> {stockReport.totalStock}
                    </li>
                    <li>
                        <strong>Valor total del costo (con IVA):</strong> ${parseFloat(stockReport.totalCostValue).toLocaleString()}
                    </li>
                    <li>
                        <strong>Valor total de los precios:</strong> ${parseFloat(stockReport.totalPriceValue).toLocaleString()}
                    </li>
                    <li>
                        <strong>Margen de ganancia general:</strong> ${parseFloat(stockReport.profitMargin).toLocaleString()}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default StockReport;
