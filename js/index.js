// The updated code logic now includes an edit modal that opens when an image is clicked. The user can edit the image in the modal and save the changes. The edited image is then displayed on the screen. The modal can be closed by clicking the close button or outside the modal area.

document.addEventListener("DOMContentLoaded", function () {
  const uploadFiles = document.querySelector("#file");
  const result = document.querySelector("#result");
  const noImagesMessage = document.querySelector("#no-images-message");

  // Modal elements
  const modal = document.getElementById("editModal");
  const modalImg = document.getElementById("editImage");
  const closeModal = document.querySelector(".close");

  // Update the message visibility
  function updateNoImagesMessage() {
    if (result.children.length === 0) {
      noImagesMessage.style.display = "block";
    } else {
      noImagesMessage.style.display = "none";
    }
  }

  // Handle file input change event
  uploadFiles.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });

  // Handle drag and drop events
  const dropArea = document.querySelector(".file-upload-label");
  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("drag-over");
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
  });

  // Handle files function
  function handleFiles(files) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.match("image")) continue;

        const picReader = new FileReader();
        picReader.addEventListener("load", function (event) {
          const picFile = event.target;

          const imageContainer = document.createElement("div");
          imageContainer.classList.add("thumbnail");

          const img = document.createElement("img");
          img.classList.add("thumb-nail");
          img.src = picFile.result;
          img.title = picFile.name;

          const options = document.createElement("div");
          options.classList.add("image-options");

          const editButton = document.createElement("button");
          editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
          editButton.addEventListener("click", function () {
            modal.style.display = "flex"; // Here I'm using flex to center content
            modal.style.flexDirection = "row"; // Here I'm using flex to center content
            modalImg.src = img.src;
            document.body.classList.add("modal-open"); // I'm Preventing body scroll
          });

          const loveButton = document.createElement("button");
          loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

          options.appendChild(editButton);
          options.appendChild(loveButton);

          imageContainer.appendChild(img);
          imageContainer.appendChild(options);
          result.appendChild(imageContainer);

          updateNoImagesMessage();
        });

        picReader.readAsDataURL(files[i]);
      }
    } else {
      alert("Your browser does not support File API");
    }
  }

  // Close the modal when the user clicks on <span> (x)
  closeModal.onclick = function () {
    modal.style.display = "none";
    document.body.classList.remove("modal-open"); // Allow body scroll
  };

  // Close the modal when the user clicks anywhere outside of the modal content
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open"); // Allow body scroll
    }
  };

  updateNoImagesMessage();
});

 // Get the checkbox element
 const checkbox = document.getElementById('like-checkbox');

 // Add a change event listener to detect checkbox state changes
 checkbox.addEventListener('change', function() {
   const svgOutline = document.querySelector('.svg-outline');
   const svgFilled = document.querySelector('.svg-filled');
   const svgCelebrate = document.querySelector('.svg-celebrate');

   // Toggle display based on checkbox state
   if (this.checked) {
     svgOutline.style.display = 'none';
     svgFilled.style.display = 'inline-block';
     svgCelebrate.style.display = 'inline-block';
   } else {
     svgOutline.style.display = 'inline-block';
     svgFilled.style.display = 'none';
     svgCelebrate.style.display = 'none';
   }
});













// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");

//   // Modal elements
//   const modal = document.getElementById("editModal");
//   const modalImg = document.getElementById("editImage");
//   const closeModal = document.querySelector(".close");

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Handle file input change event
//   uploadFiles.addEventListener("change", (e) => {
//     handleFiles(e.target.files);
//   });

//   // Handle drag and drop events
//   const dropArea = document.querySelector(".file-upload-label");
//   dropArea.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     dropArea.classList.add("drag-over");
//   });

//   dropArea.addEventListener("dragleave", () => {
//     dropArea.classList.remove("drag-over");
//   });

//   dropArea.addEventListener("drop", (e) => {
//     e.preventDefault();
//     dropArea.classList.remove("drag-over");
//     handleFiles(e.dataTransfer.files);
//   });

//   // Handle files function
//   function handleFiles(files) {
//     if (window.File && window.FileReader && window.FileList && window.Blob) {
//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           const imageContainer = document.createElement("div");
//           imageContainer.classList.add("thumbnail");

//           const img = document.createElement("img");
//           img.classList.add("thumb-nail");
//           img.src = picFile.result;
//           img.title = picFile.name;

