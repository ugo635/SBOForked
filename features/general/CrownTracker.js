import settings from "../../settings";
import { registerWhen, timerCrown, timerCrownSession, data } from "../../utils/variables";
import { formatNumber, formatNumberCommas, formatTime, isInSkyblock, printDev, getMagicFind } from "../../utils/functions";
import { getZone } from "../../utils/world";
import { isDataLoaded } from "../../utils/checkData";
import { SboOverlay, OverlayTextLine, OverlayButton, hoverText } from "../../utils/overlays";
import { YELLOW, BOLD, GOLD, DARK_GREEN, LIGHT_PURPLE, DARK_PURPLE, GREEN, DARK_GRAY, GRAY, WHITE, AQUA, ITALIC, BLUE, UNDERLINE, RED} from "../../utils/constants";

let crownTracker = new SboOverlay("crownTracker", "crownTracker", "render", "CrownLoc");
let timerOverlayLine = new OverlayTextLine(`&ePlaytime: &b${getTimerMessage()}`, true);

let crownTimers = [timerCrown, timerCrownSession];

function crownOverlay() {
    calculateCrownCoins();
    let messageLines = [];
    messageLines = getCrownMessage();
    messageLines.push(timerOverlayLine);
    crownTracker.setLines(messageLines);
}

const crownTiers = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];

let profitPerHourSession = 0;
let ghostKillsSession = 0;
let sorrowDropsSession = 0;
function getCrownMessage() {
    let crownLines = [];
    let timePassed = timerCrown.getHourTime();
    let timePassedSession = timerCrownSession.getHourTime();
    let profitPerHour = 0;
    let timeUntilNextTier = 0;
    let currentTier = 0;
    let totalPerecent = 0;
    let percentToNextTier = 0;

    for (let i = 0; i < crownTiers.length; i++) {
        if (data.totalCrownCoins < crownTiers[i]) {
            currentTier = i - 1;
            break;
        }
    }
    if (currentTier < 0) currentTier = 0;
    let nextTier = crownTiers[currentTier + 1];

    if (timePassed != "NaN" && timePassed != 0) {
        profitPerHour = (data.totalCrownCoinsGained / timePassed).toFixed();
    }
    if(timePassedSession != "NaN" && timePassedSession != 0) {
        profitPerHourSession = (data.totalCrownCoinsSession / timePassedSession).toFixed();
    }
    if (profitPerHour > 0 && nextTier > data.totalCrownCoins) {
        let coinsNeeded = nextTier - data.totalCrownCoins;
        let hoursUntilNextTier = coinsNeeded / profitPerHour;
        let millisecondsUntilNextTier = hoursUntilNextTier * 60 * 60 * 1000;
        timeUntilNextTier = formatTime(millisecondsUntilNextTier);
    }


    totalPerecent = (data.totalCrownCoins / crownTiers[crownTiers.length - 1]) * 100;
    percentToNextTier = (data.totalCrownCoins / nextTier) * 100;
    totalPerecent = totalPerecent.toFixed(2);
    percentToNextTier = percentToNextTier.toFixed(2);

    crownLines.push(new OverlayTextLine(`${YELLOW}${BOLD}Crown Tracker`, true));
    crownLines.push(new OverlayTextLine(`${GOLD}Total Coins: ${AQUA}${formatNumberCommas(data.totalCrownCoins)} &7(&b${totalPerecent}%&7)`, true));
    crownLines.push(new OverlayTextLine(`${GOLD}Tracked Coins: ${AQUA}${formatNumber(data.totalCrownCoinsGained)} &7(${formatNumber(data.totalCrownCoinsSession)})`, true));
    crownLines.push(new OverlayTextLine(`${GOLD}Last Coins: ${AQUA}${formatNumberCommas(data.lastCrownCoins)}`, true));
    crownLines.push(new OverlayTextLine(`${GOLD}Coins/hr: ${AQUA}${formatNumber(profitPerHour)} &7(${formatNumber(profitPerHourSession)})`, true));
    
    function nextTierMessage() {
        if (nextTier != crownTiers[crownTiers.length - 1]) {
            return new OverlayTextLine(`${GOLD}${formatNumber(nextTier)} in: ${AQUA}${timeUntilNextTier} &7(&b${percentToNextTier}%&7)`, true);
        } else {
            return new OverlayTextLine(`${GOLD}${formatNumber(nextTier)} in: ${AQUA}${timeUntilNextTier}`, true);
        }
    }

    if (settings.crownGhostMode) {
        if (getZone().includes("The Mist")) {
            let ghostCoins = data.lastCrownCoins;
            let ghostCoinsList = [];
            let coinsNeeded = nextTier - data.totalCrownCoins;

            if (ghostCoinsList.length < 100 || Math.abs(ghostCoins - ghostCoinsAVG) < 500) {
                ghostCoinsList.push(ghostCoins);
            }

            if (ghostCoinsList.length > 1000) {
                ghostCoinsList.shift();
            }

            let ghostCoinsAVG = 0;
            if (ghostCoinsList.length > 0) {
                ghostCoinsAVG = ghostCoinsList.reduce((a, b) => a + b, 0) / ghostCoinsList.length;
            }

            let ghostsTillTier = ghostCoinsAVG > 0 ? coinsNeeded / ghostCoinsAVG : 0;
            crownLines.push(new OverlayTextLine(`${GOLD}~Ghosts/Tier: ${AQUA}${formatNumberCommas(ghostsTillTier.toFixed())}`, true));
            crownLines.push(new OverlayTextLine(`${GOLD}Ghost Kills: ${AQUA}${formatNumber(data.ghostKills)} &7(${formatNumber(ghostKillsSession)})`, true));
            crownLines.push(new OverlayTextLine(`${GOLD}Sorrows: ${AQUA}${formatNumber(data.sorrowDrops)} &7(${formatNumber(sorrowDropsSession)})`, true));
        }
    }

    if (timeUntilNextTier) {
        crownLines.push(nextTierMessage());
    } 
    else if (data.totalCrownCoinsGained == 0) {
        crownLines.push(new OverlayTextLine(`${GOLD}${formatNumber(nextTier)} in: ${AQUA}Unknown`, true));
    }
    else if (currentTier == crownTiers[crownTiers.length - 1]) {
        crownLines.push(new OverlayTextLine(`${GOLD}Tier: ${RED}MAX!`, true));
    }

    return crownLines;
}

