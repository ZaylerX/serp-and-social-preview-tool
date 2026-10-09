// Storing inputs in an object
const inputs = {
    title : document.querySelector("#title-input"),
    description : document.querySelector("#description-input"),
    url : document.querySelector("#url-input"),
    keyword : document.querySelector("#keyword-input"),
    socialImage : document.querySelector("#social-input")
};

// Storing UI elements in consts
const titleCounter = document.querySelector("#title-count");
const descCounter = document.querySelector("#description-count");

const titleJudgement = document.querySelector("#title-judgement");
const descJudgement = document.querySelector("#description-judgement");

const googleTitle = document.querySelector("#google-title");
const googleDesc = document.querySelector("#google-desc");

const slugPreviewText = document.querySelector("#slug-preview-text");

const socialUrl = document.querySelector("#fb-url");
const socialTitle = document.querySelector("#social-title");
const socialDesc = document.querySelector("#social-desc");

// Declaring state constant
const state = {
    title : "",
    description : "",
    url : "",
    keyword : "",
    socialImage : ""
};

const placeholderTexts = {
    title: "Your title will appear here",
    description: "Your description will appear here",
    url: "example.com › level-1 › level-2",
    domain: "example.com"
}

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

// Function to display generic Title and Desc preview
function textPreview(element, text, placeholder, max) {
    if (text.trim().length > max) {
        element.textContent = `${text.trim().slice(0, max)}...`;
    } else {
        element.textContent = text.trim() || placeholder;
    }
}

// Function to validate a URL
function parseUrl(url) {

    let urlLine = url.trim();
    if (!urlLine) {
        return null;
    }
    if (!urlLine.toLowerCase().startsWith("http://") && !urlLine.toLowerCase().startsWith("https://")) {
        urlLine = "https://" + urlLine;
    }
    try {
        return new URL(urlLine);
    } catch {
        return null;
    }
}

// Function to build slug from initial URL
function buildSlug(urlObject) {
    if (!urlObject) {
        return placeholderTexts.url;
    }
    const segments = urlObject.pathname.split("/").filter((segment) => segment !== "");
    segments.unshift(urlObject.hostname);
    return segments.join(" › ");
}

// Function to extract domain only
function extractDomain(urlObject) {
    if(!urlObject) {
        return placeholderTexts.domain;
    }
    return urlObject.hostname
}


// Function to display the results
function render() {
    titleCounter.textContent = `${state.title.length}/60 characters`;
    descCounter.textContent = `${state.description.length}/155 characters`;

    applyJudgement(titleJudgement, judgement(state.title.length, 50, 60));
    applyJudgement(descJudgement, judgement(state.description.length, 120, 155));

    textPreview(googleTitle, state.title, placeholderTexts.title, 60);
    textPreview(googleDesc, state.description, placeholderTexts.description, 155);

    textPreview(socialTitle, state.title, placeholderTexts.title, 70);
    textPreview(socialDesc, state.description, placeholderTexts.description, 200);

    const urlObject = parseUrl(state.url);
    slugPreviewText.textContent = buildSlug(urlObject);
    socialUrl.textContent = extractDomain(urlObject);
}

// Listener for all inputs
Object.entries(inputs).forEach(([key, element]) => {
    element.addEventListener("input", (event) => {
        state[key] = event.target.value;
        render();
    })
});

render();
