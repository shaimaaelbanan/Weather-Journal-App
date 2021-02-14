/* Global Variables */
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = +d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();

const apiKey = "a6680253fe3555a1b2542ca7348f96b5";
const generate = document.querySelector("#generate")

generate.addEventListener('click', async () => {
    const zipCode = document.querySelector("#zip").value;
    const feelings = document.querySelector("#feelings").value;
    getWeather(zipCode, feelings);
    
    if(!zipCode){
        return alert("Please Enter your area's zipCode!")
    }
    if(!feelings){
        return alert("Please Enter what you feel right now!")
    }
})

async function getWeather(zipCode, feelings){
    try{

        // fetching the weather data from the api
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`);

        if(response.status === 404 || response.status === 400){
            return alert("Please Enter a valid zipCode!");
        }

        const weatherData = await response.json();

        const temp = weatherData.main.temp;

        //Fetching data from the server
        const serverData = await fetch('/getData', {
            credentials: "same-origin"
        });
        const data = await serverData.json();

        //Sending data to the server
        await fetch('/saveData', {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: newDate,
                temp: temp,
                feelings: feelings
            })
        });

        //Updating UI
        updatingAppUI(data);
    }
    catch(err){
        alert("Something went wrong! Please try again");
    }
}

function updatingAppUI(data){
    document.getElementById('date').innerHTML = `Date: ${data.date}`;
    document.getElementById('temp').innerHTML = `Temperature: ${data.temp}`;
    document.getElementById('content').innerHTML = `Feelings: ${data.feelings}`;    
}