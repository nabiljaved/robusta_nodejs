const bcrypt = require('bcryptjs')

           //basic concept 

const myFunction = async () =>{

    const password = "nabeel12345";
    const hashPassword = await bcrypt.hash(password, 8);

    //console.log(password);

    const isMatch = await bcrypt.compare(password, hashPassword);
    console.log(hashPassword);
    console.log(isMatch);


}

myFunction();