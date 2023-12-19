var small_images  = document.getElementsByClassName("small-image");
var show_image_popup  = document.getElementById("show_image_popup");
var large_image  = document.getElementById("large-image");
var image-show-area = document.getElementById("image-show-area");

for(var i=0; i< small_images.length; i++){

  small_images[i].addEventListener("click", function(){
    // remove active class from every images
    for(var j=0; j< small_images.length; j++){
      small_images[j].classList.remove('active');
    }
    // end
 
    this.classList.add('active'); // add active class to this image
    
    var src_val = this.src;
    large_image.src = src_val;
    showModal();
  });
}

function showModal(){
  show_image_popup.style.display = 'block';
}

image-show-area.addEventListener("click", function(){
  // before closing the modal we need to remove active class
  for(var i=0; i< small_images.length; i++){
    small_images[i].classList.remove('active');
  }
  // end
  closeModal();
});

function closeModal(){
  show_image_popup.style.display = 'none';
}

