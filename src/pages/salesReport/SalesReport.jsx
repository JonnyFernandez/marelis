import styleSales from './SalesReport.module.css';
import { NavLink, useNavigate } from 'react-router-dom';

import useOrders from '../../utils/useOrders';

const SalesReport = () => {
    const navigate = useNavigate();
    const { filteredOrders, selectedDate, setSelectedDate, paymentFilter, setPaymentFilter } = useOrders(navigate);



    const calculateDailyFinances = (orders) => {
        const initialStats = {
            totalSales: 0,
            electronicPayment: 0,
            cashPayment: 0,
            totalProfit: 0,
            countOrder: orders.length,
        };

        return orders.reduce((stats, order) => {
            stats.totalSales += order.total_with_discount;
            stats.totalProfit += order.total_profit_amount;

            if (order.payment_method === 'electronic') stats.electronicPayment += order.total_with_discount;
            if (order.payment_method === 'cash') stats.cashPayment += order.total_with_discount;

            return stats;
        }, initialStats);
    };

    const dailyFinances = calculateDailyFinances(filteredOrders || []);



    return (
        <div className={styleSales.salesContainer}>
            <header className={styleSales.salesHeader}>
                <h1 className={styleSales.titleOrders}>Reporte de Ventas</h1>
                <div className={styleSales.economiInfo}>
                    <p>Venta total: ${dailyFinances.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p>Pago electrónico: ${dailyFinances.electronicPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p>Pago efectivo: ${dailyFinances.cashPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p>Ganancia total: ${dailyFinances.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p>Ordenes de compra: {filteredOrders?.length}</p>
                </div>
            </header>

            <div className={styleSales.filters}>
                <label htmlFor="dateFilter">Filtrar por fecha:</label>
                <input
                    type="date"
                    id="dateFilter"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={styleSales.dateInput}
                />

                <div className={styleSales.filterButtons}>
                    {['all', 'cash', 'electronic'].map((method) => (
                        <button
                            key={method}
                            className={`${styleSales.filterButton} ${paymentFilter === method ? styleSales.activeFilter : ''}`}
                            onClick={() => setPaymentFilter(method)}
                        >
                            {method === 'all' ? 'Todas' : method === 'cash' ? 'Efectivo' : 'Electrónico'}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styleSales.cardsContainer}>
                {filteredOrders?.length ? (
                    filteredOrders.map((order) => (

                        <div
                            key={order.id}
                            className={`${styleSales.card} ${order.status === 'Cancelled' ? styleSales.canceledCard : ''}`}
                        >
                            <h2>Orden: {order.code}</h2>
                            <p>Fecha: {order.date}</p>
                            <p>Total sin descuento: ${order.total_without_discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p>Total con descuento: ${order.total_with_discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p>Ganancia: ${order.total_profit_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p>Método de pago: {order.payment_method}</p>
                            <p>Estado: {order.status}</p>

                            <NavLink to={`/order-detail/${order.id}`}> Detelles
                            </NavLink>
                        </div>
                    ))
                ) : (
                    <p>No hay órdenes para la fecha seleccionada.</p>
                )}
            </div>
        </div>
    );
};

export default SalesReport;
