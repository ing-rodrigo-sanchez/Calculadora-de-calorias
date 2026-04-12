const calorieForm = document.getElementById("calorieForm");
const bmrResult = document.getElementById("bmrResult");
const totalResult = document.getElementById("totalResult");
const goalResult = document.getElementById("goalResult");
const goalGuidance = document.getElementById("goalGuidance");
const formMessage = document.getElementById("formMessage");
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const ageInput = document.getElementById("age");
const activitySelect = document.getElementById("activity");
const goalSelect = document.getElementById("goal");
const sexInputs = document.querySelectorAll('input[name="sex"]');

function formatCalories(value) {
    return `${Math.round(value).toLocaleString("es-ES")} kcal/día`;
}

function calculateGoalCalories(totalCalories, goal) {
    if (goal === "gain") {
        // Superavit moderado para favorecer ganancia muscular y limitar ganancia de grasa.
        return totalCalories * 1.1;
    }

    if (goal === "deficit") {
        // Deficit moderado para proteger la masa muscular frente a perdidas bruscas.
        return totalCalories * 0.85;
    }

    return totalCalories;
}

function getGoalGuidance(totalCalories, objectiveCalories, goal) {
    const dailyDelta = objectiveCalories - totalCalories;
    const weeklyChangeKg = (dailyDelta * 7) / 7700;
    const weeklyText = Math.abs(weeklyChangeKg).toFixed(2).replace(".", ",");

    if (goal === "gain") {
        return `Superavit moderado recomendado para ganar masa de forma gradual: +${Math.round(dailyDelta)} kcal/dia (aprox. +${weeklyText} kg/semana).`;
    }

    if (goal === "deficit") {
        return `Deficit moderado recomendado para proteger musculo: ${Math.round(dailyDelta)} kcal/dia (aprox. -${weeklyText} kg/semana).`;
    }

    return "Mantenimiento: enfocate en sostener tu peso y ajustar segun progreso semanal.";
}

function resetFormAfterSexChange() {
    weightInput.value = "";
    heightInput.value = "";
    ageInput.value = "";
    activitySelect.selectedIndex = 0;
    goalSelect.selectedIndex = 0;

    bmrResult.textContent = "-- kcal/día";
    totalResult.textContent = "-- kcal/día";
    goalResult.textContent = "-- kcal/día";
    goalGuidance.textContent = "Completa el formulario para ver tu recomendación semanal.";
    formMessage.textContent = "";
}

sexInputs.forEach((input) => {
    input.addEventListener("change", resetFormAfterSexChange);
});

calorieForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(calorieForm);
    const sex = formData.get("sex");
    const weight = Number(formData.get("weight"));
    const height = Number(formData.get("height"));
    const age = Number(formData.get("age"));
    const activity = Number(formData.get("activity"));
    const goal = formData.get("goal");

    if (!sex || !weight || !height || !age || !activity || !goal) {
        formMessage.textContent = "Completa todos los campos para calcular.";
        return;
    }

    if (weight <= 0 || height <= 0 || age <= 0) {
        formMessage.textContent = "Ingresa valores validos mayores a cero.";
        return;
    }

    formMessage.textContent = "";

    // Formula Mifflin-St Jeor: se resta 5 * edad.
    const bmrBase = (10 * weight) + (6.25 * height) - (5 * age);
    const bmr = sex === "male" ? bmrBase + 5 : bmrBase - 161;
    const totalCalories = bmr * activity;
    const objectiveCalories = calculateGoalCalories(totalCalories, goal);

    bmrResult.textContent = formatCalories(bmr);
    totalResult.textContent = formatCalories(totalCalories);
    goalResult.textContent = formatCalories(objectiveCalories);
    goalGuidance.textContent = getGoalGuidance(totalCalories, objectiveCalories, goal);
});
