import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, CircularProgress, List, ListItem, ListItemText, TextField } from '@mui/material';

interface Product {
    id: number;
    product_name: string;
    category: string;
    price: number;
    discount?: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Product>({
        id: 0,
        product_name: '',
        category: '',
        price: 0,
        discount: 0,
    });

    useEffect(() => {
        if (status === 'idle') {
            fetchProducts();
        }
    }, [status]);

    const fetchProducts = async () => {
        setStatus('loading');
        try {
            const response = await axios.get('http://localhost:8000/api/products');
            setProducts(response.data);
            setStatus('succeeded');
        } catch (error) {
            setError('Failed to fetch products');
            setStatus('failed');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8000/api/products/${id}`);
            fetchProducts(); // Re-fetch the products after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
    };

    const handleUpdate = async () => {
        if (editingProduct) {
            try {
                await axios.put(`http://localhost:8000/api/products/${editingProduct.id}`, editingProduct);
                fetchProducts(); // Re-fetch the products after update
                setEditingProduct(null);
            } catch (error) {
                console.error('Error updating product:', error);
            }
        }
    };

    const handleAddProduct = async () => {
        try {
            await axios.post('http://localhost:8000/api/products', newProduct);
            fetchProducts(); // Re-fetch the products after adding
            setNewProduct({
                id: 0,
                product_name: '',
                category: '',
                price: 0,
                discount: 0,
            });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    if (status === 'loading') {
        return <CircularProgress />;
    }

    if (status === 'failed') {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div>
            <Typography variant="h4">PRODUK</Typography>

            {/* Form untuk tambah Produk baru */}
            <div>
                <Typography variant="h6">Tambah Produk Baru</Typography>
                <TextField
                    label="Product Name"
                    value={newProduct.product_name}
                    onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                />
                <TextField
                    label="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
                <TextField
                    label="Price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                />
                <TextField
                    label="Discount"
                    type="number"
                    value={newProduct.discount || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
                />
                <Button variant="contained" color="primary" onClick={handleAddProduct}>
                    Tambah Produk
                </Button>
            </div>

            {/* List produk */}
            <List>
                {products.map(product => (
                    <ListItem key={product.id}>
                        <ListItemText
                            primary={product.product_name}
                            secondary={`${product.category} - $${product.price} ${product.discount ? ` - ${product.discount}% off` : ''}`}
                        />
                        <Button variant="contained" color="primary" onClick={() => handleEdit(product)} style={{ marginRight: '10px' }}>
                            Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleDelete(product.id)}>
                            Delete
                        </Button>

                        {/* Edit form */}
                        {editingProduct?.id === product.id && (
                            <div>
                                <TextField
                                    label="Product Name"
                                    value={editingProduct.product_name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, product_name: e.target.value })}
                                />
                                <TextField
                                    label="Category"
                                    value={editingProduct.category}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                />
                                <TextField
                                    label="Discount"
                                    type="number"
                                    value={editingProduct.discount || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, discount: Number(e.target.value) })}
                                />
                                <Button variant="contained" color="primary" onClick={handleUpdate}>
                                    Update
                                </Button>
                            </div>
                        )}
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ProductList;
