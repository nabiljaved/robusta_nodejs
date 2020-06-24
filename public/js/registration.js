const form = document.querySelector('#register-form').addEventListener('submit', registerUser)
const message  = document.getElementById('messages')


// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(
  config => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

function registerUser (e)
{  

  e.preventDefault()
const name = document.getElementById('name').value
const email = document.getElementById('email').value
const password = document.getElementById('password').value
const password2 = document.getElementById('password2').value
const age = document.getElementById('age').value

  axios
    .post('/task-manager-api-v1/users', {name: name, email:email, password:password, password2:password2, age:age})
    .then(res => {
      if(res.status == '201'){
        console.log(res)
        const tokens = res.data.token
        localStorage.setItem('jwt-tokens', JSON.stringify(tokens))
        redirectPage()
        
    }
      var arr = res.data.array  
      showError(arr)  
      
    })
    .catch(err => {
      if(err.response){
        if(err.response.data){
          showError(err.response.data.array)
          console.log(err.response.data)
        }
        console.log(err.response)
        console.log(err.response.status);
        console.log(err.response.headers);  
      } 
      
    });

    function redirectPage()
    {
        window.location = '/robusta/global/'
    }

    function showError(arr)
    {
    
        arr.forEach((msg) => {
          message.innerHTML += `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            ${msg.msg}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        `
        })
   }

}