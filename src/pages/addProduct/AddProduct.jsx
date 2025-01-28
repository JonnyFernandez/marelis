import f from './AddProduct.module.css'
import React, { useState, useEffect } from 'react';

import axios from 'axios';
// import { api_post_order, api_get_all_categories, api_get_all_distributors } from '../../api/product';

import { codeGenerator } from '../../utils/genetareCode';



const AddProduct = () => {
    const [inputs, setInputs] = useState({
        image: '',
        name: '',
        description: '',
        code: '' || codeGenerator(),
        cost: '',
        stock: '',
        minStock: '',
        iva: '',
        profit: '',
        distributor: [],
        category: []
    });
    // console.log(inputs);

    const data = {
        ...inputs,
        name: inputs.name.toUpperCase(),
        cost: Number(inputs.cost),
        stock: Number(inputs.stock),
        minStock: Number(inputs.minStock),
        iva: Number(inputs.iva),
        profit: Number(inputs.profit),
        distributor: inputs.distributor.length ? inputs.distributor : [1],
        category: inputs.category.length ? inputs.category : [1]
    }
    // console.log(data);

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [categoryRes, distributorRes] = await Promise.all([
    //                 api_get_all_categories(), 
    //                 api_get_all_distributors() 
    //             ]);
    //             setCategories(categoryRes.data);
    //             setDistributors(distributorRes.data);
    //         } catch (error) {
    //             console.error('Error al cargar categorías o distribuidores:', error);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSelect = (e, type) => {
        const { value } = e.target;
        if (type === 'distributor') {
            if (inputs.distributor.includes(value)) {
                alert(`Distribuidor ya agregado!`);
            } else {
                setInputs({ ...inputs, distributor: [...inputs.distributor, value] });
            }
        } else if (type === 'category') {
            if (inputs.category.includes(value)) {
                alert(`Categoría ya agregada!`);
            } else {
                setInputs({ ...inputs, category: [...inputs.category, value] });
            }
        }
    };

    const handleDelete = (type, id) => {
        setInputs({
            ...inputs,
            [type]: inputs[type].filter(item => item !== id)
        });
    };

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'assistt_file');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dkx6y2e2z/image/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setInputs({ ...inputs, image: response.data.secure_url });
        } catch (error) {
            console.error('Error al cargar la imagen:', error);
            alert('Error al cargar la imagen. Inténtalo de nuevo.');
        }
    };

    const validateInputs = () => {
        const errors = {};
        if (!inputs.name) errors.name = 'El nombre es obligatorio';
        if (!inputs.description) errors.description = 'La descripción es obligatoria';
        if (inputs.cost <= 0) errors.cost = 'El costo debe ser mayor a 0';
        if (inputs.stock < 0) errors.stock = 'El stock no puede ser negativo';
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // api_post_order(data);
        // console.log("Formulario enviado", inputs);
        alert('Producto guardado con éxito.');
        setInputs({
            image: '',
            name: '',
            description: '',
            code: '',
            cost: '',
            stock: '',
            minStock: '',
            iva: '',
            profit: '',
            distributor: [],
            category: []
        })
    };

    return (
        <div className={f.addProd}>
            <h2>Ingresar Producto</h2>
            <div className={f.infoContainer}>
                <div className={f.divImage}>
                    {inputs.image ? (
                        <img src={inputs.image} alt="Vista previa del producto" />
                    ) : (
                        <p>Vista previa de imagen</p>
                    )}
                </div>

                <form className={`${f.inputsContainer} ${f.responsiveForm}`} onSubmit={handleSubmit}>
                    <div className={f.row}>
                        <div className={f.column}>
                            <label className={f.label}>Imagen</label>
                            <input type="file" name="image" onChange={handleUploadImage} />

                            <label htmlFor="name" className={f.label}>Nombre del producto</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nombre del producto"
                                value={inputs.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className={f.error}>{errors.name}</p>}

                            <label htmlFor="description" className={f.label}>Descripción</label>
                            <textarea
                                name="description"
                                id="description"
                                placeholder="Descripción"
                                rows="2"
                                value={inputs.description}
                                onChange={handleChange}
                            ></textarea>
                            {errors.description && <p className={f.error}>{errors.description}</p>}
                        </div>

                        <div className={f.column}>
                            <label htmlFor="cost" className={f.label}>Costo</label>
                            <input
                                type="number"
                                name="cost"
                                id="cost"
                                placeholder="Costo"
                                value={inputs.cost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                            {errors.cost && <p className={f.error}>{errors.cost}</p>}

                            <label htmlFor="iva">IVA:</label>
                            <input
                                type="number"
                                name="iva"
                                placeholder="IVA"

                                id="iva"
                                value={inputs.iva}
                                onChange={handleChange}
                            />

                            <label htmlFor="profit" className={f.label}>Ganancia</label>
                            <input
                                type="number"
                                name="profit"
                                id="profit"
                                placeholder="Ganancia"
                                value={inputs.profit}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />

                            <label htmlFor="stock" className={f.label}>Stock</label>
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                placeholder="Stock"
                                value={inputs.stock}
                                onChange={handleChange}
                                min="0"
                            />
                            {errors.stock && <p className={f.error}>{errors.stock}</p>}

                            <label htmlFor="minStock" className={f.label}>Stock mínimo</label>
                            <input
                                type="number"
                                name="minStock"
                                id="minStock"
                                placeholder="Stock mínimo"
                                value={inputs.minStock}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className={f.column}>
                            <label htmlFor="category" className={f.label}>Categoría</label>
                            <select name="category" id="category" onChange={(e) => handleSelect(e, 'category')}>
                                <option value="">Seleccionar Categoría</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>

                            <label htmlFor="distributor" className={f.label}>Distribuidor</label>
                            <select name="distributor" id="distributor" onChange={(e) => handleSelect(e, 'distributor')}>
                                <option value="">Seleccionar Distribuidor</option>
                                {distributors.map(distributor => (
                                    <option key={distributor.id} value={distributor.id}>{distributor.name}</option>
                                ))}
                            </select>

                            <div className={f.itemsCategoryAndDistribuitor}>
                                <div className={f.itemsCategory}>
                                    {inputs.category.map((id, index) => (
                                        <div key={index}>
                                            <p className={f.textD}>
                                                {categories.find(cat => cat.id === id)?.name || id}{' '}
                                                <button
                                                    className={f.botonX}
                                                    onClick={() => handleDelete('category', id)}
                                                >
                                                    x
                                                </button>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className={f.itemDistribuitor}>
                                    {inputs.distributor.map((id, index) => (
                                        <div key={index}>
                                            <p className={f.textD}>
                                                {distributors.find(dist => dist.id === id)?.name || id}{' '}
                                                <button
                                                    className={f.botonX}
                                                    onClick={() => handleDelete('distributor', id)}
                                                >
                                                    x
                                                </button>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <label htmlFor="code" className={f.label}>Código</label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                placeholder="Código"
                                value={inputs.code}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit">Guardar Producto</button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct