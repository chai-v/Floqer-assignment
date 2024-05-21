import './App.css'
import { useState } from 'react';
import Headbar from './sections/header/Headbar';
import Footerbar from './sections/footer/Footerbar';
import Container from './sections/content/Container';
import { FloatButton } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import Chat from './components/Chat';


function App() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className='w-full h-full flex flex-col bg-custom-gradient'>
        <FloatButton style={{
          width: '50px',
          height: '50px',
          fontSize: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF7F7',
          zIndex: 10
        }} icon={<CommentOutlined />} tooltip={<div>Chat with Floqer</div>} onClick={()=>{setOpen(true)}}></FloatButton>

        <div className={`fixed top-0 right-0 h-full w-1/3 bg-cream z-50 shadow-lg  duration-300 ${ open ? '' : 'translate-x-full'}`}>
          <div className={`w-12 h-12 bg-cream border border-darkcream rounded-full ${ open ? '-translate-x-5' : ''}  mt-4 flex flex-col items-center`}>
              <button className='text-4xl' onClick={()=>{setOpen(false)}}>
                &times;
              </button>
          </div>
          <div className='p-4 overflow-hidden'>
            <h2 className='text-lg font-semibold'>Chat with <span className='text-purple'>Floqer</span></h2>
            <p>Gain deeper insights of the data with the power of AI and its knowledge base that are beyond the tables.</p>
            <Chat/>
          </div>
        </div>

        <div>
          <Headbar/>
        </div>
        <div className=''>
          <Container/>
        </div>
        <div>
          <Footerbar/>
        </div>
      </div>
    </>
  )
}

export default App
