import { Icon } from '@iconify/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = ({server}) => {
  const navig = useNavigate();
  const [lcUrl1, setLcUrl1] = useState('');
  const [lcUrl2, setLcUrl2] = useState('');
  const [gfgUrl1, setGfgUrl1] = useState('');
  const [gfgUrl2, setGfgUrl2] = useState('');

  const update = async () => {
    try {
      const r1 = await axios.post(`${server}/images/lc`, {
        imgsUrl : [lcUrl1, lcUrl2],
      });
      console.log(r1.data);
      const r2 = await axios.post(`${server}/images/gfg`, {
        imgsUrl : [gfgUrl1, gfgUrl2],
      });
      console.log(r2.data);
    } catch (error) {
      console.log('Server error: ' + error.message);
    }
  };
    const [code, setCode] = useState("");
  
    return (
      <div className='bg-white w-full h-full sm:min-h-screen flex flex-col sm:flex-row p-3 sm:p-0'>
        <Icon
     className="absolute size-12 cursor-pointer hover:p-1 top-2 right-2 rounded-full bg-white p-2" icon="bxs:home"
     onClick={()=>navig('/')}
     />
  
      <div className='w-full sm:w-1/2 flex h-full py-3 sm:py-0 sm:min-h-screen flex-col items-center justify-center'>
  
      <h1 className='text-4xl font-extrabold font-mono text-blue-600'>
        Admin Route 
        
      </h1>
      <h1 className='text-3xl font-extrabold font-mono text-blue-600'>
        add Problem of the Day
        
      </h1>
  
         <div className='w-full sm:w-1/2'>

         <div className='m-1 p-1'>
            <label className='text-lg'>
          LeetCode :
          <div className='flex flex-col justify-evenly space-y-2'>
          <input
            className='border-2 border-gray-300 rounded-md size-9 p-2 w-full'
            type='text'
            placeholder='img Url...'
            onChange={(e)=> setLcUrl1(e.target.value)}
            value={lcUrl1}
          />
          <input
            className='border-2 border-gray-300 rounded-md size-9 p-2 w-full'
            type='text'
            placeholder='img Url...'
            onChange={(e)=> setLcUrl2(e.target.value)}
            value={lcUrl2}
          />
          </div>  
        </label>
        </div>


         <div className='m-1 p-1'>
            <label className='text-lg'>
          gfg :
          <div className='flex flex-col justify-evenly space-y-2'>
          <input
            className='border-2 border-gray-300 rounded-md size-9 p-2 w-full'
            type='text'
            placeholder='img Url...'
            onChange={(e)=> setGfgUrl1(e.target.value)}
            value={gfgUrl1}
          />
          <input
            className='border-2 border-gray-300 rounded-md size-9 p-2 w-full'
            type='text'
            placeholder='img Url...'
            onChange={(e)=> setGfgUrl2(e.target.value)}
            value={gfgUrl2}
          />
          </div>  
        </label>
        </div>


         <div className='m-1 p-1'>
            <label className='text-lg'>
          security code :
          <div className='flex justify-evenly space-x-2'>
          
          <input
            className='border-2 border-gray-300 rounded-md size-9 p-2 w-full'
            type='text'
            placeholder='code****'
            onChange={(e)=>setCode(e.target.value)}
            value={code}
          />
          <button 
            onClick={()=>setCode("admin123")}
           className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-1 rounded shadow-md"
           >demo</button>

          </div>  
        </label>
        </div>
        <div className='w-full flex justify-center items-center m-2'>
            <button 
            onClick={update}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
            >Update</button>
            </div>
         </div>
     </div>
  
  
      <div className="w-full sm:w-1/2 flex justify-center items-center">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" alt="img"/>
      </div>
            
    </div>
    );
  };

export default Admin;
