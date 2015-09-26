'use strict';

// Dependencies
var fs        = require('fs');
var mime      = require('mime');
var path      = require('path');
var photoData = null;

function openFolderDialog(cb){
  var inputField = document.querySelector('#folderSelector');
  inputField.addEventListener('change', function(){
    var folderPath = this.value;
    cb(folderPath);
  }, false);
  inputField.click();
}

function bindSelectFolderClick(cb){
  var button = document.querySelector('#select_folder');
  button.addEventListener('click', function(){
    openFolderDialog(cb);
  });
}

function hideSelectFolderButton(){
  var button = document.querySelector('#select_folder');
  button.style.display = 'none';
}

function findAllFiles(folderPath, cb){
  fs.readdir(folderPath, function(err, files){
    if (err) { return cb(err, null); }
    cb(null, files);
  });
}

// List of all image mime types
var imageMimeTypes = [
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/pjpeg',
  'image/tiff',
  'image/webp',
  'image/x-tiff',
  'image/x-windows-bmp'
];

function findImageFiles(files, folderPath, cb){
  var imageFiles = [];
  files.forEach(function (file){
    var fullFilePath = path.resolve(folderPath, file);
    var extension = mime.lookup(fullFilePath);
    if (imageMimeTypes.indexOf(extension) !== -1) {
      imageFiles.push({name: file, path: fullFilePath});
    }
    if (files.indexOf(file) === files.length-1) {
      cb(imageFiles);
    }
  });
}

function addImageToPhotosArea(file){
  var photosArea = document.getElementById('photos');
  var template = document.querySelector('#photo-template');
  template.content.querySelector('img').src = file.path;
  template.content.querySelector('img').setAttribute('data-name', file.name);
  var clone = window.document.importNode(template.content, true);
    photosArea.appendChild(clone);
}

function displayPhotoInFullView(photo){
  var filePath = photo.querySelector('img').src;
  var fileName = photo.querySelector('img').attributes[1].value;
  document.querySelector('#fullViewPhoto > img').src = filePath;
  document.querySelector('#fullViewPhoto > img').setAttribute('data-name', fileName);
  document.querySelector('#fullViewPhoto').style.display = 'block';
}

// Default Filters
var filters = {
    original: function () {},

    grayscale: function (item) {
        item.saturation(-100);
        item.render();
    },
    sepia: function (item) {
        item.saturation(-100);
        item.vibrance(100);
        item.sepia(100);
        item.render();
    },
    sunburst: function (item) {
        item.brightness(21);
        item.vibrance(22);
        item.contrast(11);
        item.saturation(-18);
        item.exposure(18);
        item.sepia(17);
        item.render();
    },
    port: function (item) {
        item.vibrance(49);
        item.hue(6);
        item.gamma(0.6);
        item.stackBlur(2);
        item.contrast(11);
        item.saturation(19);
        item.exposure(2);
        item.noise(2);
        item.render();
    }
};

