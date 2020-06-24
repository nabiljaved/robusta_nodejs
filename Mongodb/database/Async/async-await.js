const add = (a, b) =>{

    return new Promise((resolve, reject) => {

        setTimeout(() =>{

        if(a < 0 || b < 0 ){
            reject("negative numbers are not allowed");
        }


            resolve(a+b);

        }, 2000);

    })
}

const doWork = async () =>{

    const sum = await add(1,-12);
    const sum2 = await add(1,1);
    const sum3 = await add(1,-12);
    return sum+sum2+sum3; 
}

doWork()
.then(result => console.log(result))
.catch(error => console.log(error))