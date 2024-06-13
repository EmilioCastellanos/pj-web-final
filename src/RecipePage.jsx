import './RecipePage.css';
import React, { useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = doc(db, 'recipes', id);
        const currRecipe = await getDoc(recipeRef);

        if (currRecipe.exists()) {
          setRecipe(currRecipe.data());
        } else {
          console.error('No such document!');
        }
      } catch (err) {
        console.error('Failed to fetch recipe: ' + err);
        setFetchError(true);
      }
    };

    fetchRecipe();
  }, [id]);

  if(fetchError){
    return(
      <center><h1>No se pudo conseguir la receta especificada</h1></center>
      
    );
  }
  if (!recipe) {
    return (
      <div id="loadingContainer">
        <div id="loadingBall"></div>
      </div>
    );
  }


  return (
    <div id='recContainer'>
      <div id='title'>
        <img src='/imgs/bowl.png' id='bowl' alt='bowl' />
        <h1 id='name'>{recipe.name}</h1>
      </div>

      <Image src={recipe.imageRef} rounded id='recipeImg' />
      <div id='ingredients'>
        <h1 className='oswald' id='ingTit'>INGREDIENTS</h1>
        <ul>
          {recipe.ingredients.map((ing) => {
            return (
              <li id='ing' key={ing}>{ing}</li>
            );
          })}
        </ul>
      </div>

      <div id="stepsCont">
        <ol id='ol'>
          {recipe.steps.map((step) => {
            return (
              <li id='stepRP' key={step}>{step}</li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default RecipePage;
