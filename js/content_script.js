var body = document.body

body.addEventListener('dblclick', function (e) {
    var selectedText = window.getSelection().toString().trim();
    console.log(selectedText, 'test', e)
})