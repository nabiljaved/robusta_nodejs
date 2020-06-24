const message = document.getElementById('message')
const list = document.getElementById('book-list')
//const books = [{title : "gone by wind", author : 'nabeel javed', isbn:'AEDR34532'}, {title : "learn css", author : 'asim raza', isbn:'ALKFD34532'}]
let sortByValue = "createdAt:asc"


class Book {
    constructor(title,author,isbn){
        this.title = title,
        this.author = author,
        this.isbn = isbn
    }
}

class FrontUI {

    static removePreviousList()
    {
        const trr = document.querySelectorAll('#book-list tr')
        trr.forEach((rows) => rows.remove())
    }

    static hideAddButton(){
        var add = document.getElementById('add-button')
        add.style.display = 'none'
        document.getElementById('update-button').style.display = ''
    }

    static displayAddButton(){
        var add = document.getElementById('add-button')
        add.style.display = ''
        document.getElementById('update-button').style.display = 'none'
    }

    //call get method and show books 
    static showBooks()
    {
        DataBase.getBooks()
    }

    static showMessage(classname, msg)
    {
        message.innerHTML = 
        
        `
        <div class="alert ${classname} alert-dismissible fade show" role="alert">
        ${msg}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

        `
        setTimeout(() => {
            document.querySelector('.alert').remove()        
        }, 3000)
    }

    static populateData(books)
    {
        
         
         books.forEach((book) => {
            
            const tableRow = document.createElement('tr')
            tableRow.className = 'data'            

            tableRow.innerHTML = 
            `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><button class="btn btn-danger btn-sm delete" value="${book._id}">x</button> <button class="btn btn-success ml-3 btn-sm" value="${book._id}"><i class="fa fa-archive update-values" aria-hidden="true"></i></button> </td>
            `
            list.appendChild(tableRow)

         })

    }

    static removeBook(e)
    {
        //delete 
        if(e.target.classList.contains('delete'))
        {
            if(confirm('Are You Sure ?'))
            {
                const row = e.target.parentElement.parentElement
                list.removeChild(row) 
                DataBase.deleteBooks(e.target.value)     
            } 
        }

        //update
         
        if(e.target.classList.contains('update-values'))
        {
            const tr= e.target.parentElement.parentElement.parentElement
            const title = tr.firstElementChild.textContent
            const author = tr.firstElementChild.nextElementSibling.textContent
            const isbn = tr.firstElementChild.nextElementSibling.nextElementSibling.textContent
            const id = tr.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.querySelector('button').value
            console.log(title, author, isbn, id)

            const form = document.getElementById('book-form')
            form['title'].value = title
            form['author'].value = author
            form['isbn'].value = isbn
            
            FrontUI.hideAddButton()    

            var update = document.getElementById('update-button')
            update.style.display = ''

            update.addEventListener('click', function(e){
                e.preventDefault()

                const book = new Book(form['title'].value, form['author'].value, form['isbn'].value)
                //FrontUI.removePreviousList()
                DataBase.updateRecord(book, id)
            })

        }

    }

    static addBooks(e)
    {
        e.preventDefault()
          
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
  
    // Validate
    if(title === '' || author === '' || isbn === '') {
      FrontUI.showMessage('alert-danger', 'one of your field is empty');
    } else {
      // Instatiate book
      const book = new Book(title, author, isbn);

      // Add book to database
      DataBase.addBooks(book)
  
      // Clear fields
      FrontUI.clearFields()
    }
  }

    static clearFields(){
        document.querySelector('#book-form').reset()        
    }

    static searchBook(e)
    {
        //javascript code 

        // let filter = document.getElementById('filter').value.toUpperCase()
        // console.log(filter)
        // let myTable = document.getElementById('myTable')
        // let tr = myTable.getElementsByTagName('tr')

        // for(var i=0; i<tr.length; i++)
        // {
        //     let td = tr[i].getElementsByTagName('td')[0]
        //     if(td)
        //     {
        //         let textValue = td.textContent || td.innerHTML;
        //         if(textValue.toUpperCase() .indexOf(filter) > -1){
        //             tr[i].style.display = ""
        //         }else{
        //             tr[i].style.display = "none"
        //         }
        //     }
        // }

        //jquery code 

        $(".form-control").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            console.log(value)
            $("#book-list tr").filter(function() {
              $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });

    }

    static sorting()
    {
        if(sortByValue === "createdAt:asc"){
            sortByValue = "createdAt:desc"
        }else{
            sortByValue = "createdAt:asc"
        }
        
        const rows = document.querySelectorAll('#book-list tr')
        rows.forEach((row) => {
            row.remove()
        })
        DataBase.getBooks()
    }


}

class DataBase{

    static updateRecord(book, id)
    {

        axios.patch(`/robusta/global/updatebooks/${id}`, book, {headers: {'Authorization' : `Bearer ${token}`}})
        .then(res => {
            if(res.data.book)
            {
                
                FrontUI.showMessage('alert-success', 'Record is updated successfull!')
                FrontUI.displayAddButton()  
                FrontUI.clearFields()
                
                setTimeout(function(){window.location = window.location}, 1000);

                
            }
            
        })
        .catch(err => {
            if(err.response)
            {
                FrontUI.showMessage('alert-danger', err.response.data.error)
                FrontUI.displayAddButton()  
                FrontUI.clearFields() 
                FrontUI.showBooks()
            }
        })

    
    }

    static getBooks()
    {
        axios
        .get('/robusta/global/getBooks', Headers.customHeader(sortByValue) )
        .then(res => {
            FrontUI.populateData(res.data.book)
            console.log(res.data.book)
        })
        .catch(err => {
            if(err.response)
            {
                if(err.response.data)
                {
                    FrontUI.showMessage('alert-danger', err.response.data.error)
                }
            }
        })
    }

    static addBooks(book)
    {
        axios.post('/robusta/global/bookstore', book, {headers: {'Authorization' : `Bearer ${token}`}}
        ).then(res => {
            console.log(res.data.book)
            var newbook = [res.data.book]
            // Add Book to U"I
            FrontUI.populateData(newbook)
            FrontUI.showMessage('alert-success', 'Record is added successfull!')
        })
        .catch(err => {
            if(err.response)
            {
                console.log(err.response)
            }
        })    
    }

    static deleteBooks(ownerid)
    {
        axios.delete(`/robusta/global/books/${ownerid}`, {headers: {'Authorization' : `Bearer ${token}`}})
        .then(res => {
            console.log(res.data.response)
            FrontUI.showMessage('alert-danger', 'Record has been deleted!')
        })
        .catch(err => {
            if(err.response){
                FrontUI.showMessage('alert-danger', 'err.response.config.url')
            }
        })
    }


}

class Storage
{
    static getJwt()
    {
        let token;
        if(localStorage.getItem('jwt-tokens') === null)
        {
            token = []
        }else{
            token = JSON.parse(localStorage.getItem('jwt-tokens'))
        }
        return token
    }
}


//when DOM is Loaded 
document.addEventListener('DOMContentLoaded', FrontUI.showBooks)
list.addEventListener('click', FrontUI.removeBook)
document.querySelector('#book-form').addEventListener('submit',FrontUI.addBooks)
document.querySelector('.form-control').addEventListener('keyup', FrontUI.searchBook)
let token = Storage.getJwt()




//custom headers

class Headers {

    static customHeader(sort)
    {               
        const config = {
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
            },
            params : {
                sortBy: `${sort}`
            },
            cache: {
                clear: 'auto',
                type: 'memory'
              }
        }

        return config
    }
}



//sorting the table 
const th = document.getElementsByTagName('th')

for (let c=0; c<th.length; c++)
{
    th[c].addEventListener('click', FrontUI.sorting)
}
