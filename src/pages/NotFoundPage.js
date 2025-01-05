import React from 'react';

const NotFoundPage = () => {
  return (
    <div className='d-flex flex-column align-items-center py-5'>
      <h1 className='text-danger'>404 - Sayfa Bulunamadı</h1>
      <p>Aradığınız sayfa mevcut değil.</p>
    </div>
  );
};

export default NotFoundPage;
