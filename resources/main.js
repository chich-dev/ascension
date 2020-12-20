var Path = require('path');
var FS = require('fs');

var Constants = {
    Ascension: {
        Base: {
            Abeyance: "Abeyance",
            Adaptation: "Adaptation",
            Benevolence: "Benevolence",
            Celestial: "Celestial",
            Centurion: "Centurion",
            Defiance: "Defiance",
            Elementalist: "Elementalist",
            Occultist: "Occultist",
            Paucity: "Paucity",
            Predator: "Predator",
            Presence: "Presence",
            Prosperity: "Prosperity",
            Purity: "Purity",
            ViolentStrike: "Violent Strike",
            VitalityVoid: "Vitality Void",
            VolatileArmor: "Volatile Armor",
            Voracity: "Voracity",
            Ward: "Ward",
            Wither: "Wither"
        }
    },
    Reactions: {
        Base: {
            Celestial: " Celestial",
            Centurion: " Centurion",
            Elementalist: " Elementalist",
            Occultist: " Occultist",
            Predator: " Predator"
        },
        PerRound: "reaction per round"
    },
    Stats: {
        Damage: "Damage",
        MagicArmor: "Magic Armor",
        PhysicalArmor: "Physical Armor",
        Strength: "Strength",
        Finesse: "Finesse",
        Constitution: "Constitution",
        Power: "Power",
        Wits: "Wits",
        Aerotheurge: "Aerotheurge",
        Huntsman: "Huntsman",
        Pyrokinetic: "Pyrokinetic",
        Scoundrel: "Scoundrel",
        Warfare: "Warfare",
        DualWielding: "Dual Wielding",
        Ranged: "Ranged",
        SingleHanded: "Single-Handed",
        TwoHanded: "Two-Handed",
        AirResistance: "Air Resistance",
        FireResistance: "Fire Resistance",
        PhysicalResistance: "Physical Resistance",
        EarthResistance: "Earth Resistance",
        PoisonResistance: "Poison Resistance",
        WaterResistance: "Water Resistance",
        PiercingResistance: "Piercing Resistance",
        Aerotheurge: "Aerotheurge",
        Huntsman: "Huntsman",
        Accuracy: "Accuracy",
        CriticalChance: "Critical Chance",
        MaximumVitality: "Maximum Vitality",
        Leadership: "Leadership",
        Perseverance: "Perseverance",
        Force: "Force",
        Life: "Life",
        Inertia: "Inertia",
        Entropy: "Entropy",
        Form: "Form",
        Geomancer: "Geomancer",
        Necromancer:"Necromancer",
        Hydrosophist: "Hydrosophist",
        Summoning: "Summoning",
        Movement: "Movement Speed",
        DodgeChance: "Dodge Chance",
        Initiative: "Initiative",
        Memory: "Memory",
        ElementalResist: "Elemental Resistances",
        AllResist: "all Resistances",
        BatteredandHarriedThreshold: "Battered and Harried Threshold",
        Retribution: "Retribution",
        VitalityRegen: "Vitality Regen",
        SummonDodge: "summon Dodge",
        SummonResist: "summon Resistances"
    }
};

var Expressions = {
    Class: new RegExp(/(Force:|Entropy:|Inertia:|Life:|Form:)[\s\S]*?(?=Force:|Entropy:|Inertia:|Life:|Form:)/gm),
    NameAndGroup: new RegExp(/(Force:|Entropy:|Inertia:|Life:|Form:).*$/gm),
    Node: new RegExp(/Node_[0-9]\s[\s\S]*?(?=Node_\d\s|$)/g),
    Subnode: new RegExp(/Node_[\s\S]*?(?=Node_|$)/g),
    Requires: new RegExp(/.*Requires:.*$/gm),
    Grants: new RegExp(/.*grants:.*$/gm),
    Force: new RegExp(/\d Force/g),
    Entropy: new RegExp(/\d Entropy/g),
    Life: new RegExp(/\d Life/g),
    Form: new RegExp(/\d Form/g),
    Inertia: new RegExp(/\d Inertia/g),
    //Stats: new RegExp(/^\+\d[\d|\.|%|\s][\d|\.|%|\s|\S].*$/g)
};

var ManualReview = [];

var ascensionRaw = FS.readFileSync(__dirname + Path.sep + 'ascension-raw.txt', { encoding: 'utf-8' });

