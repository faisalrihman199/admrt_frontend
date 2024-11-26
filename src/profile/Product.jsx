import React, { useEffect, useState } from 'react'
import { ProductAdventiser } from '../Layout/context/adventiser/productAdventiser';
import { allProducts} from '../service/profile';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const Product = () => {
    const authHeader = useAuthHeader();
    const [products, setProducts]=useState([]);
    useEffect(()=>{
        allProducts(authHeader)
        .then((res)=>{
            console.log("All Products :", res.data);
            setProducts(res.data)
            
        })
        .catch((err)=>{
            console.log("Error :", err);
            
        })
    },[])
    
    return (
        <div>          

             <ProductAdventiser userProducts={products} />
        </div>
    )
}

export default Product