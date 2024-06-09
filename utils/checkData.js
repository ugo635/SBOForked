import { getDateMayorElected, getNewMayorAtDate, getSkyblockDate, getMayor } from "./mayor";
import { initializeGuiSettings, getKuudraItems, getBazaarItems } from "./functions";
import { dianaTrackerMayor as trackerMayor, dianaTrackerSession as trackerSession, dianaTrackerTotal as trackerTotal } from "./variables";
import settings from "../settings";

// check if data is loaded and time is set //
export let trackerFileLocation  = "./dianaTracker";

export function isDataLoaded() {
    return dataLoaded;
}

function checkDataLoaded() {
    if (!FileLib.exists("SBO", "guiSettings.json")) {
        let tempDict = initializeGuiSettings();
        FileLib.write("SBO", "guiSettings.json", JSON.stringify(tempDict, null, 4));
    }
}

register("step", () => {
    if (!dataLoaded) {
        if (checkAllCriteria()) {
            dataLoaded = true;
            ChatLib.chat("§6[SBO] §4Module Loaded");
        }
    }
}).setFps(1);


let dataLoaded = false;
function checkAllCriteria() {
    checkDataLoaded();
    let check7 = true;
    let check1 = FileLib.exists("SBOTracker", trackerFileLocation  + "Total.json");
    let check2 = FileLib.exists("SBOTracker", trackerFileLocation  + "Mayor.json");
    let check3 = FileLib.exists("SBOTracker", trackerFileLocation  + "Session.json");
    let check4 = FileLib.exists("SBO", "guiSettings.json");
    let check5 = (getDateMayorElected() !== undefined  && getNewMayorAtDate() !== undefined && getSkyblockDate() !== undefined);
    let check6 = getMayor() !== undefined;
    if (settings.attributeValueOverlay) {
        check7 = (getKuudraItems() !== undefined && getBazaarItems() !== undefined);
    }
    let check8 = (trackerTotal !== undefined && trackerMayor !== undefined && trackerSession !== undefined);
    if (check1 && check2 && check3 && check4 && check5 && check6 && check7 && check8) {
        return true;
    }
    return false;
}

register("guiClosed", (event) => {
    // || event.toString().includes("JSGui")
    if (event.toString().includes("vigilance")) {
        checkSound(settings.inqSound);
        checkSound(settings.chimSound);
        checkSound(settings.stickSound);
        checkSound(settings.relicSound);
        checkSound(settings.sprSound);
    }
});

function checkSound(sound) {
    if (sound != "") {
        if (sound.includes(".ogg")) sound = sound.replace(".ogg", "");
        if (!FileLib.exists(Config.modulesFolder.replace("modules", "images") + `/${sound}.ogg`)) {
            ChatLib.chat(`&6[SBO] &cSound file not found (${sound})! (if the filename is correct, make sure to reload ct by "/ct load")`);
        }
    }
}

// register("command", () => {
//     let check1 = FileLib.exists("SBO", trackerFileLocation  + "Total.json");
//     let check2 = FileLib.exists("SBO", trackerFileLocation  + "Mayor.json");
//     let check3 = FileLib.exists("SBO", trackerFileLocation  + "Session.json");
//     let check4 = FileLib.exists("SBO", "guiSettings.json");
//     let check5 = (getDateMayorElected() !== undefined  && getNewMayorAtDate() !== undefined && getSkyblockDate() !== undefined);
//     let check6 = getMayor() !== undefined;
//     print("check1: " + check1 + " check2: " + check2 + " check3: " + check3 + " check4: " + check4 + " check5: " + check5 + " check6: " + check6);
// }).setName("sbocheck");