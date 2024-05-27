import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @SliderProperty,
    @Vigilant,
} from 'Vigilance';
import { data, resetVersion } from './utils/variables';

// The only parameter that is required is the first, which should be the Module name.
// The other 2 parameters are optional.
// The 2nd parameter is the title of the settings window, seen in the top left above the
// category list.
// The 3rd parameter is an object that determines the sorting order of the categories.

@Vigilant('SBO', 'SkyblockOverhaul', {
    getCategoryComparator: () => (a, b) => {
        // By default, categories, subcategories, and properties are sorted alphabetically.
        // You can override this behavior by returning a negative number if a should be sorted before b,
        // or a positive number if b should be sorted before a.

        // In this case, we can put Not general! to be above general.
        const categories = ['General','Diana','Slayer', 'Dungeon','Kuudra','Mining','Party Commands','Customization','Quality of Life','Debug','Credits/Infos'];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
    // getSubcategoryComparator: () => (a, b) => {
    //     // These function examples will sort the subcategories by the order in the array, so eeeeeee
    //     // will be above Category.
    //     const subcategories = ['Burrows', 'Tracker', 'Waypoints', 'Loot Announcer', 'Bobber Counter', 'Other', 'Party Commands'];

    //     return subcategories.indexOf(a.name) - subcategories.indexOf(b.name);
    // },
    // getPropertyComparator: () => (a, b) => {
    //     // And this will put the properties in the order we want them to appear.
    //     const names = ["Do action!!!", "password", "text", "Color Picker"];

    //     return names.indexOf(a.attributesExt.name) - names.indexOf(b.attributesExt.name);
    // }
})
class Settings {
    constructor() {
        this.initialize(this);
        // this.addDependency("Checkbox", "Do action!!!")
        this.addDependency("Mob View", "Diana Mob Tracker");
        this.addDependency("Loot View", "Diana Loot Tracker");
        this.addDependency('Warp Party','Party Commands');
        this.addDependency('Allinvite','Party Commands');
        this.addDependency('Party Transfer','Party Commands');
        this.addDependency('Promote/Demote','Party Commands');
        this.addDependency('Ask Carrot','Party Commands');
        this.addDependency('Inq Warp Key','Detect Inq Cords');
        this.addDependency('Notify Party About Rare Room','Recognize Rare Room');
        this.addDependency('Announce Rare Room On Screen','Recognize Rare Room');
        // this.addDependency('Blaze View','Blaze Tracker');
        this.addDependency('Max Displayed Items','Attribute Value Overlay')
        this.addDependency('Select Displayed Lines','Attribute Value Overlay');
        this.addDependency('Bazaar Setting','Attribute Value Overlay');
        this.addDependency('Key Price','Attribute Value Overlay');
        this.addDependency('Kuudra Pet Rarity','Attribute Value Overlay');
        this.addDependency('Kuudra Pet Level','Attribute Value Overlay');
        this.addDependency('Attribute Shards For Chest Profit','Attribute Value Overlay');
        this.addDependency('Distance For Remove','Remove Guess');
        this.addDependency('Highlight All Possible Fossils','Fossil Solver');
    } 
    //-----------Diana Burrows----------------
    @SwitchProperty({
        name: "Diana Burrow Guess",
        description: "Guess the burrow location",
        category: "Diana",
        subcategory: "Diana Burrows"
    })
    dianaBurrowGuess = false;
    @SwitchProperty({
        name: "Diana Burrow Warp",
        description: "Warp to the closest burrow",
        category: "Diana",
        subcategory: "Diana Burrows"
    })
    dianaBurrowWarp = false;
    @TextProperty({
        name: "Warp Block Difference",
        description: "Increase it to set the diffrence when player warps (inq/burrow warp)",
        category: "Diana",
        subcategory: "Diana Burrows"
    })
    warpDiff = "10";
    @SwitchProperty({
        name: "Diana Burrow Detect",
        description: "Detects diana burrows | to reset waypoints /sboclearburrows",
        category: "Diana",
        subcategory: "Diana Burrows"
    })
    dianaBurrowDetect = false;

    // --- Diana Tracker ---
    @SwitchProperty({
        name: "Diana Mob Tracker",
        description: "Tracks your diana mob kills",
        category: "Diana",
        subcategory: "Diana Tracker",
    })
    dianaMobTracker = false;
    @SelectorProperty({
        name: "Mob View",
        description: "Tracks your diana mob kills /sboguis to move the counter",
        category: "Diana",
        subcategory: "Diana Tracker",
        options: ["OFF", "Overall View", "Event View", "Session View"]
    })
    dianaMobTrackerView = 0;
    @SwitchProperty({
        name: "Diana Loot Tracker",
        description: "Tracks your diana loot",
        category: "Diana",
        subcategory: "Diana Tracker",
    })
    dianaLootTracker = false;
    @SelectorProperty({
        name: "Loot View",
        description: "Tracks your diana loot /sboguis to move the counter",
        category: "Diana",
        subcategory: "Diana Tracker",
        options: ["OFF", "Overall View", "Event View", "Session View"]
    })
    dianaLootTrackerView = 0;
    @ButtonProperty({
        name: "Reset Session Tracker",
        description: "Resets the session tracker For mobs and items (/sboresetsession)",
        placeholder: "Reset Session",
        category: "Diana",
        subcategory: "Diana Tracker",
    })
    resetTrackerSession() {
       ChatLib.command("sboresetsession", true);
    }

    // --- Diana Waypoints ---
    @SwitchProperty({
        name: 'Detect Inq Cords',
        description: 'Create inquisitor waypoints',
        category: 'Diana',
        subcategory: 'Diana Waypoints',
    })
    inqWaypoints = false;
    @SwitchProperty({
        name: 'Inq Warp Key',
        description: 'Enable inquisitor warp key, set your keybind in controls.',
        category: 'Diana',
        subcategory: 'Diana Waypoints',
    })
    inqWarpKey = false;
    @SwitchProperty({
        name: 'Remove Guess',
        description: 'Removes guess when getting close to it',
        category: 'Diana',
        subcategory: 'Diana Waypoints',
    })
    removeGuess = false;
    @SliderProperty({
        name: 'Distance For Remove',
        description: 'Input distacne for guess removal',
        category: 'Diana',
        subcategory: 'Diana Waypoints',
        min: 1,
        max: 30
    })
    removeGuessDistance = 10;
    // --- Diana lines ---
    @SwitchProperty({
        name: 'Inquis Line',
        description: 'Draws lines for Inquisitor',
        category: 'Diana',
        subcategory: 'Diana Waypoint Lines',
    })
    inqLine = false;
    @SwitchProperty({
        name: 'Burrow Line',
        description: 'Draws lines for burrows',
        category: 'Diana',
        subcategory: 'Diana Waypoint Lines',
    })
    burrowLine = false;
    // --- Diana Other ---
    @SwitchProperty({
        name: 'Mythos HP',
        description: 'Displays HP of mythological mobs near you. /sboguis to move it',
        category: 'Diana',
        subcategory: "Other",
    })
    mythosMobHp = false;
    @SwitchProperty({
        name: "Inquis Party Message",
        description: "Party massage for inquisitor detection (patcher format).",
        category: "Diana",
        subcategory: "Other",
    })
    inquisDetect = false;
    // Loot Announcer
    @SwitchProperty({
        name: 'Rare Drop Announcer',
        description: 'Announce loot in chat',
        category: 'Diana',
        subcategory: 'Loot Announcer',
    })
    lootAnnouncerChat = false;
    @SwitchProperty({
        name: 'Loot Screen Announcer',
        description: 'Announce chimera/stick/relic on screen',
        category: 'Diana',
        subcategory: 'Loot Announcer',
    })
    lootAnnouncerScreen = false;
    //Party Commands
    @SwitchProperty({
        name: 'Party Commands',
        description: 'Enable party commands',
        category: 'Party Commands',
        subcategory: 'Party Commands',
    })
    PartyCommands = false;
    @SwitchProperty({
        name: 'Warp Party',
        description: '!w, !warp',
        category: 'Party Commands',
        subcategory: 'Party Commands',
    })
    WarpCommand = false;
    @SwitchProperty({
        name: 'Allinvite',
        description: '!allinv, !allinvite',
        category: 'Party Commands',
        subcategory: 'Party Commands',
    })
    AllinviteCommand = false;
    @SwitchProperty({
        name: 'Party Transfer',
        description: '!transfer [Player] (if no player is defined it transfers the party to the command writer)',
        category: 'Party Commands',
        subcategory: 'Party Commands',
    })
    TransferCommand = false;
    @SwitchProperty({
        name: 'Promote/Demote',
        description: '!promote/demote [Player] (if no player is defined it pro/demotes the command writer)',
        category: 'Party Commands',
        subcategory: 'Party Commands',
    })
    MoteCommand = false;
    @SwitchProperty({
        name: 'Ask Carrot',
        description: 'Enable !carrot Command',
        category: 'Party Commands',
        subcategory: 'Party Commands',
    })
    carrotCommand = false;
    @SwitchProperty({
        name: 'Time Check',
        description: 'Sends your time in party chat (!time)',
        category: 'Party Commands',
        subcategory: 'Party Commands',
    })
    timeCommand = false;


    // Slayer
    @SwitchProperty({
        name: 'Effects For Blaze',
        description: 'Displays effects for blaze slayer. /sboguis to move the overlay',
        category: 'Slayer',
        subcategory: 'Blaze',
    })
    effectsGui = false;
    @TextProperty({
        name: "Parrot Level",
        description: "Enter parrot level for effect duration (0 = off/no parrot)",
        category: "Slayer",
        subcategory: 'Blaze',
    })
    parrotLevel = "0";
    // @SwitchProperty({
    //     name: 'Slayer Drop Detect',
    //     description: 'Detect slayer drops',
    //     category: 'Slayer',
    //     subcategory: 'Slayer Drop Detect',
    // })
    // slayerDropDetect = false;
    // @SwitchProperty({
    //     name: "Blaze Tracker",
    //     description: "Tracks your Blaze loot",
    //     category: "Slayer",
    //     subcategory: "Blaze Tracker",
    // })
    // blazeLootTracker = false;
    // @SelectorProperty({
    //     name: "Blaze View",
    //     description: "/sbomoveblazecounter to move the counter",
    //     category: "Slayer",
    //     subcategory: "Blaze Tracker",
    //     options: ["OFF", "Overall View", "Event View", "Session View"]
    // })
    // blazeLootTrackerView = 0;
    // Dungeon
    @SwitchProperty({
        name: 'Recognize Rare Room',
        description: 'Recognize rare rooms in dungeons (like Trinity etc.)',
        category: 'Dungeon',
        subcategory: 'Quality of Life',
    })
    recognizeRareRoom = false;
    @SwitchProperty({
        name: 'Notify Party About Rare Room',
        description: "Notify's your party about the rare room you found",
        category: 'Dungeon',
        subcategory: 'Quality of Life',
    })
    notifyPartyRareRoom = false;
    @SwitchProperty({
        name: 'Announce Rare Room On Screen',
        description: 'Announce the rare room you found on screen',
        category: 'Dungeon',
        subcategory: 'Quality of Life',
    })
    announceRareRoomScreen = false;
    // Quality of Life
    @SwitchProperty({
        name: 'Formated Bridge Bot',
        description: 'Format bridge bot messages (that are like this "Guild > birgeBot: player: message")',
        category: 'Quality of Life',
    })
    formatBridgeBot = false;
    @TextProperty({
        name: 'Bridge Bot Name',
        description: 'Set the name of the bridge bot',
        category: 'Quality of Life',
    })
    bridgeBotName = "";
    @SwitchProperty({
        name: 'Copy Rare Drop',
        description: 'Copy rare drop Message to clipboard',
        category: 'Quality of Life',
    })
    copyRareDrop = false;
    @SwitchProperty({
        name: 'Find Dragon Lair',
        description: "Find Dragon's Lair in crystal hollows (requires hostile mob sounds enabled)",
        category: 'Quality of Life',
    })
    findDragonNest = false;
    @SwitchProperty({
        name: 'Jacob Message Hider',
        description: 'Hide Messages from jacob NPC in the chat',
        category: 'Quality of Life',
    })
    jacobHider = false;
    // General
    // General Waypoints
    @SwitchProperty({
        name: 'Detect Patcher Cords',
        description: 'Create patcher waypoints',
        category: 'General',
        subcategory: 'Waypoints',
    })
    patcherWaypoints = false;
    @SelectorProperty({
        name: "Hide Own Waypoints",
        description: "Hide your own patcher/inquisitor waypoints",
        category: "General",
        subcategory: "Waypoints",
        options: ["OFF", "Inq Waypoints", "Patcher Waypoints", "Both Waypoints"]
    })
    hideOwnWaypoints = 0;

    // Kuudra
    // ---ProfitHud---
    @SwitchProperty({
        name: 'Attribute Value Overlay',
        description: 'Displays value of attributes in chests and profit for kuudra chest. /sboguis to move the overlay',
        category: 'Kuudra',
    })
    attributeValueOverlay = false;
    @SliderProperty({
        name: 'Max Displayed Items',
        description: 'Max amount of items displayed in the overlay',
        category: 'Kuudra',
        min: 1,
        max: 20
    })
    maxDisplayedItems = 15;
    @SelectorProperty({
        name: 'Select Displayed Lines',
        description: 'Select if attributes are displayed in one or two lines',
        category: 'Kuudra',
        options: ['two lines','one line'],
    })
    lineSetting = 0;
    @SelectorProperty({
        name: 'Bazaar Setting',
        description: 'Bazaar setting for instasell/sell offer',
        category: 'Kuudra',
        options: ['Instasell','Sell Offer'],
    })
    bazaarSetting = 0;
    @SelectorProperty({
        name: 'Key Price',
        description: 'Use instabuy/buy offer for materials',
        category: 'Kuudra',
        options: ['Instabuy','Buy Offer'],
    })
    keySetting = 0;
    @SelectorProperty({
        name: 'Kuudra Pet Rarity',
        description: 'Set the rarity of your pet for essence perk',
        category: 'Kuudra',
        options: ['Legendary','Epic','Rare','Uncommon','Common','None'],
    })
    kuudraPet = 0;
    @TextProperty({
        name: 'Kuudra Pet Level',
        description: 'Set the level of your pet for essence perk',
        category: 'Kuudra',
    })
    kuudraPetLevel = "100";
    @SwitchProperty({
        name: 'Attribute Shards For Chest Profit',
        description: 'Use attribute shards for chest profit calculation',
        category: 'Kuudra',
    })
    attributeShards = false;

    // Mining
    @SwitchProperty({
        name: "Fossil Solver",
        description: "Enables the fossil solver",
        category: "Mining",
    })
    fossilSolver = false;
    @SwitchProperty({
        name: "Fossil Overlay",
        description: "Tells you the fossil you excavate /sboguis to move the overlay",
        category: "Mining",
    })
    fossilOverlay = false;
    @SwitchProperty({
        name: "Highlight All Possible Fossils",
        description: "Highlights all potential fossil locations with equal probability (if this is off only one location will be highlighted)",
        category: "Mining",
    })
    highlightAllSlots = false;
    @SwitchProperty({
        name: "Create Exit Waypoint",
        description: "Creates a waypoint at the exit of the mineshaft",
        category: "Mining",
    })
    exitWaypoint = false;
    @SwitchProperty({
        name: "Mineshaft Announcer",
        description: "Announces the mineshaft on your screen",
        category: "Mining",
    })
    mineshaftAnnouncer = false;


    // General other
    @SwitchProperty({
        name: "Bobber Counter",
        description: "Tracks the number of bobbers near you /sboguis to move the counter",
        category: "General",
    })
    bobberCounter = false;
    @SwitchProperty({
        name: "Legion Counter",
        description: "Tracks the players near you for legion buff /sboguis to move the counter",
        category: "General",
    })
    legionCounter = false;

    // Color Settings
    @ColorProperty({
        name: "Start Burrow Color",
        description: "Pick a color for start burrows",
        category: "Customization",
        subcategory: "Category"
    })
    startColor = new Color(0.333,1,0.333);
    @ColorProperty({
        name: "Mob Burrow Color",
        description: "Pick a color for mob burrows",
        category: "Customization",
        subcategory: "Category"
    })
    mobColor = new Color(1,0.333,0.333);
    @ColorProperty({
        name: "Treasure Burrow Color",
        description: "Pick a color for treasure burrows",
        category: "Customization",
        subcategory: "Category"
    })
    treasureColor = new Color(1,0.667,0);
    @ColorProperty({
        name: "Guess Color",
        description: "Pick a color for your guess",
        category: "Customization",
        subcategory: "Category"
    })
    guessColor = new Color(1,1,1);
    @ColorProperty({
        name: "Slot Highlighting Color",
        description: "Pick a color for slot highlighting",
        category: "Customization",
        subcategory: "Category"
    })
    slotColor = Color.RED;

    // Debug
    @SwitchProperty({
        name: 'Always Diana',
        description: 'Its always Diana, no need to check for mayor, perks or spade',
        category: 'Debug',
    })
    itsAlwaysDiana = false;
    @SwitchProperty({
        name: 'Always in Skyblock',
        description: 'you are always in skblock, just for trolls and debug',
        category: 'Debug',
    })
    alwaysInSkyblock = false;

    // credits/infos
    @ButtonProperty({
        name: "Discord",
        description: "Open Tickets for help/bug reports",
        placeholder: "Click Me",
        category: "Credits/Infos",
        subcategory: "Infos",
    })
    openDiscord() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://discord.gg/QvM6b9jsJD"));
    }
    @ButtonProperty({
        name: "Github",
        description: "View our progress on github",
        placeholder: "Click Me",
        category: "Credits/Infos",
        subcategory: "Infos",
    })
    openGithub() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://github.com/SkyblockOverhaul/SBO"));
    }
    @ButtonProperty({
        name: "Patreon",
        description: "Support our development ☕",
        placeholder: "Click Me",
        category: "Credits/Infos",
        subcategory: "Infos",
    })
    openPatreon() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://www.patreon.com/Skyblock_Overhaul"));
    }
    @ButtonProperty({
        name: "Website",
        description: "Explore our website for tracking Magic Find upgrades and Attribute upgrades",
        placeholder: "Click Me",
        category: "Credits/Infos",
        subcategory: "Infos",
    })
    openWebsite() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://skyblockoverhaul.com/"));
    }
    @ButtonProperty({
        name: "SoopyV2",
        description: "(Diana guess, Mob HP)",
        placeholder: "Click Me",
        category: "Credits/Infos",
        subcategory: "Credits",
    })
    openSoopyV2() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://www.chattriggers.com/modules/v/SoopyV2"));
    }
    @ButtonProperty({
        name: "VolcAddons",
        description: "(Burrow detect, Render waypoints and some utils)",
        placeholder: "Click Me",
        category: "Credits/Infos",
        subcategory: "Credits",
    })
    openVolcAddons() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://www.chattriggers.com/modules/v/VolcAddons"));
    }
}
// let SboData = {
//     "effects": [],
//     "version": "0.1.3"
// };
// if (FileLib.exists("./config/ChatTriggers/modules/SBO/SboData.json")) {
//     SboData = JSON.parse(FileLib.read("./config/ChatTriggers/modules/SBO/SboData.json"));
// }
// if(!SboData.hasOwnProperty("version")) {
//     SboData["version"] = "0.0.0";
// }
let newResetVersion = resetVersion; 
if (data.resetVersion != newResetVersion) {
    FileLib.deleteDirectory("./config/ChatTriggers/modules/SBO/config.toml");
    data.resetVersion = newResetVersion;
    data.save();
    // FileLib.write("./config/ChatTriggers/modules/SBO/SboData.json", JSON.stringify(SboData, null, 4));
}
export default new Settings();

//  java.awt.Desktop.getDesktop().browse(new java.net.URI("url"));