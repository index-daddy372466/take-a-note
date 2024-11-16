// vars
const wrapper = document.getElementById('wrapper')
const textarea = document.getElementById('textarea')
// helper function to format textarea (security)
const formatTextArea = (textarea) => {
  textarea.value = textarea.value.replace(
    /[;\)\(\_\~\+\=\^\%\$\#\@\!\&\*\|\[\])]/g,
    ""
  );
};


// add focus & blur event listeners
textarea.onfocus = textareaFocus
textarea.onblur = textareaBlur



// trigger textarea focus
function textareaFocus(e){
  console.log('it works')
  const elem = e.currentTarget;
  elem.classList.toggle('focustext')
  // toggle wrapper's class to end-focus
  wrapper.classList.add('end-focus')
  wrapper.classList.remove('starter-focus')
}
// trigger textarea blur
function textareaBlur(e){
  const elem = e.currentTarget;
  elem.classList.remove('focustext')
  // toggle wrapper's class to end-focus
  wrapper.classList.add('starter-focus')
  wrapper.classList.add('end-focus')
}
