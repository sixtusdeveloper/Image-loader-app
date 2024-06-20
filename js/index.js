const uploadFiles = document.querySelector('#file');
const result = document.querySelector('#result');
const noImagesMessage = document.querySelector('#no-images-message');

// Function to handle file upload
function handleFileUpload(files) {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.match('image')) continue;

      const picReader = new FileReader();
      picReader.addEventListener('load', function (event) {
        const picFile = event.target;

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('thumbnail');

        const img = document.createElement('img');
        img.classList.add('thumb-nail');
        img.src = picFile.result;
        img.title = picFile.name;

        imageContainer.appendChild(img);
        result.appendChild(imageContainer);

        // After adding image, hide the no images message
        noImagesMessage.style.display = 'none';
      });

      picReader.readAsDataURL(files[i]);
    }
  } else {
    alert("Your browser doesn't support the File API!");
  }
}

// Event listener for file input change
uploadFiles.addEventListener('change', (e) => {
  const files = e.target.files;
  handleFileUpload(files);
});

// Event listeners for drag and drop functionality
result.addEventListener('dragover', (e) => {
  e.preventDefault();
  result.classList.add('drag-over');
});

result.addEventListener('dragleave', () => {
  result.classList.remove('drag-over');
});

result.addEventListener('drop', (e) => {
  e.preventDefault();
  result.classList.remove('drag-over');
  const files = e.dataTransfer.files;
  handleFileUpload(files);
});

// Initial check to display the message if no images are present
if (result.children.length === 0) {
  noImagesMessage.style.display = 'block';
  noImagesMessage.style.textAlign = 'center';
  noImagesMessage.style.fontSize = '2rem';
  noImagesMessage.style.alignItems = 'center';
  noImagesMessage.style.paddingTop = '4rem';
  noImagesMessage.style.paddingBottom = '4rem';
  noImagesMessage.style.paddingLeft = '1rem';
  noImagesMessage.style.paddingRight = '1rem';
} else {
  noImagesMessage.style.display = 'none';
}






// const uploadFiles = document.querySelector('#file');
// const result = document.querySelector('#result');
// const noImagesMessage = document.querySelector('#no-images-message');


// uploadFiles.addEventListener('change', (e) => {
//   if (window.File && window.FileReader && window.FileList && window.Blob) {
//     const files = e.target.files;

//     for (let i = 0; i < files.length; i++) {
//       if (!files[i].type.match('image')) continue;
      
//       const picReader = new FileReader();
//       picReader.addEventListener('load', function (event) {
//         const picFile = event.target;

//         const imageContainer = document.createElement('div');
//         imageContainer.classList.add('thumbnail');

//         const img = document.createElement('img');
//         img.classList.add('thumb-nail');
//         img.src = picFile.result;
//         img.title = picFile.name;

//         imageContainer.appendChild(img);
//         result.appendChild(imageContainer);

//         // After adding image, hide the no images message
//         noImagesMessage.style.display = 'none';
//       });

//       picReader.readAsDataURL(files[i]);
//     }
//   } else {
//     alert("Your browser doesn't support the File API!");
//   }
// });

// // Initial check to display the message if no images are present
// if (result.children.length === 0) {
//   noImagesMessage.style.display = 'block';
//   noImagesMessage.style.textAlign = 'center';
//   noImagesMessage.style.fontSize = '2rem';
//   noImagesMessage.style.alignItems = 'center';
//   noImagesMessage.style.paddingTop = '4rem';
//   noImagesMessage.style.paddingBottom = '4rem';
//   noImagesMessage.style.paddingLeft = '1rem';
//   noImagesMessage.style.paddingRight = '1rem';
// } else {
//   noImagesMessage.style.display = 'none';
// }






// const uploadFiles = document.querySelector('#files');

// uploadFiles.addEventListener('change', (e) => {
//   if (window.File && window.FileReader && window.FileList && window.Blob) {
//     const files = e.target.files;
//     const output = document.querySelector('#result');
    
//     for (let i = 0; i < files.length; i++) {
//       if (!files[i].type.match('image')) continue;
      
//       const picReader = new FileReader();
//       picReader.addEventListener('load', function (event) {
//         const picFile = event.target;
        
