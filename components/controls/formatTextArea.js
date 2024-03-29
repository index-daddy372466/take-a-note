export default formatTextArea = (textarea) => {
    textarea.value=textarea.value.replace(/[;\)\(\_\~\+\=\^\%\$\#\@\!\&\*\|\[\])]/g,'')
}