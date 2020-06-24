const  {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add}  = require('./calculatetip')
// test('Hello World!!' , ()=>{

// })

// test('This should fail', () => {
//     throw new Error('Failure!')
// })

test('should calculate total with tip', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})


// test('should calculate total with default tip', () => {
//     const total = calculateTip(10)
//     expect(total).toBe(12.5)
// })

// test('should convert 32 F to 0 Degree', () => {
//     const temp = fahrenheitToCelsius(32)
//     expect(temp).toBe(0)  
// })


// test('should convert 0 C to 32 F', () => {
//     const temp = celsiusToFahrenheit(0)
//     expect(temp).toBe(32)  
// })


// // we can call this function through callback
// // test('should add two numbers', (done) => {
// //     add(2, -3, (error, result) => {

// //         if(error){
// //             return console.log(error);
// //             done()
// //         }

// //         expect(result).toBe(5) 
// //         done()
// //     })
// // })

// // we can call this function through promises

// test('Should add two numbers', (done) => {
//     add(2, 3).then((sum) => {
//         expect(sum).toBe(5)
//         done()
//     })
// })

// // we can call this function through async await in modern style

// test('Should add two numbers async/await', async () => {
//     const sum = await add(10, 22)
//     expect(sum).toBe(32)  
// })