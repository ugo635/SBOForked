import {
    SiblingConstraint,
    FillConstraint,
    CenterConstraint,
    SubtractiveConstraint,
    AdditiveConstraint,
    animate,
    Animations,
    ChildBasedMaxSizeConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    ScissorEffect,
    UIBlock,
    UIContainer,
    UIMultilineTextInput,
    UIText,
    UIWrappedText,
    WindowScreen,
    UIRoundedRectangle,
    ChildBasedRangeConstraint,
    Window
} from "../../Elementa";
import { YELLOW, BOLD, GOLD, DARK_GREEN, LIGHT_PURPLE, DARK_PURPLE, GREEN, DARK_GRAY, GRAY, WHITE, AQUA, ITALIC, BLUE } from "../utils/constants";
import settings from "../settings";

//alle imports als export functions (setter) definieren

export function setOverlay(overlay, selected, name){
    switch(name){
        case "kuudraOverlay":
            kuudraOverlay = overlay;
            kuudraValueOverlaySelected = selected;
            break;
        case "fossilOverlay":
            fossilOverlay = overlay;
            fossilGUISelected = selected;
            break;
        case "bobberOverlay":
            bobberOverlay = overlay;
            bobberOverlaySelected = selected;
            break;
        case "effectsOverlay":
            effectsOverlay = overlay;
            effectsOverlaySelected = selected;
            break;
        case "dianaMobTracker":
            dianaMobTracker = overlay;
            dianaMobTrackerSelected = selected;
            break;
        case "dianaLootTracker":
            dianaLootTracker = overlay;
            dianaLootTrackerSelected = selected;
            break;
        case "mythosMobHpOverlay":
            mythosHpOverlay = overlay;
            mythosMobHpSelected = selected;
            break;
    }
}
// siehe https://github.com/EssentialGG/Elementa für mehr 
export function getGuiOpen(){
    return guiOpen;
}

let guiOpen = false;
const gui = new Gui();
const renderWindow = new Window()
const postWindow = new Window()
this.gui.registerClicked((x,y,b) => {
    this.renderWindow.mouseClick(x,y,b);
    this.postWindow.mouseClick(x,y,b);
});
this.gui.registerMouseDragged((x, y, b) => {
    this.renderWindow.mouseDrag(x, y, b);
    this.postWindow.mouseDrag(x, y, b);
});
this.gui.registerMouseReleased(() => {
    this.renderWindow.mouseRelease();
    this.postWindow.mouseRelease();
});
let overlayExamples = {
    kuudraExampleOne: `&r&62.49M &r&eTerror Chestplate&r
&r&b(BL 5/BR 4 - &r&6100.00K/2.49M&b)
&r&62.50M &r&eTerror Boots&r
&r&b(ER 5/DO 4 - &r&61.48M/2.50M&b)
&r&eTotal Value: &r&64.99M coins`,
kuudraExampleTwo: `&r&6600.00K &r&eCrimson Chestplate&r &r&b(BL 5/BR 4 - &r&6100.00K/600.00K&b)
&r&62.50M &r&eTerror Boots&r &r&b(ER 5/DO 4 - &r&61.48M/2.50M&b)
&r&eTotal Value: &r&63.1M coins`,
fossilExample: `Fossil: Unknown `,
bobbercounterExample:`${YELLOW}${BOLD}Bobber: ${AQUA}${BOLD}0`,
effectsGuiExample:
`${YELLOW}${BOLD}Active Effects
--------------
${AQUA}${BOLD}Wisp's Water: ${WHITE}2520s`,
mythosMobHpExample:
`&8[&7Lv750&8] &2Exalted Minos Inquisitor &a40M&f/&a40M`,
dianaMobTrackerExample:
`${YELLOW}${BOLD}Diana Mob Tracker
------------------
${LIGHT_PURPLE}${BOLD}Minos Inquisitor: ${WHITE}
${DARK_PURPLE}${BOLD}Minos Champion: ${WHITE}
${GOLD}${BOLD}Minotaur: ${WHITE}
${GREEN}${BOLD}Gaia Construct: ${WHITE}
${GREEN}${BOLD}Siamese Lynx: ${WHITE}
${GREEN}${BOLD}Minos Hunter: ${WHITE}
${GRAY}${BOLD}Total Mobs: ${WHITE}
`,
dianaLootTrackerExample: 
`${YELLOW}${BOLD}Diana Loot Tracker
-------------------
${LIGHT_PURPLE}${BOLD}Chimera: ${WHITE}
${DARK_PURPLE}${BOLD}Minos Relic: ${WHITE}
${GOLD}${BOLD}Daedalus Stick: ${WHITE}
${GOLD}${BOLD}Crown of Greed: ${WHITE}
${GOLD}${BOLD}Souvenir: ${WHITE}
${DARK_GREEN}${BOLD}Turtle Shelmet: ${WHITE}
${DARK_GREEN}${BOLD}Tiger Plushie: ${WHITE}
${DARK_GREEN}${BOLD}Antique Remedies: ${WHITE}
${BLUE}${BOLD}Ancient Claws: ${WHITE}
${BLUE}${BOLD}Enchanted Ancient Claws: ${WHITE}
${GOLD}${BOLD}Griffin Feather: ${WHITE}
${GOLD}${BOLD}Coins: ${WHITE}
${GRAY}${BOLD}Total Burrows: ${WHITE}
`,
};


