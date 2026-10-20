// Storing icons 
const seoIcons = {
    pass: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check preview-icon"><circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/></svg>`,
    fail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x preview-icon"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`
};

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

const checklist = document.querySelector("#checklist");

const codeSection = document.querySelector("#generated-code");

const copyButton = document.querySelector("#copy-button");
const copyButtonText = document.querySelector("#copy-button .copy-text");

const desktopButton = document.querySelector(".desktop-preview");
const mobileButton = document.querySelector(".mobile-preview");

const searchPreviewBox = document.querySelector(".search-preview");

const modeSwitchButton = document.querySelector(".light-change-button-row");
const switchButtonText = document.querySelector(".light-change-button-row .writing")

const switchButtonIcon = document.querySelector(".light-change-button-row .icon");

// Declaring state constant
const state = {
    title : "",
    description : "",
    url : "",
    keyword : "",
    socialImage : "",
    mode: "desktop",
    theme: "light"
};

const placeholderTexts = {
    title: "Your title will appear here",
    description: "Your description will appear here",
    url: "example.com › level-1 › level-2",
    domain: "example.com",
    img: "https://blocks.astratic.com/img/general-img-landscape.png"
}

const previewLimits = {
    desktop: { title: 60, description: 155},
    mobile: {title: 50, description: 120}
};

const seoLimits = {
    title: { min: 50, max: 60},
    description: { min: 120, max: 155}
};

const socialLimits = {
    title: { min: 50, max: 70},
    description: { min: 120, max: 200}
};

const themeButtonContent = {
    light: {
        text: "Midnight Mode",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon preview-icon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`
    },
    dark: {
        text: "Vivid Mode",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun preview-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
    }
};  

const seoChecklistRules = [
    {
        passText : "Title length is within the optimal range.",
        failText : `Title should be within ${seoLimits.title.min} and ${seoLimits.title.max} characters.`,
        check : (state) => {
            const length = state.title.trim().length;
            if (length === 0) {
                return null;
            }
            return length >= seoLimits.title.min && length <= seoLimits.title.max;
        }
    },
    {
        passText : "Description length is within the optimal range.",
        failText : `Description should be within ${seoLimits.description.min} and ${seoLimits.description.max} characters.`,
        check : (state) => {
            const length = state.description.trim().length;
            if (length === 0) {
                return null;
            }
            return length >= seoLimits.description.min && length <= seoLimits.description.max;
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
        failText : "Make sure your URL is clean, lowercase and readable.",
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
        const urlObject = new URL(urlLine);
        if  (!urlObject.hostname.includes(".")) {
            return null;
        }
        return urlObject;
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

function createChecklistItem(result) {
    let resultValue;
    if (result.passed) {
        resultValue = "pass"; 
    } else {
        resultValue = "fail"
    }
    const checklistItem = document.createElement("li");
    checklistItem.classList.add("checklist-item", resultValue);

    const checklistIcon = document.createElement("i");
    checklistIcon.classList.add("checklist-icon");
    checklistIcon.innerHTML = seoIcons[resultValue];

    const checklistText = document.createElement("div");
    checklistText.classList.add("checklist-text");
    checklistText.textContent = result.text;

    checklistItem.append(checklistIcon, checklistText);

    return checklistItem;
}

function renderChecklist(results) {
    const items = results.map(createChecklistItem);
    checklist.replaceChildren(...items);
}

// Function to replace symbols with code
function escapeHtml(htmlCode) {
    return htmlCode
        .replaceAll("&", "&amp;")
        .replaceAll(`"`, "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
}

// Build code meta-tags
function buildMetaTags(state, urlObject) {
    const title = escapeHtml(state.title.trim());
    const description = escapeHtml(state.description.trim());
    const image = escapeHtml(state.socialImage.trim());

    const lines = [];

    if (title) {
        lines.push(`<title>${title}</title>`)
    }
    if (description) {
        lines.push(`<meta name="description" content="${description}">`);
    }
    lines.push(`<meta property="og:type" content="website">`);
    if (title) {
        lines.push(`<meta property="og:title" content="${title}">`);
    }
    if (description) {
        lines.push(`<meta property="og:description" content="${description}">`);
    }
    if (image) {
        lines.push(`<meta property="og:image" content="${image}">`);
    }
    if (urlObject) {
        lines.push(`<meta property="og:url" content="${escapeHtml(urlObject.href)}">`);
    }

    lines.push(`<meta name="twitter:card" content="summary_large_image">`);

    return lines.join("\n");
}


// Function to display the results
function render() {
    titleCounter.textContent = `${state.title.length}/${seoLimits.title.max} characters`;
    descCounter.textContent = `${state.description.length}/${seoLimits.description.max} characters`;

    applyJudgement(titleJudgement, judgement(state.title.length, seoLimits.title.min, seoLimits.title.max));
    applyJudgement(descJudgement, judgement(state.description.length, seoLimits.description.min, seoLimits.description.max));

    desktopButton.classList.toggle("active", state.mode === "desktop");
    mobileButton.classList.toggle("active", state.mode === "mobile");

    searchPreviewBox.classList.toggle("mobile", state.mode === "mobile");

    textPreview(googleTitle, state.title, placeholderTexts.title, previewLimits[state.mode].title);
    textPreview(googleDesc, state.description, placeholderTexts.description, previewLimits[state.mode].description);

    textPreview(socialTitle, state.title, placeholderTexts.title, socialLimits.title.max);
    textPreview(socialDesc, state.description, placeholderTexts.description, socialLimits.description.max);

    const urlObject = parseUrl(state.url);
    slugPreviewText.textContent = buildSlug(urlObject);
    socialUrl.textContent = extractDomain(urlObject);

    updateImg(socialImg, state.socialImage, placeholderTexts.img)

    renderChecklist(evaluateRules(state));

    codeSection.textContent = buildMetaTags(state, urlObject);

    document.body.classList.toggle("dark", state.theme === "dark");

    const themeContent = themeButtonContent[state.theme];
    switchButtonText.textContent = themeContent.text;
    switchButtonIcon.innerHTML = themeContent.icon; 
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

// Listener for copy button
copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(codeSection.textContent);
    copyButtonText.textContent = "Copied!";
    setTimeout(() => {
        copyButtonText.textContent = "Copy";
    }, 2000);
});

// Listeners for desktop/mobile buttons
desktopButton.addEventListener("click", () => {
    state.mode = "desktop";
    render();
});

mobileButton.addEventListener("click", () => {
    state.mode = "mobile";
    render();
});

// Listener for light/dark mode

modeSwitchButton.addEventListener("click", () => {
    if (state.theme === "light") {
        state.theme = "dark";
    } else {
        state.theme = "light";
    }
    render();
});


render();
