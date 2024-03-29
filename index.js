/// <reference types="../CTAutocomplete" />
import Settings from "./settings";
import "./features/general/pickuplog";
import "./features/diana/DianaMobDetect";
// import "./features/Diana/DianaWaypoints";
import "./features/guis/BobberCounter";
import "./features/general/PartyCommands";
import "./features/general/messageHider";
import "./features/general/Waypoints";
import "./features/diana/DianaBurrowDetect";
import "./features/slayer/BlazeSlayer";
import "./features/general/CopyMessage";

// in sbo addons packen
import "./features/general/QOL";
import "./features/guis/SlayerGuis";
import "./features/dungeon/recognizeRareRoom";
import "./features/general/alphaCheck";
import "./utils/overlays";

import { indexDict, indexDictReverse } from "./utils/constants";



register("command", () => Settings.openGUI()).setName("skyblockoverhaul").setAliases("sbo");

// Title bug fix
register("worldLoad", () => {
    Client.showTitle("", "", 0, 40, 20);
});

register("chat", (event) => {
    Client.showTitle("&l&9!!!!!WORM!!!!!!", "&eKILL!!!", 0, 90, 20);
}).setCriteria("&r&7&oYou hear the sound of something approaching...&r");

register("chat", (message, event) => {
    message = message.removeFormatting();
    if (!message.includes("Powder") && !message.includes("Refelctor") && !message.includes("Blue Goblin Egg") && !message.includes("Heart")) {
        cancel(event);
    }
    if (message.includes("Refelctor")) {
        Client.showTitle("&9Robotron Reflector", "&eCarrot", 0, 40, 20);
    }
    if (message.includes("Blue Goblin Egg")) {
        Client.showTitle("&3Blue Goblin Egg", "&eCarrot", 0, 40, 20);
    }
}).setCriteria("&r&aYou received ${message}");

register("chat", (player, message, event) =>{
    // cancel original message
    // send new guildbot message
    if (!player.includes(" ")) {
        cancel(event);
        player = player.removeFormatting();
        ChatLib.chat("&r&2Guild > &b[DC] &b" + player + "&r:" + message);
        // print("&r&2Guild > &b[DC] &b" + player + "&r:" + message);
    }
    else if (player.includes("replying to")) {
        cancel(event);
        let split = player.split(" ");
        let player1 = split[0];
        let player2 = split[3];
        ChatLib.chat("&r&2Guild > &b[DC] &b" + player1 + " &3replying to &b" + player2 + "&r:" + message);
        // print("&r&2Guild > &b[DC] &b" + player1 + " &3replying to &b" + player2 + "&r:" + message);
    }
}).setCriteria("&r&2Guild > &a[VIP] SlowDT &3[GM]&f: ${player}:${message}").setContains()
// geht
// &r&2Guild > &a[VIP] SlowDT &3[GM]&f: &rSuccesfully invited kenchika to the party!&r
// &r&2Guild > &b[MVP&2+&b] MasterNR &3[320]&f: &rnice&r
// testen
// &r&2Guild > &a[VIP] SlowDT &3[GM]&f: &rWiggleSnakey replying to dtAxl: WWDYM&r 

// register("command", () => {
//     // Client.showTitle(`&r&6&l<&b&l&kO&6&l> &b&lINQUISITOR! &6&l<&b&l&kO&6&l>`, "&r&b[MVP&f+&b] RolexDE", 0, 90, 20);
//     Client.showTitle(`&5&lMinos Relic!`, "", 0, 25, 35);
//     ChatLib.chat("&6[SBO] &r&6&lRARE DROP! &5Minos Relic!");
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.0);
//     }, 0);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.2);
//     }, 50);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.4);
//     }, 100);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.6);
//     }, 150);
// }).setName("sboinq");

