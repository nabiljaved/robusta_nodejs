const doWorkPromise = new Promise((resolve, reject) => {

    setTimeout(() => {
        resolve([7, 4, 1])
        // reject('Things went wrong!')
    }, 2000)

})

const add = new Promise((resolve, reject) =>{

    setTimeout(()=>{

        resolve(2+3);
        //reject("could not add");

    }, 2000);

});

doWorkPromise
.then((result) => {
    console.log('Success!', result)
    return add
    .then(result => console.log(result))
}).catch((error) => {
    console.log('Error!', error)

})

// add
// .then(result => console.log(result))
// .catch(error => console.log(error));