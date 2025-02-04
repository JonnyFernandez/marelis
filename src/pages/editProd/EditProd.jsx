import React, { useState, useEffect } from 'react';
import h from './EditProd.module.css';
import axios from 'axios';
import { api_prod_details, api_prod_detail_update } from '../../api/product';
import { useParams, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditProd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api_prod_details(id);
                setInputs(data);
                setOriginalData(data);
            } catch (error) {
                Swal.fire('Error', 'No se pudo cargar el producto.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = ({ target: { name, value } }) => {
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadImage = async ({ target }) => {
        const file = target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'assistt_file');

        try {
            const { data } = await axios.post(
                'https://api.cloudinary.com/v1_1/dkx6y2e2z/image/upload',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setInputs((prev) => ({ ...prev, image: data.secure_url }));
        } catch (error) {
            Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
        }
    };

    const validateInputs = () => {
        const errors = {};
        if (!inputs?.name) errors.name = 'El nombre es obligatorio.';
        if (!inputs?.cost || inputs.cost <= 0) errors.cost = 'El costo debe ser mayor a 0.';
        if (!inputs?.stock || inputs.stock < 0) errors.stock = 'El stock no puede ser negativo.';
        if (!inputs?.minStock || inputs.minStock < 0) errors.minStock = 'El stock mínimo no puede ser negativo.';
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedData = Object.keys(inputs).reduce((acc, key) => {
            if (inputs[key] !== originalData[key]) acc[key] = inputs[key];
            return acc;
        }, {});

        if (Object.keys(updatedData).length === 0) {
            Swal.fire('Sin Cambios', 'No hay modificaciones para guardar.', 'info');
            return;
        }

        try {
            await api_prod_detail_update(id, updatedData);
            Swal.fire('Éxito', 'Producto actualizado correctamente.', 'success').then(() => {
                navigate(`/detail/${id}`);
            });
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
        }
    };

    if (loading) return <p>Cargando producto...</p>;
    if (!inputs) return <p>Error al cargar los datos.</p>;

    return (
        <div className={h.addProd}>
            <h2>Editar Producto</h2>
            <NavLink to={`/detail/${id}`} className={h.backLink}>Volver</NavLink>
            <div className={h.infoContainer}>
                <div className={h.divImage}>
                    {inputs.image ? <img src={inputs.image} alt="Vista previa" /> : <p>Vista previa de imagen</p>}
                </div>
                <form className={`${h.inputsContainer} ${h.responsiveForm}`} onSubmit={handleSubmit}>
                    <div className={h.row}>
                        <div className={h.column}>
                            <label className={h.label}>Imagen</label>
                            <input type="file" name="image" onChange={handleUploadImage} />

                            <label className={h.label} htmlFor="name">Nombre</label>
                            <input type="text" name="name" value={inputs.name || ''} onChange={handleChange} />
                            {errors.name && <p className={h.error}>{errors.name}</p>}

                            <label className={h.label} htmlFor="description">Descripción</label>
                            <textarea name="description" value={inputs.description || ''} onChange={handleChange} rows="2"></textarea>
                        </div>

                        <div className={h.column}>
                            {[
                                { name: 'cost', label: 'Costo', step: '0.01' },
                                { name: 'iva', label: 'IVA', step: '0.01' },
                                { name: 'profit', label: 'Ganancia', step: '0.01' },
                                { name: 'stock', label: 'Stock', step: '1' },
                                { name: 'minStock', label: 'Stock mínimo', step: '1' },
                                { name: 'code', label: 'Código', type: 'text' },
                            ].map(({ name, label, step, type = 'number' }) => (
                                <React.Fragment key={name}>
                                    <label className={h.label} htmlFor={name}>{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={inputs[name] || ''}
                                        onChange={handleChange}
                                        min="0"
                                        step={step}
                                    />
                                    {errors[name] && <p className={h.error}>{errors[name]}</p>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <button type="submit">Guardar Producto</button>
                </form>
            </div>
        </div>
    );
};

export default EditProd;
