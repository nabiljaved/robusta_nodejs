const sgMail = require('@sendgrid/mail')

// without setting up the single sender verification from sendgrid we cant send email otherwise it will show an
// error : forbidden 



sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ahmed94.shabbir@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the robusta, ${name}. Let me know how you get along with the coffee shop.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ahmed94.shabbir@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. We hope to see you back sometime soon.`
    })
}

module.exports = {

    sendWelcomeEmail,
    sendCancelationEmail
}


// sgMail.send({
//     to: 'ahmed94.shabbir@gmail.com',
//     from: 'ahmed94.shabbir@gmail.com',
//     subject: 'This is my first creation!',
//     text: 'I hope this one actually get to you.'
// }).then(() => {
//     console.log('message send')
// }).catch(error => {
//     console.log(error)
// })