//           const options = document.createElement("div");
//           options.classList.add("image-options");

//           const editButton = document.createElement("button");
//           editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//           editButton.addEventListener("click", function () {
//             modal.style.display = "flex"; // Use flex to center content
//             modalImg.src = img.src;
//           });

//           const loveButton = document.createElement("button");
//           loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//           options.appendChild(editButton);
//           options.appendChild(loveButton);

//           imageContainer.appendChild(img);
//           imageContainer.appendChild(options);
//           result.appendChild(imageContainer);

//           updateNoImagesMessage();
//         });

//         picReader.readAsDataURL(files[i]);
//       }
//     } else {
//       alert("Your browser does not support File API");
//     }
//   }

//   // Close the modal when the user clicks on <span> (x)
//   closeModal.onclick = function () {
//     modal.style.display = "none";
//   };

//   // Close the modal when the user clicks anywhere outside of the modal content
//   window.onclick = function (event) {
//     if (event.target == modal) {
//       modal.style.display = "none";
//     }
//   };

//   updateNoImagesMessage();
// });








// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");

//   // Modal elements
//   const modal = document.getElementById("editModal");
//   const modalImg = document.getElementById("editImage");
//   const closeModal = document.querySelector(".close");

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Handle file input change event
//   uploadFiles.addEventListener("change", (e) => {
//     handleFiles(e.target.files);
//   });

//   // Handle drag and drop events
//   const dropArea = document.querySelector(".file-upload-label");
//   dropArea.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     dropArea.classList.add("drag-over");
//   });

//   dropArea.addEventListener("dragleave", () => {
//     dropArea.classList.remove("drag-over");
//   });

//   dropArea.addEventListener("drop", (e) => {
//     e.preventDefault();
//     dropArea.classList.remove("drag-over");
//     handleFiles(e.dataTransfer.files);
//   });

//   // Handle files function
//   function handleFiles(files) {
//     if (window.File && window.FileReader && window.FileList && window.Blob) {
//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           const imageContainer = document.createElement("div");
//           imageContainer.classList.add("thumbnail");

//           const img = document.createElement("img");
//           img.classList.add("thumb-nail");
//           img.src = picFile.result;
//           img.title = picFile.name;

//           const options = document.createElement("div");
//           options.classList.add("image-options");

//           const editButton = document.createElement("button");
//           editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//           editButton.addEventListener("click", function () {
//             modal.style.display = "block";
//             modalImg.src = img.src;
//           });

//           const loveButton = document.createElement("button");
//           loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//           options.appendChild(editButton);
//           options.appendChild(loveButton);

//           imageContainer.appendChild(img);
//           imageContainer.appendChild(options);
//           result.appendChild(imageContainer);

//           updateNoImagesMessage();
//         });

//         picReader.readAsDataURL(files[i]);
//       }
//     } else {
//       alert("Your browser does not support File API");
//     }
//   }

//   // Close the modal when the user clicks on <span> (x)
//   closeModal.onclick = function () {
//     modal.style.display = "none";
//   };

//   // Close the modal when the user clicks anywhere outside of the modal
//   window.onclick = function (event) {
//     if (event.target == modal) {
//       modal.style.display = "none";
//     }
//   };

//   updateNoImagesMessage();
// });







// This code logic accepts image files from the user and displays them on the screen. It also provides drag and drop functionality to upload images. If no images are present, it displays a message to the user.

// const uploadFiles = document.querySelector('#file');
// const result = document.querySelector('#result');
// const noImagesMessage = document.querySelector('#no-images-message');

// // Function to handle file upload
// function handleFileUpload(files) {
//   if (window.File && window.FileReader && window.FileList && window.Blob) {
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
// }

// // Event listener for file input change
// uploadFiles.addEventListener('change', (e) => {
//   const files = e.target.files;
//   handleFileUpload(files);
// });

// // Event listeners for drag and drop functionality
// result.addEventListener('dragover', (e) => {
//   e.preventDefault();
//   result.classList.add('drag-over');
// });

// result.addEventListener('dragleave', () => {
//   result.classList.remove('drag-over');
// });

// result.addEventListener('drop', (e) => {
//   e.preventDefault();
//   result.classList.remove('drag-over');
//   const files = e.dataTransfer.files;
//   handleFileUpload(files);
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




// This code logic accetpts images files from users through browsing the files and displays them on the page but doesn't accomodate drag and drop functionality. If no images are present, it displays a message to the user.

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


