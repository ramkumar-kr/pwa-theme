async function updateTheme() {
    const linkElements = document.head.getElementsByTagName("link");
    var isPWA = false;

    for (let i = 0; i < linkElements.length; i++) {
        const element = linkElements[i];
        if (element.getAttribute("rel") == "manifest") {
            fetchAndUpdateTheme(element.href)
        }
    }

    if (!isPWA && document.visibilityState == "visible") {
        browser.runtime.sendMessage({
            type: "reset"
        });
    }

}

const hexToLuma = (colour) => {
    const hex = colour.replace(/#/, '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return [
        0.299 * r,
        0.587 * g,
        0.114 * b
    ].reduce((a, b) => a + b) / 255;
};

function textColor(colorHex) {
    return ((hexToLuma(colorHex) < 0.5) ? "white" : "black")
}

async function fetchAndUpdateTheme(url) {
    if (document.visibilityState == "hidden") {
        return
    }
    let isPWA = true
    let response = await fetch(url);
    let manifest = await response.json();
    let {
        theme_color,
        background_color
    } = manifest;

    if ((typeof background_color == "undefined") && (typeof theme_color == "undefined")) {

    } else {

        if (typeof theme_color == "undefined") {
            theme_color = background_color
        }

        if (typeof background_color == "undefined") {
            background_color = theme_color
        }

        let themeObject = {
            "colors": {
                "accentcolor": background_color.toString(),
                "toolbar": theme_color.toString(),
                "textcolor": textColor(background_color.toString()),
                "toolbar_text": textColor(theme_color.toString())
            }
        }


        if (document.visibilityState == "visible") {
            browser.runtime.sendMessage({
                "type": "update",
                "theme": themeObject
            });
        }
    }
}

(updateTheme)();