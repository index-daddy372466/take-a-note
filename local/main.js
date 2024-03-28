// let list = document.querySelectorAll('.textarea-list-container>li')
let listContainer = document.querySelector('.textarea-list-container')
let textarea = document.querySelector('textarea')


document.querySelector('.post').addEventListener('click',e=>{
    e.preventDefault()
    
    let li = document.createElement('li')
    li.setAttribute('class','textarea-list-container>li')
if(textarea.value){
    li.textContent = textarea.value;
    listContainer.appendChild(li);
    textarea.value=''
}
else{
textarea.value = ''
}
})
    

