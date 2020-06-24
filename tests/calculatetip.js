const calculateTip = (total, tipPercent = 0.25) => total + (total * tipPercent)


const fahrenheitToCelsius = (temp) => (temp-32) /1.8

const celsiusToFahrenheit = (temp) => (temp * 1.8) + 32

//// by using callback 
// const add = (a, b, callback) => {

//         setTimeout(() => {

//             if(a < 0 || b < 0){
//                 return callback('number must not be less then 0', undefined)
//             }

//             callback(undefined, a+b)

//         }, 1000)    
// }

// by using promises

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject('Numbers must be non-negative')
            }

            resolve(a + b)
        }, 2000)
    })
}









module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}