register("command", () => GuiHandler.openGui(gui)).setName("sboguis").setAliases("sbomoveguis");

register('renderOverlay', () => {
    checkForSetting(bobberOverlay, settings.bobberCounter, "render", 0, false);
    checkForSetting(effectsOverlay, settings.effectsGui, "render", 0, false);
    checkForSetting(dianaMobTracker, settings.dianaMobTracker, "render", settings.dianaMobTrackerView, true);
    checkForSetting(dianaLootTracker, settings.dianaLootTracker, "render", settings.dianaLootTrackerView, true);
    checkForSetting(mythosHpOverlay, settings.mythosMobHp, "render", 0, false);
    guiMover();
    renderWindow.draw()
});

register('postGuiRender', () => {
    checkForSetting(kuudraOverlay, settings.attributeValueOverlay, "post", 0, false);
    checkForSetting(fossilOverlay, settings.fossilOverlay, "post", 0, false);
    postWindow.draw()
});

register('worldUnload', () => {
    closeEditing();
});


function checkForSetting(overlay, setting, type, setting2, diana){
    if(!overlay) return;
    if(setting){
        if(setting2 === 0 && diana) return;
        if(type === "render" && !renderWindow.children.includes(overlay)) {
            renderWindow.addChild(overlay);
        }
        else if(type === "post" && !postWindow.children.includes(overlay)){
            postWindow.addChild(overlay);
        }
    }
    if(!setting){
        if(type === "render" && renderWindow.children.includes(overlay)) {
            renderWindow.removeChild(overlay);
        }
        else if(type === "post" && postWindow.children.includes(overlay)){
            postWindow.removeChild(overlay);
        }
    }
}

function closeEditing(){
    kuudraValueOverlaySelected = false;
    fossilGUISelected = false;
    bobberOverlaySelected = false;
    effectsOverlaySelected = false;
    dianaMobTrackerSelected = false;
    dianaLootTrackerSelected = false;
    mythosMobHpSelected = false;
    gui.close();
}
let clearState = false;
let firstDraw = false;
function guiMover() {
    if (gui.isOpen()) {
        guiOpen = true;
        clearState = false;
        if (firstDraw === false) {
            drawExamples();
            postWindow.draw();
            firstDraw = true;
        }
        Renderer.drawRect(
            Renderer.color(0, 0, 0, 70),
            0,
            0,
            Renderer.screen.getWidth(),
            Renderer.screen.getHeight()
        );
    }
    if (!gui.isOpen()) {
        if (clearState === false && guiOpen) {
            clearExamples();
            clearState = true;
        }
        firstDraw = false;
        guiOpen = false;
    }
}

function drawExamples(){
    switch(settings.lineSetting){
        case 0:
            exampleMessage(overlayExamples["kuudraExampleOne"], kuudraOverlay, true);
            break;
        case 1:
            exampleMessage(overlayExamples["kuudraExampleTwo"], kuudraOverlay, true);
            break;
    }
    if(settings.fossilOverlay){
        exampleMessage(overlayExamples["fossilExample"], fossilOverlay, false);
    }
    if(settings.bobberCounter){
        exampleMessage(overlayExamples["bobbercounterExample"], bobberOverlay, false);
    }
    if(settings.effectsGui){
        exampleMessage(overlayExamples["effectsGuiExample"], effectsOverlay, true);
    }
    if(settings.mythosMobHp){
        exampleMessage(overlayExamples["mythosMobHpExample"], mythosHpOverlay, false);
    }
    if(settings.dianaMobTracker){
        exampleMessage(overlayExamples["dianaMobTrackerExample"], dianaMobTracker, true);
    }
    if(settings.dianaLootTracker){
        exampleMessage(overlayExamples["dianaLootTrackerExample"], dianaLootTracker, true);
    }
}

function exampleMessage(example, overlay, split){
    let exampleMSG = new UIWrappedText(example)
    overlay.clearChildren();
    exampleMSG.setX(new SiblingConstraint())
    exampleMSG.setY(new SiblingConstraint())
    if(split){
        maxStringWidth = example.split("\n").reduce((a, b) => a.length > b.length ? a : b).length
        exampleMSG.setWidth((maxStringWidth * 4.5).pixels());
    }
    overlay.addChild(exampleMSG);
    overlay.setWidth(new ChildBasedRangeConstraint());
    overlay.setHeight(new ChildBasedRangeConstraint());
}

function clearExamples(){
    kuudraOverlay.clearChildren();
    fossilOverlay.clearChildren();
    bobberOverlay.clearChildren();
    effectsOverlay.clearChildren();
    mythosHpOverlay.clearChildren();
    dianaMobTracker.clearChildren();
    dianaLootTracker.clearChildren();
}