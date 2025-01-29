import React, { useState, useEffect } from 'react';
import f from './DistributorForm.module.css';
import {
    api_post_distributor,
    api_get_all_distributors,
    api_update_distributor_numbers,
    api_toggle_distributor_status,
    api_delete_distributor,
} from '../../api/product';
import Modal from '../modal/Modal';
// import UpdateProdByCategory from '../updateProdByCategory/UpdateProdByCategory';
import UpdateProdByDistributor from '../updateProdByDistributor/UpdateProdByDistributor';


const DistributorForm = () => {
    const [inputs, setInputs] = useState({
        name: "",
        address: "",
        phoneNumbers: [],
    });
    const [phoneNumber, setPhoneNumber] = useState("");
    const [distributors, setDistributors] = useState([]);
    const [editingDistributorId, setEditingDistributorId] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    // Cargar distribuidores al montar el componente
    useEffect(() => {
        fetchDistributors();
    }, []);

    const fetchDistributors = async () => {
        const data = await api_get_all_distributors();
        setDistributors(data.data);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const addPhoneNumber = () => {
        if (phoneNumber.trim() !== "") {
            setInputs((prev) => ({
                ...prev,
                phoneNumbers: [...prev.phoneNumbers, phoneNumber.trim()],
            }));
            setPhoneNumber("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputs.name || !inputs.address || inputs.phoneNumbers.length === 0) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (editingDistributorId) {
            // Actualizar distribuidor
            await api_update_distributor_numbers(editingDistributorId, phoneNumber);
            alert("Distribuidor actualizado correctamente.");
            setEditingDistributorId(null);
        } else {
            // Crear nuevo distribuidor
            await api_post_distributor(inputs);
            alert("Distribuidor creado correctamente.");
        }

        fetchDistributors();
        setInputs({ name: "", address: "", phoneNumbers: [] });
    };

    const handleEdit = (distributor) => {
        setEditingDistributorId(distributor.id);
        setInputs({
            name: distributor.name,
            address: distributor.address,
            phoneNumbers: distributor.phoneNumbers,
        });
    };

    const handleDelete = async (id) => {
        await api_delete_distributor(id);
        alert("Distribuidor eliminado correctamente.");
        fetchDistributors();
    };

    const toggleStatus = async (id) => {
        const message = await api_toggle_distributor_status(id);
        alert(message);
        fetchDistributors();
    };



    return (
        <div className={f.distributor}>
            <h2>{editingDistributorId ? "Editar Distribuidor" : "Ingresar Distribuidor"}</h2>
            <button onClick={toggleOpen}>Masivo Costo</button>
            <div className={f.distributorContainer}>
                <form
                    className={`${f.inputsContainerDistributor} ${f.responsiveForm}`}
                    onSubmit={handleSubmit}
                >
                    <div className={f.row}>
                        <div className={f.columnDistributor}>
                            <label htmlFor="name" className={f.label}>
                                Nombre del Distribuidor
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nombre del distribuidor"
                                value={inputs.name}
                                onChange={handleChange}
                            />

                            <label htmlFor="address" className={f.label}>
                                Dirección
                            </label>
                            <textarea
                                name="address"
                                id="address"
                                placeholder="Dirección"
                                rows="2"
                                value={inputs.address}
                                onChange={handleChange}
                            ></textarea>

                            <label htmlFor="phoneNumber" className={f.label}>
                                Número de Teléfono
                            </label>
                            <div className={f.phoneInputContainer}>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    placeholder="Agregar número de teléfono"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                />
                                <button type="button" onClick={addPhoneNumber}>
                                    Agregar
                                </button>
                            </div>

                            <ul className={f.phoneNumbersList}>
                                {inputs.phoneNumbers.map((number, index) => (
                                    <li key={index} className={f.phoneNumberItem}>
                                        {number}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <button type="submit">
                        {editingDistributorId ? "Actualizar Distribuidor" : "Guardar Distribuidor"}
                    </button>
                </form>
            </div>

            <h2>Lista de Distribuidores</h2>
            <div className={f.distributorsList}>
                {distributors
                    .slice() // Crear una copia del array para no mutar el original
                    .sort((a, b) => b.isActive - a.isActive) // Ordenar por estado activo (activo primero)
                    .map((distributor) => (
                        <div
                            key={distributor.id}
                            className={`${f.distributorItem} ${!distributor.isActive ? f.paused : ""}`}
                        >
                            <h3>{distributor.name}</h3>
                            <p>Dirección: {distributor.address}</p>
                            <p>Teléfono/s: {distributor.phoneNumbers.join(", ")}</p>
                            <p>Estado: {distributor.isActive ? "Activo" : "Inactivo"}</p>
                            <button onClick={() => handleEdit(distributor)}>Editar</button>
                            <button onClick={() => handleDelete(distributor.id)}>Eliminar</button>
                            <button onClick={() => toggleStatus(distributor.id)}>
                                {distributor.isActive ? "Pausar" : "Activar"}
                            </button>
                        </div>
                    ))}
            </div>
            <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
                <UpdateProdByDistributor toggleOpen={toggleOpen} />
            </Modal>

        </div>
    );
};

export default DistributorForm;
