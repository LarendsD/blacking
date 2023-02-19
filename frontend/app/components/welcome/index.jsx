import React from 'react';
import Footer from './Footer';
import { Header } from './Header';
import Greet from './Greet';

export default function Welcome() {
  return (
    <>
      <Header />
      <Greet />
      <Footer />
    </>
  );
}
