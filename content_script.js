function updateTheme() {
    if(document.visibilityState == "visible"){
        const linkElements = document.querySelector('link[rel=manifest]');

        if(linkElements && linkElements.href){
            fetchAndUpdateTheme(linkElements.href)
        } else {
            browser.runtime.sendMessage({
                type: "reset"
            });
        }
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
    let response = await fetch(url);
    let {
        theme_color,
        background_color
    } = await response.json();

    if(theme_color || background_color){
        if(!theme_color && background_color){
            theme_color = background_color;
        }

        if(theme_color && !background_color){
            theme_color = background_color;
        }

        let colors = {};

        if(background_color) {
            colors.accentcolor = background_color.toString();
            colors.textcolor = textColor(background_color.toString());
        }

        if(theme_color){
            colors.toolbar = theme_color.toString();
            colors.toolbar_text = textColor(theme_color.toString());
        }

        browser.runtime.sendMessage({
            "type": "update",
            "theme": {
                colors
            }
        });
    } else {
        browser.runtime.sendMessage({
            type: "reset"
        });
    }
}

(updateTheme)();