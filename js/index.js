// The updated code logic now includes an edit modal that opens when an image is clicked. The user can edit the image in the modal and save the changes. The edited image is then displayed on the screen. The modal can be closed by clicking the close button or outside the modal area.

document.addEventListener("DOMContentLoaded", function () {
  const uploadFiles = document.querySelector("#file");
  const result = document.querySelector("#result");
  const noImagesMessage = document.querySelector("#no-images-message");
  const progressBar = document.getElementById("progress-bar");

  // Hide the progress bar by default
  progressBar.style.display = "none";

  // Modal elements for error and success messages
  const errorModal = document.getElementById("errorModal");
  const closeErrorModal = document.querySelector("#errorModal .modal-close");

  const successModal = document.getElementById("successModal");
  const closeSuccessModal = document.querySelector("#successModal .modal-close");

  const editModal = document.getElementById("editModal");
  const closeEditModal = document.querySelector("#editModal .close");

  // Cropper variables
  let cropper = null;

  // Constants for size limits
  const MAX_FILE_SIZE_BYTES = 962560; // 940 KB
  const MAX_IMAGE_WIDTH = 1024; // Maximum width allowed
  const MAX_IMAGE_HEIGHT = 1024; // Maximum height allowed
  const RESIZE_WIDTH = 1200; // Desired width for resized images
  const RESIZE_HEIGHT = 900; // Desired height for resized images

  // Function to display error message
  function displayErrorMessage(message) {
    errorModal.querySelector(".modal-message").textContent = message;
    errorModal.style.display = "flex";
    document.body.classList.add("modal-open");
  }

  // Function to display success message
  function displaySuccessMessage(message) {
    successModal.querySelector(".modal-message").textContent = message;
    successModal.style.display = "flex";
    document.body.classList.add("modal-open");
  }

  // Function to display edit modal
  function displayEditModal(imageSrc) {
    const editModalImage = editModal.querySelector("img");
    editModalImage.src = imageSrc;
    editModal.style.display = "flex";
    document.body.classList.add("modal-open");

    // Initialize Cropper.js if not already initialized
    if (!cropper) {
      cropper = new Cropper(editModalImage, {
        aspectRatio: 4 / 3, // Example aspect ratio
        viewMode: 1, // Set the default view mode
        responsive: true,
        zoomable: true,
        scalable: true,
        modal: true,
        background: true,
        autoCropArea: 1,
        movable: true,
        rotatable: true,
        minContainerWidth: 800,
        minContainerHeight: 600
      });
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
      let hasValidImage = false;

      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.match("image")) continue;

        hasValidImage = true;

        // Check file size
        if (files[i].size > MAX_FILE_SIZE_BYTES) {
          displayErrorMessage(
            "File size exceeds the maximum allowed size of 940 KB. Upload a smaller image."
          );
          continue; // Skip this file
        }

        const picReader = new FileReader();
        picReader.addEventListener("load", function (event) {
          const picFile = event.target;

          const image = new Image();
          image.src = picFile.result;
          image.onload = function () {
            // Resize the image
            resizeImage(image, RESIZE_WIDTH, RESIZE_HEIGHT, function (resizedImageDataUrl) {
              const img = document.createElement("img");
              img.classList.add("thumb-nail");
              img.src = resizedImageDataUrl;
              img.title = files[i].name;

              const imageContainer = document.createElement("div");
              imageContainer.classList.add("thumbnail");

              const options = document.createElement("div");
              options.classList.add("image-options");

              const editButton = document.createElement("button");
              editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
              editButton.addEventListener("click", function () {
                // Display edit modal
                displayEditModal(img.src);
              });

              const loveButton = document.createElement("button");
              loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

              options.appendChild(editButton);
              options.appendChild(loveButton);

              imageContainer.appendChild(img);
              imageContainer.appendChild(options);
              result.appendChild(imageContainer);

              displaySuccessMessage("Image uploaded successfully. You may now view it!"); // Display success message
              updateNoImagesMessage();
            });
          };
        });

        picReader.readAsDataURL(files[i]);
      }

      if (hasValidImage) {
        progressBar.style.display = "block"; // Show progress bar

        // Hide the progress bar after processing
        setTimeout(() => {
          progressBar.style.display = "none";
        }, 2000);
      } else {
        progressBar.style.display = "none";
      }
    } else {
      displayErrorMessage("Your browser does not support File API."); // Display error message
    }
  }

  // Function to resize image
  function resizeImage(image, width, height, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Calculate the new dimensions while maintaining aspect ratio
    const aspectRatio = image.width / image.height;
    if (width / aspectRatio <= height) {
      canvas.width = width;
      canvas.height = width / aspectRatio;
    } else {
      canvas.width = height * aspectRatio;
      canvas.height = height;
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    callback(dataUrl);
  }

  // Close modals when the user clicks on <span> (x) or outside modal
  document.addEventListener("click", function (event) {
    if (event.target === errorModal || event.target === closeErrorModal) {
      errorModal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
    if (event.target === successModal || event.target === closeSuccessModal) {
      successModal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
    if (event.target === editModal || event.target === closeEditModal || event.target === editModal.querySelector(".modal-content")) {
      editModal.style.display = "none";
      document.body.classList.remove("modal-open");

      // Destroy Cropper.js instance if exists
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
    }
  });

  // Update the message visibility
  function updateNoImagesMessage() {
    if (result.children.length === 0) {
      noImagesMessage.style.display = "block";
    } else {
      noImagesMessage.style.display = "none";
    }
  }

  updateNoImagesMessage();
});








// Working well but not resizing the uploaded images to a specific size

// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");
//   const progressBar = document.getElementById("progress-bar");

//   // Hide the progress bar by default
//   progressBar.style.display = "none";

//   // Modal elements for error and success messages
//   const errorModal = document.getElementById("errorModal");
//   const closeErrorModal = document.querySelector("#errorModal .modal-close");

//   const successModal = document.getElementById("successModal");
//   const closeSuccessModal = document.querySelector("#successModal .modal-close");

//   const editModal = document.getElementById("editModal");
//   const closeEditModal = document.querySelector("#editModal .close");

//   // Cropper variables
//   let cropper = null;

//   // Constants for size limits
//   const MAX_FILE_SIZE_BYTES = 962560; // 940 KB
//   const MAX_IMAGE_WIDTH = 1024; // Maximum width allowed
//   const MAX_IMAGE_HEIGHT = 1024; // Maximum height allowed

//   // Function to display error message
//   function displayErrorMessage(message) {
//     errorModal.querySelector(".modal-message").textContent = message;
//     errorModal.style.display = "flex";
//     document.body.classList.add("modal-open");
//   }

//   // Function to display success message
//   function displaySuccessMessage(message) {
//     successModal.querySelector(".modal-message").textContent = message;
//     successModal.style.display = "flex";
//     document.body.classList.add("modal-open");
//   }

//   // Function to display edit modal
//   function displayEditModal(imageSrc) {
//     editModal.querySelector("img").src = imageSrc;
//     editModal.style.display = "flex";
//     document.body.classList.add("modal-open");

//     // Initialize Cropper.js if not already initialized
//     if (!cropper) {
//       cropper = new Cropper(editModal.querySelector("img"), {
//         aspectRatio: 16 / 9, // Example aspect ratio
//         viewMode: 1, // Set the default view mode
//       });
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
//       let hasValidImage = false;

//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         hasValidImage = true;

//         // Check file size
//         if (files[i].size > MAX_FILE_SIZE_BYTES) {
//           displayErrorMessage(
//             "File size exceeds the maximum allowed size of 940 KB. Upload a smaller image."
//           );
//           continue; // Skip this file
//         }

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           // Defer image creation
//           setTimeout(() => {
//             const img = document.createElement("img");
//             img.classList.add("thumb-nail");
//             img.src = picFile.result;
//             img.title = files[i].name;

//             // Check image dimensions
//             const image = new Image();
//             image.src = picFile.result;
//             image.onload = function () {
//               if (image.width > MAX_IMAGE_WIDTH || image.height > MAX_IMAGE_HEIGHT) {
//                 displayErrorMessage(
//                   `Image dimensions exceed the maximum allowed dimensions of ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}. Upload a smaller image.`
//                 );
//               } else {
//                 const imageContainer = document.createElement("div");
//                 imageContainer.classList.add("thumbnail");

//                 const options = document.createElement("div");
//                 options.classList.add("image-options");

//                 const editButton = document.createElement("button");
//                 editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//                 editButton.addEventListener("click", function () {
//                   // Display edit modal
//                   displayEditModal(img.src);
//                 });

//                 const loveButton = document.createElement("button");
//                 loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//                 options.appendChild(editButton);
//                 options.appendChild(loveButton);

//                 imageContainer.appendChild(img);
//                 imageContainer.appendChild(options);
//                 result.appendChild(imageContainer);

//                 displaySuccessMessage("Image uploaded successfully. You may now view it!"); // Display success message
//                 updateNoImagesMessage();
//               }
//             };
//           }, 2000); // Defer image creation by 2 seconds to match the progress bar timeout
//         });

//         picReader.readAsDataURL(files[i]);
//       }

//       if (hasValidImage) {
//         progressBar.style.display = "block"; // Show progress bar

//         // Hide the progress bar after processing
//         setTimeout(() => {
//           progressBar.style.display = "none";
//         }, 2000);
//       } else {
//         progressBar.style.display = "none";
//       }
//     } else {
//       displayErrorMessage("Your browser does not support File API."); // Display error message
//     }
//   }

//   // Close modals when the user clicks on <span> (x) or outside modal
//   document.addEventListener("click", function (event) {
//     if (event.target === errorModal || event.target === closeErrorModal) {
//       errorModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//     if (event.target === successModal || event.target === closeSuccessModal) {
//       successModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//     if (event.target === editModal || event.target === closeEditModal || event.target === editModal.querySelector(".modal-content")) {
//       editModal.style.display = "none";
//       document.body.classList.remove("modal-open");

//       // Destroy Cropper.js instance if exists
//       if (cropper) {
//         cropper.destroy();
//         cropper = null;
//       }
//     }
//   });

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   updateNoImagesMessage();
// });















// This is working perfectly for the error and success message modal and it's also working for the edit modal. The edit modal is opening when the edit button is clicked. However, the cropper is not saving the edited image. It's not displaying the edited image on the screen. I need help to fix this issue. Thanks.
// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");
//   const progressBar = document.getElementById("progress-bar");

//   // Hide the progress bar by default
//   progressBar.style.display = "none";

//   // Modal elements for error and success messages
//   const errorModal = document.getElementById("errorModal");
//   const errorModalMessage = document.getElementById("errorModalMessage");
//   const closeErrorModal = document.querySelector("#errorModal .modal-close");

//   const successModal = document.getElementById("successModal");
//   const successModalMessage = document.getElementById("successModalMessage");
//   const closeSuccessModal = document.querySelector("#successModal .modal-close");

//   const editModal = document.getElementById("editModal");
//   const editModalImage = document.getElementById("editImage");
//   const closeEditModal = document.querySelector("#editModal .close");

//   // Cropper variables
//   let cropper = null;

//   // Constants for size limits
//   const MAX_FILE_SIZE_BYTES = 962560; // 940 KB
//   const MAX_IMAGE_WIDTH = 1024; // Maximum width allowed
//   const MAX_IMAGE_HEIGHT = 1024; // Maximum height allowed

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Function to display error message
//   function displayErrorMessage(message) {
//     errorModalMessage.textContent = message;
//     errorModal.style.display = "flex";
//     document.body.classList.add("modal-open");
//   }

//   // Function to display success message
//   function displaySuccessMessage(message) {
//     successModalMessage.textContent = message;
//     successModal.style.display = "flex";
//     document.body.classList.add("modal-open");
//   }

//   // Function to display edit modal
//   function displayEditModal(imageSrc) {
//     editModalImage.src = imageSrc;
//     editModal.style.display = "flex";
//     document.body.classList.add("modal-open");

//     // Initialize Cropper.js if not already initialized
//     if (!cropper) {
//       cropper = new Cropper(editModalImage, {
//         aspectRatio: 16 / 9, // Example aspect ratio
//         viewMode: 1, // Set the default view mode
//       });
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
//       let hasValidImage = false;

//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         hasValidImage = true;

//         // Check file size
//         if (files[i].size > MAX_FILE_SIZE_BYTES) {
//           displayErrorMessage(
//             "File size exceeds the maximum allowed size of 940 KB. Upload a smaller image."
//           );
//           continue; // Skip this file
//         }

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           // Defer image creation
//           setTimeout(() => {
//             const imageContainer = document.createElement("div");
//             imageContainer.classList.add("thumbnail");

//             const img = document.createElement("img");
//             img.classList.add("thumb-nail");
//             img.src = picFile.result;
//             img.title = files[i].name;

//             // Check image dimensions
//             const image = new Image();
//             image.src = picFile.result;
//             image.onload = function () {
//               if (image.width > MAX_IMAGE_WIDTH || image.height > MAX_IMAGE_HEIGHT) {
//                 displayErrorMessage(
//                   `Image dimensions exceed the maximum allowed dimensions of ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}. Upload a smaller image.`
//                 );
//               } else {
//                 const options = document.createElement("div");
//                 options.classList.add("image-options");

//                 const editButton = document.createElement("button");
//                 editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//                 editButton.addEventListener("click", function () {
//                   // Display edit modal
//                   displayEditModal(img.src);
//                 });

//                 const loveButton = document.createElement("button");
//                 loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//                 options.appendChild(editButton);
//                 options.appendChild(loveButton);

//                 imageContainer.appendChild(img);
//                 imageContainer.appendChild(options);
//                 result.appendChild(imageContainer);

//                 displaySuccessMessage("Image uploaded successfully. You may now view it!"); // Display success message
//                 updateNoImagesMessage();
//               }
//             };
//           }, 2000); // Defer image creation by 2 seconds to match the progress bar timeout
//         });

//         picReader.readAsDataURL(files[i]);
//       }

//       if (hasValidImage) {
//         progressBar.style.display = "block"; // Show progress bar

//         // Hide the progress bar after processing
//         setTimeout(() => {
//           progressBar.style.display = "none";
//         }, 2000);
//       } else {
//         progressBar.style.display = "none";
//       }
//     } else {
//       displayErrorMessage("Your browser does not support File API."); // Display error message
//     }
//   }

//   // Close the error modal when the user clicks on <span> (x)
//   closeErrorModal.onclick = function () {
//     errorModal.style.display = "none";
//     document.body.classList.remove("modal-open");
//   };

//   // Close the success modal when the user clicks on <span> (x)
//   closeSuccessModal.onclick = function () {
//     successModal.style.display = "none";
//     document.body.classList.remove("modal-open");
//   };

//   // Close the edit modal when the user clicks on <span> (x)
//   closeEditModal.onclick = function () {
//     editModal.style.display = "none";
//     document.body.classList.remove("modal-open");

//     // Destroy Cropper.js instance if exists
//     if (cropper) {
//       cropper.destroy();
//       cropper = null;
//     }
//   };

//   // Close modals when the user clicks anywhere outside of the modal content
//   window.onclick = function (event) {
//     if (event.target === errorModal) {
//       errorModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//     if (event.target === successModal) {
//       successModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//     if (event.target === editModal) {
//       editModal.style.display = "none";
//       document.body.classList.remove("modal-open");

//       // Destroy Cropper.js instance if exists
//       if (cropper) {
//         cropper.destroy();
//         cropper = null;
//       }
//     }
//   };

//   updateNoImagesMessage();
// });







// This is code is working perfectly for the Error and Success message modal but not working for the edit modal. The edit modal is not opening when the edit button is clicked.
// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");
//   const progressBar = document.getElementById("progress-bar");

//   // Hide the progress bar by default
//   progressBar.style.display = "none";

//   // Modal elements for error and success messages
//   const errorModal = document.getElementById("errorModal");
//   const errorModalMessage = document.getElementById("errorModalMessage");
//   const closeErrorModal = document.querySelector("#errorModal .modal-close");

//   const successModal = document.getElementById("successModal");
//   const successModalMessage = document.getElementById("successModalMessage");
//   const closeSuccessModal = document.querySelector("#successModal .modal-close");

//   // Cropper variables
//   let cropper = null;

//   // Constants for size limits
//   const MAX_FILE_SIZE_BYTES = 962560; // 940 KB

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Function to display error message
//   function displayErrorMessage(message) {
//     errorModalMessage.textContent = message;
//     errorModal.style.display = "flex";
//     document.body.classList.add("modal-open");
//   }

//   // Function to display success message
//   function displaySuccessMessage(message) {
//     successModalMessage.textContent = message;
//     successModal.style.display = "flex";
//     document.body.classList.add("modal-open");
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
//       let hasValidImage = false;

//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         hasValidImage = true;

//         // Check file size
//         if (files[i].size > MAX_FILE_SIZE_BYTES) {
//           displayErrorMessage("File size exceeds the maximum allowed size of 940 KB. Upload a smaller image.");
//           continue; // Skip this file
//         }

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           // Defer image creation
//           setTimeout(() => {
//             const imageContainer = document.createElement("div");
//             imageContainer.classList.add("thumbnail");

//             const img = document.createElement("img");
//             img.classList.add("thumb-nail");
//             img.src = picFile.result;
//             img.title = files[i].name;

//             const options = document.createElement("div");
//             options.classList.add("image-options");

//             const editButton = document.createElement("button");
//             editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//             editButton.addEventListener("click", function () {
//               // Display modal
//               modal.style.display = "flex";
//               modalImg.src = img.src;
//               document.body.classList.add("modal-open");

//               // Initialize Cropper.js
//               if (cropper) {
//                 cropper.destroy(); // Destroy previous instance if exists
//               }
//               cropper = new Cropper(modalImg, {
//                 aspectRatio: 16 / 9, // Example aspect ratio
//                 viewMode: 1, // Set the default view mode
//               });
//             });

//             const loveButton = document.createElement("button");
//             loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//             options.appendChild(editButton);
//             options.appendChild(loveButton);

//             imageContainer.appendChild(img);
//             imageContainer.appendChild(options);
//             result.appendChild(imageContainer);

//             displaySuccessMessage("Image uploaded successfully. You may now view it!"); // Display success message
//             updateNoImagesMessage();
//           }, 2000); // Defer image creation by 2 seconds to match the progress bar timeout
//         });

//         picReader.readAsDataURL(files[i]);
//       }

//       if (hasValidImage) {
//         progressBar.style.display = "block"; // Show progress bar

//         // Hide the progress bar after processing
//         setTimeout(() => {
//           progressBar.style.display = "none";
//         }, 2000);
//       } else {
//         progressBar.style.display = "none";
//       }
//     } else {
//       displayErrorMessage("Your browser does not support File API."); // Display error message
//     }
//   }

//   // Close the error modal when the user clicks on <span> (x)
//   closeErrorModal.onclick = function () {
//     errorModal.style.display = "none";
//     document.body.classList.remove("modal-open");
//   };

//   // Close the success modal when the user clicks on <span> (x)
//   closeSuccessModal.onclick = function () {
//     successModal.style.display = "none";
//     document.body.classList.remove("modal-open");
//   };

//   // Close modals when the user clicks anywhere outside of the modal content
//   window.onclick = function (event) {
//     if (event.target == errorModal) {
//       errorModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//     if (event.target == successModal) {
//       successModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//   };

//   updateNoImagesMessage();
// });















// Not working for some reasons
// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");
//   const progressBar = document.getElementById("progress-bar");

//   // Hide the progress bar by default
//   progressBar.style.display = "none";

//   // Modal elements for error and success messages
//   const errorModal = document.getElementById("errorModal");
//   const errorMessage = document.getElementById("errorMessage");
//   const closeErrorModal = document.querySelector("#errorModal .close");

//   const successModal = document.getElementById("successModal");
//   const successMessage = document.getElementById("successMessage");
//   const closeSuccessModal = document.querySelector("#successModal .close");

//   // Cropper variables
//   let cropper = null;

//   // Constants for size limits
//   const MAX_FILE_SIZE_BYTES = 962560; // 940 KB

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Function to display error message
//   function displayErrorMessage(message) {
//     errorMessage.textContent = message;
//     errorModal.style.display = "flex";
//     document.body.classList.add("modal-open");
//   }

//   // Function to display success message
//   function displaySuccessMessage(message) {
//     successMessage.textContent = message;
//     successModal.style.display = "flex";
//     document.body.classList.add("modal-open");
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
//       let hasValidImage = false;

//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         hasValidImage = true;

//         // Check file size
//         if (files[i].size > MAX_FILE_SIZE_BYTES) {
//           displayErrorMessage("File size exceeds the maximum allowed size of 940 KB.");
//           continue; // Skip this file
//         }

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           // Defer image creation
//           setTimeout(() => {
//             const imageContainer = document.createElement("div");
//             imageContainer.classList.add("thumbnail");

//             const img = document.createElement("img");
//             img.classList.add("thumb-nail");
//             img.src = picFile.result;
//             img.title = files[i].name;

//             const options = document.createElement("div");
//             options.classList.add("image-options");

//             const editButton = document.createElement("button");
//             editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//             editButton.addEventListener("click", function () {
//               // Display modal
//               modal.style.display = "flex";
//               modalImg.src = img.src;
//               document.body.classList.add("modal-open");

//               // Initialize Cropper.js
//               if (cropper) {
//                 cropper.destroy(); // Destroy previous instance if exists
//               }
//               cropper = new Cropper(modalImg, {
//                 aspectRatio: 16 / 9, // Example aspect ratio
//                 viewMode: 1, // Set the default view mode
//               });
//             });

//             const loveButton = document.createElement("button");
//             loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//             options.appendChild(editButton);
//             options.appendChild(loveButton);

//             imageContainer.appendChild(img);
//             imageContainer.appendChild(options);
//             result.appendChild(imageContainer);

//             displaySuccessMessage("Image uploaded successfully."); // Display success message
//             updateNoImagesMessage();
//           }, 2000); // Defer image creation by 2 seconds to match the progress bar timeout
//         });

//         picReader.readAsDataURL(files[i]);
//       }

//       if (hasValidImage) {
//         progressBar.style.display = "block"; // Show progress bar

//         // Hide the progress bar after processing
//         setTimeout(() => {
//           progressBar.style.display = "none";
//         }, 2000);
//       } else {
//         progressBar.style.display = "none";
//       }
//     } else {
//       displayErrorMessage("Your browser does not support File API."); // Display error message
//     }
//   }

//   // Close the error modal when the user clicks on <span> (x)
//   closeErrorModal.onclick = function () {
//     errorModal.style.display = "none";
//     document.body.classList.remove("modal-open");
//   };

//   // Close the success modal when the user clicks on <span> (x)
//   closeSuccessModal.onclick = function () {
//     successModal.style.display = "none";
//     document.body.classList.remove("modal-open");
//   };

//   // Close modals when the user clicks anywhere outside of the modal content
//   window.onclick = function (event) {
//     if (event.target == errorModal) {
//       errorModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//     if (event.target == successModal) {
//       successModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//   };

//   updateNoImagesMessage();
// });







// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");
//   const progressBar = document.getElementById("progress-bar");

//   // Hide the progress bar by default
//   progressBar.style.display = "none";

//   // Modal elements for messages
//   const messageModal = document.getElementById("messageModal");
//   const modalMessage = document.getElementById("modalMessage");
//   const closeModal = document.querySelector("#messageModal .error-success-close");

//   // Cropper variables
//   let cropper = null;

//   // Constants for size limits
//   const MAX_FILE_SIZE_BYTES = 962560; // 940 KB

//   // Select error and success message containers
//   const errorMessageContainer = document.querySelector("#error-message");
//   const successMessageContainer = document.querySelector("#success-message");

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Function to display error message
//   function displayErrorMessage(message) {
//     modalMessage.textContent = message;
//     messageModal.style.display = "block";
//     document.body.classList.add("modal-open");
//     errorMessageContainer.style.display = "block";
//     successMessageContainer.style.display = "none";
//   }

//   // Function to display success message
//   function displaySuccessMessage(message) {
//     modalMessage.textContent = message;
//     messageModal.style.display = "block";
//     document.body.classList.add("modal-open");
//     successMessageContainer.style.display = "block";
//     errorMessageContainer.style.display = "none";
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
//       let hasValidImage = false;

//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         hasValidImage = true;

//         // Check file size
//         if (files[i].size > MAX_FILE_SIZE_BYTES) {
//           displayErrorMessage("File size exceeds the maximum allowed size of 940 KB.");
//           continue; // Skip this file
//         }

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           // Defer image creation
//           setTimeout(() => {
//             const imageContainer = document.createElement("div");
//             imageContainer.classList.add("thumbnail");

//             const img = document.createElement("img");
//             img.classList.add("thumb-nail");
//             img.src = picFile.result;
//             img.title = files[i].name;

//             const options = document.createElement("div");
//             options.classList.add("image-options");

//             const editButton = document.createElement("button");
//             editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//             editButton.addEventListener("click", function () {
//               // Display modal
//               modal.style.display = "flex";
//               modalImg.src = img.src;
//               document.body.classList.add("modal-open");

//               // Initialize Cropper.js
//               if (cropper) {
//                 cropper.destroy(); // Destroy previous instance if exists
//               }
//               cropper = new Cropper(modalImg, {
//                 aspectRatio: 16 / 9, // Example aspect ratio
//                 viewMode: 1, // Set the default view mode
//               });
//             });

//             const loveButton = document.createElement("button");
//             loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//             options.appendChild(editButton);
//             options.appendChild(loveButton);

//             imageContainer.appendChild(img);
//             imageContainer.appendChild(options);
//             result.appendChild(imageContainer);

//             displaySuccessMessage("Image uploaded successfully."); // Display success message
//             updateNoImagesMessage();
//           }, 2000); // Defer image creation by 2 seconds to match the progress bar timeout
//         });

//         picReader.readAsDataURL(files[i]);
//       }

//       if (hasValidImage) {
//         progressBar.style.display = "block"; // Show progress bar

//         // Hide the progress bar after processing
//         setTimeout(() => {
//           progressBar.style.display = "none";
//         }, 2000);
//       } else {
//         progressBar.style.display = "none";
//       }
//     } else {
//       displayErrorMessage("Your browser does not support File API."); // Display error message
//     }
//   }

//   // Close the modal when the user clicks on <span> (x)
//   closeModal.onclick = function () {
//     messageModal.style.display = "none";
//     document.body.classList.remove("modal-open");
//   };

//   // Close the modal when the user clicks anywhere outside of the modal content
//   window.onclick = function (event) {
//     if (event.target == messageModal) {
//       messageModal.style.display = "none";
//       document.body.classList.remove("modal-open");
//     }
//   };

//   updateNoImagesMessage();
// });













// Working well but not including the modal for the error or success msg instead it displays the message on the screen.

// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");
//   const progressBar = document.getElementById("progress-bar");

//   // Hide the progress bar by default
//   progressBar.style.display = "none";

//   // Modal elements
//   const modal = document.getElementById("editModal");
//   const modalImg = document.getElementById("editImage");
//   const closeModal = document.querySelector(".close");

//   // Cropper variables
//   let cropper = null;

//   // Constants for size limits
//   const MAX_FILE_SIZE_BYTES = 962560; // 940 KB

//   // Select error and success message containers
//   const errorMessageContainer = document.querySelector("#error-message");
//   const successMessageContainer = document.querySelector("#success-message");

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Function to display error message
//   function displayErrorMessage(message) {
//     errorMessageContainer.textContent = message;
//     errorMessageContainer.style.display = "block";
//     successMessageContainer.style.display = "none";
//   }

//   // Function to display success message
//   function displaySuccessMessage(message) {
//     successMessageContainer.textContent = message;
//     successMessageContainer.style.display = "block";
//     errorMessageContainer.style.display = "none";
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
//       let hasValidImage = false;

//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         hasValidImage = true;

//         // Check file size
//         if (files[i].size > MAX_FILE_SIZE_BYTES) {
//           displayErrorMessage("File size exceeds the maximum allowed size of 940 KB.");
//           continue; // Skip this file
//         }

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           // Defer image creation
//           setTimeout(() => {
//             const imageContainer = document.createElement("div");
//             imageContainer.classList.add("thumbnail");

//             const img = document.createElement("img");
//             img.classList.add("thumb-nail");
//             img.src = picFile.result;
//             img.title = files[i].name;

//             const options = document.createElement("div");
//             options.classList.add("image-options");

//             const editButton = document.createElement("button");
//             editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//             editButton.addEventListener("click", function () {
//               // Display modal
//               modal.style.display = "flex";
//               modalImg.src = img.src;
//               document.body.classList.add("modal-open");

//               // Initialize Cropper.js
//               if (cropper) {
//                 cropper.destroy(); // Destroy previous instance if exists
//               }
//               cropper = new Cropper(modalImg, {
//                 aspectRatio: 16 / 9, // Example aspect ratio
//                 viewMode: 1, // Set the default view mode
//               });
//             });

//             const loveButton = document.createElement("button");
//             loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//             options.appendChild(editButton);
//             options.appendChild(loveButton);

//             imageContainer.appendChild(img);
//             imageContainer.appendChild(options);
//             result.appendChild(imageContainer);

//             displaySuccessMessage("Image uploaded successfully."); // Display success message
//             updateNoImagesMessage();
//           }, 2000); // Defer image creation by 2 seconds to match the progress bar timeout
//         });

//         picReader.readAsDataURL(files[i]);
//       }

//       if (hasValidImage) {
//         progressBar.style.display = "block"; // Show progress bar

//         // Hide the progress bar after processing
//         setTimeout(() => {
//           progressBar.style.display = "none";
//         }, 2000);
//       } else {
//         progressBar.style.display = "none";
//       }
//     } else {
//       displayErrorMessage("Your browser does not support File API."); // Display error message
//     }
//   }

//   // Close the modal when the user clicks on <span> (x)
//   closeModal.onclick = function () {
//     modal.style.display = "none";
//     document.body.classList.remove("modal-open");

//     // Destroy Cropper.js instance
//     if (cropper) {
//       cropper.destroy();
//       cropper = null;
//     }
//   };

//   // Close the modal when the user clicks anywhere outside of the modal content
//   window.onclick = function (event) {
//     if (event.target == modal) {
//       modal.style.display = "none";
//       document.body.classList.remove("modal-open");

//       // Destroy Cropper.js instance
//       if (cropper) {
//         cropper.destroy();
//         cropper = null;
//       }
//     }
//   };

//   updateNoImagesMessage();
// });

















// Working as expected but not waiting for the progress bar to finish executing before uploading the image. 

// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");
//   const progressBar = document.getElementById("progress-bar");

//   // Hide the progress bar by default
//   progressBar.style.display = "none";

//   // Modal elements
//   const modal = document.getElementById("editModal");
//   const modalImg = document.getElementById("editImage");
//   const closeModal = document.querySelector(".close");

//   // Cropper variables
//   let cropper = null;

//   // Constants for size limits
//   const MAX_FILE_SIZE_BYTES = 962560; // 940 KB

//   // Select error and success message containers
//   const errorMessageContainer = document.querySelector("#error-message");
//   const successMessageContainer = document.querySelector("#success-message");

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Function to display error message
//   function displayErrorMessage(message) {
//     errorMessageContainer.textContent = message;
//     errorMessageContainer.style.display = "block";
//     successMessageContainer.style.display = "none";
//   }

//   // Function to display success message
//   function displaySuccessMessage(message) {
//     successMessageContainer.textContent = message;
//     successMessageContainer.style.display = "block";
//     errorMessageContainer.style.display = "none";
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
//       let hasValidImage = false;

//       for (let i = 0; i < files.length; i++) {
//         if (!files[i].type.match("image")) continue;

//         hasValidImage = true;

//         // Check file size
//         if (files[i].size > MAX_FILE_SIZE_BYTES) {
//           displayErrorMessage("File size exceeds the maximum allowed size of 940 KB.");
//           continue; // Skip this file
//         }

//         const picReader = new FileReader();
//         picReader.addEventListener("load", function (event) {
//           const picFile = event.target;

//           const imageContainer = document.createElement("div");
//           imageContainer.classList.add("thumbnail");

//           const img = document.createElement("img");
//           img.classList.add("thumb-nail");
//           img.src = picFile.result;
//           img.title = files[i].name;

//           const options = document.createElement("div");
//           options.classList.add("image-options");

//           const editButton = document.createElement("button");
//           editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
//           editButton.addEventListener("click", function () {
//             // Display modal
//             modal.style.display = "flex";
//             modalImg.src = img.src;
//             document.body.classList.add("modal-open");

//             // Initialize Cropper.js
//             if (cropper) {
//               cropper.destroy(); // Destroy previous instance if exists
//             }
//             cropper = new Cropper(modalImg, {
//               aspectRatio: 16 / 9, // Example aspect ratio
//               viewMode: 1, // Set the default view mode
//             });
//           });

//           const loveButton = document.createElement("button");
//           loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//           options.appendChild(editButton);
//           options.appendChild(loveButton);

//           imageContainer.appendChild(img);
//           imageContainer.appendChild(options);
//           result.appendChild(imageContainer);

//           displaySuccessMessage("Image uploaded successfully."); // Display success message
//           updateNoImagesMessage();
//         });

//         picReader.readAsDataURL(files[i]);
//       }

//       if (hasValidImage) {
//         progressBar.style.display = "block"; // Show progress bar

//         // Hide the progress bar after processing
//         setTimeout(() => {
//           progressBar.style.display = "none";
//         }, 2000);
//       } else {
//         progressBar.style.display = "none";
//       }
//     } else {
//       displayErrorMessage("Your browser does not support File API."); // Display error message
//     }
//   }

//   // Close the modal when the user clicks on <span> (x)
//   closeModal.onclick = function () {
//     modal.style.display = "none";
//     document.body.classList.remove("modal-open");

//     // Destroy Cropper.js instance
//     if (cropper) {
//       cropper.destroy();
//       cropper = null;
//     }
//   };

//   // Close the modal when the user clicks anywhere outside of the modal content
//   window.onclick = function (event) {
//     if (event.target == modal) {
//       modal.style.display = "none";
//       document.body.classList.remove("modal-open");

//       // Destroy Cropper.js instance
//       if (cropper) {
//         cropper.destroy();
//         cropper = null;
//       }
//     }
//   };

//   updateNoImagesMessage();
// });




// This logic is working well for upload validation

// document.addEventListener("DOMContentLoaded", function () {
//   const uploadFiles = document.querySelector("#file");
//   const result = document.querySelector("#result");
//   const noImagesMessage = document.querySelector("#no-images-message");

//   // Modal elements
//   const modal = document.getElementById("editModal");
//   const modalImg = document.getElementById("editImage");
//   const closeModal = document.querySelector(".close");

//   // Cropper variables
//   let cropper = null;

//   // Constants for size limits
//   const MAX_FILE_SIZE_BYTES = 962560; // 940 KB

//   // Select error and success message containers
//   const errorMessageContainer = document.querySelector("#error-message");
//   const successMessageContainer = document.querySelector("#success-message");

//   // Update the message visibility
//   function updateNoImagesMessage() {
//     if (result.children.length === 0) {
//       noImagesMessage.style.display = "block";
//     } else {
//       noImagesMessage.style.display = "none";
//     }
//   }

//   // Function to display error message
//   function displayErrorMessage(message) {
//     errorMessageContainer.textContent = message;
//     errorMessageContainer.style.display = "block";
//   }

//   // Function to display success message
//   function displaySuccessMessage(message) {
//     successMessageContainer.textContent = message;
//     successMessageContainer.style.display = "block";
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

//         // Check file size
//         if (files[i].size > MAX_FILE_SIZE_BYTES) {
//           displayErrorMessage("File size exceeds the maximum allowed size of 940 KB.");
//           continue; // Skip this file
//         }

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
//             // Display modal
//             modal.style.display = "flex";
//             modalImg.src = img.src;
//             document.body.classList.add("modal-open");

//             // Initialize Cropper.js
//             if (cropper) {
//               cropper.destroy(); // Destroy previous instance if exists
//             }
//             cropper = new Cropper(modalImg, {
//               aspectRatio: 16 / 9, // Example aspect ratio
//               viewMode: 1, // Set the default view mode
//             });
//           });

//           const loveButton = document.createElement("button");
//           loveButton.innerHTML = '<i class="fas fa-heart"></i> Love';

//           options.appendChild(editButton);
//           options.appendChild(loveButton);

//           imageContainer.appendChild(img);
//           imageContainer.appendChild(options);
//           result.appendChild(imageContainer);

//           displaySuccessMessage("Image uploaded successfully."); // Display success message
//           updateNoImagesMessage();
//         });

//         picReader.readAsDataURL(files[i]);
//       }
//     } else {
//       displayErrorMessage("Your browser does not support File API."); // Display error message
//     }
//   }

//   // Close the modal when the user clicks on <span> (x)
//   closeModal.onclick = function () {
//     modal.style.display = "none";
//     document.body.classList.remove("modal-open");

//     // Destroy Cropper.js instance
//     if (cropper) {
//       cropper.destroy();
//       cropper = null;
//     }
//   };

//   // Close the modal when the user clicks anywhere outside of the modal content
//   window.onclick = function (event) {
//     if (event.target == modal) {
//       modal.style.display = "none";
//       document.body.classList.remove("modal-open");

//       // Destroy Cropper.js instance
//       if (cropper) {
//         cropper.destroy();
//         cropper = null;
//       }
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


