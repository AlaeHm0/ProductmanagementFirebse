import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useFirebase } from "../helpers/firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import 'firebase/compat/auth';
import { useStateContext } from "../helpers/context";

const auth = useFirebase.auth();

function SignUp () {
  const { setToken } = useStateContext();
  const [ displayName, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ psw, setPassword ] = useState('')
  const [ confirmPsw, setConfirmPsw ] = useState('')

  const handleConfirmPassword = (e) => {
    setConfirmPsw(e.target.value)
    if(e.target.value === psw){
      e.target.style.boxShadow = '0 0 0 0.2rem rgba(0, 255, 0, 0.25)';
    }else{
      e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 0, 0, 0.25)';
    }
  }
  // Sign Up with Google
  const GoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const accessToken = userCredential.user.accessToken;
      setToken(accessToken)
      // Handle the accessToken or userCredential.user as needed
    } catch (error) {
      console.error('Google sign-up error:', error.message);
      // Handle the error
    }
  }
  
  const handleSignUp = async (e) => {
    e.preventDefault()
    if(!email || !psw || !confirmPsw){
      alert('Please entre all the fields!')
      return
    }
    if (psw !== confirmPsw){
      alert('Please write the same password!')
      return
    }
    await createUserWithEmailAndPassword(auth, email, psw)
    .then(userCardinate =>{ 
      auth.currentUser.updateProfile({
        displayName : displayName,
      })
      setToken(userCardinate.user.accessToken)
    })
    .catch(err => alert(err.message))
  }
  return (
    <div style={{position : 'absolute', left : '50%', top : '50%', transform : 'translate(-50%, -50%)', width : '400px', maxWidth : '80%'}} className="rounded bg-light p-3">
      <form className="form-group" onSubmit={handleSignUp}>
        <label htmlFor="name" className="form-label">Full Name</label>
        <input type="text" value={displayName} placeholder="full name" onChange={e => setName(e.target.value)} className="form-control" />
        <label className="form-label" htmlFor="email">Email</label>
        <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
        <label className="form-label" htmlFor="psw">Password</label>
        <input type="password" value={psw} onChange={e => setPassword(e.target.value)} className="form-control"/>
        <label className="form-label" htmlFor="confirmPsw">Confirm Password</label>
        <input type="password"  value={confirmPsw}  onBlur={e => e.target.style.boxShadow = 'none'} onChange={handleConfirmPassword} onFocus={handleConfirmPassword} className="form-control" />
        <button type="submit" className="btn btn-primary mt-3 form-control">Sign Up</button>
      </form>
      <button className="form-control mt-2" onClick={GoogleSignUp}><i className="fa-brands fa-google"></i> SignUp with Google</button>
      <p className="text-center mt-1">Already have an account? <Link to='/login'>Log in</Link></p>
    </div>
  )
};

export default SignUp;
