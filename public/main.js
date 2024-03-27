// let list = document.querySelectorAll('.textarea-list-container>li')
let listContainer = document.querySelector('.textarea-list-container')
let textarea = document.querySelector('textarea')
let api = window.location.origin+'/notes'
console.log(api)





fetch(api).then(res=>{
    return res.json();
})
.then(d=>{
    let arr = [...d]
     console.log(arr)
})

    