let fossilFoundAt = [];
let noFossilAt = [];
function calculatePositions(figure, mapSize) {
    let foundBool = false;
    let positions = [];
    let figureWidth = Math.max(...figure.map(p => p.x)) - Math.min(...figure.map(p => p.x));
    let figureHeight = Math.max(...figure.map(p => p.y)) - Math.min(...figure.map(p => p.y));

    for (let x = 0; x <= mapSize.x - figureWidth; x++) {
        for (let y = 0; y <= mapSize.y - figureHeight; y++) {
            let newPosition = figure.map(p => ({x: p.x + x, y: p.y + y}));
            // check if position is not in noFossilAt
            if (!newPosition.some(p => noFossilAt.includes(indexDict[`${p.x}${p.y}`]))) {
                positions.push(newPosition);
            }
        }
    }

    // check if one of the positions is in fossilFoundAt
    if (fossilFoundAt.length > 0) {
        for (let pos of positions) {
            if (pos.some(p => fossilFoundAt.includes(indexDict[`${p.x}${p.y}`]))) {
                foundBool = true;
            }
        }
    }
    else {
        foundBool = true;
    }

    if (foundBool) {
        return positions;
    }
    else {
        return [];
    }
}


let mapSize = {x: 8, y: 5};
let anker1 = [{x:0,y:1},{x:1,y:2},{x:2,y:3},{x:3,y:3},{x:3,y:2},{x:3,y:1},{x:3,y:0},{x:4,y:3},{x:5,y:2},{x:6,y:1}];
// anker2 is rotated 180 degrees              geht 100%
let anker2 = [{x:6,y:3},{x:5,y:2},{x:4,y:1},{x:3,y:1},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:2,y:1},{x:1,y:2},{x:0,y:3}];
let tusk1 = [{x:2,y:0},{x:1,y:1},{x:3,y:1},{x:0,y:2},{x:1,y:3},{x:2,y:4},{x:3,y:4},{x:4,y:4}];
// tusk2 is rotated 90 degrees from tusk1    geht 100%
let tusk2 = [{x:0,y:2},{x:1,y:1},{x:1,y:3},{x:2,y:0},{x:3,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4}];
// tusk3 is rotated 180 degrees from tusk1  geht 100%
let tusk3 = [{x:2,y:4},{x:3,y:3},{x:1,y:3},{x:4,y:2},{x:3,y:1},{x:2,y:0},{x:1,y:0},{x:0,y:0}];
// tusk4 is rotated 270 degrees from tusk1 geht 100%
let tusk4 = [{x:4,y:2},{x:3,y:3},{x:3,y:1},{x:2,y:4},{x:1,y:3},{x:0,y:2},{x:0,y:1},{x:0,y:0}];
let pyrmaide1 = [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:0,y:4},{x:1,y:4},{x:0,y:5}];
// pyrmaide2 is rotated 90 degrees from pyrmaide1
let pyrmaide2 = [{x:0,y:5},{x:1,y:4},{x:1,y:5},{x:2,y:3},{x:2,y:4},{x:2,y:5},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:3,y:5},{x:4,y:1},{x:4,y:2}];
// pyrmaide3 is rotated 180 degrees from pyrmaide1
let pyrmaide3 = [{x:4,y:1},{x:3,y:2},{x:4,y:2},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:0,y:5},{x:1,y:5},{x:2,y:5}];
// pyrmaide4 is rotated 270 degrees from pyrmaide1
let pyrmaide4 = [{x:4,y:5},{x:3,y:4},{x:3,y:5},{x:2,y:2},{x:2,y:3},{x:2,y:4},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:0,y:0},{x:0,y:1}];
let helix1 = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:0,y:1},{x:4,y:1},{x:0,y:2},{x:2,y:2},{x:4,y:2},{x:0,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3}];
// helix2 is rotated 90 degrees from helix1
let helix2 = [{x:4,y:0},{x:4,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4},{x:3,y:0},{x:3,y:4},{x:2,y:0},{x:2,y:2},{x:2,y:4},{x:1,y:0},{x:1,y:2},{x:1,y:3},{x:1,y:4}];
// helix3 is rotated 180 degrees from helix1
let helix3 = [{x:4,y:4},{x:3,y:4},{x:2,y:4},{x:1,y:4},{x:0,y:4},{x:4,y:3},{x:0,y:3},{x:4,y:2},{x:2,y:2},{x:0,y:2},{x:4,y:1},{x:2,y:1},{x:1,y:1},{x:0,y:1}];
// helix4 is rotated 270 degrees from helix1
let helix4 = [{x:0,y:4},{x:0,y:3},{x:0,y:2},{x:0,y:1},{x:0,y:0},{x:1,y:4},{x:1,y:0},{x:2,y:4},{x:2,y:2},{x:2,y:0},{x:3,y:4},{x:3,y:2},{x:3,y:1},{x:3,y:0}];
let clubbed1 = [{x:6,y:0},{x:7,y:0},{x:1,y:1},{x:6,y:1},{x:7,y:1},{x:0,y:2},{x:5,y:2},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3}];
// clubbed2 is rotated 180 degrees from clubbed1
let clubbed2 = [{x:0,y:3},{x:5,y:3},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:6,y:1},{x:7,y:1},{x:1,y:0},{x:6,y:0},{x:7,y:0}];
let ugly1 = [{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:1,y:5}];
// ugly2 is rotated 90 degrees from ugly1
let ugly2 = [{x:1,y:5},{x:2,y:4},{x:2,y:5},{x:2,y:3},{x:3,y:4},{x:3,y:3},{x:3,y:2},{x:3,y:1},{x:4,y:4},{x:4,y:3},{x:4,y:2},{x:4,y:1},{x:5,y:4},{x:5,y:3},{x:5,y:2},{x:0,y:3}];
// ugly3 is rotated 180 degrees from ugly1
let ugly3 = [{x:5,y:4},{x:4,y:5},{x:5,y:5},{x:3,y:5},{x:4,y:4},{x:3,y:4},{x:2,y:4},{x:1,y:4},{x:4,y:3},{x:3,y:3},{x:2,y:3},{x:1,y:3},{x:4,y:2},{x:3,y:2},{x:2,y:2},{x:3,y:1}];
// ugly4 is rotated 270 degrees from ugly1
let ugly4 = [{x:4,y:1},{x:3,y:2},{x:3,y:1},{x:3,y:3},{x:2,y:2},{x:2,y:3},{x:2,y:4},{x:2,y:5},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:1,y:5},{x:0,y:2},{x:0,y:3},{x:0,y:4},{x:5,y:3}];
let footprint1 = [{x:0,y:0},{x:2,y:0},{x:4,y:0},{x:0,y:1},{x:2,y:1},{x:4,y:1},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:2,y:4}];
// footprint2 is rotated 90 degrees from footprint1
let footprint2 = [{x:2,y:4},{x:2,y:3},{x:2,y:2},{x:3,y:4},{x:3,y:3},{x:3,y:2},{x:4,y:3},{x:4,y:2},{x:4,y:1},{x:5,y:3},{x:5,y:2},{x:5,y:1},{x:6,y:2}];
// footprint3 is rotated 180 degrees from footprint1
let footprint3 = [{x:6,y:2},{x:5,y:1},{x:4,y:0},{x:5,y:2},{x:4,y:1},{x:3,y:0},{x:3,y:2},{x:2,y:1},{x:1,y:0},{x:2,y:2},{x:1,y:1},{x:0,y:0},{x:2,y:3}];
// footprint4 is rotated 270 degrees from footprint1
let footprint4 = [{x:4,y:2},{x:4,y:3},{x:4,y:4},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:2,y:3},{x:2,y:4},{x:2,y:5},{x:1,y:3},{x:1,y:4},{x:1,y:5},{x:0,y:4}];

