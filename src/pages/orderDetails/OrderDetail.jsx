import orderStyle from './OrderDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
import { api_order_by_id, api_order_cancel, api_order_delete } from '../../api/product';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import { useProd } from '../../context/ProdContext'
// import exportOrderToPDF from '../../utils/orderPdf';




const OrderDetail = () => {

    const navigate = useNavigate()
    // const dispatch = useDispatch();
    const { id } = useParams();

    const { getOrdersById, orderDetail, cancelOrder: orderCancel, deleteOrder: orderDelete } = useProd()

    const orderDetails = orderDetail
    const [count, setCount] = useState(0)



    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await getOrdersById(id);

            } catch (error) {
                console.error('Error fetching order data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Servidor desconectado. Por favor, contacta al soporte técnico.',
                    footer: 'Soporte técnico: arcancode@gmail.com',
                });
            }
        };

        fetchOrderDetails();
    }, [id, count]);




    // Validación de datos
    if (!orderDetails || !orderDetails.order) {
        return <p className={orderStyle.notFound}>Orden no encontrada.</p>;
    }

    const {
        id: orderId,
        code,
        user,
        date,
        status,
        payment_method,
        discount,
        total_without_discount,
        total_with_discount,
        total_profit_amount,
        Products,
    } = orderDetails.order;

    const cancelOrder = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez cancelada esta orden, no podrás reanudarla. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, regresar',
            reverseButtons: true, // Invierte los botones para evitar confirmaciones accidentales
        });

        if (result.isConfirmed) {
            try {
                await orderCancel(id); // Llamar a la función API para cancelar la orden
                await Swal.fire({
                    title: 'Orden cancelada',
                    text: 'La orden ha sido cancelada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setCount(prev => prev + 1)
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo cancelar la orden. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } else {
            Swal.fire({
                title: 'Cancelación abortada',
                text: 'La orden sigue activa.',
                icon: 'info',
                confirmButtonText: 'OK',
            });
        }
    };

    const deleteOrder = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez eliminada esta orden, no podrás reanudarla. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Eliminar',
            cancelButtonText: 'No, regresar',
            reverseButtons: true, // Invierte los botones para evitar confirmaciones accidentales
        });

        if (result.isConfirmed) {
            try {
                await orderDelete(id); // Llamar a la función API para cancelar la orden
                await Swal.fire({
                    title: 'Orden cancelada',
                    text: 'La orden ha sido eliminada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                navigate('/sales-report')
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo cancelar la orden. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } else {
            Swal.fire({
                title: 'Cancelación abortada',
                text: 'La orden sigue activa.',
                icon: 'info',
                confirmButtonText: 'OK',
            });
        }
    }
    const expoertOrder = () => {
        // exportOrderToPDF(orderDetails.order)
        alert("falta codigo para exportar pdf")
    }


    return (
        <div className={orderStyle.container}>
            <NavLink to={'/sales-report'} className={orderStyle.back}>Volver</NavLink>
            <div className={orderStyle.headerDetails}>

                <h1 className={orderStyle.title}>Detalles de la Orden</h1>
            </div>
            <div className={orderStyle.card}>
                <p><strong>Código:</strong> {code}</p>
                <p><strong>Usuario:</strong> {user}</p>
                <p><strong>Fecha:</strong> {date}</p>
                <p><strong>Estado:</strong> {status}</p>
                <p><strong>Método de Pago:</strong> {payment_method || 'No especificado'}</p>

                <p><strong>Descuento:</strong> {discount}%</p>

                <p><strong>Total sin Descuento:</strong> ${total_without_discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p><strong>Total con Descuento:</strong> ${total_with_discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p><strong>Ganancia Total:</strong> ${total_profit_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>

                <div className={orderStyle.updateOrders}>
                    {orderDetails.order.status !== "Cancelled" && <button className={orderStyle.cancelOrders} onClick={cancelOrder}>Cancelar</button>}
                    {orderDetails.order.status === "Cancelled" && <button className={orderStyle.deleteOrders} onClick={deleteOrder}>Eliminar</button>}

                    <button className={orderStyle.exportPDF} onClick={expoertOrder}>Exportar PDF</button>
                </div>

            </div>

            <h2 className={orderStyle.subtitle}>Productos</h2>
            <div className={orderStyle.productsContainer}>
                {Products.length > 0 ? (
                    Products.map(({ id, name, profit_amount, OrderProduct }) => (
                        <div key={id} className={orderStyle.productCard}>
                            <p><strong>Nombre:</strong> {name}</p>
                            <p><strong>Cantidad:</strong> {OrderProduct?.quantity || 0}</p>
                            <p><strong>Precio:</strong> ${OrderProduct?.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</p>
                            <p><strong>Ganancia:</strong> ${profit_amount ? (profit_amount * (OrderProduct?.quantity || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}</p>
                        </div>
                    ))
                ) : (
                    <p className={orderStyle.noProducts}>No hay productos asociados a esta orden.</p>
                )}
            </div>

        </div>
    );
}

export default OrderDetail