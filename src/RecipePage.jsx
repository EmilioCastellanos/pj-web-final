import './RecipePage.css';
import React, { useEffect, useState } from 'react';
import { Image, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
//------------------- Reciep Page -------------------
function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [eliminated, setEliminated] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = doc(db, 'recipes', id);
        const currRecipe = await getDoc(recipeRef); //Geting the Recipe from the DB

        if (currRecipe.exists()) { //Verify if exists
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

  if (fetchError) {
    return (
      <center><h1>No se pudo conseguir la receta especificada</h1></center>

    );
  }
  //------------------- Loading Animation-------------------
  if (!recipe) {
    return (
      <div id="loadingContainer">
        <div id="loadingBall"></div>
      </div>
    );
  }


  //------------------- Function to eliminate a recipe -------------------
  const eliminate = async () => {
    await deleteDoc(doc(db, "recipes", id));
    setEliminated(true);
  }

  if(eliminated){
    return(
      <center>
        <h1>The recipe has been successfully deleted</h1>
      </center>
    );
  }


  //------------------- Recipe Body with all the steps and information -------------------
  return (
    <div id='recContainer'>
      <div id='title'>
        <img src='/imgs/bowl.png' id='bowl' alt='bowl' />
        <h1 id='name'>{recipe.name}</h1>
        <Button variant="outline-dark" onClick={eliminate}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M16 1.75V3h5.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75Zm-6.5 0V3h5V1.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM4.997 6.178a.75.75 0 1 0-1.493.144L4.916 20.92a1.75 1.75 0 0 0 1.742 1.58h10.684a1.75 1.75 0 0 0 1.742-1.581l1.413-14.597a.75.75 0 0 0-1.494-.144l-1.412 14.596a.25.25 0 0 1-.249.226H6.658a.25.25 0 0 1-.249-.226L4.997 6.178Z"></path><path d="M9.206 7.501a.75.75 0 0 1 .793.705l.5 8.5A.75.75 0 1 1 9 16.794l-.5-8.5a.75.75 0 0 1 .705-.793Zm6.293.793A.75.75 0 1 0 14 8.206l-.5 8.5a.75.75 0 0 0 1.498.088l.5-8.5Z"></path>
          </svg>
        </Button>

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
