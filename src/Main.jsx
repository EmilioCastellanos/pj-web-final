import './App.css';
import { React, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { db } from './firebase.js';
import { collection, getDocs } from "firebase/firestore";
import { Tarjeta, Title, Qi } from './components.jsx';
import Carousel from 'react-bootstrap/Carousel';


function Main() {
  const { filterPar } = useParams();
  var carIndx = [];

  //----------------------- Conseguir las recetas de la db ----------------------- 
  const [recipesDB, setRecipesDB] = useState(['']);
  const recipesCollectionRef = collection(db, "recipes");

  useEffect(() => {
    const getRecipes = async () => {
      const data = await getDocs(recipesCollectionRef);
      setRecipesDB(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getRecipes();
  }, []);

  //----------------------- Create Array with Random Indexs----------------------- 
  function getRandomIndex(longitud, cantidad) {
    let numerosUnicos = new Set();

    while (numerosUnicos.size < cantidad) {
      let numeroAleatorio = Math.floor(Math.random() * (longitud));
      numerosUnicos.add(numeroAleatorio);
    }

    carIndx = Array.from(numerosUnicos);

    //We use this array as a parameter of the carrousel component. So it renderizes random recipes.
  }


  //----------------------- Loading Animation ----------------------- 
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
        {/* ------------------- Carousel Component with Random Recipes ------------------- */} 
        <Carousel id='carru' data-bs-theme='dark'>
          {getRandomIndex(recipesDB.length, 5)}
          {recipesDB.map((recipe, indx) => {
            if (carIndx.includes(indx)) {
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
      <Qi /> {/* ------------------- Quick Ingredient Bar ------------------- */}

      <Title text="Recipes List" /> {/* ------------------- Recipes Renderization ------------------- */}

      <div id='recipeList'>
        {recipesDB.map((recipe) => { //We starte looping the recipes array.
          if (recipe.country === filterPar) { //Verify if theres a filtration by the country.
            return (
              <Link to={`/Recipe/${recipe.id}`}
                key={recipe.id}
              >
                <Tarjeta img={recipe.imageRef} titulo={recipe.name} pais={recipe.country} />
              </Link>
            );
          } else if (filterPar === undefined) { //if theres is no filter.
            //Return all the recipes.
            return (
              <Link to={`/Recipe/${recipe.id}`}
                key={recipe.id}
              >
                <Tarjeta img={recipe.imageRef} titulo={recipe.name} pais={recipe.country} />
              </Link>
            );
          } else {
            var banderita = true; //if theres is a filtration by any ingredient.
            //return all the recipes that includes the specific ingredient.
            return (
              recipe.ingredients.map((currIng) => { //looping the ingredients of each recipe.
                var arrIng = currIng.split(' ');
                if (banderita) {
                  return (
                    arrIng.map((currWord) => { //looping each ingredient if it has more than 1 word.
                      if (currWord.toUpperCase() === filterPar.toUpperCase()) { //verify if it matches the ingredient.
                        banderita = false;
                        //returning the recipe with ingredient.
                        return (
                          <Link to={`/Recipe/${recipe.id}`}
                            key={recipe.id}
                          >
                            <Tarjeta img={recipe.imageRef} titulo={recipe.name} pais={recipe.country} />
                          </Link>
                        );
                      }
                    })
                  );
                }
              })
            );
          }
        })}
      </div>
      {/*------------------- Filter Section -------------------*/}
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