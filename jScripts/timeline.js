"use strict";

// איתור הפקדים פעם אחת. מאפייני data-* מחברים כל בחירה לתמונה ולרשימה שלה.
const checklistForm = document.getElementById("checklistForm");
const coupleNames = document.getElementById("coupleNames");
const checklistTypes = document.getElementsByName("checklistType");
const doneTasks = document.getElementsByName("doneTask");
const roleImages = document.querySelectorAll(".role-image");
const taskPreviews = document.querySelectorAll(".task-preview");
const roleHint = document.getElementById("roleHint");
const submitButton = document.getElementById("timelineSubmit");
const summary = document.getElementById("timelineSummary");

// מחזירה את כפתור הרדיו הנבחר, או null אם עדיין לא נבחר תפקיד.
function getSelectedRole() {
    for (let i = 0; i < checklistTypes.length; i++) {
        if (checklistTypes[i].checked) return checklistTypes[i];
    }
    return null;
}

// שינוי הפרטים מסתיר סיכום ישן. תיבות הסימון אינן תנאי להפעלת הכפתור.
// trim מונע אישור של מחרוזת המכילה רווחים בלבד.
function updateFormState() {
    submitButton.disabled = coupleNames.value.trim() === "" || getSelectedRole() === null;
    summary.hidden = true;
}

// כל תמונת משימה מודגשת בנפרד; ה-CSS אחראי לשקיפות של המחלקה.
function updateTaskImage(task) {
    const icon = document.getElementById(task.dataset.icon);
    icon.classList.toggle("is-complete", task.checked);
}

// התצוגה הגדולה היא תוספת. התמונות הקטנות נשארות מודגשות בנפרד,
// גם כשמסומנות כמה משימות. ללא משימה מוצגת דמות התפקיד הנבחר.
function showPreview(task) {
    for (let i = 0; i < roleImages.length; i++) roleImages[i].hidden = true;
    for (let i = 0; i < taskPreviews.length; i++) taskPreviews[i].hidden = true;
    const role = getSelectedRole();
    if (task && task.checked) {
        document.getElementById(task.dataset.preview).hidden = false;
    } else if (role) {
        document.getElementById(role.dataset.image).hidden = false;
    }
}

// בתחילה שתי הרשימות גלויות והתמונות בשקיפות חלקית. בחירת תפקיד מציגה
// רק את הרשימה המתאימה ומאפסת את הסימונים ברשימה האחרת.
function changeRole() {
    const role = getSelectedRole();
    for (let i = 0; i < checklistTypes.length; i++) {
        const panel = document.getElementById(checklistTypes[i].dataset.panel);
        panel.hidden = role !== null && checklistTypes[i] !== role;
    }
    for (let i = 0; i < doneTasks.length; i++) {
        if (role && doneTasks[i].dataset.for !== role.value) doneTasks[i].checked = false;
        updateTaskImage(doneTasks[i]);
    }
    roleHint.hidden = role !== null;
    showPreview(null);
    updateFormState();
}

// יצירת הסיכום באמצעות textContent: הקלט נשאר טקסט ואינו מתפרש כקוד HTML.
function showSummary(event) {
    event.preventDefault();
    const role = getSelectedRole();
    if (!role || coupleNames.value.trim() === "") {
        updateFormState();
        return;
    }
    const completedTasks = [];
    for (let i = 0; i < doneTasks.length; i++) {
        if (doneTasks[i].checked && doneTasks[i].dataset.for === role.value) {
            completedTasks.push(doneTasks[i].value);
        }
    }
    const feedback = [
        "עוד לא התחלת, אבל זה בדיוק הזמן לעבור על הרשימה!",
        "התחלה טובה! דבר אחד כבר מוכן, ויש עוד כמה דברים קטנים לסגור.",
        "את/ה לגמרי בדרך הנכונה! חצי מהצ'ק ליסט כבר מאחוריך.",
        "את/ה כמעט מוכן/ה! נשאר רק עוד דבר אחד קטן לפני היום הגדול.",
        "הכל מוכן! אפשר לנשום עמוק ולהגיע ליום הגדול בראש שקט!"
    ];
    const heading = document.createElement("h3");
    heading.textContent = feedback[Math.min(completedTasks.length, feedback.length - 1)];
    const introduction = document.createElement("p");
    const name = document.createElement("strong");
    name.textContent = coupleNames.value.trim();
    const roleName = document.createElement("strong");
    roleName.textContent = role.value;
    introduction.append(name, ", פתחת את הצ'ק ליסט של ה", roleName, ".");
    const tasks = document.createElement("p");
    const taskHeading = document.createElement("strong");
    taskHeading.textContent = "מה כבר מוכן? ";
    const tasksText = completedTasks.length > 0
        ? completedTasks.join(", ")
        : "עדיין לא סימנת משימות שהושלמו";
    tasks.append(taskHeading, tasksText + ".");
    summary.replaceChildren(heading, introduction, tasks);
    summary.hidden = false;
}

coupleNames.addEventListener("input", updateFormState);
for (let i = 0; i < checklistTypes.length; i++) {
    checklistTypes[i].addEventListener("change", changeRole);
}
for (let i = 0; i < doneTasks.length; i++) {
    doneTasks[i].addEventListener("change", function () {
        updateTaskImage(this);
        showPreview(this);
        updateFormState();
    });
}
checklistForm.addEventListener("submit", showSummary);
// סנכרון פקדים גם לאחר חזרה לעמוד באמצעות כפתור 'אחורה' בדפדפן.
window.addEventListener("pageshow", changeRole);
changeRole();
