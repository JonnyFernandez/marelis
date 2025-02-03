import p from './Catalog.module.css';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useProd } from '../../context/ProdContext';

const Catalog = () => {
    const { allProduct, prod, categories, distributors, getCategory, get_distributor, filter_product } = useProd();
    // console.log(prod);

    const fetchData = async () => {
        await allProduct();
        await getCategory();
        await get_distributor();
    };

    useEffect(() => {
        fetchData();
    }, []);



    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [distributorFilter, setDistributorFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');

    useEffect(() => {
        if (categoryFilter) filter_product('category', categoryFilter);
        if (priceFilter) filter_product(priceFilter === 'mas' ? 'price_high' : 'price_low');
        if (distributorFilter) filter_product('distributor', distributorFilter);
        if (stockFilter) filter_product(stockFilter === 'min' ? 'low_stock' : 'out_of_stock');
    }, [categoryFilter, priceFilter, distributorFilter, stockFilter]);

    const getStockClass = (stock, minStock) => {
        if (stock === 0) return p.notStock;
        if (stock <= minStock) return p.lowStock;
        return p.cardStock;
    };

    const filteredProducts = prod?.filter(({ name, code }) =>
        [name, code].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const refresh = () => {
        fetchData();
    }
    return (
        <div className={p.prodManagement}>
            <div onClick={refresh} className={p.titleProductManagement}>Product Management</div>
            <div className={p.filterContainer}>
                {/* Filtro por categoría */}
                <select className={p.filterSelect} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">Category</option>
                    {categories.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                </select>

                {/* Filtro por precio */}
                <select className={p.filterSelect} onChange={(e) => setPriceFilter(e.target.value)}>
                    <option value="">Price</option>
                    <option value="mas">Mayor</option>
                    <option value="min">Menor</option>
                </select>

                {/* Filtro por distribuidor */}
                <select className={p.filterSelect} onChange={(e) => setDistributorFilter(e.target.value)}>
                    <option value="">Suplidor</option>
                    {distributors.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                </select>

                {/* Filtro por stock */}
                <select className={p.filterSelect} onChange={(e) => setStockFilter(e.target.value)}>
                    <option value="">Stock</option>
                    <option value="min">Mínimo</option>
                    <option value="cero">Sin Stock</option>
                </select>

                {/* Barra de búsqueda */}
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

            {/* Renderizado de productos filtrados */}
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
