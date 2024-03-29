// let list = document.querySelectorAll('.textarea-list-container>li')
let listContainer = document.querySelector('.textarea-list-container')
let textarea = document.querySelector('textarea')
let api = window.location.origin+'/notes'
let counter;

// helper function to format textarea (security)
const formatTextArea = (textarea) => {
    textarea.value=textarea.value.replace(/[;\)\(\_\~\+\=\^\%\$\#\@\!\&\*\|\[\])]/g,'')
}
// fetch data from `/notes` endpoint (server/routes.js)
// We are retrieving api data from psql
fetch(api)
.then(res=>{
    return res.json();
})
.then(data=>{
    let arr = [...data]
    //  console.log(arr)
        arr.forEach((note,index)=>{
        const li_btn = document.createElement('button')
        li_btn.classList.add('text-area-list-container>li>button')
        const li = document.createElement('li')
        li.classList.add('textarea-list-container>li');
        li.classList.add('hide-item')
        li.textContent = `${note.notes} - ${note.timestamp}`
        listContainer.append(li)
        li.appendChild(li_btn)
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
    const deleteItem = () => {
        return [...listContainer.children].forEach((el,index)=>{
            let btn = el.children[0]
            btn.addEventListener('click', e => {
                console.log('you clicked me!')
                let id = index+1
                $.ajax({
                    type: 'GET',
                    url: `/delete/${id}`
                });
            })
        })
    }
    deleteItem();
   


})


const formatUTC = (date) => {
    // form object of months
    const months = {
        january:1,
        february:2,
        march:3,
        april:4,
        may:5,
        june:6,
        july:7,
        august:8,
        september:9,
        october:10,
        november:11,
        december:12
    }
    // goal: 2024-03-28T23:45:32.313Z
    // current: Thu, 28 Mar 2024 23:56:55 GMT
    let num;
    const year = date.match(/[0-9]{4}/);//year
    const month = date.split` `[2].toLowerCase()//month to lowercase
    const day = date.split` `[1]//day
    const time = date.split` `[4]//utc-Time
    Object.keys(months).forEach(key => {
        if(key.slice(0,3)===month){
            num = months[key];
        }
    } )
    return `${year}-${num<10?'0'+num:num}-${day<10?'0'+day:day}T${time}Z`

}
// use ajax to submit form data without page reload
$(".post").on('click',function(e){
    e.preventDefault();
    textarea.focus();
    const date = new Date().toUTCString();
    const testISO = new Date().toISOString();
    // const mod_date = formatUTC(date);
    formatTextArea(textarea)
    let note = textarea.value;
    console.log('You pressed me')
    $.ajax({
        type: 'POST',
        url: '/notes',
        data: {notes:note}
    });
    
        if(note){
            
            const li = document.createElement('li')
            const li_btn = document.createElement('button')
            li_btn.classList.add('text-area-list-container>li>button')
            li.classList.add('textarea-list-container>li');
            counter = listContainer.children.length+1
            li.classList.add(counter)
            console.log(counter)
            li.textContent = `${note} - ${testISO}`
            listContainer.append(li)
            li.appendChild(li_btn)
            // console.log(id)
            textarea.value = ''
        }
        else{
            textarea.value = ''
        }
})

// delete all data
$(".delete").on('click',function(e){
    e.preventDefault()
    counter = 0;
    console.log(counter)
    formatTextArea(textarea)
    let note = textarea.value;
    $.ajax({
        type: 'POST',
        url: '/delete',
        data: {notes:note}
    });
    textarea.value = ''
    // remove children
    return [...listContainer.children].forEach(c=>listContainer.removeChild(c))
    
})


