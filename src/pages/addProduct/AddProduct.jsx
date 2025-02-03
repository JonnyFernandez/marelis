import React, { useState, useEffect } from 'react';
import f from './AddProduct.module.css'
import axios from 'axios';
import { codeGenerator } from '../../utils/genetareCode';
import { useProd } from '../../context/ProdContext'




const AddProduct = () => {

    const { getCategory, categories, get_distributor, distributors, create_Prod, errors: api_error } = useProd()

    const [inputs, setInputs] = useState({
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
    });
    console.log(inputs.category);
    console.log(inputs.distributor);

    useEffect(() => {
        setInputs(prev => ({ ...prev, code: codeGenerator() }));
    }, []);


    const data = {
        ...inputs,
        name: inputs.name.toUpperCase(),
        cost: Number(inputs.cost),
        stock: Number(inputs.stock),
        minStock: Number(inputs.minStock),
        iva: Number(inputs.iva),
        profit: Number(inputs.profit),
        distributor: inputs.distributor?.length ? inputs.distributor : [],
        category: inputs.category?.length ? inputs.category : []
    }
    // console.log(data);

    const [errors, setErrors] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                await get_distributor()
                await getCategory()

            } catch (error) {
                console.error('Error al cargar categorías o distribuidores:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSelect = (e, type) => {
        const { value } = e.target;
        if (type === 'distributor') {
            if (inputs.distributor?.includes(value)) {
                alert(`Distribuidor ya agregado!`);
            } else {
                setInputs({ ...inputs, distributor: [...inputs.distributor, value] });
            }
        } else if (type === 'category') {
            if (inputs.category?.includes(value)) {
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
        create_Prod(data);

        alert('Producto guardado con éxito.');
        setInputs({
            image: '',
            name: '',
            description: '',
            code: codeGenerator(), // 🔥 Asegura que se genere un nuevo código
            cost: '',
            stock: '',
            minStock: '',
            // iva: '',
            // profit: '',
            distributor: [],
            category: []
        });

    };

    return (
        <div className={f.addProd}>
            <h2 className={f.titleAddProd} >Ingresar Producto</h2>
            {
                api_error.length ? api_error.map((item, index) => <p key={index} className={f.errorCreatedProd}>{item}</p>) : ''
            }
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
                            <label htmlFor="code" className={f.label}>Código</label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                placeholder="Código"
                                value={inputs.code}
                                onChange={handleChange}
                            />
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
                        </div>

                        <div className={f.column}>


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
                                {categories?.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>

                            <label htmlFor="distributor" className={f.label}>Distribuidor</label>
                            <select name="distributor" id="distributor" onChange={(e) => handleSelect(e, 'distributor')}>
                                <option value="">Seleccionar Distribuidor</option>
                                {distributors?.map(distributor => (
                                    <option key={distributor.id} value={distributor.id}>{distributor.name}</option>
                                ))}
                            </select>

                            <div className={f.itemsCategoryAndDistribuitor}>
                                {/* Categorías seleccionadas */}
                                {inputs.category?.length > 0 && (
                                    <div className={f.itemsCategory}>

                                        <div className={f.div1}>Categorías seleccionadas:</div>

                                        {inputs.category.map((id) => {
                                            const category = categories.find(cat => cat.id === Number(id));
                                            return (
                                                <div key={id} className={f.selectedItem}>
                                                    <span>{category ? category.name : 'Desconocido'}</span>
                                                    <button className={f.botonX} onClick={() => handleDelete('category', id)}>x</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Distribuidores seleccionados */}
                                {inputs.distributor?.length > 0 && (
                                    <div className={f.itemDistribuitor}>

                                        <div className={f.div1}>Distribuidores seleccionados:</div>

                                        {inputs.distributor.map((id) => {
                                            const distributor = distributors.find(dist => dist.id === Number(id));
                                            return (
                                                <div key={id} className={f.selectedItem}>
                                                    <span>{distributor ? distributor.name : 'Desconocido'}</span>
                                                    <button className={f.botonX} onClick={() => handleDelete('distributor', id)}>x</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>


                        </div>
                    </div>
                    <button type="submit">Guardar Producto</button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct