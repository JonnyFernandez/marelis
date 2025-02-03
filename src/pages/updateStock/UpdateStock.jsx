import u from './UpdateStock.module.css';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useProd } from '../../context/ProdContext';



const UpdateStock = () => {

    const { prod, allProduct, update_stock } = useProd()
    const [search, setSearch] = useState('');
    const [inputs, setInputs] = useState({});
    console.log(prod);

    useEffect(() => {
        const fetchData = async () => {
            await allProduct()
        }
        fetchData()
    }, [])

    const data = {
        stock: Number(inputs.stock),
        cost: Number(inputs.cost),

    }

    const handleSearch = () => {

        const product = prod?.find((p) => p.code.includes(search.trim()));
        if (product) {
            setInputs(product);
        } else {
            alert("producto no encontrado")
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirmar la actualización
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se actualizarán los datos del producto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await update_stock(inputs.id, data);

                await Swal.fire({
                    title: 'Actualizado',
                    text: 'El producto ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setInputs({})
                setSearch('')

            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo actualizar el producto. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };


    return (
        <div className={u.container}>
            <h2 className={u.titleUpdate}>Buscar y Actualizar</h2>
            <input
                type="text"
                placeholder="Buscar por código de barras"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={u.updateSearchButton} onClick={handleSearch}>Buscar</button>

            {inputs.code && (
                <div>
                    <form className={u.form} onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name">Nombre del producto</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nombre del producto"
                                value={inputs.name}
                                onChange={handleChange}
                            />

                            <label htmlFor="stock">Stock:</label>
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                placeholder="Stock"
                                value={inputs.stock}
                                onChange={handleChange}
                                min="0"
                            />


                            <label htmlFor="cost">Costo:</label>
                            <input
                                type="number"
                                name="cost"
                                id="cost"
                                placeholder="Costo"
                                value={inputs.cost || ''}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />

                        </div>
                        <button type="submit">Guardar Producto</button>
                    </form>
                    <div className={u.imageUpdateContainer}>
                        <img src={inputs.image} alt="" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateStock;