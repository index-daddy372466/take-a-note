// let list = document.querySelectorAll('.textarea-list-container>li')
let listContainer = document.querySelector('.textarea-list-container')
let textarea = document.querySelector('textarea')
let api = window.location.origin+'/notes'

// fetch data from `/notes` endpoint (server/routes.js)
    fetch(api)
    .then(res=>{
        return res.json();
    })
    .then(data=>{
        let arr = [...data]
         console.log(arr)
         arr.forEach((note,index)=>{
            const li = document.createElement('li')
            li.classList.add('textarea-list-container>li');
            li.classList.add('hide-item')
            li.textContent = `${note.notes} - ${note.timestamp}`
            listContainer.append(li)
         })
         const items = document.querySelectorAll('.textarea-list-container>li')
        // console.log(items)
        for(let x = 0; x < items.length; x++){
            if(items[x].classList.contains('hide-item')){
                setTimeout(()=>{
                    items[x].classList.remove('hide-item')
                    items[x].classList.add('show-item')
                },50 * (x+1))
            }
        }
    })





    

