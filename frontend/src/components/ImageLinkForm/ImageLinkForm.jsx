import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) =>{
  return(
    <div>
      <p className='f3'>
        {'Sube aquí tu imagen:'}
      </p>
      <div className='center'>
        <div className='form center pa4 br3 shadow-5'>
          <input onChange={onInputChange} className='f4 pa2 w-70 center' type='tex' />
          <button
            className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
            onClick={onButtonSubmit}
          >
            Detectar
          </button>
        </div>
      </div>
    </div>
  );
}
export default ImageLinkForm;
