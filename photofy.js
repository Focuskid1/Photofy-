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
