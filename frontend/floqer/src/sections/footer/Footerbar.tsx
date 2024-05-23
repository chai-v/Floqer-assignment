import React from 'react';

interface Footerprops {
  
}

const Footerbar: React.FC<Footerprops> = () => {
  return (
    <div className='w-full h-full flex flex-row items-center justify-between bg-darkpurple py-4 px-6'>
        <div className='h-1/2 rounded-full flex flex-row items-center'>
            <img className="h-12 w-auto" src='/circle-loading.png'></img>
            <span className='ml-2 font-semibold text-2xl leading-[64px] text-cream'>Floqer</span>
        </div>
        <div className=''>
          <a href='https://github.com/chai-v/Floqer-assignment'>
            <img width='45px' height='45px' src='/github.png'></img>
          </a>
        </div>
    </div>
  );
};

export default Footerbar;
