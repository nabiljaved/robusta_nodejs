const jwt = require('jsonwebtoken');

const myFunction = async () => {

    const token = jwt.sign({_id : "abc123"}, 'thisistokensecret', {expiresIn: '7 days'})
    //console.log(token);

    const data = jwt.verify(token, 'thisistokensecret')
    console.log(data)

}

myFunction()