let allFigures = [anker1, anker2, tusk1, tusk2, tusk3, tusk4, pyrmaide1, pyrmaide2, pyrmaide3, pyrmaide4, helix1, helix2, helix3, helix4, clubbed1, clubbed2, ugly1, ugly2, ugly3, ugly4, footprint1, footprint2, footprint3, footprint4];



register("chat", () => {
    print("Excavation complete")
    fossilFoundAt = [];
    noFossilAt = [];
    coordsAdded = [];
    firstClick = true;
    calcNewCoords()
}).setCriteria("&r&cYou didn't find anything. Maybe next time!&r");

register("chat", () => {
    print("Excavation complete")
    fossilFoundAt = [];
    noFossilAt = [];
    coordsAdded = [];
    firstClick = true;
    calcNewCoords()
}).setCriteria("&r  &r&6&lEXCAVATION COMPLETE &r");

let slotToHighlight = 0;
function calcNewCoords() {
    let allFossilCoords = [];
    let counter = {};
    let anzahlPositions = 0;
    let tempList = [];
    slotToHighlight = 0;
    for (let figur of allFigures) {
        tempList = calculatePositions(figur, mapSize);
        for (let pos of tempList) {
            anzahlPositions++;
            for (let p of pos) {
                allFossilCoords.push(p);
                // print("Fossil at: " + p.x + " " + p.y);
                let index = indexDict[`${p.x}${p.y}`];
                if (!fossilFoundAt.includes(index) && !noFossilAt.includes(index)) {
                    if (counter.hasOwnProperty(index)) {
                        counter[index]++;
                    }
                    else {
                        counter[index] = 1;
                    }
                }
            };
        };
    };
    print("TempList: " + tempList.length)
    print("NoFossilAt: " + noFossilAt.length)
    print("AllFossilCoords: " + allFossilCoords.length)
    print("figure: " + allFigures.length)
        
    
    
    // print index with most fossils
    let max = 0;
    for (let key in counter) {
        if (counter[key] > max) {
            max = counter[key];
            slotToHighlight = key;
        }
    }
    print("Index with most fossils: " + slotToHighlight + " with " + max + " fossils");
    print("Anzahl Positionen: " + anzahlPositions);
}
calcNewCoords()


