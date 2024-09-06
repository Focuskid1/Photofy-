const fileInput = document.querySelector("#fileInput");
        const previewImg = document.querySelector("#previewImg");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const downloadIcon = document.getElementById("download-icon");

        // Load image
        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Apply filters when button is clicked
        const buttons = document.querySelectorAll('.scroll-button[data-filter]');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const filterClass = this.getAttribute('data-filter');
                previewImg.className = ''; // Reset classes
                previewImg.classList.add(filterClass); // Apply new filter
            });
        });

        // Reset button functionality
        const resetButton = document.getElementById('reset');
        resetButton.addEventListener('click', () => {
            previewImg.className = ''; // Remove all filters
        });

        // Download the image
        downloadIcon.addEventListener("click", () => {
            canvas.width = previewImg.naturalWidth;
            canvas.height = previewImg.naturalHeight;
            ctx.filter = getComputedStyle(previewImg).filter; // Apply current filter
            ctx.drawImage(previewImg, 0, 0);
            downloadIcon.href = canvas.toDataURL("image/jpeg");
        });




self.addEventListener("install", function(event) {
  event.waitUntil(preLoad());
});

var preLoad = function(){
  console.log("Installing web app");
  return caches.open("offline").then(function(cache) {
    console.log("caching index and important routes");
    return cache.addAll(["/blog/", "/blog", "/", "/contact", "/resume", "/offline.html"]);
  });
};

self.addEventListener("fetch", function(event) {
  event.respondWith(checkResponse(event.request).catch(function() {
    return returnFromCache(event.request);
  }));
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function(request){
  return new Promise(function(fulfill, reject) {
    fetch(request).then(function(response){
      if(response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
};

var addToCache = function(request){
  return caches.open("offline").then(function (cache) {
    return fetch(request).then(function (response) {
      console.log(response.url + " was cached");
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function(request){
  return caches.open("offline").then(function (cache) {
    return cache.match(request).then(function (matching) {
     if(!matching || matching.status == 404) {
       return cache.match("offline.html");
     } else {
       return matching;
     }
    });
  });
};
