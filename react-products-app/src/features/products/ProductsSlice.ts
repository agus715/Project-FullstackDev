import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
    id: number;
    product_name: string;
    category: string;
    price: number;
    discount?: number;
}

interface ProductsState {
    products: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    status: 'idle',
    error: null,
};

// Thunks
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await axios.get('http://localhost:8000/api/products');
    return response.data;
});

export const addProduct = createAsyncThunk('products/addProduct', async (product: Product) => {
    const response = await axios.post('http://localhost:8000/api/products', product);
    return response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product: Product) => {
    const response = await axios.put(`http://localhost:8000/api/products/${product.id}`, product);
    return response.data;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: number) => {
    await axios.delete(`http://localhost:8000/api/products/${id}`);
    return id;
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(product => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product.id !== action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to add product';
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update product';
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete product';
            });
    },
});

export default productsSlice.reducer;