let firstClick = true;
let coordsAdded = [];
register("guiMouseClick", () => {
    let slot = Client.currentGui.getSlotUnderMouse()
    if (slot == null) return;
    let index = slot.getIndex();
    if (index > 53) return;
    const container = Player.getContainer();
    if (container == null) return;
    if (container.getName() != "Fossil Excavator") return; 
    setTimeout(() => {
        if (!firstClick) {
            let item = container.getStackInSlot(index);
            if (item == null) {
                let xy = indexDictReverse[index];
                if (!coordsAdded.includes(index)) {
                    noFossilAt.push(index);
                    coordsAdded.push(index);
                    print("No Fossil at: " + index);
                };
            }
            else {
                if (item.getName() == "§6Fossil") {
                    let xy = indexDictReverse[index];
                    fossilFoundAt.push(index);
                    print("Fossil at: " + index);
                }
                else {
                    let xy = indexDictReverse[index];
                    if (!coordsAdded.includes(index)) {
                        noFossilAt.push(index);
                        coordsAdded.push(index);
                        print("No Fossil at: " + index);
                    };
                }
            }
            calcNewCoords()
        }
        else {
            print("First Click")
            firstClick = false;
        }
    }, 300);
});

register("renderSlot", (slot) => {
    const container = Player.getContainer();
    if (container == null) return;
    if (container == undefined) return;
    if (container.getName() == "Fossil Excavator") {
        let item = slot.getItem();
        if (item == null) return;
        if (item.getName() == "§6Dirt" || item.getName() == "§6Fossil") {
            if (slot.getIndex() == slotToHighlight) {
                let x = slot.getDisplayX() + 5;
                let y = slot.getDisplayY();
                drawOutlinedString("§6Dirt", x, y, 0.5, 500)
            }
        };
    }
});

function drawOutlinedString(text,x1,y1,scale,z) {
    let outlineString = "&0" + ChatLib.removeFormatting(text)
    let x = x1/scale
    let y = y1/scale

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(outlineString, x + 1, y)

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(outlineString, x - 1, y)

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(outlineString, x, y + 1)

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(outlineString, x, y - 1)

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(text, x, y)
}