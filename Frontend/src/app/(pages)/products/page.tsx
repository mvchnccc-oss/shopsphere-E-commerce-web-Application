import { getAllProducts } from '@/actions/products.actions';
import ProductSearch from '@/components/productsearch';
import React from 'react'

export default async function Allproducts() {
    const products = await getAllProducts();

    return (<>

        <div className='py-7'>
            <ProductSearch products={products} />
        </div>

    </>)
}
