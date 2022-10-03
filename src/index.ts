// Prueba TS corre en index
let message = 'Hello World';
console.log(message);
const checkButton = document.querySelector("#enviarBtn");
let checkBtn = checkButton; //declaración no null
const botones = document.querySelectorAll("#casilla"); //las casillas del cartón del bingo
var numberDisplay = document.querySelector("#numDisplay"); //donde se mostrará el número escogido por el programa
var recorrido: Array<String> = []; //array para los números aleatorios que ha escogido el sistema
var muestra: Array<number> = []; //array que contiene los 75 números aleatorios de los que se puede escoger
var marcados : Array<String> = []; //array para los números marcados por el usuario
var bingoState = false; //si el usuario ganó o no

//Asignar a todos los botones la función de hacerle clic a un número
for (const x of botones) {
    x.addEventListener("click", numberClick);
}

function fillMuestra () {
    //Llenar el array de los 75 números que puedan sacarse en el bingo
    for (let index = 1; index < 76; index++) {
        muestra.push(index);
    }
}

//Función para escoger un número de los 75 y quitarlo de la lista de números que aún no han aparecido
function randomBingo() {
    if (muestra.length>=1) {
        const item = muestra[Math.floor(Math.random()*muestra.length)];
        console.log("Moderador: ", item);
        numberDisplay.textContent = item.toString();
        const index = muestra.indexOf(item);
        muestra.splice(index, 1);
        recorrido.push(item.toString());
        console.log(muestra);
    }
}

//función que resalta la casilla del número al que le hizo clic el usuario y lo agrega al array "marcados"
function numberClick(event) {
    let botonMarcado = event.target;
    console.log(botonMarcado.innerHTML);
    if (botonMarcado.classList.contains("clicked")) {
        botonMarcado.classList.remove("clicked");
        let indexQuitar = marcados.indexOf(botonMarcado.innerHTML);
        marcados.splice(indexQuitar,1);
    } else {
        botonMarcado.classList.add("clicked");
        marcados.push(botonMarcado.innerHTML);
    }
    console.log(marcados);
}

//función para generar el tablero aleatoriamente al inicio
function generarTablero() {
    //Seleccionar números de 1 a 75 y llenar el tablero con ellos
    for (const element of botones) {
        const item = muestra[Math.floor(Math.random()*muestra.length)];
        const index = muestra.indexOf(item);
        muestra.splice(index, 1);
        element.innerHTML = item.toString();
    }
    muestra = [];
    fillMuestra();
    console.log("MUESTRA ", muestra);
}

//función que le reportará al moderador que el usuario terminó el bingo
function bingoComplete() {
    console.log("Bingo marcado como completo. Esperando a que el moderador revise...");
    for (let ind of marcados) {
        if (recorrido.includes(ind)) {
            //El número marcado sí está en el recorrido
            bingoState = true;
        } else {
            //Marcó un número que no está en el recorrido
            bingoState = false;
            break;
        }
    }
    if (marcados.length >= 24) {
        //Marcó suficientes números
    } else {
        //Es imposible ganar porque no marcó todo el cartón
        bingoState = false;
    }
    if (bingoState == true) {
        numberDisplay.textContent = "Felicidades, ganó!";
        console.log("Ganador");
    } else {
        numberDisplay.textContent = "No ha ganado.";
        console.log("Perdedor");
    }
}

//Asignar función al botón de Bingo para que bingoState sea true cuando ha hecho clic indicando que completó el bingo
checkBtn.addEventListener("click", bingoComplete);

//En el momento en el que se abre la página se le genera un tablero al usuario
window.onload = function () {
    fillMuestra();
    generarTablero();
    ejecucionJuego.displayBingo();
};

class ejecucionJuego {
    static wait(time: number): Promise<null> {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }

    static async displayBingo() {
        while (bingoState==false) {
            await ejecucionJuego.wait(4000);
            randomBingo();
        }
    }
}