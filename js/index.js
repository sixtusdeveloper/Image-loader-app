const uploadFiles = document.querySelector('#files')
uploadFiles.addEventListener('change', (e) => {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    const files = e.target.files
    const output = document.querySelector('#result')
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.match('image')) continue
      const picReader = new FileReader()
      picReader.addEventListener('load', function (event) {
        const picFile = event.target
        const imageContainer = document.createElement('div')
        imageContainer.innerHTML = `<img class="thumb-nail" src="${picFile.result}" title="${picFile.name}" />`
        output.appendChild(imageContainer)
      })
      picReader.readAsDataURL(files[i])
    }
  } else {
    alert("Your browser doesn't support the File API!")
  }
})
