import React from 'react'
import './lootieLoaderDot.css';
import Lottie from 'lottie-react';
import dotLoader from '../../../src/assets/loader/dotLoading.json'

const LootieLoaderDot = () => {
  return (
    <div className='dot_loader_mainWrapper'>
        <div className='dot_loaderWrapper'>
            <Lottie animationData={dotLoader} loop={true} style={{height:"100%"}} />
            <h5>Please Wait...</h5>
        </div>
    </div>
  )
}

export default LootieLoaderDot