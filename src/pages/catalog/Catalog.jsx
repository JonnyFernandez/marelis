import p from './Catalog.module.css';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useProd } from '../../context/ProdContext';

const Catalog = () => {
    const { allProduct, prod, errors } = useProd();

    useEffect(() => {
        const fetchData = async () => {
            await allProduct();
        };
        fetchData();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [distributorFilter, setDistributorFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    const getStockClass = (stock, minStock) => {
        if (stock === 0) return p.notStock;
        if (stock <= minStock) return p.lowStock;
        return p.cardStock;
    };

    const filteredProducts = prod
        ?.filter(({ name, code }) =>
            [name, code].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter(({ category }) => (categoryFilter ? category === categoryFilter : true))
        .filter(({ distributor }) => (distributorFilter ? distributor === distributorFilter : true))
        .filter(({ stock, minStock }) => {
            if (stockFilter === 'min') return stock <= minStock;
            if (stockFilter === 'cero') return stock === 0;
            return true;
        })
        .sort((a, b) => {
            if (priceFilter === 'mas') return b.price - a.price;
            if (priceFilter === 'min') return a.price - b.price;
            return 0;
        });

    return (
        <div className={p.prodManagement}>
            <h1 className={p.title}>Product Management</h1>
            <div className={p.filterContainer}>
                <select className={p.filterSelect} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">Category</option>
                    <option value="pileta">Pileta</option>
                    <option value="bazar">Bazar</option>
                    <option value="jugueteria">Jugueteria</option>
                    <option value="quimica">Quimica</option>
                </select>

                <select className={p.filterSelect} onChange={(e) => setPriceFilter(e.target.value)}>
                    <option value="">Price</option>
                    <option value="mas">Mayor</option>
                    <option value="min">Menor</option>
                </select>

                <select className={p.filterSelect} onChange={(e) => setDistributorFilter(e.target.value)}>
                    <option value="">Suplidor</option>
                    <option value="quillay">Quillay</option>
                    <option value="tecnoclor">Tecnoclor</option>
                    <option value="ana">Ana</option>
                </select>

                <select className={p.filterSelect} onChange={(e) => setStockFilter(e.target.value)}>
                    <option value="">Stock</option>
                    <option value="min">Mínimo</option>
                    <option value="cero">Sin Stock</option>
                </select>

                <div className={p.searchContainer}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={p.filterSelect}
                    />
                </div>
            </div>

            <div className={p.cardContainer}>
                {filteredProducts?.map(({ id, image, name, description, stock, minStock, price, code }) => (
                    <div key={id} className={p.card}>
                        <NavLink to={`/prod-detail/${id}`}>
                            <img src={image} alt={name} className={p.cardImage} />
                        </NavLink>

                        <div className={p.cardContent}>
                            <h2 className={p.cardTitle}>{name}</h2>
                            <span>Cod: {code && String(code).slice(-4)}</span>
                            <p className={p.cardDescription}>{description}</p>
                            <p className={getStockClass(stock, minStock)}>stock: {stock}</p>
                            <p className={p.cardPrice}>${price?.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
