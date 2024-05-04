import React, { useEffect, useState } from "react"
import { useFirebase } from "../helpers/firebaseConfig"
import 'firebase/compat/database';
import 'firebase/compat/storage';
import { useNavigate, useParams} from "react-router-dom";

const db = useFirebase.database()
const storage = useFirebase.storage()

function AddProduct () {
    const { productId } = useParams();
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const [product, setProduct] = useState({})
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [quantite, setQuantite] = useState(0)
    const [priceU, setPriceU] = useState(0)
    const [file, setFile] = useState(null)
    const [priceT, setPriceT] = useState(0)
    const [imgURL, setImgURL] = useState('')
    
    // Set the values if the inputs in Edit Mode
    useEffect(()=>{
        if(typeof productId !== 'undefined'){
            setEditMode(true)
            const productRef = db.ref('products').child(productId)
            productRef.once('value', (snapchot) => {
                const productData = snapchot.val()
                if(productData){
                    setProduct(productData)
                    setCode(productData.code)
                    setName(productData.name)
                    setPriceU(productData.priceU)
                    setQuantite(productData.quantite)
                    setPriceT(productData.priceU * productData.quantite)
                }
            })
        }
    }, [])
    
    const handleChangeFile = e => {
        const ffile = e.target.files[0]
        if(ffile){
            const extention = ffile.name.split('.').pop().toLowerCase(); // Get the extention from its name
            if(['jpg', 'jpeg', 'png'].includes(extention)){ // Check if the file type is image
                alert('picture added succeffuly!')
                setFile(e.target.files[0])
            }else{
                alert('the file must be type of image (jpg, jpeg, png)')
                e.target.value = ''
            }
        }
    }
    
    // Handle Submit function
    const handleSubmit = async e => {
        e.preventDefault()
        if(!code || !name || !quantite || !priceU) return
        // handle file upload and get file URL
        if(!editMode){
            if(file){
                const fileRef = storage.ref().child(file.name)
                await fileRef.put(file)
                .then(() => console.log('file uploaded with success!'))
                .catch(err => console.error(err.message))
                const fileURL = await fileRef.getDownloadURL()
                setImgURL(fileURL)
            }
            // handle product upload
            db.ref('products').push({
                code,
                name,
                quantite : parseInt(quantite),
                priceU : parseFloat(priceU),
                imgURL
            })
            alert('Product added successfully!')
            window.location.reload()
            
        }else{
            if(file){
                // delete the old image
                if(product.imgURL){
                    const imgUrl = product.imgURL
                    const imgId = imgUrl.slice(imgUrl.lastIndexOf('/')+1, imgUrl.lastIndexOf('?'))
                    const storageRef = storage.ref().child(imgId)
                    await storageRef.delete()
                }
                // add the new image
                const fileRef = storage.ref().child(file.name)
                await fileRef.put(file)
                .then(() => console.log('file uploaded with success!'))
                .catch(err => console.error(err.message))
                const fileURL = await fileRef.getDownloadURL()
                await db.ref(`products/${productId}`).update({
                    imgURL : fileURL
                })
            }
            // handle product upload
            await db.ref(`products/${productId}`).update({
                code,
                name,
                quantite : parseInt(quantite),
                priceU : parseFloat(priceU),
            })
            alert('Product updated successfully!')
            navigate('/products')
        }
    }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 bg-light rounded p-3">
            <form className="form-group" onSubmit={handleSubmit}>
                <label htmlFor="code_produit" className="form-label">Code Product</label>
                <input type="text" className="form-control" value={code} onChange={e => setCode(e.target.value)} required/>
                <label htmlFor="" className="form-label">Name Product</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required/>
                <label htmlFor="" className="form-label">Unite Price</label>
                <input type="number" step={0.01} className="form-control" value={priceU} onChange={e =>{ setPriceU(e.target.value); setPriceT(e.target.value * quantite)}} required/>                
                <label htmlFor="" className="form-label">Quantite</label>
                <input type="number" value={quantite} min={0}  onChange={e =>{ setQuantite(e.target.value);setPriceT(e.target.value * priceU)}} className="form-control" required/>
                <label htmlFor="" className="form-label">Total Price</label>
                <input type="number" className="form-control" value={priceT} readOnly/>
                <label htmlFor="" className="form-label">Image </label>
                <input type="file" className="form-control" onChange={handleChangeFile}/>
                <button type="submit" className="btn btn-block btn-success mt-2">{editMode ? 'Edit Product' : 'Add Product'}</button>
            </form>
        </div>
      </div>
    </div>
  )
};

export default AddProduct;
