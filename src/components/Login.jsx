import React, { useEffect, useState } from 'react'
// Image
import vactor2 from '/img/Unikari6.png'

// Limks
import { useNavigate } from 'react-router-dom'
import apiObj from '../services/api'
import { toast } from 'react-toastify' 


export default function Login() {
    const notifyError = (msg) =>  toast.error(msg)
    const notifySuccess = (msg) => toast.success(msg)
      const navigate = useNavigate()
      const [email , setEmail] = useState()
      const [password , setPassword] = useState()
  
      const loginFunc = async () => {
          let data = {
              email : email ,
              password : password
          }
          
          if(email && password){
  
              try{
                  let result = await apiObj.login(data)
                  console.log(data)
                  if(result.data.error){
                      notifyError(result.data.error)
                  }else{

                      let data2 = result.data
                      let adminData = {
                        token : data2.token,
    
                      }
                      notifySuccess('Loign Successfully')
                      localStorage.setItem('UNIKARIADMIN' , JSON.stringify(adminData))
                      navigate('/dashboard')
                      console.log('result',result.data)
                  }
              }catch(err){
                  console.log(err)
              }
          }else{
              notifyError("Please input email & password")
          }
      }
  
      useEffect(()=>{
          if(localStorage.getItem('UNIKARIADMIN')){
              navigate('/dashboard')   
          }
      })
  return (
    
    <>
    <div className='w-full min-h-screen bg-gradient-to-b from-[#3ce2ff] to-[#18169b] p px-3'>
         <div className='min-w-[250px] w-full max-w-[400px] md:max-w-[800px] min-h-screen mx-auto flex items-center'>
             <div className='min-w-[250px] w-full max-w-[400px] h-[90vh] max-h-[400px] bg-[#fff] px-4 sm:px-10 overflow-auto pb-5'>
                 <h1 className='text-[25px] sm:text-[30px] font-[600] text-[#03041d] text-center pt-10 pb-3'>Admin Log in</h1>
                 <div className='mt-10'>
                     <p className='font-[500]'>Email ID</p>
                     <input className='w-full h-[40px] focus:border-[2px] rounded-md bg-[#] px-2 outline-none border-[1px] border-[#06061d]  ' type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
                 </div>
                 <div className='mt-3'>
                     <p className='font-[500]'>Password</p>
                     <input className='w-full h-[40px] focus:border-[2px] rounded-md bg-[#] px-2 outline-none border-[1px] border-[#06061d]  ' type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />

                     <div className='w-full flex items-center justify-end flex-wrap gap-2 mt-2'>
                        
                     </div>
                 </div>
                 <button className='w-full h-[40px] bg-[#070d33] mx-auto rounded-md mt-6 text-[white] text-[18px] font-[500]' 
                 onClick={loginFunc}
                 >Log In </button>
                
             </div>

             <div className='hidden md:block w-[400px]  bg-gradient-to-b from-[#ac2ca5] to-[#070580]'>
                 <div className='w-full  flex items-center justify-center'>
                     <img src={vactor2} alt="" className='h-[90vh] max-h-[400px]' />
                 </div>
             </div>
         </div>
     </div>
 </>
  )
}
