// vars
getList()
// window.onkeydown = e => {
//   if(e.key=='r' && e.ctrlKey){
//     e.preventDefault()
//     }
// }
const wrapper = document.getElementById('wrapper')
const textarea = document.getElementById('textarea')
const textTop = document.getElementById('textarea-top')
const listcontainer = document.querySelector('.textarea-list-container')
const clearall = document.querySelector('.delete')
const btn = {
  post:document.querySelector('.post'),
  clear:document.getElementById('clear'),
  delete:document.querySelector('.delete'),
}
const urls = {
  note:'/note',
  delete:'/delete',
}


// post a note on click
btn['post'].onclick = async e => {
  e.preventDefault();
  const value = formatTextArea(textarea);
  if(!value){
    console.log('no value in textarea')
    return null
  } else {
    const target = e.currentTarget;
    const response = await postFetch(urls['note'],{note:value});
    controlPostUI(target);
    console.log(response)
    // clear writingpad
    textarea.value = null;
    postNoteFn(response,listcontainer)
  }
}

// helper function to format textarea (security)
const formatTextArea = (textarea) => {
  textarea.value = textarea.value.replace(
    /[;\)\(\_\~\+\=\^\%\$\#\@\!\&\*\|\[\])]/g,
    ""
  );
  return textarea.value
};
function postNoteFn(obj,container){
textarea.focus()
const note = obj.note;
const date = obj.date
const li = document.createElement('li')
const p = document.createElement('p')
const del = document.createElement('p')
del.textContent = 'x';
del.classList.add('remove-li')

p.innerHTML = purifyText(note);
li.appendChild(p)
li.appendChild(del)
container.appendChild(li)
createTimeSlot(date,li)
textTop.onscroll = scrollTopFn
del.onclick = removeNote
clearall.onclick = removeAllNotes
const items = document.querySelectorAll('.textarea-list-container>li')
    items.forEach((item,idx)=>{
      // scrolltop fn to each item
      item.onscroll = scrollTopFn
    })
}
// timeout to control trigger spam
function controlPostUI(elem){
  elem.classList.add('no-pointer')
  elem.setAttribute('disabled',true)
setTimeout(()=>{
  elem.classList.remove('no-pointer')
  elem.disabled = false;
},1500)
}

// post a note to the server
async function postFetch(url,obj){
 const response = await fetch(url,{headers:{'Content-Type':'application/json'},method:'POST',body:JSON.stringify(obj)}).then(r=>r.json()).then(pay=>{
  console.log(pay)
  return pay
})
return response
}
// get notes from server
async function getFetch(url){
  const response = await fetch(url).then(r=>r.json()).then(pay=>pay)
  console.log(response)
  return response;
}
// delete notes on server
async function deleteFetch(url,data){
  await fetch(url,{headers:{'Content-Type':'application/json'},method:'DELETE',body:JSON.stringify(data)})
}
// display the list of notes
async function getList(){
  // getFetch('/note')
  let arr = await getFetch('/note')
  console.log(arr)
  arr = arr['data']||undefined
  console.log(arr)
  if(!arr){
    return null
  } else {
    arr.forEach(obj=>{
      let str = obj.note, date = obj.timestamp
      const li = document.createElement('li')
      const p = document.createElement('p')
      const del = document.createElement('p')
      del.textContent = 'x';
      del.classList.add('remove-li')

      p.innerHTML = purifyText(str);
      li.appendChild(p)
      li.appendChild(del)
      listcontainer.appendChild(li)
      createTimeSlot(date,li)
      del.onclick = removeNote
    })
    textTop.onscroll = scrollTopFn
    clearall.onclick = removeAllNotes
    const items = document.querySelectorAll('.textarea-list-container>li')
    items.forEach((item,idx)=>{
      // scrolltop fn to each item
      item.onscroll = scrollTopFn
    })
  }
}
// remove year from date
function shaveYear(str){
  // str = str.split`/`.slice(0,-1).join`/` // remove year
  str = str.replace(/\/[0-9]{4}$/,'') // remove year
  return str
}
// domPurify api
function purifyText(text){
  const clean = DOMPurify.sanitize(text)
  return clean
}

// function to pull time note was posted
function createTimeSlot(arr,container){
  let date = arr.filter(x=>/\//g.test(x)), time = arr.filter(x=>/\:/g.test(x)), slot = document.createElement('div')


  // give slot attributes
  slot.classList.add('time-slot')
  console.log(date)
  // iterate through date and time
  for(let i = 0; i < arr.length; i++){
    if(date.includes(arr[i])) arr[i] = shaveYear(arr[i])
    const p = document.createElement('p');
    p.textContent = arr[i];
    slot.appendChild(p)
  }
  // append slot to container
  container.appendChild(slot)
}
let scrollDir = []
// scroll fn
function scrollTopFn(e){
  let ceiling = e.currentTarget.getBoundingClientRect().y
  let ol = e.currentTarget.children[0];
  let lis = [...ol.children];
  let idx = 0, base = 0, target
  let control = 1;
  // let scrollLimit = e.currentTarget.scrollTop
  // scrollDir.push(scrollLimit)
  // scrollDir = scrollDir.slice(-2)
  for(let i = 0; i < lis.length; i++){
  let scrollLimit = e.currentTarget.scrollTop % lis[idx].clientHeight
  
      let slot = lis[idx].children[2] // .time-slot
      let del = lis[idx].children[1] // delete note
      target = lis[idx]
      // if ceiling is scrolled [DOWN] past the END of li & we are not on the last li
      if(ceiling > (lis[idx].getBoundingClientRect().y + lis[idx].clientHeight) && idx < lis.length){
        console.log('over li - down')
        idx+=1
        target = lis[idx]
      }
      // if ceiling is scrolled [UP] past the END of [PREVIOUS] li & we are not on the first li
      if(idx > 0 && (ceiling <= (lis[idx-1].getBoundingClientRect().y + lis[idx-1].clientHeight))){
        console.log('over li - up')
        idx-=1
        target = lis[idx]
      }
      // if ceiling is between indexed li
      if(ceiling >= lis[idx].getBoundingClientRect().y && (ceiling <= lis[idx].getBoundingClientRect().y + lis[idx].clientHeight)) {
        // method in current li
        slot.style = `top:${scrollLimit}px`
        del.style = `top:${scrollLimit}px`
      }
      if(e.currentTarget.scrollTop == base){
        slot.style = `top:${base}px`
        del.style = `top:${base}px`
      }
      if(target!=lis[i]){
        let slot = lis[i].children[2]
        let dels = lis[i].children[1]
        slot.style = `top:${base}px`
        dels.style = `top:${base}px`
        }
        console.log(scrollLimit)
  }
}

// remove single note/all notes
async function removeNote(e){
  // variables
    const li = e.currentTarget.parentElement;
    const text = purifyText(li.children[0].textContent)
    const payload = {text:text}
    const container = li.parentElement;
    container.removeChild(li)
    deleteFetch('/note',payload)
}
async function removeAllNotes(e){
  e.preventDefault()
  textarea.focus()
  const notes = document.querySelectorAll('.textarea-list-container>li');
  const container = document.querySelector('.textarea-list-container')
  for(let i = 0; i < notes.length; i++){
    container.removeChild(notes[i])
  }

  deleteFetch('/notes',{bool:true})
}