var ClassesRaw = ascensionRaw.match(Expressions.Class);
var ClassesProcess = ClassesRaw.map((element) => { return element.trim() });
var Classes = [];

ClassesProcess.forEach(element => {
    var NameAndGroup = element.match(Expressions.NameAndGroup)[0];
    var Requires = element.match(Expressions.Requires)[0];
    var Grants = element.match(Expressions.Grants) ? element.match(Expressions.Grants)[0] : null;
    var Class = {
        Group: NameAndGroup.substring(0, NameAndGroup.indexOf(':')).trim(),
        Name: NameAndGroup.substring(NameAndGroup.indexOf(':') + 1).trim(),
        Requires: {
            Force: Requires.match(Expressions.Force) ? parseInt(Requires.match(Expressions.Force)[0].substring(0, 1)) : 0,
            Entropy: Requires.match(Expressions.Entropy) ? parseInt(Requires.match(Expressions.Entropy)[0].substring(0, 1)) : 0,
            Life: Requires.match(Expressions.Life) ? parseInt(Requires.match(Expressions.Life)[0].substring(0, 1)) : 0,
            Form: Requires.match(Expressions.Form) ? parseInt(Requires.match(Expressions.Form)[0].substring(0, 1)) : 0,
            Inertia: Requires.match(Expressions.Inertia) ? parseInt(Requires.match(Expressions.Inertia)[0].substring(0, 1)) : 0,
        },
        Nodes: [],
        Grants: {
            Force: Grants ? Grants.match(Expressions.Force) ? parseInt(Grants.match(Expressions.Force)[0].substring(0, 1)) : 0 : 0,
            Entropy: Grants ? Grants.match(Expressions.Entropy) ? parseInt(Grants.match(Expressions.Entropy)[0].substring(0, 1)) : 0 : 0,
            Life: Grants ? Grants.match(Expressions.Life) ? parseInt(Grants.match(Expressions.Life)[0].substring(0, 1)) : 0 : 0,
            Form: Grants ? Grants.match(Expressions.Form) ? parseInt(Grants.match(Expressions.Form)[0].substring(0, 1)) : 0 : 0,
            Inertia: Grants ? Grants.match(Expressions.Inertia) ? parseInt(Grants.match(Expressions.Inertia)[0].substring(0, 1)) : 0 : 0,
        }
    };
    Classes.push(Class);
    var Nodes = element.match(Expressions.Node);
    Nodes.forEach((node) => {
        var SubNodes = node.match(Expressions.Subnode);
        var SubNode;
        for (var i = 0; i < SubNodes.length; i++) {
            var SubNodeWork;
            if (i == 0) {
                SubNodeWork = SubNodes[i].substring(6).trim();
                SubNodeWork = SubNodeWork.replace(new RegExp(/» /gm), "").replace(new RegExp(/\"/gm), "");
                SubNodeArray = SubNodeWork.trim().split('\r\n').map((item) => { return item.trim() });
                SubNode = {
                    ID: Class.Nodes.length,
                    Raw: SubNodeWork,
                    Activation: [],
                    Modifiers: [],
                    Stats: {

                    },
                    //Augments: SubNodeWork ? SubNodeWork.match(Expressions.Augments) ? SubNodeWork.match(Expressions.Augments).map((item) => { return item }) : [] : [],
                    SubNodes: []
                };
                if (SubNodeWork) {
                    SubNodeArray.forEach((SubNodeWork) => {
                        let target;
                        for (var name in Constants.Ascension.Base) {
                            if (SubNodeWork.indexOf(Constants.Ascension.Base[name]) > -1) {
                                target = Constants.Ascension.Base[name];
                            }
                        }
                        if (target) {
                            if (SubNodeWork.indexOf("basic activation") > -1) {
                                SubNode.Activation.push(target);
                            }
                            else {
                                SubNode.Modifiers.push(SubNodeWork);
                            }
                        }
                        else {
                            for (var name in Constants.Stats) {
                                if (SubNodeWork.indexOf(Constants.Stats[name]) > -1) {
                                    target = Constants.Stats[name];
                                }
                            }
                            if (target) {
                                if (SubNodeWork.indexOf("+") > -1) {
                                    SubNode.Stats[target] = SubNodeWork.substring(SubNodeWork.indexOf("+") + 1, SubNodeWork.indexOf(" ")).replace("%", "").trim();
                                }
                            }
                            else {
                                SubNode.Modifiers.push(SubNodeWork)
                            }
                        }
                    })

                    /*
                    var StatWork = SubNodeWork.match(Expressions.Stats);
                    if(StatWork) {
                        StatWork.forEach((item) => {
                            var localStatWork = item.split(' ');
                            SubNode.Stats[localStatWork.slice(1).join(" ").replace(".", "")] = localStatWork[0].replace("+", "").replace("%", "");
                        });
                    }
                    */
                }
                Class.Nodes.push(SubNode);
            }
            else {
                SubNodeWork = SubNodes[i].substring(8).trim();
                SubNodeWork = SubNodeWork.replace(new RegExp(/» /gm), "").replace(new RegExp(/\"/gm), "");
                SubNodeArray = SubNodeWork.trim().split('\r\n').map((item) => { return item.trim() });
                var localSubNode = {
                    Raw: SubNodeWork,
                    Activation: [],
                    Modifiers: [],
                    Stats: {

                    }
                    //Augments: SubNodeWork ? SubNodeWork.match(Expressions.Augments) ? SubNodeWork.match(Expressions.Augments).map((item) => { return item }) : [] : []
                }
                SubNode.SubNodes.push(localSubNode);
                if (SubNodeWork) {
                    SubNodeArray.forEach((SubNodeWork) => {
                        let target;
                        for (var name in Constants.Ascension.Base) {
                            if (SubNodeWork.indexOf(Constants.Ascension.Base[name]) > -1) {
                                target = Constants.Ascension.Base[name];
                            }
                        }
                        if (target) {
                            if (SubNodeWork.indexOf("basic activation") > -1) {
                                localSubNode.Activation.push(target);
                            }
                            else {
                                localSubNode.Modifiers.push(SubNodeWork);
                            }
                        }
                        else {
                            for (var name in Constants.Stats) {
                                if (SubNodeWork.indexOf(Constants.Stats[name]) > -1) {
                                    target = Constants.Stats[name];
                                }
                            }
                            if (target) {
                                if (SubNodeWork.indexOf("+") > -1) {
                                    localSubNode.Stats[target] = SubNodeWork.substring(SubNodeWork.indexOf("+") + 1, SubNodeWork.indexOf(" ")).replace("%", "").trim();
                                }
                            }
                            else {
                                localSubNode.Modifiers.push(SubNodeWork)
                            }
                        }
                    })
                    /*
                    let AugmentWork = SubNodeWork.trim();
                    var StatWork = SubNodeWork.match(Expressions.Stats);
                    if(StatWork) {
                        StatWork.forEach((item) => {
                            AugmentWork = AugmentWork.replace(item, "");
                            var localStatWork = item.split(' ');
                            localSubNode.Stats[localStatWork.slice(1).join(" ").replace(".", "")] = localStatWork[0].replace("+", "").replace("%", "");
                        });
                    }
                    localSubNode.Augments = AugmentWork.split("\r\n").filter(item => { return item ? item : null });
                    */
                }
            }
        }
    });
});

FS.writeFileSync(__dirname + Path.sep + ".." + Path.sep + "src" + Path.sep + "assets" + Path.sep + "ascension.json", JSON.stringify(Classes, null, "\t"), { encoding: "utf-8" });
//console.log(JSON.stringify(Classes, null, "\t"));
//console.log(JSON.stringify(Classes.filter((item) => { return item.Name == "Wrath" }), null, "\t"));
//console.log(JSON.stringify(Classes.filter((cls) => { return cls.Nodes.filter((node) => { return node.Activation.length > 0 || node.SubNodes.filter((subnode) => { return subnode.Activation.length > 0 })[0] } )[0] }), null, "\t"));
//console.log(JSON.stringify(Classes.filter((cls) => { return cls.Nodes.filter((node) => { return node.Activation.length > 0 || node.SubNodes.filter((subnode) => { return subnode.Activation.length > 0 })[0] } )[0] }).map((item) => { return item.Name; }), null, "\t"));
//console.log(Classes.filter((cls) => { return cls.Nodes.filter((node) => { return node.Activation.length > 0 || node.SubNodes.filter((subnode) => { return subnode.Activation.length > 0 })[0] } )[0] }).length)
//console.log(ManualReview)