function getTimerMessage(timer) {
    if (timer === undefined) return "00:00:00";
    if (timer.trackerObject[timer.dataFieldName] === undefined) return formatTime(timer.getElapsedTime());
    if (timer.trackerObject[timer.dataFieldName] > 0) {
        return formatTime(timer.trackerObject[timer.dataFieldName]);
    } else {
        return formatTime(timer.getElapsedTime());
    }
}

function getCoinsFromCrown() {
    let helmet = hasCrown();
    if (!helmet) return 0;
    let helmetLore = helmet.getLore();
    let coinsFound = 0;
    for (let line of helmetLore) {
        if (line == null || !line) continue;
        if (line.includes("Collected Coins")) {
            let coins = line.split(": ")[1];
            coins = coins.replace(/§./, "").replaceAll(",", "");
            coinsFound = parseInt(coins);
            printDev("[CTT] Coins Found");
            break;
        }
    }
    return coinsFound;
}
let coinsBeforeCreeperDeath = 0;
if (data.totalCrownCoins > 0) coinsBeforeCreeperDeath = data.totalCrownCoins;
function calculateCrownCoins() {
    let coinsAfterCreeperDeath = getCoinsFromCrown();
    let coinsGained = coinsAfterCreeperDeath - coinsBeforeCreeperDeath;
    if (coinsGained > 0 && coinsGained != coinsAfterCreeperDeath) {
        printDev("[CTT] coins gained");
        for (let timer of crownTimers) {
            timer.start();
            timer.continue();
            timer.updateActivity();
        }
        data.totalCrownCoinsGained += coinsGained;
        data.totalCrownCoinsSession += coinsGained;
        data.lastCrownCoins = coinsGained;
        data.totalCrownCoins = coinsAfterCreeperDeath;
        coinsBeforeCreeperDeath = coinsAfterCreeperDeath;
        data.save();
    }
}

function hasCrown() {
    let helmet = Player.armor.getHelmet();
    if (!helmet) return false;
    let helmetLore = helmet.getLore();
    if (!helmetLore) return false;
    let helmetName = helmet.getName();
    if (!helmetName) return false;
    helmetName = helmetName.trim();
    if (!helmetName.includes("Crown of Avarice")) return false;
    return helmet;
}

let isInitilized = false;
function cronwInitilization() {
    if (isInitilized) return;
    if (isInSkyblock() && isDataLoaded()) {
        data.totalCrownCoins = getCoinsFromCrown();
        if (data.totalCrownCoins > 0) {
            isInitilized = true;
        }
    }
}

function countGhostKills(entity) {
    let name = entity.getName();
    if (!name) return;
    if (!name.includes("Creeper")) return;
    const distance = Math.sqrt(
        (Player.getX() - entity.getX())**2 +
        (Player.getY() - entity.getY())**2 +
        (Player.getZ() - entity.getZ())**2
    );
    if (distance > 10) return;
    data.ghostKills++;
    ghostKillsSession++;
    data.save();
}

registerWhen(register("entityDeath", (entity) => {
    countGhostKills(entity);
}), () => settings.crownTracker && settings.crownGhostMode && getZone().includes("The Mist"));

registerWhen(register("chat", (mf) => {
    let magicFind = getMagicFind(mf);
    data.sorrowDrops++;
    sorrowDropsSession++;
    data.save();
}).setCriteria("&r&6&lRARE DROP! &r&9Sorrow${mf}"), () => settings.crownTracker && settings.crownGhostMode);
// &7[16:23] &r&r&r&6&lRARE DROP! &r&9Sorrow &r&b(+&r&b378% &r&b✯ Magic Find&r&b)&r

registerWhen(register("tick", () => {
    if (hasCrown()) {
        if (timerOverlayLine) {
            timerOverlayLine.setText(`&ePlaytime: &b${getTimerMessage(timerCrown)} &7(${getTimerMessage(timerCrownSession)})`);
        }
    }
}), () => settings.crownTracker);

registerWhen(register("step", () => {
    if (!hasCrown() || !isDataLoaded() || !isInSkyblock()) {
        crownTracker.renderGui = false;
    }
    else {
        crownTracker.renderGui = true;
        cronwInitilization();
        crownOverlay();
    }
}).setFps(4), () => settings.crownTracker);

register("command", () => {
    data.totalCrownCoinsGained = 0;
    data.totalCrownCoinsSession = 0;
    data.lastCrownCoins = 0;
    data.ghostKills = 0;
    data.sorrowDrops = 0;
    ghostKillsSession = 0;
    sorrowDropsSession = 0;
    timerCrown.reset();
    timerCrownSession.reset();
    data.save();
}).setName("sboresetcrowntracker")

register("gameUnload", () => {
    data.totalCrownCoinsSession = 0;
    profitPerHourSession = 0;
    ghostKillsSession = 0;
    sorrowDropsSession = 0;
    timerCrownSession.reset();
    data.save();
});
