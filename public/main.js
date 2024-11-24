// vars
getList()
// window.onkeydown = e => {
//   if(e.key=='r' && e.ctrlKey){
//     e.preventDefault()
//     }
// }

const wrapper = document.getElementById('wrapper')
const textarea = document.getElementById('textarea')
const listcontainer = document.querySelector('.textarea-list-container')
const btn = {
  post:document.querySelector('.post'),
  clear:document.getElementById('clear'),
  delete:document.querySelector('.delete'),
}
const urls = {
  note:'/note',
  delete:'/delete',
}
// add focus & blur event listeners
textarea.onfocus = textareaFocus
textarea.onblur = textareaBlur


// post a note on click
btn['post'].onclick = async e => {
  e.preventDefault();
  const value = formatTextArea(textarea);
  if(!value){
    console.log('no value in textarea')
    return null
  }
  const target = e.currentTarget;
  const response = await postFetch(urls['note'],{note:value});
  controlPostUI(target);
  console.log(response)
  // clear writingpad
  textarea.value = null;
  postNoteFn(response,listcontainer)
}


// helper function to format textarea (security)
const formatTextArea = (textarea) => {
  textarea.value = textarea.value.replace(
    /[;\)\(\_\~\+\=\^\%\$\#\@\!\&\*\|\[\])]/g,
    ""
  );
  return textarea.value
};
function postNoteFn(note,container){
note = note.note;
const li = document.createElement('li')
li.textContent = note;
container.appendChild(li)
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
// trigger textarea focus
function textareaFocus(e){
  const elem = e.currentTarget;
  elem.classList.add('focustext')
  // toggle wrapper's class to end-focus
  wrapper.classList.add('end-focus')
  wrapper.classList.remove('starter-focus')
}
// trigger textarea blur
function textareaBlur(e){
  const elem = e.currentTarget;
  elem.classList.remove('focustext')
  wrapper.classList.add('starter-focus')
  wrapper.classList.remove('end-focus')
  // access btn object
  for(let i in btn){
    // if buttons are focused, the textarea will remain focused
    btn[i].onfocus = ev => {
      elem.classList.add('focustext')
      wrapper.classList.remove('starter-focus')
      wrapper.classList.add('end-focus')
    }
  }
}
// post a note to the server
async function postFetch(url,obj){
 const response = await fetch(url,{headers:{'Content-Type':'application/json'},method:'POST',body:JSON.stringify(obj)}).then(r=>r.json()).then(pay=>{
  return pay
})
return response
}
async function getFetch(url){
  const response = await fetch(url).then(r=>r.json()).then(pay=>pay)
  console.log(response)
  return response;
}
async function getList(){
  // getFetch('/note')
  let arr = await getFetch('/note')
  arr = arr['notes']||undefined
  console.log(arr)
  if(!arr){
    return null
  } else {
    arr.forEach(str=>{
      const li = document.createElement('li')
      li.textContent = str
      console.log(li.textContent)
      listcontainer.appendChild(li)
    })
  }
}

