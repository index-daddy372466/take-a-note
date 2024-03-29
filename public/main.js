// let list = document.querySelectorAll('.textarea-list-container>li')
let listContainer = document.querySelector('.textarea-list-container')
let textarea = document.querySelector('textarea')
let api = window.location.origin+'/notes'

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
    const date = new Date().toUTCString();
    console.log(date)
    const mod_date = formatUTC(date);
    let note = textarea.value;
    console.log('You pressed me')
    $.ajax({
        type: 'POST',
        url: '/notes',
        data: {notes:note}
    });
    const li = document.createElement('li')
          li.classList.add('textarea-list-container>li');
          li.textContent = `${note} - ${mod_date}`
          listContainer.append(li)
    textarea.value = ''
})

// delete all data
$(".delete").on('click',function(e){
    e.preventDefault()
    let note = textarea.value;
    $.ajax({
        type: 'POST',
        url: '/delete',
        data: {notes:note}
    });
    // remove children
    return [...listContainer.children].forEach(c=>listContainer.removeChild(c))
    
})
    

    

