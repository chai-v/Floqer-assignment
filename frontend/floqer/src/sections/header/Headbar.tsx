import React from 'react';

interface Headerprops {
  
}

const Headbar: React.FC<Headerprops> = () => {
  return (
    <div className='w-full py-4 flex flex-col items-center'>
        <div className='w-5/6 h-1/2 bg-cream rounded-full flex flex-row items-center px-4'>
            <img className="h-12 w-auto" src='/circle-loading.png'></img>
            <span className='ml-2 font-semibold text-2xl leading-[64px] text-purple'>Floqer</span>
        </div>
    </div>
  );
};

export default Headbar;
