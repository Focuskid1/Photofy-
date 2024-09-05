     
function toggleMenu() {
    var menu = document.getElementById("navMenu");
    var icon = document.querySelector('.navbar i');

    // Toggle the display of the menu
    if (menu.style.display === "block") {
        menu.style.display = "none";
        icon.classList.remove('fa-times'); // Change to bars icon
        icon.classList.add('fa-bars');
    } else {
        menu.style.display = "block";
        icon.classList.remove('fa-bars'); // Change to close icon
        icon.classList.add('fa-times');
    }
}

// Close the menu and change the icon when the user scrolls
window.onscroll = function() {
    var menu = document.getElementById("navMenu");
    var icon = document.querySelector('.navbar i');
    if (menu.style.display === "block") {
        menu.style.display = "none";
        icon.classList.remove('fa-times'); // Change back to bars icon
        icon.classList.add('fa-bars');
    }
};

// Optional: Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.fas')) {
        var menu = document.getElementById("navMenu");
        var icon = document.querySelector('.navbar i');
        if (menu.style.display === "block") {
            menu.style.display = "none";
            icon.classList.remove('fa-times'); // Change back to bars icon
            icon.classList.add('fa-bars');
        }
    }
};
    
