import './App.css';
import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';


export function Navbarpj() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" id='miNav' sticky="top">
      <Container>
        <img src="/imgs/chef_hat.png" id='chefImg' width={'50px'} />
        <Navbar.Brand href="/" className='oswald'>Recipe book</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/About" className='oswald'>About</Nav.Link>
        </Nav>
        <Nav.Link href="/uploadRecipe" id='addCont'><img src="/imgs/addIcon.svg" width={'50px'} id='addNav' /></Nav.Link>
      </Container>
    </Navbar>
  );
};

export const Tarjeta = ({ img, titulo, pais }) => {
  const [hover, setHover] = useState(false);

  const setFlag = () => {
    if (pais === 's') {
      return (
        < img src='/imgs/slv.svg' className="imagenSuperiorDerecha" />
      );
    } else if (pais === 'g') {
      return (
        < img src='/imgs/gtm.svg' className="imagenSuperiorDerecha" />
      );
    }
  }

  const handleHover = () => {
    setHover(!hover);
  };

  return (
    <div className={`tarjeta ${hover ? 'hover' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
      <div className="cara-delantera">
        <img src={img} alt="Imagen" className="cardImg" />
        {setFlag()}
      </div>
      <div className="cara-trasera">
        <h2 className="titulo">{titulo}</h2>
      </div>
    </div>
  );
};

export const Title = ({ text }) => {
  return <h1 className="secTitle">{text}</h1>;
};

export function Qi() {
  return (
    <div className='container qi'>
      <Link to='/tomate'><img src="/imgs/tomato.png" className="ing" /></Link>
      <Link to='/maiz'><img src="/imgs/tomato.png" className="ing" /></Link>
      <Link to='/harina'><img src="/imgs/tomato.png" className="ing" /></Link>
      <Link to='/pollo'><img src="/imgs/tomato.png" className="ing" /></Link>
      <Link to='/pan'><img src="/imgs/tomato.png" className="ing" /></Link>
    </div>
  );
};