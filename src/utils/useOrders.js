import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useProd } from '../context/ProdContext';
import Swal from 'sweetalert2';

const useOrders = (navigate) => {
    const { errors, getOrders, orders } = useProd()
    const allOrders = orders
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentFilter, setPaymentFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await getOrders();

            } catch (error) {
                console.error('Error fetching orders:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: error.response?.data?.message || 'Error desconocido',
                    footer: 'Soporte técnico: arcancode@gmail.com',
                });
                // navigate('/');
            }
        };
        fetchOrders();
    }, [navigate]);

    const filteredOrders = allOrders?.orders
        ?.filter((order) => order.date === selectedDate)
        .filter((order) => {
            if (paymentFilter === 'cash') return order.payment_method === 'cash';
            if (paymentFilter === 'electronic') return order.payment_method === 'electronic';
            return true;
        });

    return { filteredOrders, selectedDate, setSelectedDate, paymentFilter, setPaymentFilter };
};

export default useOrders 