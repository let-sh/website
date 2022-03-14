import Header from 'components/dashboard/header';
import React from 'react';
import styles from './index.module.scss';
import Footer from 'components/dashboard/footer';
function LoginSuccess() {
  return (
    <div>
      <Header />
      <div className="container py-16 px-4" style={{ maxWidth: "1280px", margin:"auto"}}>
        <h1 className='text-6xl text-left font-bold'>About Us</h1>
      </div>

      <Footer />
    </div>
  );
}

export default LoginSuccess;
