import React, { useState } from 'react';
import { useFirebase } from '../helpers/firebaseConfig';
import 'firebase/compat/auth';
import { useStateContext } from '../helpers/context';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Link } from 'react-router-dom';
// Initialize Firebase (replace with your Firebase config)

const auth = useFirebase.auth();

const Login = () => {
  const { setToken } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault()
    if(!email || !password){
      alert('Please enter all the fields!');
      return ;
    }
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCardinate) => {
      setToken(userCardinate.user.accessToken)
    })
    .catch(err => alert(err.message))
  };

  // Sign Up with Google
  const GoogleSignIn = async () => {
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


  

  return (
    <div>
      
      <div className='rounded p-3 bg-light' style={{ position : 'absolute', top : '50%', left : '50%', transform : 'translate(-50%, -50%)', width : '400px', maxWidth : '80%'}}>
      <form onSubmit={handleSignIn} className="form-group">
              <label className='form-label' htmlFor="email">Email</label>
              <input type="email" className="form-control" placeholder='name@example.com' value={email} onChange={e => setEmail(e.target.value)}/>
              <label className='form-label' htmlFor="psw">Password</label>
              <input type="password" placeholder='password' className="form-control" value={password} onChange={e => setPassword(e.target.value)}/>
              <button type="submit" className='btn btn-primary mt-3 form-control'>Log In</button>
            </form>
            <button className="mt-2 form-control" onClick={GoogleSignIn}><i className="fa-brands fa-google"></i> Login with Google</button>
            <p className="text-center mt-1">Don't have an account? <Link to='/signup'>Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
