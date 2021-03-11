var Module = null;
var Theme = {};

function traverseColors(root, data) {
    for (i in data) {
        let v = data[i];
        
        if (typeof v === "string" || v instanceof String) {
            Theme[root + i] = parseInt(v, 16);
        } else {
            traverseColors(root + i, v);
        }
    }
}

function parseTheme(theme) {
    if ("colors" in theme) {
        try {
            Theme = {};
            traverseColors("", theme["colors"]);
            return true;
        } catch (e) {
            setStatus("Error while parsing colors!");
            console.log(e);
            return false;
        }
    } else {
        setStatus("No colors in theme!");
        return false;
    }
}

function setStatus(val) {
    document.getElementById("status").textContent = val;
}

function loadTheme() {
    let content = document.getElementById("theme").value;

    try {
        let data = JSON.parse(content);
        return parseTheme(data)
    } catch(e) {
        setStatus("Error parsing JSON!");
        return false;
    }
}

function run() {
    if (Module != null) {
        Module._IonSimulatorEventsPushEvent(217);
        delete Module;
        Module = null;
    }
    
    if (loadTheme()) {
        console.log(Theme);
        var mainCanvas = document.getElementById('canvas');
        var epsilonLanguage = document.documentElement.lang || window.navigator.language.split('-')[0];
        Module = {
            canvas: mainCanvas,
            arguments: ['--language', epsilonLanguage],
            onColorRequest: function(name) {
                if (name in Theme) {
                    return Theme[name];
                } else {
                    setStatus("Unknown color " + name + ", aborting!");
                    Module._IonSimulatorEventsPushEvent(217);
                    delete Module;
                    Module = null;
                    return 0xFF00FF;
                }
            }
        }
        Epsilon(Module);
    }
}
