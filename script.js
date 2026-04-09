document.addEventListener("DOMContentLoaded", () => {
    /* =============== MOBILE NAVIGATION DOM =============== */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links li a");
    const header = document.querySelector("header");

    // Toggle menu
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    /* =============== SCROLL EFFECTS =============== */
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* =============== INTERSECTION OBSERVER FOR FADE-IN =============== */
    const faders = document.querySelectorAll(".fade-in");
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("appear");
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    /* =============== FORM & Customization Logic =============== */
    const form = document.getElementById("customForm");
    const budgetInput = document.getElementById("budget");
    const budgetDisplay = document.getElementById("budgetDisplay");
    
    // DOM nodes for preview
    const blueprintPlaceholder = document.getElementById("blueprintPlaceholder");
    const blueprintContent = document.getElementById("blueprintContent");
    const successMsg = document.getElementById("successMsg");
    const downloadBtn = document.getElementById("downloadBtn");
    const clearBtn = document.getElementById("clearBtn");
    const blueprintCard = document.getElementById("blueprintCard");

    // Update Budget slider display dynamically
    budgetInput.addEventListener("input", (e) => {
        budgetDisplay.textContent = e.target.value;
    });

    // Load data from LocalStorage on mount
    loadSavedData();

    function loadSavedData() {
        const savedData = localStorage.getItem("consciousBambooBlueprint");
        if (savedData) {
            displayBlueprint(JSON.parse(savedData));
        }
    }

    /* =============== FORM SUBMISSION =============== */
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Reset Validation Visuals
        document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
        form.querySelectorAll('input, select').forEach(el => el.classList.remove('invalid'));
        successMsg.classList.add("hidden");

        let isValid = true;

        // Validation Checks
        const nameNode = document.getElementById("name");
        if (!nameNode.value.trim()) {
            document.getElementById("nameError").classList.add("visible");
            nameNode.classList.add("invalid");
            isValid = false;
        }

        const emailNode = document.getElementById("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailNode.value.trim() || !emailRegex.test(emailNode.value)) {
            document.getElementById("emailError").classList.add("visible");
            emailNode.classList.add("invalid");
            isValid = false;
        }

        const typeNode = document.getElementById("productType");
        if (!typeNode.value) {
            document.getElementById("typeError").classList.add("visible");
            typeNode.classList.add("invalid");
            isValid = false;
        }

        const purposeNode = document.getElementById("purpose");
        if (!purposeNode.value.trim()) {
            document.getElementById("purposeError").classList.add("visible");
            purposeNode.classList.add("invalid");
            isValid = false;
        }

        if(isValid) {
            // Collect Data
            const selectedDesign = document.querySelector('input[name="design"]:checked').value;
            const notesNode = document.getElementById("notes");
            
            const blueprintData = {
                name: nameNode.value.trim(),
                email: emailNode.value.trim(),
                type: typeNode.value,
                design: selectedDesign,
                budget: budgetInput.value,
                purpose: purposeNode.value.trim(),
                notes: notesNode.value.trim() ? notesNode.value.trim() : "No additional notes."
            };

            // Save to LocalStorage
            localStorage.setItem("consciousBambooBlueprint", JSON.stringify(blueprintData));
            
            // Display Data in Preview
            displayBlueprint(blueprintData);
            
            // Optionally clear the form
            // form.reset();
            // budgetDisplay.textContent = "100";
        }
    });

    /* =============== DISPLAY BLUEPRINT =============== */
    function displayBlueprint(data) {
        // Hide placeholder, show content
        blueprintPlaceholder.classList.add("hidden");
        blueprintContent.classList.remove("hidden");
        blueprintCard.style.borderStyle = "solid";
        blueprintCard.style.borderColor = "var(--color-primary-light)";
        
        // Map data to DOM
        document.getElementById("prevName").textContent = data.name;
        document.getElementById("prevEmail").textContent = data.email;
        document.getElementById("prevType").textContent = data.type;
        document.getElementById("prevDesign").textContent = data.design;
        document.getElementById("prevBudget").textContent = data.budget;
        document.getElementById("prevPurpose").textContent = data.purpose;
        document.getElementById("prevNotes").textContent = data.notes;
        successMsg.classList.add("hidden"); // Reset success message
    }

    /* =============== CLEAR BUTTON =============== */
    clearBtn.addEventListener("click", () => {
        localStorage.removeItem("consciousBambooBlueprint");
        blueprintPlaceholder.classList.remove("hidden");
        blueprintContent.classList.add("hidden");
        blueprintCard.style.borderStyle = "dashed";
        blueprintCard.style.borderColor = "#ccc";
        form.reset();
        budgetDisplay.textContent = "100";
    });

    /* =============== SIMULATE DOWNLOAD/SEND =============== */
    downloadBtn.addEventListener("click", () => {
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = "Sending...";
        downloadBtn.disabled = true;
        
        // Simulate network request
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
            successMsg.classList.remove("hidden");
            
            // Auto hide success message
            setTimeout(() => {
                successMsg.classList.add("hidden");
            }, 3000);
        }, 1500);
    });
});
