import './nRecipe.css';
import { useState } from 'react';
import { storage, db } from './firebase.js';
import { useNavigate, } from 'react-router-dom';
import { Button, Form, } from "react-bootstrap";
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// funcion para agregar inputs de ingredientes (no se puede eliminar)
const addIng = () => {
    var newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.placeholder = 'Ingredient';
    newInput.className = 'form medium form-control';
    newInput.id = 'ingredient';
    newInput.autocomplete = 'off';

    document.getElementById('ingContainer').appendChild(newInput);
};

// funcion para agregar inputs de PASOS (no se puede eliminar)
const addStep = () => {
    var newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.placeholder = 'Step';
    newInput.className = 'form large form-control';
    newInput.id = 'step';
    newInput.autocomplete = 'off';

    document.getElementById('stepsContainer').appendChild(newInput);
};

// Funcion para subir la imagen y retornar el link
async function submitImg() {
    const fileInput = document.getElementById('cFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('No se adjuntó ninguna imagen!');
        console.log("No file selected");
        return null;
    }

    const metadata = {
        contentType: 'image/jpeg',
    };

    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log('User doesn\'t have permission to access the object');
                        break;
                    case 'storage/canceled':
                        console.log('User canceled the upload');
                        break;
                    case 'storage/unknown':
                        console.log('Unknown error occurred, inspect error.serverResponse');
                        break;
                }
                reject(error);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL);
                }).catch(reject);
            }
        );
    });
};

// Funcion para asegurar que todo esté escrito bien
function capitalizeFirstLetter(word) {
    if (!word) return ''; // Manejo de caso donde la palabra es nula o vacía
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Funcion para subir la receta a la database
const submitRecipe = async () => {

    // Mandar a subir la imagen y conseguir la url
    var imageRef = await submitImg();
    if (imageRef === null) {
        console.log('imageRef is null');
        return 'imgnull';
    }

    // establecer el país
    var salvaBtn = document.getElementById('salvaBtn');
    if (salvaBtn.checked) {
        var country = 's';
    } else {
        var country = 'g';
    }

    // conseguir titulo
    var title = capitalizeFirstLetter(document.getElementById('titleForm').value);

    // conseguir todos los ingredientes
    var inputs = document.querySelectorAll('#ingContainer input[id="ingredient"]');
    var ingredients = [];
    inputs.forEach(function (input) {
        if (input.value != '') {
            var capInput = capitalizeFirstLetter(input.value);
            ingredients.push(capInput);
        }
    });

    // conseguir todos los pasos
    inputs = document.querySelectorAll('#stepsContainer input[id="step"]');
    var steps = [];
    inputs.forEach(function (input) {
        if (input.value != '') {
            var capInput = capitalizeFirstLetter(input.value);
            steps.push(capInput);
        }
    });

    // subir la receta
    await addDoc(collection(db, "recipes"), {
        name: title,
        ingredients: ingredients,
        steps: steps,
        imageRef: imageRef,
        country: country,
    });

    console.log('Recipe uploaded successfully');
};

// Funcioin principal del archivo que retrona el div de html
function NewRecipe() {

    const navigate = useNavigate();

    const cadena = async () => {



        var test = await submitRecipe();
        if (test != 'imgnull') {
            navigate('/');
        }
    }

    return (
        <div id="mainDiv">
            <>
                <div id="header">
                    <div id="one">
                        <h4>Image</h4>
                        <Form.Control type="file" id='cFile' className="form medium" />
                    </div>

                    <div id="one">
                        <h4>Title</h4>
                        <Form.Control type="text" placeholder="Title" className="form medium" id='titleForm' autoComplete='off' />
                    </div>
                </div>

                <h4 className="section">Ingredients</h4>
                <div id="ingContainer">
                    <input type="text" placeholder="Ingredients" className="form medium form-control" id="ingredient" autoComplete='off' />
                </div>
                <Button variant="Link" id='newIng' className='addBtn' onClick={addIng}>
                    <img src="/imgs/addIcon.svg" width={50} height={50} />
                </Button>

                <h4 className="section">Steps</h4>
                <div id="stepsContainer">
                    <input type="text" placeholder="Step" className="form large form-control" id="step" autoComplete='off' />
                </div>
                <Button variant="Link" id='newStep' className='addBtn' onClick={addStep}>
                    <img src="/imgs/addIcon.svg" width={50} height={50} />
                </Button>
            </>

            <h4 className="section">Country</h4>
            <div id="countButs">
                <input type="radio" className="btn-check" name="options-outlined" id="salvaBtn" autoComplete="off" defaultChecked />
                <label className="btn btn-outline-dark" htmlFor="salvaBtn">El Salvador</label>
                <input type="radio" className="btn-check" name="options-outlined" id="guateBtn" autoComplete="off" />
                <label className="btn btn-outline-dark" htmlFor="guateBtn">Guatemala</label>
            </div>

            <Button onClick={() => { cadena() }} id="submit">Submit</Button>
        </div>
    );
};

export default NewRecipe;