"use strict";

// עמוד שלא פותח נשאר עם href="#" לפי המטלה, בלי קפיצה לראש העמוד.
const placeholderLinks = document.querySelectorAll('a[aria-disabled="true"]');
for (let i = 0; i < placeholderLinks.length; i++) {
    placeholderLinks[i].addEventListener("click", function (event) {
        event.preventDefault();
    });
}

// הדפדפן בודק required ו-email לפני אירוע submit.
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    const contactStatus = document.getElementById("contactStatus");
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        contactStatus.textContent = "הפרטים מולאו בהצלחה.";
        contactStatus.hidden = false;
    });
    contactForm.addEventListener("input", function () {
        contactStatus.hidden = true;
    });
}
