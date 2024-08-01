import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ProductForm: React.FC = () => {
    const formik = useFormik({
        initialValues: {
            product_name: '',
            category: '',
            price: '',
            discount: '',
        },
        validationSchema: Yup.object({
            product_name: Yup.string()
                .max(150, 'Must be 150 characters or less')
                .required('Required'),
            category: Yup.string()
                .max(100, 'Must be 100 characters or less')
                .required('Required'),
            price: Yup.number()
                .required('Required'),
            discount: Yup.number().nullable(),
        }),
        onSubmit: values => {
            axios.post('http://localhost:8000/api/products', values)
                .then(response => {
                    console.log('Product added:', response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="product_name">Product Name</label>
            <input
                id="product_name"
                name="product_name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.product_name}
            />
            {formik.touched.product_name && formik.errors.product_name ? (
                <div>{formik.errors.product_name}</div>
            ) : null}

            <label htmlFor="category">Category</label>
            <input
                id="category"
                name="category"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
            />
            {formik.touched.category && formik.errors.category ? (
                <div>{formik.errors.category}</div>
            ) : null}

            <label htmlFor="price">Price</label>
            <input
                id="price"
                name="price"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
            />
            {formik.touched.price && formik.errors.price ? (
                <div>{formik.errors.price}</div>
            ) : null}

            <label htmlFor="discount">Discount</label>
            <input
                id="discount"
                name="discount"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.discount}
            />
            {formik.touched.discount && formik.errors.discount ? (
                <div>{formik.errors.discount}</div>
            ) : null}

            <button type="submit">Submit</button>
        </form>
    );
};

export default ProductForm;
