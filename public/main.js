// let list = document.querySelectorAll('.textarea-list-container>li')
let listContainer = document.querySelector('.textarea-list-container')
let textarea = document.querySelector('textarea')



document.querySelector('.post').addEventListener('click',e=>{
    
    // e.preventDefault()
    let li = document.createElement('li')
    li.setAttribute('class','textarea-list-container>li')

    if(textarea.value){
        li.textContent = textarea.value;
        listContainer.appendChild(li);
        let items = document.querySelectorAll('.textarea-list-container>li')

        console.log(listContainer.children)
        console.log(items)
    // sort list-item notes by alphabetical order
    items = [...items].sort((a,b)=>{
    return (+a.outerText)-(+b.outerText)
    });
    console.log(items)
    }
    else{
    textarea.value = ''
    }

})

    

