let text = document.querySelector('input[type="text"]')
let form = document.getElementById('weather-form')
let degree = document.getElementById('degree')

let description = document.getElementById('description')
let humidity = document.getElementById('humidity')
let latt = document.getElementById('lat')
let lonn = document.getElementById('lon')
let output = document.getElementById('output')


// show the spinner
const spinner = document.querySelector('#spinner')
   

form.addEventListener('submit', getWeather)

function getWeather(e){
    e.preventDefault()

    geocode(text.value)
    output.style.display = 'none'
    spinner.style.display = 'block';
}

function geocode(address){
    axios
    .get(`https://us1.locationiq.com/v1/search.php?key=fc4f8c5031e9f1&q=${address}&format=json`, {
      timeout: 10000
    })
    .then(res => {
        console.log(res.data)
        forecast(res.data[0].lat, res.data[0].lon)
    })
    .catch(err => console.error(err));
}

function forecast(lat, lon){
    axios
    .get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=7b7f723bec631e0dad07c8f0f1a94247`, {
      timeout: 10000
    })
    .then(res => {
        
        spinner.style.display = 'none';
        console.log(res.data)
        showOutPut(res, lat, lon)
        resetForm()
        
    })
    .catch(err => console.error(err));
}

function showOutPut(res, lat, lon){
        output.style.display = 'block'
        degree.innerText = `${res.data.current.temp}*c`;
        description.innerText = res.data.current.weather[0].description
        humidity.innerText = `Humidity : ${res.data.current.humidity}`
        latt.innerText = `Latitute : ${lat}`
        lonn.innerText = `Longitute : ${lon}`
       
}

function resetForm(){
    text.value = ""
    text.focus()
        
}