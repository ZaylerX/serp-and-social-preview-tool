// Storing inputs in an object
const inputs = {
    title : document.querySelector("#title-input"),
    description : document.querySelector("#description-input"),
    url : document.querySelector("#url-input"),
    keyword : document.querySelector("#keyword-input"),
    socialImage : document.querySelector("#social-input")
};

// Storing various UI elements in consts
const titleCounter = document.querySelector("#title-count");
const descCounter = document.querySelector("#description-count");

const titleJudgement = document.querySelector("#title-judgement");
const descJudgement = document.querySelector("#description-judgement");

const googleTitle = document.querySelector("#google-title");
const googleDesc = document.querySelector("#google-desc");

const urlPreview = document.querySelector("#slug-preview-text");

// Declaring state constant
const state = {
    title : "",
    description : "",
    url : "",
    keyword : "",
    socialImage : ""
};

// Function for determining the judgement visual
function judgement(length, min, max) {
    if (length === 0) {
        return {text : "-", className : "neutral"}
    } else if (length < min) {
        return {text: "Too short", className : "short"}
    } else if (length >= min && length <= max) {
        return {text : "Optimal", className : "optimal"}
    } else {
        return {text: "Too long", className : "long"}
    }
}

// Function for applying the judgement visual
function applyJudgement(element, result) {
    element.textContent = result.text; 
    element.classList.remove("neutral", "short", "optimal", "long");
    element.classList.add(result.className);
}

// Function to display the Google Title and Desc preview
function googlePreview(element, text, placeholder, max) {
    if (text.trim().length > max) {
        element.textContent = `${text.trim().slice(0, max)}...`;
    } else {
        element.textContent = text.trim() || placeholder;
    }
}

// Function to display the Google URL Preview
function urlPreview(url) {
    let urlLine = url.trim();
    if (!urlLine) {
        return "example.com › level-1 › level-2";
    }
    if (!urlLine.toLowerCase().startsWith("http://") && !urlLine.toLowerCase().startsWith("https://")) {
        urlLine = "https://" + urlLine;
    }
    try {
        let urlObject = new URL(urlLine);
        console.log(urlObject.hostname, urlObject.pathname);
    }
    catch {
        console.log("Invalid URL")
    }
}

// Function to display the results
function render() {
    titleCounter.textContent = `${state.title.length}/60 characters`;
    descCounter.textContent = `${state.description.length}/155 characters`;

    applyJudgement(titleJudgement, judgement(state.title.length, 50, 60));
    applyJudgement(descJudgement, judgement(state.description.length, 120, 155));

    googlePreview(googleTitle, state.title, "Your page title will appear here", 60);
    googlePreview(googleDesc, state.description, "Your page description will appear here", 155);
}

// Listener for all inputs
Object.entries(inputs).forEach(([key, element]) => {
    element.addEventListener("input", (event) => {
        state[key] = event.target.value;
        render();
    })
});

render();