//         const imageContainer = document.createElement('div');
//         imageContainer.style.width = '100px';
//         imageContainer.style.height = '100px';
//         imageContainer.style.margin = '5px';
//         imageContainer.style.border = '1px solid #ccc';
//         imageContainer.style.display = 'flex';
//         imageContainer.style.alignItems = 'center';
//         imageContainer.style.justifyContent = 'center';
//         imageContainer.style.overflow = 'hidden';
        
//         const img = document.createElement('img');
//         img.classList.add('thumb-nail');
//         img.src = picFile.result;
//         img.title = picFile.name;
//         img.style.maxWidth = '100%';
//         img.style.maxHeight = '100%';
        
//         imageContainer.appendChild(img);
//         output.appendChild(imageContainer);
//       });
      
//       picReader.readAsDataURL(files[i]);
//     }
//   } else {
//     alert("Your browser doesn't support the File API!");
//   }
// });




// const uploadFiles = document.querySelector('#files')

// uploadFiles.addEventListener('change', (e) => {
//   if (window.File && window.FileReader && window.FileList && window.Blob) {
//     const files = e.target.files
//     const output = document.querySelector('#result')
//     for (let i = 0; i < files.length; i++) {
//       if (!files[i].type.match('image')) continue
//       const picReader = new FileReader()
//       picReader.addEventListener('load', function (event) {
//         const picFile = event.target
//         const imageContainer = document.createElement('div')
//         imageContainer.innerHTML = `<img class="thumb-nail" src="${picFile.result}" title="${picFile.name}" />`
//         output.appendChild(imageContainer)
//       })
//       picReader.readAsDataURL(files[i])
//     }
//   } else {
//     alert("Your browser doesn't support the File API!")
//   }
// })



// const uploadFiles = document.querySelector('#files')
// uploadFiles.addEventListener('change', (e) => {
//   if (window.File && window.FileReader && window.FileList && window.Blob) {
//     const files = e.target.files
//     const output = document.querySelector('#result')
//     for (let i = 0; i < files.length; i++) {
//       if (!files[i].type.match('image')) continue
//       const picReader = new FileReader()
//       picReader.addEventListener('load', function (event) {
//         const picFile = event.target
//         const imageContainer = document.createElement('div')
//         imageContainer.innerHTML = `<img class="thumb-nail" src="${picFile.result}" title="${picFile.name}" />`
//         output.appendChild(imageContainer)
//       })
//       picReader.readAsDataURL(files[i])
//     }
//   } else {
//     alert("Your browser doesn't support the File API!")
//   }
// })
// const uploadFiles = document.querySelector('#files')
// uploadFiles.addEventListener('change', (e) => {
//   if (window.File && window.FileReader && window.FileList && window.Blob) {
//     const files = e.target.files
//     const output = document.querySelector('#result')
//     for (let i = 0; i < files.length; i++) {
//       if (!files[i].type.match('image')) continue
//       const picReader = new FileReader()
//       picReader.addEventListener('load', function (event) {
//         const picFile = event.target
//         const imageContainer = document.createElement('div')
//         imageContainer.innerHTML = `<img class="thumb-nail" src="${picFile.result}" title="${picFile.name}" />`
//         output.appendChild(imageContainer)
//       })
//       picReader.readAsDataURL(files[i])
//     }
//   } else {
//     alert("Your browser doesn't support the File API!")
//   }
// })




// document.addEventListener("DOMContentLoaded", function() {
//   const fileInput = document.getElementById("files");
//   const result = document.getElementById("result");
//   const noImagesMessage = document.getElementById("no-images-message");

//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = 'block';
//       noImagesMessage.style.textAlign = 'center';
//       noImagesMessage.style.fontSize = '2rem';
//       noImagesMessage.style.alignItems = 'center';
//       noImagesMessage.style.paddingTop = '4rem';
//       noImagesMessage.style.paddingBottom = '4rem';
//       noImagesMessage.style.paddingLeft = '1rem';
//       noImagesMessage.style.paddingRight = '1rem';
//     } else {
//       noImagesMessage.style.display = 'none';
//     }
//   }

//   fileInput.addEventListener("change", function(event) {
//     const files = event.target.files;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = function(e) {
//         const img = document.createElement("img");
//         img.src = e.target.result;

//         const thumbnail = document.createElement("div");
//         thumbnail.classList.add("thumbnail");
//         thumbnail.appendChild(img);

//         result.appendChild(thumbnail);
//         updateNoImagesMessage();
//       }

//       reader.readAsDataURL(file);
//     }
//   });

//   // Initial check to display the message if no images are present
//   updateNoImagesMessage();
// });


