import { getOrdersAction } from '@/lib/actions/orders.action'
import React from 'react'

export default async function page() {
    const orders = await getOrdersAction();
    
    
    return (
        <>








        </>
    )
}
