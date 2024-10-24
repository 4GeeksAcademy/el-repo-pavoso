import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../store/appContext'

const LoginForm=()=>{

  const navigate=useNavigate()
  const {store,actions}=useContext(Context)

  async function submitForm(e){
    e.preventDefault()
    const formData=new FormData(e.target)
    const email=formData.get("email")
    const password=formData.get("password")
    if(!password || !email){
      console.log("Datos incompletos")
      return
    }
    let success=await actions.loginUser(email,password)
    if(!success){
      console.log("Error en el inicio de sesion")      
      return
    }

    console.log("Usuario logeado")
    //navigate(-1)
  }

  return (
    <form className='p-5' onSubmit={submitForm} style={{"minWidth":"400px"}}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email address</label>
        <input type="email" id="email" className="form-control" name="email" aria-describedby="emailHelp" />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" id="password" className="form-control" name="password" />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  )
}

export default LoginForm