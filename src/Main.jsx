import './App.css';
import { React, useState, useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom';
import { db } from './firebase.js';
import { collection, getDocs } from "firebase/firestore";
import { Tarjeta, Title, Qi } from './components.jsx';
import Carousel from 'react-bootstrap/Carousel';


function Main() {
  const { countryPar } = useParams();
  const location = useLocation();
  var carIndx = [];
  // if(countryPar === undefined){
  //   console.log('aaaaaaaaaaaaaaaaaaeeeeeeeeeee');
  // }

  // Conseguir las recetas de la db
  const [recipesDB, setRecipesDB] = useState(['']);
  const recipesCollectionRef = collection(db, "recipes");

  useEffect(() => {
    const getRecipes = async () => {
      const data = await getDocs(recipesCollectionRef);
      setRecipesDB(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getRecipes();
  }, []);

  function getRandomIndex(longitud, cantidad) {
    let numerosUnicos = new Set();

    while (numerosUnicos.size < cantidad) {
      let numeroAleatorio = Math.floor(Math.random() * (longitud + 1));
      numerosUnicos.add(numeroAleatorio);
    }

    carIndx = Array.from(numerosUnicos);
    console.log('por dios: ' + carIndx);
  }



  if (recipesDB[0] === '') {
    return (
      <div id="loadingContainer">
        <div id="loadingBall"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <div id="recepotaDiv">
        <Carousel id='carru' data-bs-theme='dark'>
          {recipesDB.map((recipe, indx) => {
            if (indx < 5) {
              return (
                <Carousel.Item className='carrItem' key={recipe.id}>
                  <Link to={`/Recipe/${recipe.id}`}>
                    <img src={recipe.imageRef} className='carImg' />
                  </Link>
                  <Carousel.Caption className='carrCap'>
                    <h3 className='h3Cap'>{recipe.name}</h3>
                  </Carousel.Caption>
                </Carousel.Item>
              );
            }
          })}
        </Carousel>
      </div>

      <Title text="quick search by ingredient" />
      <Qi />

      <Title text="frequently consulted recipes" />

      <div id='recipeList'>
        {recipesDB.map((recipe) => {
          if (recipe.country === countryPar) {
            return (
              <Link to={`/Recipe/${recipe.id}`}
                key={recipe.id}
              >
                <Tarjeta img={recipe.imageRef} titulo={recipe.name} pais={recipe.country} />
              </Link>
            );
          } else if (countryPar === undefined) {
            return (
              <Link to={`/Recipe/${recipe.id}`}
                key={recipe.id}
              >
                <Tarjeta img={recipe.imageRef} titulo={recipe.name} pais={recipe.country} />
              </Link>
            );
          }
        })}
      </div>

      <Title text="filter by country" />
      <div id='banderas'>
        <Link to={'/s'}>
          <Tarjeta img="/imgs/slv.svg" titulo="El Salvador" />
        </Link>
        <Link to={'/g'}>
          <Tarjeta img="/imgs/gtm.svg" titulo="Guatemala" />
        </Link>
      </div>
      <center>
        <Link to={'/'}>
          <img src="/imgs/ban.svg" id='banImg' />
        </Link>
      </center>
    </div>
  );
}


export default Main;