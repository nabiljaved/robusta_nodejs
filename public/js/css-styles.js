var loggedItems = document.querySelectorAll('.log-in')  
var logoutItems = document.querySelectorAll('.log-out') 



//functions 
const getTokens = () => {
    let tokens;
    if(localStorage.getItem('jwt-tokens') === null){
        tokens = []
    }else{
        tokens = JSON.parse(localStorage.getItem('jwt-tokens'))
    }

    return tokens
}



const tokens = getTokens()
//tokens.push({token : 'laskdjlaksjd'}) //farzi token 


if(tokens.length > 0){
    
    loggedItems.forEach((item) => item.style.setProperty("display", "block", "important"))
    logoutItems.forEach((item) => item.style.setProperty("display", "none", "important"))    
}else{
    loggedItems.forEach((item) => item.style.setProperty("display", "none", "important"))
    logoutItems.forEach((item) => item.style.setProperty("display", "block", "important"))    
}

if(window.location.href == 'http://localhost:3000/')
{
    if(tokens.length > 0)
    {
        window.location = '/robusta/global/'
    }
}

if(window.location.href == 'http://localhost:3000/login')
{
    if(tokens.length > 0)
    {
        window.location = '/robusta/global/'
    }
}

if(window.location.href == 'http://localhost:3000/robusta/global/' || window.location.href == 'http://localhost:3000/robusta/global/weather' || window.location.href == 'http://localhost:3000/robusta/global/services')
{
    if(!tokens.length)
    {
        window.location = '/'
    }
}
