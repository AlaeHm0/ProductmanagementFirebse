import React, { useEffect, useState } from "react"
import { useFirebase } from "../helpers/firebaseConfig";
import 'firebase/compat/database';
import { Link } from "react-router-dom";

const db = useFirebase.database()



function Products () {

  const [products, setProducts] = useState([])
  useEffect(()=>{
    const productsRef = db.ref('products')
    productsRef.on('value', (snapchot) => {
      const productData = snapchot.val()
      const productsArray = []
      for(let id in productData){
        productsArray.push({id, ...productData[id]})
      }
      setProducts(productsArray)
    })
  }, [])

  const deleteProduct =  (id) => {
    const confirm = window.confirm('are you sure?')
    if(confirm){
       db.ref(`/products/${id}`).remove()
       alert('Product deleted successfully!')
    }
  }

  return (
    <div className="container">
      <div className="row">
      <div className="col-sm-1"></div>
      <div className="col-sm-10">
        <table className="table table-striped table-bordered" id="datatable">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Code Product</th>
              <th>Name Product</th>
              <th>Unite Price</th>
              <th>Quantite</th>
              <th>Full Price</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            { products.length === 0 ? <tr><td colSpan={7} className="text-center">Loading...</td></tr> :  products.map((pro, key) => (
              <tr key={key}>
                <td>
                  <img src={pro.imgURL} alt="" style={{width : '100px', height : '100px'}}/>
                </td>
                <td>{pro.code}</td>
                <td>{pro.name}</td>
                <td>{pro.priceU}</td>
                <td>{pro.quantite}</td>
                <td>{pro.priceU * pro.quantite}</td>
                <td>
                <button className="btn btn-outline-danger mx-2" onClick={()=>deleteProduct(pro.id)}><i className="fa fa-trash"></i></button>
                <Link to={`/addProduct/${pro.id}`} className="btn btn-outline-warning"><i className="fa fa-pen-to-square"></i></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-sm-1"></div>
      </div>
    </div>
  )
};

export default Products;
