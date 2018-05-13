async function handleMessage(message, sender) {
    switch (message.type) {
        case "reset":
            browser.theme.reset();
            break;
        case "update":
            browser.theme.update(sender.tab.windowId, message.theme);
            break;
        default:
            break;
    }
}

async function handleActivated(tabInfo) {
    updateTabTheme(tabInfo.tabId);
}

async function updateTabTheme(tabId) {
    try {
        await browser.tabs.executeScript(tabId, {
            code: "updateTheme()"
        })
    } catch (error) {
        browser.theme.reset()
    }
}

async function handleUpdated(tabId, changeInfo, tab) {
    updateTabTheme(tabId)
}


async function handleWindowFocusChange(windowId) {
    const window = await browser.windows.get(windowId);
    if (window.focused) {
        const tabs = await browser.tabs.query({
            active: true,
            windowId: windowId
        });
        updateTabTheme(tabs[0].tabId);
    }
}



async function handleCreated(tab) {
    updateTabTheme(tab.id);
}

browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onCreated.addListener(handleCreated);
browser.windows.onFocusChanged.addListener(handleWindowFocusChange);

browser.runtime.onMessage.addListener(handleMessage);