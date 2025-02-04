import React, { useState, useEffect } from 'react';
import h from './EditProd.module.css';
import axios from 'axios';
import { api_prod_details, api_prod_detail_update } from '../../api/product';
import { useParams, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';


const EditProd = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api_prod_details(id);
                setInputs(data);
                setOriginalData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar el producto:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'assistt_file');

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dkx6y2e2z/image/upload',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setInputs({ ...inputs, image: response.data.secure_url });
        } catch (error) {
            console.error('Error al cargar la imagen:', error);
            alert('Error al cargar la imagen. Inténtalo de nuevo.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedData = Object.keys(inputs).reduce((acc, key) => {
            if (inputs[key] !== originalData[key]) {
                acc[key] = inputs[key];
            }
            return acc;
        }, {});

        if (Object.keys(updatedData).length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin Cambios',
                text: 'No se detectaron cambios para guardar.',
            });
            return;
        }

        try {
            await api_prod_detail_update(id, updatedData);

            Swal.fire({
                icon: 'success',
                title: 'Actualización Exitosa',
                text: 'El producto se actualizó correctamente.',
                confirmButtonText: 'Volver',
            }).then(() => {
                navigate(`/prod-detail/${id}`);
            });
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar los cambios.',
            });
        }
    };
    const validateInputs = () => {
        const errors = {};
        if (!inputs.name) errors.name = 'El nombre es obligatorio.';
        if (!inputs.cost || inputs.cost <= 0) errors.cost = 'El costo debe ser mayor a 0.';
        if (!inputs.stock || inputs.stock < 0) errors.stock = 'El stock no puede ser negativo.';
        if (!inputs.minStock || inputs.minStock < 0) errors.minStock = 'El stock mínimo no puede ser negativo.';
        return errors;
    };

    if (loading) {
        return <p>Cargando producto...</p>;
    }

    return (
        <div className={h.addProd}>
            <h2>Editar Producto</h2>
            <NavLink to={`/detail/${id}`} className={h.backLink}>
                Volver
            </NavLink>
            <div className={h.infoContainer}>
                <div className={h.divImage}>
                    {inputs.image ? (
                        <img src={inputs.image} alt="Vista previa del producto" />
                    ) : (
                        <p>Vista previa de imagen</p>
                    )}
                </div>

                <form className={`${h.inputsContainer} ${h.responsiveForm}`} onSubmit={handleSubmit}>
                    <div className={h.row}>
                        <div className={h.column}>
                            <label className={h.label}>Imagen</label>
                            <input type="file" name="image" onChange={handleUploadImage} />

                            <label htmlFor="name" className={h.label}>Nombre del producto</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nombre del producto"
                                value={inputs.name || ''}
                                onChange={handleChange}
                            />
                            {errors.name && <p className={h.error}>{errors.name}</p>}

                            <label htmlFor="description" className={h.label}>Descripción</label>
                            <textarea
                                name="description"
                                id="description"
                                placeholder="Descripción"
                                rows="2"
                                value={inputs.description || ''}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className={h.column}>
                            <label htmlFor="cost" className={h.label}>Costo</label>
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

                            <label htmlFor="iva" className={h.label}>IVA</label>
                            <input
                                type="number"
                                name="iva"
                                id="iva"
                                placeholder="IVA"
                                value={inputs.iva || ''}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />

                            <label htmlFor="profit" className={h.label}>Ganancia</label>
                            <input
                                type="number"
                                name="profit"
                                id="profit"
                                placeholder="Ganancia"
                                value={inputs.profit || ''}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />

                            <label htmlFor="stock" className={h.label}>Stock</label>
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                placeholder="Stock"
                                value={inputs.stock || ''}
                                onChange={handleChange}
                                min="0"
                            />

                            <label htmlFor="minStock" className={h.label}>Stock mínimo</label>
                            <input
                                type="number"
                                name="minStock"
                                id="minStock"
                                placeholder="Stock mínimo"
                                value={inputs.minStock || ''}
                                onChange={handleChange}
                                min="0"
                            />

                            <label htmlFor="code" className={h.label}>Código</label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                placeholder="Código"
                                value={inputs.code || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit">Guardar Producto</button>
                </form>
            </div>
        </div>
    );
};

export default EditProd;