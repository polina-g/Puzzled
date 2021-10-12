//CACHED ELEMENTS
const $urlInput = $('#url-input');
const $uploadButton = $('#upload-btn');
const $displayImg = $('#display-img');

//Event Listeners
$uploadButton.on('click', uploadImage);


//Events
function uploadImage () {
    const url = $urlInput.val();
    $displayImg.attr('src', url);
};