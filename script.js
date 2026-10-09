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
const socialImg = document.querySelector("#social-preview-image")

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
    domain: "example.com",
    img: "https://blocks.astratic.com/img/general-img-landscape.png"
}

const seoChecklistRules = [
    {
        passText : "Title length is within the optimal range.",
        failText : "Title should be within 50 and 60 characters",
        check : (state) => {
            const length = state.title.trim().length;
            if (length === 0) {
                return null;
            }
            return length >= 50 && length <= 60;
        }
    },
    {
        passText : "Description length is within the optimal range.",
        failText : "Description should be within 120 and 155 characters.",
        check : (state) => {
            const length = state.description.trim().length;
            if (length === 0) {
                return null;
            }
            return length >= 120 && length <= 155;
        }
    },
    {
        passText : "The target keyword is in the first part of the title.",
        failText : "Move the target keyword earlier in the title.",
        check : (state) => {
            const keyword = state.keyword.trim().toLowerCase();
            const title = state.title.trim().toLowerCase();
            if (keyword === "" || title === "") {
                return null;
            }
            return title.slice(0, 25).includes(keyword);
        }
    },
    {
        passText : "The target keyword is in the first part of the description.",
        failText : "Move the target keyword earlier in the description.",
        check : (state) => {
            const keyword = state.keyword.trim().toLowerCase();
            const description = state.description.trim().toLowerCase();
            if (keyword === "" || description === "") {
                return null;
            }
            return description.slice(0, 75).includes(keyword);
        }
    },
    {
        passText : "URL is clean, lowercase and readable.",
        failText : "Correct URL issues.",
        check : (state) => {
            const url = state.url.trim();
            if (url === "") {
                return null;
            }
            return url === url.toLowerCase() && !url.includes(" ") && !url.includes("_");
        }
    }
]

function evaluateRules(state) {
    return seoChecklistRules
        .map((rule) => {
            const passed = rule.check(state);
            let text;
            if (passed) {
                text = rule.passText;
            } else {
                text = rule.failText;
            }
            return { passed: passed, text: text };
        })
        .filter((result) => result.passed !== null);
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

// Function to replace the image
function updateImg(imageField, newImg, defaultImg) {
    const imageToShow = newImg.trim() || defaultImg;
    if (imageField.getAttribute("src") !== imageToShow) {
        imageField.setAttribute("src", imageToShow);
    }
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

    updateImg(socialImg, state.socialImage, placeholderTexts.img)
}

// Listener to handle invalid URLs
socialImg.addEventListener("error", () => {
    if (socialImg.getAttribute("src") !== placeholderTexts.img) {
        socialImg.setAttribute("src", placeholderTexts.img)
    }
})


// Listener for all inputs
Object.entries(inputs).forEach(([key, element]) => {
    element.addEventListener("input", (event) => {
        state[key] = event.target.value;   
        render();
    })
});

render();