// Custom Filters
// var filters = {
//   original: function(){},
//
//   XPro2: function(item){
//     item.contrast(1.3);
//     item.brightness(0.8);
//     item.sepia(0.3);
//     item.saturation(1.5);
//     item.hue(-20);
//     item.render();
//   },
//
//   Willow: function(item){
//     item.saturation(0.02);
//     item.contrast(0.85);
//     item.brightness(1.2);
//     item.sepia(0.02);
//     item.render();
//   },
//
//   Walden: function(item){
//     item.sepia(0.35);
//     item.contrast(0.9);
//     item.brightness(1.1);
//     item.hue(-10);
//     item.saturation(1.5);
//     item.render();
//   },
//
//   Valencia: function(item){
//     item.sepia(0.15);
//     item.saturation(1.5);
//     item.contrast(0.9);
//     item.render();
//   },
//
//   Toaster: function(item){
//     item.sepia(0.4);
//     item.saturation(2.5);
//     item.hue(-30);
//     item.contrast(0.67);
//     item.render();
//   },
//
//   Sutro: function(item){
//     item.brightness(0.75);
//     item.contrast(1.3);
//     item.sepia(0.5);
//     item.hue(-25);
//     item.render();
//   },
//
//   Sierra: function(item){
//     item.contrast(0.8);
//     item.saturation(1.2);
//     item.sepia(0.15);
//     item.render();
//   },
//
//   Rise: function(item){
//     item.saturation(1.4);
//     item.sepia(0.25);
//     item.hue(-15);
//     item.contrast(0.8);
//     item.brightness(1.1);
//     item.render();
//   },
//
//   Nashville: function(item){
//     item.sepia(0.4);
//     item.saturation(1.5);
//     item.contrast(0.9);
//     item.brightness(1.1);
//     item.hue(-15);
//     item.render();
//   },
//
//   Mayfair: function(item){
//     item.saturation(1.4);
//     item.contrast(1.1);
//     item.render();
//   },
//
//   LoFi: function(item){
//     item.contrast(1.4);
//     item.brightness(0.9);
//     item.sepia(0.05);
//     item.render();
//   },
//
//   Kelvin: function(item){
//     item.sepia(0.4);
//     item.saturation(2.4);
//     item.brightness(1.3);
//     item.contrast(1);
//     item.render();
//   },
//
//   Inkwell: function(item){
//     item.greyscale(1);
//     item.brightness(1.2);
//     item.contrast(1.05);
//     item.render();
//   },
//
//   Hudson: function(item){
//     item.contrast(1.2);
//     item.brightness(0.9);
//     item.hue(-10);
//     item.render();
//   },
//
//   Hefe: function(item){
//     item.contrast(1.3);
//     item.sepia(0.3);
//     item.saturation(1.3);
//     item.hue(-10);
//     item.brightness(0.95);
//     item.render();
//   },
//
//   Earlybird: function(item){
//     item.sepia(0.4);
//     item.saturation(1.6);
//     item.contrast(1.1);
//     item.brightness(0.9);
//     item.hue(-10);
//     item.render();
//   },
//
//   Brannan: function(item){
//     item.sepia(0.5);
//     item.contrast(1.4);
//     item.render();
//   },
//
//   Amaro: function(item){
//     item.hue(-10);
//     item.contrast(0.9);
//     item.brightness(1.1);
//     item.saturation(1.5);
//     item.render();
//   },
//
//   IG1977: function(item){
//     item.sepia(0.5);
//     item.hue(-30);
//     item.saturation(1.2);
//     item.contrast(0.8);
//     item.render();
//   }
// };

function applyFilter(filterName){
  Caman('#image', function(){
    this.reset();
    filters[filterName](this)
  });
}

function bindSavingToDisk(){
  var photoSaver = document.querySelector('#photoSaver');
  photoSaver.addEventListener('change', function(){
    var filePath = this.value;
    fs.writeFile(filePath, photoData, 'base64', function(err){
      if(err){ alert('There was an error saving the photo:', err.message); }
      photoData = null;
    });
  });
}

function saveToDisk(){
  var photoSaver = document.querySelector('#photoSaver');
  var canvas     = document.querySelector('canvas');
  photoSaver.setAttribute('nwsaves', 'Copy of ' + canvas.attributes['data-name'].value);
  photoData      = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  photoSaver.click();
}

function backToGridView(){
    var canvas  = document.querySelector('canvas');
    if (canvas){
      var image   = document.createElement('img');
      image.setAttribute('id','image');
      canvas.parentNode.removeChild(canvas);
      var fullViewPhoto = document.querySelector('#fullViewPhoto');
      fullViewPhoto.insertBefore(image, fullViewPhoto.firstChild);
  }
  document.querySelector('#fullViewPhoto').style.display = 'none';
}

function bindClickingOnAPhoto(photo){
  photo.onclick = function(){
      displayPhotoInFullView(photo);
  };
}

function bindClickingOnAllPhotos(){
  var photos = document.querySelectorAll('.photo');
  for (var i = 0; i < photos.length; i++) {
    var photo = photos[i];
    bindClickingOnAPhoto(photo);
  }
}

// Runs when the browser has loaded the page
window.onload = function(){
  bindSelectFolderClick(function(folderPath){
    hideSelectFolderButton();
    findAllFiles(folderPath, function(err, files){
      if (!err) {
        findImageFiles(files, folderPath, function(imageFiles){
          imageFiles.forEach(function(file, index){
            addImageToPhotosArea(file);
            if (index === imageFiles.length-1) {
              bindClickingOnAllPhotos();
              bindSavingToDisk();
            }
          });
        });
      }
    });
  });
};
