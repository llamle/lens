'use strict';

// Dependencies
var fs   = require('fs');
var mime = require('mime');
var path = require('path');

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

var filters = {
  original: function(){},

  XPro2: function(item){
    item.contrast(1.3);
    item.brightness(0.8);
    item.sepia(0.3);
    item.saturate(1.5);
    item.hue-rotate(-20);
  },

  Willow: function(item){
    item.saturate(0.02);
    item.contrast(0.85);
    item.brightness(1.2);
    item.sepia(0.02);
  },

  Walden: function(item){
    item.sepia(0.35);
    item.contrast(0.9);
    item.brightness(1.1);
    item.hue-rotate(-10);
    item.saturate(1.5);
  },

  Valencia: function(item){
    item.sepia(0.15);
    item.saturate(1.5);
    item.contrast(0.9);
  },

  Toaster: function(item){
    item.sepia(0.4);
    item.saturate(2.5);
    item.hue-rotate(-30);
    item.contrast(0.67);
  },

  Sutro: function(item){
    item.brightness(0.75);
    item.contrast(1.3);
    item.sepia(0.5);
    item.hue-rotate(-25);
  },

  Sierra: function(item){
    item.contrast(0.8);
    item.saturate(1.2);
    item.sepia(0.15);
  },

  Rise: function(item){
    item.saturate(1.4);
    item.sepia(0.25);
    item.hue-rotate(-15);
    item.contrast(0.8);
    item.brightness(1.1);
  },

  Nashville: function(item){
    item.sepia(0.4);
    item.saturate(1.5);
    item.contrast(0.9);
    item.brightness(1.1);
    item.hue-rotate(-15);
  },

  Mayfair: function(item){
    item.saturate(1.4);
    item.contrast(1.1);
  },

  LoFi: function(item){
    item.contrast(1.4);
    item.brightness(0.9);
    item.sepia(0.05);
  },

  Kelvin: function(item){
    item.sepia(0.4);
    item.saturate(2.4);
    item.brightness(1.3);
    item.contrast(1);
  },

  Inkwell: function(item){
    item.grayscale(1);
    item.brightness(1.2);
    item.contrast(1.05);
  },

  Hudson: function(item){
    item.contrast(1.2);
    item.brightness(0.9);
    item.hue-rotate(-10);
  },

  Hefe: function(item){
    item.contrast(1.3);
    item.sepia(0.3);
    item.saturate(1.3);
    item.hue-rotate(-10);
    item.brightness(0.95);
  },

  Earlybird: function(item){
    item.sepia(0.4);
    item.saturate(1.6);
    item.contrast(1.1);
    item.brightness(0.9);
    item.hue-rotate(-10);
  },

  Brannan: function(item){
    item.sepia(0.5);
    item.contrast(1.4);
  },

  Amaro: function(item){
    item.hue-rotate(-10);
    item.contrast(0.9);
    item.brightness(1.1);
    item.saturate(1.5);
  },

  IG1977: function(item){
    item.sepia(0.5);
    item.hue-rotate(-30);
    item.saturate(1.2);
    item.contrast(0.8);
  }
};

function applyFilter(filterName){
  Caman('#image', function(){
    this.reset();
    filters[filterName](this)
  });
}

function backToGridView(){
  var canvas = document.querySelector('canvas');
  var image  = document.createElement('img');
  image.setAttribute('id', 'image');
  canvas.parentNode.removeChild(canvas);
  var fullViewPhoto = document.querySelector('#fullViewPhoto');
  fullViewPhoto.insertBefore(image, fullViewPhoto.firstChild);
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
            }
          });
        });
      }
    });
  });
};
