// This is the only file initially loaded by the extenion manifest, under content_scripts.
// It is used to load our actual scripts because these scripts run in their own "container"
// that doesn't allow us access to the url, window obj, and more

function injectScript(page, tag) {
    console.log(`Starting Projector Plus for page ${page}`);

    const path = chrome.runtime.getURL(`/scripts/${page}.js`);
    const node = document.getElementsByTagName(tag)[0];
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', path);
    node.appendChild(script);
    
    console.log("Projector Plus Started");
}

// TODO in the future, let this dynamically load the correct JS file based on the current page you're on.
// For now, it's just the timeoff.js file
// const page = chrome.runtime.getURL(location.pathname.substring(1));
injectScript('timeoff', 'body');