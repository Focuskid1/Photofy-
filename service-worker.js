self.addEventListener("install", function(event) {
    event.waitUntil(preLoad());
});

var preLoad = function(){
    console.log("Installing web app");
    return caches.open("offline").then(function(cache) {
        console.log("Caching index and important routes");
        return cache.addAll(["/blog/", "/blog", "/", "/contact", "/resume", "/offline.html"]);
    });
};

self.addEventListener("fetch", function(event) {
    event.respondWith(
        checkResponse(event.request).catch(function() {
            return returnFromCache(event.request);
        })
    );
    event.waitUntil(addToCache(event.request));
});

var checkResponse = function(request){
    return fetch(request).then(function(response){
        if(response.status !== 404) {
            return response;
        } else {
            return Promise.reject('Not found');
        }
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