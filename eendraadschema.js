//=========================================================================//
//
//  Eendraadschema tekenen (https://eendraadschema.goethals-jacobs.be/)
//  Copyright (C) 2019  Ivan Goethals
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//-------------------------------------------------------------------------//
//
//  Want to contribute?, use the contact-form on the website mentioned
//  above.
//
//=========================================================================//

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
function isInt(value) {
    return !isNaN(value) &&
        parseInt(value) == value &&
        !isNaN(parseInt(value, 10));
}
function flattenSVG(SVGstruct, shiftx, shifty, node) {
    var str = "";
    var X = new XMLSerializer();
    var parser = new DOMParser();
    var outstruct = SVGstruct;
    if (SVGstruct.localName == "svg") {
        if (outstruct.attributes.getNamedItem("x")) { // make SVG a 0,0 element
            shiftx += parseFloat(outstruct.attributes.getNamedItem("x").nodeValue);
            outstruct.attributes.getNamedItem("x").nodeValue = 0;
        }
        if (outstruct.attributes.getNamedItem("y")) { // make SVG a 0,0 element
            shifty += parseFloat(outstruct.attributes.getNamedItem("y").nodeValue);
            outstruct.attributes.getNamedItem("y").nodeValue = 0;
        }
        for (var i = 0; i < SVGstruct.children.length; i++) {
            str = str.concat(flattenSVG(SVGstruct.children[i], shiftx, shifty, node + 1), "\n");
        }
        if (node <= 0) {
            //---output[0] = outstruct;
            if (outstruct.attributes.getNamedItem("width")) { // make SVG a 0,0 element
                str = '<svg width="' + (outstruct.attributes.getNamedItem("width").nodeValue) +
                    '" height="' + (outstruct.attributes.getNamedItem("height").nodeValue) + '">' + str + '</svg>';
            }
            else {
                str = '<svg>' + str + '</svg>';
            }
        }
    }
    else {
        if (SVGstruct.localName == "line") {
            if (shiftx != 0) {
                outstruct.attributes.getNamedItem("x1").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x1").nodeValue) + shiftx;
                outstruct.attributes.getNamedItem("x2").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x2").nodeValue) + shiftx;
            }
            if (shifty != 0) {
                outstruct.attributes.getNamedItem("y1").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y1").nodeValue) + shifty;
                outstruct.attributes.getNamedItem("y2").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y2").nodeValue) + shifty;
            }
        }
        if (SVGstruct.localName == "use") {
            if (shiftx != 0) {
                outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
            }
            if (shifty != 0) {
                outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
            }
        }
        if (SVGstruct.localName == "rect") {
            if (shiftx != 0) {
                outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
            }
            if (shifty != 0) {
                outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
            }
        }
        if (SVGstruct.localName == "circle") {
            if (shiftx != 0) {
                outstruct.attributes.getNamedItem("cx").nodeValue = parseFloat(outstruct.attributes.getNamedItem("cx").nodeValue) + shiftx;
            }
            if (shifty != 0) {
                outstruct.attributes.getNamedItem("cy").nodeValue = parseFloat(outstruct.attributes.getNamedItem("cy").nodeValue) + shifty;
            }
        }
        if (SVGstruct.localName == "text") {
            outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
            outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
            if (outstruct.attributes.getNamedItem("transform")) {
                outstruct.attributes.getNamedItem("transform").value = "rotate(-90 " +
                    outstruct.attributes.getNamedItem("x").nodeValue + "," +
                    outstruct.attributes.getNamedItem("y").nodeValue + ")";
            }
        }
        if (SVGstruct.localName == "polygon") {
            var polystr_out = "";
            var polystr_in = outstruct.attributes.getNamedItem("points").nodeValue;
            var splitted_in = polystr_in.split(" ");
            for (var countstr = 0; countstr < splitted_in.length; countstr++) {
                var points_in = splitted_in[countstr].split(",");
                polystr_out += (points_in[0] * 1 + shiftx) + ',' + (points_in[1] * 1 + shifty);
                if (countstr < splitted_in.length - 1) {
                    polystr_out += ' ';
                }
            }
            outstruct.attributes.getNamedItem("points").nodeValue = polystr_out;
        }
        str = X.serializeToString(outstruct);
        //remove all the xmlns tags
        var regex = /xmlns="[^"]+"/g;
        str = str.replace(regex, '');
    }
    return str;
}
function flattenSVGfromString(xmlstr) {
    var str = "";
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlstr, "text/xml"); //important to use "text/xml"
    //str = flattenSVG(xmlDoc.children[0],0,0,0);
    str = flattenSVG(xmlDoc.childNodes[0], 0, 0, 0);
    return str;
}
function htmlspecialchars(my_input) {
    var str;
    if (isNaN(my_input))
        str = my_input;
    else
        str = my_input.toString();
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, function (m) { return map[m]; });
}
function browser_ie_detected() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');
    if ((msie > 0) || (trident > 0))
        return true;
    else
        return false;
}
var SVGelement = /** @class */ (function () {
    function SVGelement() {
        this.data = "";
        this.xleft = 0;
        this.xright = 0;
        this.xrightmin = 0;
        this.yup = 0;
        this.ydown = 0;
    }
    return SVGelement;
}());
var List_Item = /** @class */ (function () {
    function List_Item() {
        this.id = 0; //undefined
        this.parent = 0; //no parent
        this.indent = 0; //at root note, no parent
        this.collapsed = false; //at the start, nothingh is collapsed
        this.keys = new Array();
    }
    List_Item.prototype.resetKeys = function () {
    };
    List_Item.prototype.setKey = function (key, setvalue) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i][0] == key) {
                this.keys[i][2] = setvalue;
            }
        }
    };
    List_Item.prototype.getKey = function (key) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i][0] == key) {
                return (this.keys[i][2]);
            }
        }
    };
    List_Item.prototype.stringToHTML = function (keyid, size) {
        var output = "";
        var sizestr = "";
        switch (size) {
            case null: break;
            default:
                sizestr = ' size="' + size + '" ';
        }
        output += "<input type=\"text\"" + sizestr + " id=\"" + "HL_edit_" + this.id + "_" + this.keys[keyid][0] +
            "\" onchange=HLUpdate(" + this.id + ",\"" + this.keys[keyid][0] + "\",\"" +
            this.keys[keyid][1] + "\",\"" + "HL_edit_" + this.id + "_" + this.keys[keyid][0] +
            "\") value=\"" + this.keys[keyid][2] + "\">";
        return (output);
    };
    List_Item.prototype.checkboxToHTML = function (keyid) {
        var output = "";
        output += "<input type=\"checkbox\" id=\"" + "HL_edit_" + this.id + "_" + this.keys[keyid][0] + "\" onchange=HLUpdate(" + this.id + ",\"" + this.keys[keyid][0] + "\",\"" + this.keys[keyid][1] + "\",\"" + "HL_edit_" + this.id + "_" + this.keys[keyid][0] + "\")" + (this.keys[keyid][2] ? ' checked' : '') + ">";
        return (output);
    };
    List_Item.prototype.selectToHTML = function (keyid, items) {
        var myId = "HL_edit_" + this.id + "_" + this.keys[keyid][0];
        var myType = this.keys[keyid][1];
        var output = "";
        var options = "";
        output += "<select id=\"" + myId + "\" onchange=HLUpdate(" + this.id + ",\"" + this.keys[keyid][0] + "\",\"" + this.keys[keyid][1] + "\",\"" + myId + "\")>";
        for (var i = 0; i < items.length; i++) {
            options = "";
            if (this.keys[keyid][2] == items[i]) {
                options += " selected";
            }
            if (items[i] == "---") {
                options += " disabled";
                items[i] = "---------------------------";
            }
            output += '<option value="' + items[i] + '" ' + options + '>' + items[i] + '</option>';
        }
        output += "</select>";
        return (output);
    };
    List_Item.prototype.toHTML = function (mode, Parent) {
        return ("toHTML() function not defined for base class List_Item. Extend class first.");
    };
    List_Item.prototype.toSVG = function (hasChild) {
        if (hasChild === void 0) { hasChild = false; }
        var mySVG = new SVGelement();
        return (mySVG);
    };
    List_Item.prototype.updateConsumers = function () {
    }; //Empty container class --> only in extended functions
    return List_Item;
}());
var Electro_Item = /** @class */ (function (_super) {
    __extends(Electro_Item, _super);
    function Electro_Item(Parent) {
        var _this = _super.call(this) || this;
        _this.keys.push(["type", "SELECT", ""]); //0
        _this.keys.push(["geaard", "BOOLEAN", true]); //1
        _this.keys.push(["kinderveiligheid", "BOOLEAN", true]); //2
        _this.keys.push(["accumulatie", "BOOLEAN", false]); //3
        _this.keys.push(["aantal", "SELECT", "1"]); //4
        _this.keys.push(["lichtkring_poligheid", "SELECT", "enkelpolig"]); //5
        _this.keys.push(["ventilator", "BOOLEAN", false]); //6
        _this.keys.push(["zekering", "SELECT", "automatisch"]); //7
        _this.keys.push(["amperage", "STRING", "20"]); //8
        _this.keys.push(["kabel", "STRING", "XVB 3G2,5"]); //9
        _this.keys.push(["naam", "STRING", ""]); //10
        _this.keys.push(["differentieel_waarde", "STRING", "300"]); //11
        _this.keys.push(["kabel_aanwezig", "BOOLEAN", true]); //12, In eerste plaats om aan te geven of er een kabel achter een zekering zit.
        _this.keys.push(["aantal2", "SELECT", "1"]); //13, a.o. gebruikt voor aantal lampen of aantal knoppen op drukknop_armatuur
        _this.keys.push(["voltage", "STRING", "230V/24V"]); //14, a.o. gebruikt voor aantal lampen
        _this.keys.push(["commentaar", "STRING", ""]); //15, extra tekstveld
        _this.keys.push(["select1", "SELECT", "standaard"]); //16, algemeen veld
        //Indien lichtpunt, select1 is het type van licht (standaard, TL, ...)
        //Indien drukknop, select1 kan "standaard", "dimmer" or "rolluik" zijn
        //Indien vrije tekst, select1 kan "verbruiker" of "zonder kader" zijn
        //Indien ketel, type is het soort verwarming
        _this.keys.push(["select2", "SELECT", "standaard"]); //17, algemeen veld
        //Indien lichtpunt, select2 is de selector voor het type noodverlichting (indien aanwezig)
        //Indien vrije tekst kan "links", "centreer", "rechts" zijn
        _this.keys.push(["select3", "SELECT", "standaard"]); //18, algemeen veld
        _this.keys.push(["bool1", "BOOLEAN", false]); //19, algemeen veld
        //Indien lichtpunt, bool1 is de selector voor wandverlichting of niet
        //Indien drukknop, bool1 is de selector voor afgeschermd of niet
        //Indien schakelaar/lichtcircuit, bool1 is de selector voor signalisatielamp of niet
        //Indien vrije tekst, bool1 is de selector voor vet
        _this.keys.push(["bool2", "BOOLEAN", false]); //20, algemeen veld
        //Indien lichtpunt, schakelaar, drukknop of stopcontact, bool2 is de selector voor halfwaterdicht of niet
        //Indien vrije tekst, bool2 is de selector voor schuin
        //Indien vrije tekst, bool2 is de selector voor energiebron
        _this.keys.push(["bool3", "BOOLEAN", false]); //21, algemeen veld
        //Indien lichtpunt, bool3 is de selector voor ingebouwde schakelaar of niet
        //Indien schakelaar of drukknop, bool3 is de selector voor verklikkerlamp of niet
        //Indien vrije tekst, bool3 is de selector voor warmtefunctie
        _this.keys.push(["string1", "STRING", ""]); //22, algemeen veld
        //Indien vrije tekst, breedte van het veld
        _this.keys.push(["string2", "STRING", ""]); //23, algemeen veld
        //Indien vrije tekst, het adres-veld (want reeds gebruikt voor de tekst zelf)
        _this.keys.push(["string3", "STRING", ""]); //24, algemeen veld
        _this.keys.push(["bool4", "BOOLEAN", false]); //25, algemeen veld
        //Indien schakelaar, indicatie trekschakelaar of niet
        _this.Parent_Item = Parent;
        _this.updateConsumers();
        return _this;
    }
    Electro_Item.prototype.updateConsumers = function () {
        if (this.Parent_Item == null) {
            this.consumers = ["", "Kring", "Aansluiting"];
        }
        else {
            switch (this.Parent_Item.getKey("type")) {
                case "Bord": {
                    this.consumers = ["", "Kring"];
                    break;
                }
                case "Splitsing":
                case "Domotica": {
                    this.consumers = ["", "Kring"];
                    break;
                }
                case "Kring": {
                    this.consumers = ["", "Aansluiting", "Bord", "Domotica", "Meerdere verbruikers", "Kring", "Splitsing", "---", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Schakelaars", "Stopcontact", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verwarmingstoestel", "Vrije tekst", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt",
                        "Aftakdoos", "Leeg"];
                    break;
                }
                case "Meerdere verbruikers": {
                    this.consumers = ["", "Domotica", "Splitsing", "---", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verwarmingstoestel", "Vrije tekst", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt",
                        "Aftakdoos", "Leeg"];
                    break;
                }
                case "Aansluiting": {
                    this.consumers = ["", "Bord", "Kring", "Splitsing"];
                    break;
                }
                default: {
                    this.consumers = [""];
                    break;
                }
            }
        }
    };
    Electro_Item.prototype.resetKeys = function () {
        this.keys[1][2] = true;
        this.keys[2][2] = true;
        this.keys[3][2] = false;
        this.keys[5][2] = "enkelpolig";
        this.keys[6][2] = false;
        if (this.keys[0][2] == "Aansluiting") {
            this.keys[4][2] = "2";
            this.keys[7][2] = "differentieel";
            this.keys[8][2] = "40";
            this.keys[9][2] = "2x16";
        }
        else {
            this.keys[4][2] = "1";
            this.keys[7][2] = "automatisch";
            this.keys[8][2] = "20";
            this.keys[9][2] = "XVB 3G2,5";
        }
        ;
        if (this.keys[0][2] == "Vrije tekst") {
            this.keys[22][2] = 40;
            this.keys[17][2] = "centreer";
        }
        ;
        this.keys[11][2] = "300"; //Differentieel
        if (this.Parent_Item == null) {
            this.keys[12][2] = true;
        }
        else {
            switch (this.Parent_Item.getKey("type")) { //Kabel_aanwezig
                case "Splitsing":
                    this.keys[7][2] = "geen"; //geen zekering per default na splitsing
                    this.keys[12][2] = false; //geen kabel per default na splitsing
                    break;
                case "Domotica":
                    this.keys[7][2] = "geen"; //geen zekering per default na domotica
                    break;
                default:
                    this.keys[7][2] = "automatisch"; //wel een zekering na bord
                    this.keys[12][2] = true; //wel een kabel na bord
                    break;
            }
        }
        ;
        if (this.keys[0][2] == "Schakelaars") {
            this.keys[25][2] = false;
        }
        this.keys[13][2] = "1";
        this.keys[14][2] = "230V/24V";
        this.keys[15][2] = "";
        //-- Set each of the optional booleans to false --
        this.keys[19][2] = false;
        this.keys[20][2] = false;
        this.keys[21][2] = false;
        switch (this.keys[0][2]) { //Special cases
            case "Kring":
                this.keys[10][2] = "---";
                this.keys[16][2] = "N/A";
                this.keys[19][2] = false;
                break;
            case "Splitsing":
                //this.keys[10][2] = "";
                break;
            case "Domotica":
                this.keys[15][2] = "Domotica";
                break;
            case "Lichtpunt":
                this.keys[17][2] = "Geen"; //Geen noodverlichting
                break;
            default:
                //this.keys[10][2] = "";
                break;
        }
        ;
    };
    Electro_Item.prototype.setKey = function (key, setvalue) {
        _super.prototype.setKey.call(this, key, setvalue);
        //If type of component changed, reset everything
        if (key == "type") {
            this.resetKeys();
        }
        //Some validation on the input. Do properties still make sense after update
        switch (this.keys[0][2]) {
            case "Lichtcircuit":
                if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
                    if (this.getKey("aantal") > 2) {
                        this.setKey("aantal", "2");
                    }
                }
                break;
            case "Verwarmingstoestel":
                if ((this.getKey("accumulatie") == false) && (this.getKey("ventilator") == true)) {
                    this.setKey("ventilator", false);
                }
                break;
            case "Kring":
                if ((this.getKey("aantal") < 2) || (this.getKey("aantal") > 4)) {
                    this.setKey("aantal", "2");
                }
                break;
        }
    };
    Electro_Item.prototype.toHTML = function (mode, Parent) {
        var output = "";
        if (mode == "move") {
            output += "<b>ID: " + this.id + "</b>, ";
            output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent + '" onchange="HL_changeparent(' + this.id + ')"> ';
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id + ")\">&#9650;</button>";
            output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id + ")\">&#9660;</button>";
        }
        else {
            output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id + ")\">&#9650;</button>";
            output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id + ")\">&#9660;</button>";
            output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id + ")\">&#9654;</button>";
        }
        ;
        output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id + ")\">&#9851;</button>";
        output += "&nbsp;";
        this.updateConsumers();
        output += this.selectToHTML(0, this.consumers);
        switch (this.keys[0][2]) {
            case "Kring":
                output += "&nbsp;Naam: " + this.stringToHTML(10, 5) + "<br>";
                output += "Zekering: " + this.selectToHTML(7, ["automatisch", "differentieel", "smelt", "geen", "---", "schakelaar", "schemer"]);
                if (this.keys[7][2] != "geen")
                    output += this.selectToHTML(4, ["2", "3", "4"]) + this.stringToHTML(8, 2) + "A";
                if (this.getKey("zekering") == "differentieel") {
                    output += ", \u0394 " + this.stringToHTML(11, 3) + "mA";
                }
                output += "<br>";
                output += "Kabel: " + this.checkboxToHTML(12);
                if (this.getKey("kabel_aanwezig")) {
                    output += ", Type: " + this.stringToHTML(9, 10);
                    output += ", Plaatsing: " + this.selectToHTML(16, ["N/A", "Ondergronds", "Luchtleiding", "In wand", "Op wand"]);
                    if (this.keys[16][2] != "Luchtleiding") {
                        output += ", In buis: " + this.checkboxToHTML(19);
                    }
                }
                output += ", Tekst: " + this.stringToHTML(15, 10);
                break;
            case "Aansluiting":
                output += "&nbsp;";
                if (typeof Parent != 'undefined')
                    output += "Nr: " + this.stringToHTML(10, 5) + ", ";
                output += "Zekering: " + this.selectToHTML(7, ["automatisch", "differentieel", "smelt", "geen", "---", "schakelaar", "schemer"]) +
                    this.selectToHTML(4, ["2", "3", "4"]) +
                    this.stringToHTML(8, 2) + "A";
                if (this.getKey("zekering") == "differentieel") {
                    output += ", \u0394 " + this.stringToHTML(11, 3) + "mA";
                }
                output += ", Kabeltype: " + this.stringToHTML(9, 10);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Bord":
                output += "&nbsp;Naam: " + this.stringToHTML(10, 5) + ", ";
                output += "Geaard: " + this.checkboxToHTML(1);
                break;
            case "Drukknop":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Type: " + this.selectToHTML(16, ["standaard", "dimmer", "rolluik"]);
                output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
                output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
                output += ", Afgeschermd: " + this.checkboxToHTML(19);
                output += ", Aantal armaturen: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
                output += ", Aantal knoppen per armatuur: " + this.selectToHTML(13, ["1", "2", "3", "4", "5", "6"]);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Stopcontact":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5) + ", ";
                output += "Geaard: " + this.checkboxToHTML(1) + ", ";
                output += "Kinderveiligheid: " + this.checkboxToHTML(2) + " ";
                output += "Halfwaterdicht: " + this.checkboxToHTML(20) + ", ";
                output += "Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6"]);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Boiler":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5) + ", ";
                output += "Accumulatie: " + this.checkboxToHTML(3);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Ketel":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Type: " + this.selectToHTML(16, ["", "Met boiler", "Met tapspiraal", "Warmtekrachtkoppeling", "Warmtewisselaar"]);
                output += ", Energiebron: " + this.selectToHTML(17, ["", "Elektriciteit", "Gas (atmosferisch)", "Gas (ventilator)", "Vaste brandstof", "Vloeibare brandstof"]);
                output += ", Warmte functie: " + this.selectToHTML(18, ["", "Koelend", "Verwarmend", "Verwarmend en koelend"]);
                output += ", Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Lichtpunt":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5) + ", ";
                output += "Type: " + this.selectToHTML(16, ["standaard", "TL", "spot", "led" /*, "Spot", "Led", "Signalisatielamp" */]) + ", ";
                if (this.keys[16][2] == "TL") {
                    output += "Aantal buizen: " + this.selectToHTML(13, ["1", "2", "3", "4"]) + ", ";
                }
                output += "Aantal lampen: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]) + ", ";
                output += "Wandlamp: " + this.checkboxToHTML(19) + ", ";
                output += "Halfwaterdicht: " + this.checkboxToHTML(20) + ", ";
                output += "Ingebouwde schakelaar: " + this.checkboxToHTML(21) + ", ";
                output += "Noodverlichting: " + this.selectToHTML(17, ["Geen", "Centraal", "Decentraal"]);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Lichtcircuit":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", " + this.selectToHTML(5, ["enkelpolig", "dubbelpolig", "dubbelaansteking", "---", "schakelaar", "dimschakelaar", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat"]);
                output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
                if ((this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "kruis_enkel") ||
                    (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "dubbel") ||
                    (this.keys[5][2] == "dimschakelaar")) {
                    output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
                    output += ", Signalisatielampje: " + this.checkboxToHTML(19);
                    if (this.keys[5][2] != "dimschakelaar") {
                        output += ", Trekschakelaar: " + this.checkboxToHTML(25);
                    }
                }
                switch (this.getKey("lichtkring_poligheid")) {
                    case "enkelpolig":
                        output += ", Aantal schakelaars: " + this.selectToHTML(4, ["0", "1", "2", "3", "4", "5"]);
                        break;
                    case "dubbelpolig":
                        output += ", Aantal schakelaars: " + this.selectToHTML(4, ["0", "1", "2"]);
                        break;
                }
                output += ", Aantal lichtpunten: " + this.selectToHTML(13, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Schakelaars":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", " + this.selectToHTML(5, ["enkelpolig", "dubbelpolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);
                if ((this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "kruis_enkel") ||
                    (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
                    (this.keys[5][2] == "dimschakelaar") || (this.keys[5][2] == "rolluikschakelaar")) {
                    output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
                }
                if ((this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "kruis_enkel") ||
                    (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
                    (this.keys[5][2] == "dimschakelaar")) {
                    output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
                    output += ", Signalisatielampje: " + this.checkboxToHTML(19);
                    if (this.keys[5][2] != "dimschakelaar") {
                        output += ", Trekschakelaar: " + this.checkboxToHTML(25);
                    }
                }
                switch (this.getKey("lichtkring_poligheid")) {
                    case "enkelpolig":
                        output += ", Aantal schakelaars: " + this.selectToHTML(4, ["1", "2", "3", "4", "5"]);
                        break;
                    case "dubbelpolig":
                        output += ", Aantal schakelaars: " + this.selectToHTML(4, ["1", "2"]);
                        break;
                }
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Domotica":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Tekst: " + this.stringToHTML(15, 10);
            case "Splitsing":
                break;
            case "Transformator":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Voltage: " + this.stringToHTML(14, 8);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "USB lader":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Verwarmingstoestel":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Accumulatie: " + this.checkboxToHTML(3);
                if (this.getKey("accumulatie")) {
                    output += ", Ventilator: " + this.checkboxToHTML(6);
                }
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Vrije tekst":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Tekst: " + this.stringToHTML(15, 10);
                output += ", Type: " + this.selectToHTML(16, ["", "verbruiker", "zonder kader"]);
                output += ", Horizontale alignering: " + this.selectToHTML(17, ["links", "centreer", "rechts"]);
                output += ", Vet: " + this.checkboxToHTML(19);
                output += ", Schuin: " + this.checkboxToHTML(20);
                output += ", Breedte: " + this.stringToHTML(22, 3);
                if (this.keys[16][2] != "zonder kader")
                    output += ", Adres/tekst: " + this.stringToHTML(23, 2);
                break;
            case "Zonnepaneel":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5) + ", ";
                output += " Aantal: " + this.selectToHTML(4, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
                    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"]);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            case "Meerdere vebruikers":
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
            default:
                output += "&nbsp;Nr: " + this.stringToHTML(10, 5);
                output += ", Adres/tekst: " + this.stringToHTML(15, 5);
                break;
        }
        //output += "id: " + this.id + " parent: " + this.parent;
        return (output);
    };
    Electro_Item.prototype.toSVGswitches = function (hasChild, mySVG) {
        var outputstr = "";
        var elements = new Array();
        var halfwaterdicht = new Array();
        var verklikkerlamp = new Array();
        var signalisatielamp = new Array();
        var trekschakelaar = new Array();
        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards
        switch (this.getKey("lichtkring_poligheid")) {
            case "wissel_enkel":
                elements.push("wissel_enkel");
                signalisatielamp.push(this.keys[19][2]);
                halfwaterdicht.push(this.keys[20][2]);
                verklikkerlamp.push(this.keys[21][2]);
                trekschakelaar.push(this.keys[25][2]);
                break;
            case "wissel_dubbel":
                elements.push("wissel_dubbel");
                signalisatielamp.push(this.keys[19][2]);
                halfwaterdicht.push(this.keys[20][2]);
                verklikkerlamp.push(this.keys[21][2]);
                trekschakelaar.push(this.keys[25][2]);
                break;
            case "kruis_enkel":
                elements.push("kruis_enkel");
                signalisatielamp.push(this.keys[19][2]);
                halfwaterdicht.push(this.keys[20][2]);
                verklikkerlamp.push(this.keys[21][2]);
                trekschakelaar.push(this.keys[25][2]);
                break;
            case "teleruptor":
                elements.push("teleruptor");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "bewegingsschakelaar":
                elements.push("bewegingsschakelaar");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "schemerschakelaar":
                elements.push("schemerschakelaar");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "schakelaar":
                elements.push("schakelaar");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "dimmer":
                elements.push("dimmer");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "relais":
                elements.push("relais");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "minuterie":
                elements.push("minuterie");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "thermostaat":
                elements.push("thermostaat");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "tijdschakelaar":
                elements.push("tijdschakelaar");
                signalisatielamp.push(false);
                halfwaterdicht.push(false);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "rolluikschakelaar":
                elements.push("rolluik");
                signalisatielamp.push(false);
                halfwaterdicht.push(this.keys[20][2]);
                verklikkerlamp.push(false);
                trekschakelaar.push(false);
                break;
            case "dubbelaansteking":
                elements.push("dubbelaansteking");
                signalisatielamp.push(this.keys[19][2]);
                halfwaterdicht.push(this.keys[20][2]);
                verklikkerlamp.push(this.keys[21][2]);
                trekschakelaar.push(this.keys[25][2]);
                break;
            case "dimschakelaar":
                elements.push("dimschakelaar");
                signalisatielamp.push(this.keys[19][2]);
                halfwaterdicht.push(this.keys[20][2]);
                verklikkerlamp.push(this.keys[25][2]);
                trekschakelaar.push(false);
                break;
            default: {
                if (this.getKey("aantal") == "0") {
                    //do nothing
                }
                else if (this.getKey("aantal") == "1") {
                    if (this.getKey("lichtkring_poligheid") == "enkelpolig") {
                        elements.push("enkel");
                    }
                    else if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
                        elements.push("dubbel");
                    }
                    signalisatielamp.push(this.keys[19][2]);
                    halfwaterdicht.push(this.keys[20][2]);
                    verklikkerlamp.push(this.keys[21][2]);
                    trekschakelaar.push(this.keys[25][2]);
                }
                else {
                    if (this.getKey("lichtkring_poligheid") == "enkelpolig") {
                        elements.push("wissel_enkel");
                        signalisatielamp.push(this.keys[19][2]);
                        halfwaterdicht.push(this.keys[20][2]);
                        verklikkerlamp.push(this.keys[21][2]);
                        trekschakelaar.push(this.keys[25][2]);
                        for (var i = 2; i < this.getKey("aantal"); i++) {
                            elements.push("kruis_enkel");
                            signalisatielamp.push(this.keys[19][2]);
                            halfwaterdicht.push(this.keys[20][2]);
                            verklikkerlamp.push(this.keys[21][2]);
                            trekschakelaar.push(this.keys[25][2]);
                        }
                        elements.push("wissel_enkel");
                        signalisatielamp.push(this.keys[19][2]);
                        halfwaterdicht.push(this.keys[20][2]);
                        verklikkerlamp.push(this.keys[21][2]);
                        trekschakelaar.push(this.keys[25][2]);
                    }
                    else if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
                        elements.push("wissel_dubbel");
                        signalisatielamp.push(this.keys[19][2]);
                        halfwaterdicht.push(this.keys[20][2]);
                        verklikkerlamp.push(this.keys[21][2]);
                        trekschakelaar.push(this.keys[25][2]);
                        elements.push("wissel_dubbel");
                        signalisatielamp.push(this.keys[19][2]);
                        halfwaterdicht.push(this.keys[20][2]);
                        verklikkerlamp.push(this.keys[21][2]);
                        trekschakelaar.push(this.keys[25][2]);
                    }
                }
            }
        }
        //--START CHANGE below old code which put a lot of lamps next to each other--
        /*for (var i=0; i<this.getKey("aantal2"); i++) {
          elements.push("lamp");
          halfwaterdicht.push(this.keys[20][2]);
          verklikkerlamp.push(this.keys[21][2]);
        }*/
        //--here new code which pushes the lamp only once and then puts for instance a "x5" next to it
        if (this.getKey("aantal2") >= 1) {
            elements.push("lamp");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
        }
        //--END CHANGE--
        var startx = 1;
        var endx = 0;
        for (i = 0; i < elements.length; i++) {
            switch (elements[i]) {
                case "enkel":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar_enkel" x="' + endx + '" y="25" />';
                    if (signalisatielamp[i])
                        outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
                    if (halfwaterdicht[i])
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                    if (verklikkerlamp[i])
                        outputstr += '<line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="28" y2="22" stroke="black" />';
                    if (trekschakelaar[i])
                        outputstr += '<line x1="' + (endx + 10.5) + '" x2="' + (endx + 10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 12.5) + '" y1="15" y2="11" stroke="black" />';
                    startx = endx + 5;
                    break;
                case "dubbel":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar_dubbel" x="' + endx + '" y="25" />';
                    if (signalisatielamp[i])
                        outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
                    if (halfwaterdicht[i]) {
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                    }
                    if (verklikkerlamp[i]) {
                        outputstr += '<line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="28" y2="22" stroke="black" />';
                    }
                    ;
                    if (trekschakelaar[i])
                        outputstr += '<line x1="' + (endx + 8.5) + '" x2="' + (endx + 8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx + 8.5) + '" x2="' + (endx + 6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx + 8.5) + '" x2="' + (endx + 10.5) + '" y1="19" y2="15" stroke="black" />';
                    startx = endx + 5;
                    break;
                case "dubbelaansteking":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar_dubbelaansteking" x="' + endx + '" y="25" />';
                    if (signalisatielamp[i])
                        outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
                    if (halfwaterdicht[i]) {
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                    }
                    if (verklikkerlamp[i]) {
                        outputstr += '<line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="28" y2="22" stroke="black" />';
                    }
                    ;
                    if (trekschakelaar[i])
                        outputstr += '<line x1="' + (endx + 10.5) + '" x2="' + (endx + 10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 12.5) + '" y1="15" y2="11" stroke="black" />';
                    startx = endx + 5;
                    break;
                case "wissel_enkel":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar_wissel_enkel" x="' + endx + '" y="25" />';
                    if (signalisatielamp[i])
                        outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
                    if (halfwaterdicht[i]) {
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                    }
                    if (verklikkerlamp[i]) {
                        outputstr += '<line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="28" y2="22" stroke="black" />';
                    }
                    ;
                    if (trekschakelaar[i])
                        outputstr += '<line x1="' + (endx + 10.5) + '" x2="' + (endx + 10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 12.5) + '" y1="15" y2="11" stroke="black" />';
                    startx = endx + 5;
                    lowerbound = Math.max(lowerbound, 35);
                    break;
                case "wissel_dubbel":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar_wissel_dubbel" x="' + endx + '" y="25" />';
                    if (signalisatielamp[i])
                        outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
                    if (halfwaterdicht[i]) {
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                    }
                    if (verklikkerlamp[i]) {
                        outputstr += '<line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="28" y2="22" stroke="black" />';
                    }
                    ;
                    if (trekschakelaar[i])
                        outputstr += '<line x1="' + (endx + 8.5) + '" x2="' + (endx + 8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx + 8.5) + '" x2="' + (endx + 6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx + 8.5) + '" x2="' + (endx + 10.5) + '" y1="19" y2="15" stroke="black" />';
                    startx = endx + 5;
                    lowerbound = Math.max(lowerbound, 35);
                    break;
                case "kruis_enkel":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar_kruis_enkel" x="' + endx + '" y="25" />';
                    if (signalisatielamp[i])
                        outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
                    if (halfwaterdicht[i]) {
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                    }
                    if (verklikkerlamp[i]) {
                        outputstr += '<line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="28" y2="22" stroke="black" />';
                    }
                    ;
                    if (trekschakelaar[i])
                        outputstr += '<line x1="' + (endx + 10.5) + '" x2="' + (endx + 10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx + 10.5) + '" x2="' + (endx + 12.5) + '" y1="15" y2="11" stroke="black" />';
                    startx = endx + 5;
                    lowerbound = Math.max(lowerbound, 35);
                    break;
                case "dimschakelaar":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar_enkel_dim" x="' + endx + '" y="25" />';
                    if (signalisatielamp[i])
                        outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx - 10) + '" y="25" />';
                    if (halfwaterdicht[i]) {
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                    }
                    if (verklikkerlamp[i]) {
                        outputstr += '<line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx - 3) + '" x2="' + (endx + 3) + '" y1="28" y2="22" stroke="black" />';
                    }
                    ;
                    startx = endx + 5;
                    break;
                case "bewegingsschakelaar":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#relais" x="' + endx + '" y="25" />';
                    outputstr += '<use xlink:href="#moving_man" x="' + (endx + 1.5) + '" y="20" />';
                    startx = endx + 40;
                    lowerbound = Math.max(lowerbound, 30);
                    break;
                case "schakelaar":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar" x="' + endx + '" y="25" />';
                    startx = endx + 40;
                    break;
                case "schemerschakelaar":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schemerschakelaar" x="' + endx + '" y="25" />';
                    startx = endx + 40;
                    break;
                case "teleruptor":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#teleruptor" x="' + endx + '" y="25" />';
                    startx = endx + 40;
                    lowerbound = Math.max(lowerbound, 30);
                    break;
                case "dimmer":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#dimmer" x="' + endx + '" y="25" />';
                    startx = endx + 40;
                    lowerbound = Math.max(lowerbound, 30);
                    break;
                case "relais":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#relais" x="' + endx + '" y="25" />';
                    startx = endx + 40;
                    lowerbound = Math.max(lowerbound, 30);
                    break;
                case "minuterie":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#minuterie" x="' + endx + '" y="25" />';
                    startx = endx + 40;
                    lowerbound = Math.max(lowerbound, 30);
                    break;
                case "thermostaat":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#thermostaat" x="' + endx + '" y="25" />';
                    startx = endx + 40;
                    lowerbound = Math.max(lowerbound, 30);
                    break;
                case "tijdschakelaar":
                    endx = startx + 20;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#tijdschakelaar" x="' + endx + '" y="25" />';
                    startx = endx + 40;
                    lowerbound = Math.max(lowerbound, 30);
                    break;
                case "rolluik":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#schakelaar_rolluik" x="' + endx + '" y="25" />';
                    if (halfwaterdicht[i]) {
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                    }
                    startx = endx + 8;
                    lowerbound = Math.max(lowerbound, 25);
                    break;
                case "lamp":
                    endx = startx + 30;
                    outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
                    //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
                    outputstr += '<use xlink:href="#lamp" x="' + endx + '" y="25" />';
                    var print_str_upper = "";
                    if (this.keys[20][2]) {
                        print_str_upper = "h";
                        if (parseInt(this.keys[13][2]) > 1) { // Meer dan 1 lamp
                            print_str_upper += ", x" + this.keys[13][2];
                        }
                    }
                    else if (parseInt(this.keys[13][2]) > 1) {
                        print_str_upper = "x" + this.keys[13][2];
                    }
                    //if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
                    if (print_str_upper != "") {
                        outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
                    }
                    if ((i < elements.length - 1) || ((i == elements.length - 1) && (hasChild))) {
                        outputstr += '<line x1="' + endx + '" y1="25" x2="' + (endx + 10) + '" y2="25" stroke="black" />';
                    }
                    startx = endx + 10;
                    lowerbound = Math.max(lowerbound, 29);
                    break;
            }
        }
        //mySVG.xright = 10 + elements.length*35 - 1; //we take off "1" as xleft is already "1"
        endx = startx - 2;
        mySVG.xright = endx;
        //Place adred underneath
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
            outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="' + (25 + lowerbound) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-size="10">' + htmlspecialchars(this.keys[15][2]) + '</text>';
            mySVG.ydown += Math.max(0, lowerbound - 20);
        }
        return (outputstr);
    };
    Electro_Item.prototype.toSVG = function (hasChild) {
        if (hasChild === void 0) { hasChild = false; }
        var mySVG = new SVGelement();
        var outputstr = "";
        mySVG.data = "";
        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 20;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        switch (this.keys[0][2]) {
            case "Stopcontact":
                var startx = 1;
                for (var i = 0; i < this.getKey("aantal"); i++) {
                    outputstr += '<use xlink:href="#stopcontact" x="' + startx + '" y="25"></use>';
                    if (this.getKey("geaard"))
                        outputstr += '<use xlink:href="#stopcontact_aarding" x="' + startx + '" y="25"></use>';
                    if (this.getKey("kinderveiligheid"))
                        outputstr += '<use xlink:href="#stopcontact_kinderveilig" x="' + startx + '" y="25"></use>';
                    startx += 20;
                }
                //--check halfwaterdicht--
                if (this.keys[20][2])
                    outputstr += '<text x="25" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
                if (hasChild) {
                    outputstr += '<line x1="' + startx + '" y1="25" x2="' + (startx + 21) + '" y2="25" stroke="black" />';
                }
                ;
                mySVG.xright = 20 + this.getKey("aantal") * 20;
                //-- Plaats adres onderaan --
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Bel":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#bel" x="21" y="25"></use>';
                mySVG.xright = 40;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="58" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 14;
                }
                break;
            case "Boiler":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                switch (this.getKey("accumulatie")) {
                    case false:
                        outputstr += '<use xlink:href="#boiler" x="21" y="25"></use>';
                        break;
                    case true:
                        outputstr += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
                        break;
                }
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Diepvriezer":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#diepvriezer" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Droogkast":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#droogkast" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Drukknop":
                var printstr = "";
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#drukknop" x="21" y="25"></use>';
                var aantal_knoppen = this.getKey("aantal");
                if (this.keys[21][2]) { //met verklikkerlampje
                    outputstr += '<line x1="28" y1="20" x2="38" y2="30" stroke="black"></line>'; // midden 33, 25, lengte 7
                    outputstr += '<line x1="28" y1="30" x2="38" y2="20" stroke="black"></line>';
                }
                if (this.keys[19][2]) { //afgeschermd
                    outputstr += '<line x1="26" y1="10" x2="40" y2="10" stroke="black"></line>'; // midden 33, 25 lengte 7
                    outputstr += '<line x1="26" y1="10" x2="26" y2="15" stroke="black"></line>';
                    outputstr += '<line x1="40" y1="10" x2="40" y2="15" stroke="black"></line>';
                    outputstr += '<line x1="22" y1="15" x2="26" y2="15" stroke="black"></line>';
                    outputstr += '<line x1="40" y1="15" x2="44" y2="15" stroke="black"></line>';
                }
                //-- Plaats tekst voor "h" en/of aantal armaturen onderaan --
                if (this.keys[20][2])
                    printstr += 'h';
                if (aantal_knoppen > 1) {
                    if (printstr != '') {
                        printstr += ', ';
                    }
                    printstr += 'x' + aantal_knoppen;
                }
                if (printstr != '')
                    outputstr += '<text x="33" y="49" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(printstr) + '</text>';
                //-- Plaats tekst voor aantal knoppen --
                if (this.keys[13][2] > 1) {
                    outputstr += '<text x="44" y="13" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.keys[13][2]) + '</text>';
                    outputstr += '<line x1="39" y1="19" x2="44" y2="14" stroke="black" />';
                }
                //-- Extra tekens voor rolluik of dimmer --
                switch (this.keys[16][2]) {
                    case "dimmer":
                        outputstr += '<polygon points="18,20 18,13 28,20" fill="black" stroke="black" />';
                        break;
                    case "rolluik":
                        outputstr += '<polygon points="18,15 22,15 20,12" fill="black" stroke="black" />';
                        outputstr += '<polygon points="18,17 22,17 20,20" fill="black" stroke="black" />';
                        break;
                    default:
                }
                //-- Bereken correcte breedte
                mySVG.xright = 44;
                //-- Plaats adres onderaan --
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    if (printstr != '') {
                        outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="65" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                        mySVG.ydown += 20;
                    }
                    else {
                        outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="49" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                        mySVG.ydown += 5;
                    }
                }
                break;
            case "Elektriciteitsmeter":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#elektriciteitsmeter" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Elektrische oven":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#oven" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Ketel":
                var shifty = 0;
                if (this.keys[4][2] > 1) {
                    shifty = 15;
                    outputstr += '<text x="41" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.keys[4][2]) + '</text>';
                }
                outputstr += '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>';
                outputstr += '<use xlink:href="#verbruiker" x="21" y="' + (shifty + 25) + '"></use>';
                switch (this.keys[16][2]) {
                    case "Met tapspiraal":
                        outputstr += '<line x1="21" y1="' + (shifty + 15) + '" x2="61" y2="' + (shifty + 7) + '" stroke="black" />';
                        outputstr += '<line x1="21" y1="' + (shifty + 15) + '" x2="61" y2="' + (shifty + 23) + '" stroke="black" />';
                        break;
                    case "Met boiler":
                        outputstr += '<rect x="31" y="' + (shifty + 10) + '" width="20" height="10" stroke="black" fill="white" />';
                        break;
                    case "Warmtewisselaar":
                        outputstr += '<line x1="26" y1="' + (shifty + 0) + '" x2="26" y2="' + (shifty + 5) + '" stroke="black" />';
                        outputstr += '<line x1="56" y1="' + (shifty + 0) + '" x2="56" y2="' + (shifty + 5) + '" stroke="black" />';
                        outputstr += '<line x1="26" y1="' + (shifty + 5) + '" x2="33.5" y2="' + (shifty + 23) + '" stroke="black" />';
                        outputstr += '<line x1="56" y1="' + (shifty + 5) + '" x2="48.5" y2="' + (shifty + 23) + '" stroke="black" />';
                        outputstr += '<line x1="33.5" y1="' + (shifty + 23) + '" x2="41" y2="' + (shifty + 14) + '" stroke="black" />';
                        outputstr += '<line x1="48.5" y1="' + (shifty + 23) + '" x2="41" y2="' + (shifty + 14) + '" stroke="black" />';
                        break;
                    case "Warmtekrachtkoppeling":
                        outputstr += '<circle cx="41" cy="' + (shifty + 16) + '" r="7" style="stroke:black;fill:none" />';
                        outputstr += '<text x="41" y="' + (shifty + 17) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">G</text>';
                        break;
                }
                //Waar gaan we de andere symbolen plaatsen, indien slechts 1, midden onderaan, zoniet links en rechts
                var shift_symbol_energiebron = 41;
                var shift_symbol_warmtefunctie = 41;
                if ((this.keys[17][2] != "") && (this.keys[18][2] != "")) {
                    var shift_symbol_energiebron = 31;
                    var shift_symbol_warmtefunctie = 51;
                }
                switch (this.keys[17][2]) {
                    case "Gas (ventilator)":
                        outputstr += '<use xlink:href="#gas_ventilator" x="' + (shift_symbol_energiebron) + '" y="' + (shifty + 35) + '"/>';
                        break;
                    case "Gas (atmosferisch)":
                        outputstr += '<use xlink:href="#gas_atmosferisch" x="' + (shift_symbol_energiebron) + '" y="' + (shifty + 35) + '"/>';
                        break;
                    case "Elektriciteit":
                        outputstr += '<use xlink:href="#bliksem" x="' + (shift_symbol_energiebron) + '" y="' + (shifty + 35) + '"/>';
                        break;
                    case "Vaste brandstof":
                        outputstr += '<rect x="' + (shift_symbol_energiebron - 6) + '" y="' + (shifty + 29) + '" width="12" height="12" style="stroke:black;fill:black" />';
                        break;
                    case "Vloeibare brandstof":
                        outputstr += '<circle cx="' + (shift_symbol_energiebron) + '" cy="' + (shifty + 35) + '" r="6" style="stroke:black;fill:black" />';
                        break;
                }
                switch (this.keys[18][2]) {
                    case "Verwarmend":
                        outputstr += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+</text>';
                        break;
                    case "Koelend":
                        outputstr += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">-</text>';
                        break;
                    case "Verwarmend en koelend":
                        outputstr += '<text x="' + (shift_symbol_warmtefunctie - 1) + '" y="' + (shifty + 36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+/-</text>';
                        break;
                }
                mySVG.xright = 60;
                mySVG.yup += shifty;
                //Place adres underneath
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="' + (shifty + 60) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-size="10">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Koelkast":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#koelkast" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Kookfornuis":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#kookfornuis" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Microgolfoven":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#microgolf" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Motor":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#motor" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Omvormer":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#omvormer" x="21" y="25"></use>';
                mySVG.xright = 80;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="55" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 10;
                }
                break;
            case "Leeg":
            case "Aansluitpunt":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#aansluitpunt" x="21" y="25"></use>';
                mySVG.xright = 29;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="45" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 0;
                }
                break;
            case "Aftakdoos":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#aftakdoos" x="21" y="25"></use>';
                mySVG.xright = 49;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="55" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 10;
                }
                break;
            case "Lichtcircuit":
                outputstr += this.toSVGswitches(hasChild, mySVG);
                break;
            case "Lichtpunt":
                outputstr += '<line x1="0" x2="30" y1="25" y2="25" stroke="black" />';
                var print_str_upper = "";
                if (this.keys[20][2]) {
                    print_str_upper = "h";
                    if (parseInt(this.keys[4][2]) > 1) { // Meer dan 1 lamp
                        print_str_upper += ", x" + this.keys[4][2];
                    }
                }
                else if (parseInt(this.keys[4][2]) > 1) {
                    print_str_upper = "x" + this.keys[4][2];
                }
                switch (this.keys[16][2]) {
                    case "led":
                        outputstr += '<use xlink:href="#led" x="' + 30 + '" y="25" />';
                        if (this.keys[19][2]) {
                            outputstr += '<line x1="30" y1="35" x2="42" y2="35" stroke="black" />';
                        }
                        //determine positioning of emergency symbol and draw it
                        var noodxpos;
                        var textxpos;
                        if (print_str_upper == "") {
                            noodxpos = 36;
                            textxpos = 36; // not used
                        }
                        else {
                            noodxpos = 20;
                            if ((print_str_upper.length > 2) && ((this.keys[17][2] == "Centraal") || (this.keys[17][2] == "Decentraal"))) {
                                textxpos = 40;
                            }
                            else {
                                textxpos = 36;
                            }
                        }
                        ;
                        if (print_str_upper != "") {
                            outputstr += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
                        }
                        if (this.keys[21][2]) {
                            outputstr += '<line x1="42" y1="25" x2="45.75" y2="17.5" stroke="black" />';
                            outputstr += '<line x1="45.75" y1="17.5" x2="48.25" y2="18.75" stroke="black" />';
                        }
                        var noodypos = 6.5;
                        switch (this.keys[17][2]) {
                            case "Centraal":
                                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                break;
                            case "Decentraal":
                                outputstr += '<rect x="' + (noodxpos - 5.6) + '" y="' + (noodypos - 5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />';
                                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                break;
                            default:
                                break;
                        }
                        mySVG.xright = 42;
                        //-- Plaats adres onderaan --
                        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                            outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 23) + '" y="50" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                            mySVG.ydown += 5;
                        }
                        break;
                    case "spot":
                        outputstr += '<use xlink:href="#spot" x="' + 30 + '" y="25" />';
                        if (this.keys[19][2]) {
                            outputstr += '<line x1="30" y1="38" x2="46" y2="38" stroke="black" />';
                        }
                        //determine positioning of emergency symbol and draw it
                        var noodxpos;
                        var textxpos;
                        if (print_str_upper == "") {
                            noodxpos = 40;
                            textxpos = 40; // not used
                        }
                        else {
                            noodxpos = 24;
                            if ((print_str_upper.length > 2) && ((this.keys[17][2] == "Centraal") || (this.keys[17][2] == "Decentraal"))) {
                                textxpos = 44;
                            }
                            else {
                                textxpos = 40;
                            }
                        }
                        ;
                        if (print_str_upper != "") {
                            outputstr += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
                        }
                        if (this.keys[21][2]) {
                            outputstr += '<line x1="46" y1="25" x2="49.75" y2="17.5" stroke="black" />';
                            outputstr += '<line x1="49.75" y1="17.5" x2="52.25" y2="18.75" stroke="black" />';
                        }
                        var noodypos = 6.5;
                        switch (this.keys[17][2]) {
                            case "Centraal":
                                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                break;
                            case "Decentraal":
                                outputstr += '<rect x="' + (noodxpos - 5.6) + '" y="' + (noodypos - 5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />';
                                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                break;
                            default:
                                break;
                        }
                        mySVG.xright = 45;
                        //-- Plaats adres onderaan --
                        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                            outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 25) + '" y="52" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                            mySVG.ydown += 7;
                        }
                        break;
                    case "TL":
                        var aantal_buizen = this.keys[13][2];
                        var starty = 25 - (aantal_buizen) * 3.5;
                        var endy = 25 + (aantal_buizen) * 3.5;
                        outputstr += '<line x1="30" y1="' + starty + '" x2="30" y2="' + endy + '" stroke="black" stroke-width="2" />';
                        outputstr += '<line x1="90" y1="' + starty + '" x2="90" y2="' + endy + '" stroke="black" stroke-width="2" />';
                        for (var i = 0; i < aantal_buizen; i++) {
                            outputstr += '<line x1="30" y1="' + (starty + (i * 7) + 3.5) + '" x2="90" y2="' + (starty + (i * 7) + 3.5) + '" stroke="black" stroke-width="2" />';
                        }
                        if (this.keys[19][2]) {
                            outputstr += '<line x1="50" y1="' + (27 + (aantal_buizen * 3.5)) + '" x2="70" y2="' + (27 + (aantal_buizen * 3.5)) + '" stroke="black" />';
                        }
                        if (print_str_upper != "") {
                            outputstr += '<text x="60" y="' + (25 - (aantal_buizen * 3.5)) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
                        }
                        if (this.keys[21][2]) {
                            outputstr += '<line x1="77.5" y1="' + (29 - (aantal_buizen * 3.5)) + '" x2="85" y2="' + (14 - (aantal_buizen * 3.5)) + '" stroke="black" />';
                            outputstr += '<line x1="85" y1="' + (14 - (aantal_buizen * 3.5)) + '" x2="90" y2="' + (16.5 - (aantal_buizen * 3.5)) + '" stroke="black" />';
                        }
                        //determine positioning of emergency symbol and draw it
                        var noodxpos;
                        if (print_str_upper == "") {
                            noodxpos = 60;
                        }
                        else {
                            noodxpos = 39;
                        }
                        ;
                        var noodypos = (25 - (aantal_buizen * 3.5) - 5);
                        switch (this.keys[17][2]) {
                            case "Centraal":
                                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                break;
                            case "Decentraal":
                                outputstr += '<rect x="' + (noodxpos - 5.6) + '" y="' + (noodypos - 5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />';
                                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos - 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos + 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                outputstr += '<line x1="' + (noodxpos + 5.6) + '" y1="' + (noodypos - 5.6) + '" x2="' + (noodxpos - 5.6) + '" y2="' + (noodypos + 5.6) + '" style="stroke:black;fill:black" />';
                                break;
                        }
                        mySVG.xright = 90;
                        //-- Plaats adres onderaan --
                        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                            outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 23) + '" y="' + (endy + 13) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                            mySVG.ydown = Math.max(mySVG.ydown, endy + 18 - 25);
                        }
                        break;
                    default:
                        switch (this.keys[17][2]) {
                            case "Centraal":
                                outputstr += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                                outputstr += '<circle cx="30" cy="25" r="5" style="stroke:black;fill:black" />';
                                if (hasChild) {
                                    outputstr += '<line x1="' + 30 + '" y1="25" x2="' + (30 + 10) + '" y2="25" stroke="black" />';
                                }
                                break;
                            case "Decentraal":
                                outputstr += '<use xlink:href="#noodlamp_decentraal" x="' + 30 + '" y="25" />';
                                if (this.keys[21][2]) { //Ingebouwde schakelaar
                                    outputstr += '<line x1="37" y1="18" x2="40" y2="15" stroke="black" stroke-width="2" />';
                                }
                                break;
                            default:
                                outputstr += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                                if (hasChild) {
                                    outputstr += '<line x1="' + 30 + '" y1="25" x2="' + (30 + 10) + '" y2="25" stroke="black" />';
                                }
                                break;
                        }
                        if (print_str_upper != "") {
                            outputstr += '<text x="30" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
                        }
                        if (this.keys[19][2]) {
                            outputstr += '<line x1="20" y1="40" x2="40" y2="40" stroke="black" />';
                        }
                        if (this.keys[21][2]) {
                            outputstr += '<line x1="40" y1="15" x2="45" y2="20" stroke="black" stroke-width="2" />';
                        }
                        mySVG.xright = 39;
                        //-- Plaats adres onderaan --
                        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                            outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 20) + '" y="54" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                            mySVG.ydown += 10;
                        }
                        break;
                }
                break;
            case "Schakelaars":
                this.setKey("aantal2", 0);
                outputstr += this.toSVGswitches(hasChild, mySVG);
                break;
            case "Transformator":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#transformator" x="21" y="25"></use>';
                outputstr += '<text x="35" y="44" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                    htmlspecialchars(this.getKey("voltage")) + "</text>";
                mySVG.xright = 48;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="58" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "USB lader":
                var shifty = 0;
                if (this.keys[4][2] > 1) {
                    shifty = 12;
                    outputstr += '<text x="51" y="14" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.keys[4][2]) + '</text>';
                }
                outputstr += '<line x1="1" y1="' + (shifty + 25) + '" x2="21" y2="' + (shifty + 25) + '" stroke="black"></line>';
                outputstr += '<use xlink:href="#usblader" x="21" y="' + (shifty + 25) + '"></use>';
                mySVG.xright = 80;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="' + (shifty + 55) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 10;
                }
                mySVG.yup += shifty;
                break;
            case "Vaatwasmachine":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#vaatwasmachine" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Ventilator":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#ventilator" x="21" y="25"></use>';
                mySVG.xright = 50;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="55" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 10;
                }
                break;
            case "Verwarmingstoestel":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                mySVG.xright = 70;
                switch (this.getKey("accumulatie")) {
                    case false:
                        outputstr += '<use xlink:href="#verwarmingstoestel" x="21" y="25"></use>';
                        break;
                    case true:
                        switch (this.getKey("ventilator")) {
                            case false:
                                outputstr += '<use xlink:href="#verwarmingstoestel_accu" x="21" y="25"></use>';
                                break;
                            case true:
                                outputstr += '<use xlink:href="#verwarmingstoestel_accu_ventilator" x="21" y="25"></use>';
                                mySVG.xright = 95;
                                break;
                        }
                        break;
                }
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="55" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 10;
                }
                break;
            case "Vrije tekst":
                var width;
                if (isNaN(Number(this.keys[22][2]))) {
                    width = 40;
                }
                else {
                    if (Number(this.keys[22][2] == "")) {
                        width = 40;
                    }
                    else {
                        width = Math.max(Number(this.keys[22][2]) * 1, 1);
                    }
                }
                var options = "";
                if (this.keys[19][2])
                    options += ' font-weight="bold"';
                if (this.keys[20][2])
                    options += ' font-style="italic"';
                //width = Math.max(this.getKey("commentaar").length * 8, width)
                switch (this.keys[16][2]) {
                    case "zonder kader":
                        break;
                    default:
                        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black" />';
                        outputstr += '<rect x="21" y="5" width="' + width + '" height="40" fill="none" style="stroke:black" />';
                        if (!(/^\s*$/.test(this.keys[23][2]))) { //check if adres contains only white space
                            outputstr += '<text x="' + (21 + width / 2) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[23][2]) + '</text>';
                            mySVG.ydown += 15;
                        }
                        break;
                }
                switch (this.keys[17][2]) {
                    case "links":
                        outputstr += '<text x="' + (20 + 5) + '" y="28" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10"' + options + '>' + htmlspecialchars(this.getKey("commentaar")) + '</text>';
                        mySVG.xright = 20 + width;
                        break;
                    case "rechts":
                        outputstr += '<text x="' + (20 + width - 4) + '" y="28" style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10"' + options + '>' + htmlspecialchars(this.getKey("commentaar")) + '</text>';
                        mySVG.xright = 20 + width;
                        break;
                    default:
                        outputstr += '<text x="' + (21 + width / 2) + '" y="28" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"' + options + '>' + htmlspecialchars(this.getKey("commentaar")) + '</text>';
                        mySVG.xright = 20 + width;
                        break;
                }
                break;
            case "Wasmachine":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#wasmachine" x="21" y="25"></use>';
                mySVG.xright = 60;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
            case "Zonnepaneel":
                outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                outputstr += '<use xlink:href="#zonnepaneel" x="21" y="25"></use>';
                outputstr += '<text x="60" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.keys[4][2]) + 'x</text>';
                mySVG.xright = 100;
                if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
                    outputstr += '<text x="' + ((mySVG.xright - 20) / 2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
                    mySVG.ydown += 15;
                }
                break;
        }
        mySVG.data = outputstr + "\n";
        return (mySVG);
    };
    return Electro_Item;
}(List_Item));
var Simple_Item = /** @class */ (function (_super) {
    __extends(Simple_Item, _super);
    function Simple_Item() {
        var _this = _super.call(this) || this;
        _this.keys.push(["name", "STRING", "no_name"]);
        return _this;
    }
    Simple_Item.prototype.toHTML = function () {
        var output = "";
        for (var i = 0; i < this.keys.length; i++) {
            switch (this.keys[i][1]) {
                case "STRING": {
                    output += this.keys[i][0] + ": ";
                    var myId = "HL_edit_" + this.id + "_" + this.keys[i][0];
                    output += "<input id=\"" + myId + "\" type=\"Text\" value=\"" + this.keys[i][2] + "\" onchange=HLUpdate(" + this.id + ",\"" + this.keys[i][0] + "\",\"" + myId + "\")>";
                    break;
                }
            }
        }
        //output += " <input id=\"HL_name_"+this.id+"\" type=\"Text\" value=\""+this.name+"\" onchange=\"HLChangeName("+this.id+")\">";
        output += " <button onclick=\"HLInsertBefore(" + this.id + ")\">InsertBefore</button>";
        output += " <button onclick=\"HLDelete(" + this.id + ")\">Delete</button>";
        output += " <button onclick=\"HLInsertAfter(" + this.id + ")\">Insert After</button>";
        output += "id: " + this.id + " parent: " + this.parent;
        return (output);
    };
    return Simple_Item;
}(List_Item));
var Properties = /** @class */ (function () {
    function Properties() {
        this.filename = "eendraadschema.eds";
    }
    ;
    Properties.prototype.setFilename = function (name) {
        this.filename = name;
    };
    return Properties;
}());
var Hierarchical_List = /** @class */ (function () {
    function Hierarchical_List() {
        this.length = 0;
        this.data = new Array();
        this.active = new Array();
        this.id = new Array();
        this.properties = new Properties();
        this.curid = 1;
        this.mode = "edit";
    }
    ;
    Hierarchical_List.prototype.getOrdinalById = function (my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                return (i);
            }
        }
    };
    Hierarchical_List.prototype.addItem = function (my_item) {
        //First set the correct identifyer
        my_item.id = this.curid;
        my_item.parent = 0;
        my_item.indent = 0;
        //Then push the data into the queue
        this.data.push(my_item);
        this.active.push(true);
        this.id.push(this.curid);
        //Adjust length of the queue and future identifyer
        this.curid += 1;
        this.length += 1;
    };
    Hierarchical_List.prototype.insertItemBeforeId = function (my_item, my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                //First set the correct identifyer
                my_item.id = this.curid;
                my_item.parent = this.data[i].parent;
                my_item.indent = this.data[i].indent;
                my_item.Parent_Item = this.data[this.getOrdinalById(my_item.parent)];
                my_item.collapsed = false;
                //my_item.updateConsumers(); //Needed to ensure we do not give options in the select-box that parent wouldn't allow
                //Insert the data
                this.data.splice(i, 0, my_item);
                this.active.splice(i, 0, true);
                this.id.splice(i, 0, this.curid);
                //Adjust length of the queue and future identifyer
                this.curid += 1;
                this.length += 1;
                break;
            }
        }
    };
    Hierarchical_List.prototype.insertItemAfterId = function (my_item, my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                //First set the correct identifyer
                my_item.id = this.curid;
                my_item.parent = this.data[i].parent;
                my_item.indent = this.data[i].indent;
                my_item.Parent_Item = this.data[this.getOrdinalById(my_item.parent)];
                my_item.collapsed = false;
                //my_item.updateConsumers(); //Needed to ensure we do not give options in the select-box that parent wouldn't allow
                //Insert the data
                this.data.splice(i + 1, 0, my_item);
                this.active.splice(i + 1, 0, true);
                this.id.splice(i + 1, 0, this.curid);
                //Adjust length of the queue and future identifyer
                this.curid += 1;
                this.length += 1;
                return (i + 1);
                break;
            }
        }
    };
    Hierarchical_List.prototype.insertChildAfterId = function (my_item, my_id) {
        var ordinal = this.insertItemAfterId(my_item, my_id);
        this.data[ordinal].parent = my_id;
        this.data[ordinal].indent = this.data[ordinal - 1].indent + 1;
        this.data[ordinal].Parent_Item = this.data[this.getOrdinalById(my_id)];
        //this.data[ordinal].resetKeys();
        //this.data[ordinal].updateConsumers(); //Needed to ensure we do not give options in the select-box that parent wouldn't allow
    };
    Hierarchical_List.prototype.MoveUp = function (my_id) {
        //-- First find the ordinal number of the current location and the desired location --
        var currentOrdinal = this.getOrdinalById(my_id);
        var newOrdinal = currentOrdinal;
        var currentparent = this.data[currentOrdinal].parent;
        for (var i = currentOrdinal - 1; i >= 0; i--) {
            if ((this.data[i].parent == currentparent) && (this.active[i])) {
                newOrdinal = i;
                break; //Leave the for loop
            }
        }
        //Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
        var swapItem = new List_Item();
        swapItem = this.data[currentOrdinal];
        this.data[currentOrdinal] = this.data[newOrdinal];
        this.data[newOrdinal] = swapItem;
        var swapID = this.id[currentOrdinal];
        this.id[currentOrdinal] = this.id[newOrdinal];
        this.id[newOrdinal] = swapID;
    };
    Hierarchical_List.prototype.MoveDown = function (my_id) {
        //-- First find the ordinal number of the current location and the desired location --
        var currentOrdinal = this.getOrdinalById(my_id);
        var newOrdinal = currentOrdinal;
        var currentparent = this.data[currentOrdinal].parent;
        for (var i = currentOrdinal + 1; i < this.length; i++) {
            if ((this.data[i].parent == currentparent) && (this.active[i])) {
                newOrdinal = i;
                break; //Leave the for loop
            }
        }
        //Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
        var swapItem = new List_Item();
        swapItem = this.data[currentOrdinal];
        this.data[currentOrdinal] = this.data[newOrdinal];
        this.data[newOrdinal] = swapItem;
        var swapID = this.id[currentOrdinal];
        this.id[currentOrdinal] = this.id[newOrdinal];
        this.id[newOrdinal] = swapID;
    };
    Hierarchical_List.prototype.deleteById = function (my_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.id[i] == my_id) {
                this.active[i] = false;
                for (var j = 0; j < this.length; j++) {
                    if (this.data[j].parent == my_id)
                        this.deleteById(this.id[j]);
                }
            }
        }
        //alert("Deleted id: " + my_id);
    };
    Hierarchical_List.prototype.toHTML = function (myParent) {
        var output = "";
        var numberDrawn = 0;
        //-- bovenaan de switch van editeer-mode (teken of verplaats) --
        if (myParent == 0) {
            switch (this.mode) {
                case "edit":
                    output += 'Modus (Invoegen/Verplaatsen) <select id="edit_mode" onchange="HL_editmode()"><option value="edit" selected>Invoegen</option><option value="move">Verplaatsen</option></select><br>';
                    break;
                case "move":
                    output += 'Modus (Invoegen/verplaatsen) <select id="edit_mode" onchange="HL_editmode()"><option value="edit">Invoegen</option><option value="move" selected>Verplaatsen</option></select>' +
                        '<span style="color:black"><i>&nbsp;Gebruik de pijlen om de volgorde van elementen te wijzigen. ' +
                        'Gebruik het Moeder-veld om een component elders in het schema te hangen.</i></span><br>';
                    break;
            }
            //-- plaats input box voor naam van het schema bovenaan --
            output += 'Bestandsnaam: <span id="settings"><code>' + this.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button></span><br><br>';
        }
        //--Teken het volledige schema in HTML--
        for (var i = 0; i < this.length; i++) {
            if (this.active[i] && (this.data[i].parent == myParent)) {
                numberDrawn++;
                if (this.data[i].collapsed) {
                    output += '<table class="html_edit_table"><tr><td bgcolor="#8AB2E4" onclick="HLCollapseExpand(' + this.data[i].id + ')" valign= "top">&#x229E;</td><td width="100%">';
                }
                else {
                    output += '<table class="html_edit_table"><tr><td bgcolor="#C0C0C0" onclick="HLCollapseExpand(' + this.data[i].id + ')" valign= "top">&#x229F;</td><td width="100%">';
                }
                switch (myParent) {
                    case 0: {
                        output += this.data[i].toHTML(structure.mode) + "<br>";
                        break;
                    }
                    default: {
                        output += this.data[i].toHTML(structure.mode, this.data[myParent]) + "<br>";
                        break;
                    }
                }
                if (!this.data[i].collapsed) {
                    output += this.toHTML(this.id[i]);
                }
                output += "</td></tr></table>";
            }
        }
        if ((myParent == 0) && (numberDrawn < 1)) {
            output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"opnieuw beginnen\"</button>"; //no need for the add button if we have items
        }
        return (output);
    };
    Hierarchical_List.prototype.outputSVGDefs = function () {
        var output = "\n    <defs>\n    <pattern id=\"VerticalStripe\"\n      x=\"5\" y=\"0\" width=\"5\" height=\"10\"\n      patternUnits=\"userSpaceOnUse\" >\n      <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"10\" stroke=\"black\" />\n    </pattern>\n    <g id=\"ster\">\n      <line x1=\"0\" y1=\"-5\" x2=\"0\" y2=\"5\" style=\"stroke:black\" />\n      <line x1=\"-4.33\" y1=\"-2.5\" x2=\"4.33\" y2=\"2.5\" style=\"stroke:black\" />\n      <line x1=\"-4.66\" y1=\"2.5\" x2=\"4.33\" y2=\"-2.5\" style=\"stroke:black\" />\n    </g>\n    <g id=\"sinus\">\n      <path d=\"M0,0 C2,-5 8,-5 10,0 S18,5 20,0\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"lamp\">\n      <line x1=\"-10.61\" y1=\"-10.61\" x2=\"10.61\" y2=\"10.61\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"-10.61\" y1=\"10.61\" x2=\"10.61\" y2=\"-10.61\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"led\">\n      <line x1=\"0\" y1=\"-7\" x2=\"0\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"-7\" x2=\"12\" y2=\"0\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"7\" x2=\"12\" y2=\"0\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"12\" y1=\"-7\" x2=\"12\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"6\" y1=\"-6\" x2=\"7\" y2=\"-11\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"7\" y1=\"-11\" x2=\"8.11\" y2=\"-9.34\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"7\" y1=\"-11\" x2=\"5.34\" y2=\"-9.9\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"9\" y1=\"-6\" x2=\"10\" y2=\"-11\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"10\" y1=\"-11\" x2=\"11.11\" y2=\"-9.34\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"10\" y1=\"-11\" x2=\"8.34\" y2=\"-9.9\" stroke=\"black\" stroke-width=\"1\" />\n    </g>\n    <g id=\"spot\">\n      <path d=\"M0 0 A10 10 0 0 1 10 -10\" stroke=\"black\" fill=\"white\" stroke-width=\"1\" />\n      <path d=\"M0 0 A10 10 0 0 0 10 10\" stroke=\"black\" fill=\"white\" stroke-width=\"1\" />\n      <circle cx=\"10\" cy=\"0\" r=\"6\" style=\"stroke:black;fill:white\" />\n      <line x1=\"5.76\" x2=\"14.24\" y1=\"-4.24\" y2=\"4.24\" stroke=\"black\" stroke-width=\"1\" />\n      <line x1=\"5.76\" x2=\"14.24\" y1=\"4.24\" y2=\"-4.24\" stroke=\"black\" stroke-width=\"1\" />\n    </g>\n    <g id=\"noodlamp_decentraal\">\n      <rect x=\"-10.61\" y=\"-10.61\" width=\"21.22\" height=\"21.22\" fill=\"white\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:black\" />\n      <line x1=\"-7\" y1=\"-7\" x2=\"7\" y2=\"7\" stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"-7\" y1=\"7\" x2=\"7\" y2=\"-7\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"signalisatielamp\">\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n      <line x1=\"-3\" y1=\"-3\" x2=\"3\" y2=\"3\" stroke=\"black\" />\n      <line x1=\"-3\" y1=\"3\" x2=\"3\" y2=\"-3\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_dubbel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_wissel_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_rolluik\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <rect x=\"-8\" y=\"-8\" width=\"16\" height=\"16\" fill=\"white\" stroke=\"black\" />\n      <text x=\"0\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"16\">S</text>\n    </g>\n    <g id=\"schakelaar_enkel_dim\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n      <polygon points=\"-1,-8 11,-8 11,-15\" fill=\"black\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_kruis_enkel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"20\" x2=\"15\" y2=\"17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_dubbelaansteking\">\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"-20\" x2=\"-15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"schakelaar_wissel_dubbel\">\n      <line x1=\"0\" y1=\"0\" x2=\"10\" y2=\"-20\" stroke=\"black\" />\n      <line x1=\"10\" y1=\"-20\" x2=\"15\" y2=\"-17.5\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"-16\" x2=\"13\" y2=\"-13.5\" stroke=\"black\" />\n      <line x1=\"0\" y1=\"0\" x2=\"-10\" y2=\"20\" stroke=\"black\" />\n      <line x1=\"-10\" y1=\"20\" x2=\"-15\" y2=\"17.5\" stroke=\"black\" />\n      <line x1=\"-8\" y1=\"16\" x2=\"-13\" y2=\"13.5\" stroke=\"black\" />\n      <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"aansluitpunt\">\n      <circle cx=\"5\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"aftakdoos\">\n      <circle cx=\"15\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"15\" cy=\"0\" r=\"7.5\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"bewegingsschakelaar\">\n      <rect x=\"0\" y=\"-13\" width=\"10\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"10\" y=\"-13\" width=\"30\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"13\" x2=\"40\" y2=\"-13\"  stroke=\"black\" />\n      <line x1=\"15\" y1=\"-5\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"20\" y1=\"-10\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"20\" y1=\"-10\" x2=\"25\" y2=\"-10\"  stroke=\"black\" />\n      <text x=\"22\" y=\"11\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"10\">PIR</text>\n    </g>\n    <g id=\"schakelaar\">\n      <line x1=\"0\" y1=\"0\" x2=\"5\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"5\" y1=\"0\" x2=\"35\" y2=\"-10\"  stroke=\"black\" />\n      <line x1=\"35\" y1=\"0\" x2=\"40\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"schemerschakelaar\">\n      <line x1=\"0\" y1=\"0\" x2=\"5\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"5\" y1=\"0\" x2=\"35\" y2=\"-10\"  stroke=\"black\" />\n      <line x1=\"35\" y1=\"0\" x2=\"40\" y2=\"0\"  stroke=\"black\" />\n      <use xlink:href=\"#arrow\" x=\"14\" y=\"-17\" transform=\"rotate(90 14 -17)\" />\n      <use xlink:href=\"#arrow\" x=\"18\" y=\"-17\" transform=\"rotate(90 18 -17)\" />\n    </g>\n    <g id=\"stopcontact\">\n      <path d=\"M20 0 A15 15 0 0 1 35 -15\" stroke=\"black\" fill=\"white\" stroke-width=\"2\" />\n      <path d=\"M20 0 A15 15 0 0 0 35 15\" stroke=\"black\" fill=\"white\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"0\" x2=\"20\" y2=\"0\" stroke=\"black\" />\n    </g>\n    <g id=\"stopcontact_aarding\">\n      <line x1=\"20\" y1=\"-15\" x2=\"20\" y2=\"15\"  stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"stopcontact_kinderveilig\">\n      <line x1=\"35\" y1=\"-20\" x2=\"35\" y2=\"-15\"  stroke=\"black\" stroke-width=\"2\" />\n      <line x1=\"35\" y1=\"20\" x2=\"35\" y2=\"15\"  stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"bel\">\n      <path d=\"M20 0 A15 15 0 0 1 0 15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n      <path d=\"M20 0 A15 15 0 0 0 0 -15\" stroke=\"black\" fill=\"none\" stroke-width=\"2\" />\n      <line x1=\"0\" y1=\"15\" x2=\"0\" y2=\"-15\" stroke=\"black\" stroke-width=\"2\" />\n    </g>\n    <g id=\"boiler\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:url(#VerticalStripe)\" />\n    </g>\n    <g id=\"boiler_accu\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:url(#VerticalStripe)\" />\n    </g>\n    <g id=\"motor\">\n      <circle cx=\"20\" cy=\"0\" r=\"20\" style=\"stroke:black;fill:none\" />\n      <text x=\"20\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"16\">M</text>\n    </g>\n    <g id=\"elektriciteitsmeter\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-6\" x2=\"40\" y2=\"-6\" stroke=\"black\" stroke-width=\"1\" />\n      <text x=\"20\" y=\"10\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-weight=\"bold\" font-size=\"12\">kWh</text>\n    </g>\n    <g id=\"diepvriezer\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#ster\" x=\"10\" y=\"0\" />\n      <use xlink:href=\"#ster\" x=\"20\" y=\"0\" />\n      <use xlink:href=\"#ster\" x=\"30\" y=\"0\" />\n    </g>\n    <g id=\"zonnepaneel\">\n      <rect x=\"0\" y=\"-12\" width=\"80\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"3\" y1=\"3\" x2=\"77\" y2=\"3\" stroke=\"black\" />\n      <line x1=\"20\" y1=\"-9\" x2=\"20\" y2=\"15\" stroke=\"black\" />\n      <line x1=\"40\" y1=\"-9\" x2=\"40\" y2=\"15\" stroke=\"black\" />\n      <line x1=\"60\" y1=\"-9\" x2=\"60\" y2=\"15\" stroke=\"black\" />\n    </g>\n    <g id=\"drukknop\">\n      <circle cx=\"12\" cy=\"0\" r=\"12\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"12\" cy=\"0\" r=\"7\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"teleruptor\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"8\" y1=\"6\" x2=\"16\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"24\" y1=\"6\" x2=\"32\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"16\" y1=\"-6\" x2=\"16\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"24\" y1=\"-6\" x2=\"24\" y2=\"6\"  stroke=\"black\" />\n    </g>\n    <g id=\"dimmer\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"5\" x2=\"30\" y2=\"6\"  stroke=\"black\" />\n      <line x1=\"10\" y1=\"5\" x2=\"10\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"10\" y1=\"-5\" x2=\"30\" y2=\"5\"  stroke=\"black\" />\n    </g>\n    <g id=\"relais\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"10\" y1=\"-13\" x2=\"30\" y2=\"13\"  stroke=\"black\" />\n    </g>\n    <g id=\"minuterie\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <text x=\"20\" y=\"6\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\">t</text>\n    </g>\n    <g id=\"thermostaat\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <line x1=\"12\" y1=\"0\" x2=\"28\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"tijdschakelaar\">\n      <rect x=\"0\" y=\"-13\" width=\"40\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"11\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <line x1=\"10\" y1=\"0\"  x2=\"17\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"11\" y1=\"-6\" x2=\"11\" y2=\"1\"  stroke=\"black\" />\n      <line x1=\"21\" y1=\"0\"  x2=\"25\" y2=\"0\"  stroke=\"black\" />\n      <line x1=\"25\" y1=\"0\"  x2=\"31\" y2=\"-5\"  stroke=\"black\" />\n      <line x1=\"31\" y1=\"0\"  x2=\"36\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"droogkast\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"15\" cy=\"-7.5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"25\" cy=\"-7.5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"7.5\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"omvormer\">\n      <rect x=\"0\" y=\"-15\" width=\"60\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"35\" y1=\"-12\" x2=\"25\" y2=\"12\" stroke=\"black\" />\n      <text x=\"15\" y=\"-1\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"12\">AC</text>\n      <text x=\"45\" y=\"10\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"12\">DC</text>\n    </g>\n    <g id=\"koelkast\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#ster\" x=\"20\" y=\"0\" />\"\n    </g>\n    <g id=\"kookfornuis\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"10\" cy=\"10\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"30\" cy=\"10\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"30\" cy=\"-10\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"microgolf\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"-10\" />\"\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"0\" />\"\n      <use xlink:href=\"#sinus\" x=\"10\" y=\"10\" />\"\n    </g>\n    <g id=\"oven\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-5\" x2=\"40\" y2=\"-5\" stroke=\"black\" />\n      <circle cx=\"20\" cy=\"7.5\" r=\"3\" style=\"stroke:black;fill:black\" />\n    </g>\n    <g id=\"usblader\">\n      <rect x=\"0\" y=\"-15\" width=\"60\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"12\" cy=\"-5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"19\" cy=\"-5\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <text x=\"15\" y=\"8\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"8\">AC/DC</text>\n      <text x=\"42\" y=\"4\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"11\">USB</text>\n    </g>\n    <g id=\"vaatwasmachine\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <line x1=\"0\" y1=\"-20\" x2=\"40\" y2=\"20\" style=\"stroke:black;fill:none\" />\n      <line x1=\"40\" y1=\"-20\" x2=\"0\" y2=\"20\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:white\" />\n    </g>\n    <g id=\"ventilator\">\n      <rect x=\"0\" y=\"-15\" width=\"30\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"10\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"transformator\">\n      <circle cx=\"8\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"20\" cy=\"0\" r=\"8\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"verwarmingstoestel\">\n      <rect x=\"0\" y=\"-15\" width=\"50\" height=\"30\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n    </g>\n    <g id=\"verwarmingstoestel_accu\">\n      <rect x=\"0\" y=\"-15\" width=\"50\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"5\" y=\"-10\" width=\"40\" height=\"20\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n    </g>\n    <g id=\"verwarmingstoestel_accu_ventilator\">\n      <rect x=\"0\" y=\"-15\" width=\"70\" height=\"30\" fill=\"none\" style=\"stroke:black\" />\n      <rect x=\"5\" y=\"-10\" width=\"35\" height=\"20\" fill=\"url(#VerticalStripe)\" style=\"stroke:black\" />\n      <circle cx=\"50\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n      <circle cx=\"60\" cy=\"0\" r=\"5\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g id=\"verbruiker\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n    </g>\n    <g id=\"wasmachine\">\n      <rect x=\"0\" y=\"-20\" width=\"40\" height=\"40\" fill=\"none\" style=\"stroke:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"3\" style=\"stroke:black;fill:black\" />\n      <circle cx=\"20\" cy=\"0\" r=\"15\" style=\"stroke:black;fill:none\" />\n    </g>\n    <g transform=\"rotate(-20)\" id=\"zekering_automatisch\">\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\"  stroke=\"black\" />\n      <rect x=\"-4\" y=\"-30\" width=\"4\" height=\"10\" style=\"fill:black\" />\n    </g>\n    <g id=\"zekering_smelt\">\n      <rect x=\"-4\" y=\"-30\" width=\"8\" height=\"30\" style=\"stroke:black;fill:none\" />\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\" stroke=\"black\" />\n    </g>\n    <g transform=\"rotate(-20)\" id=\"zekering_empty\">\n      <line x1=\"0\" y1=\"-30\" x2=\"0\" y2=\"0\"  stroke=\"black\" />\n    </g>\n    <g id=\"arrow\">\n      <line x1=\"0\" y1=\"0\" x2=\"8\" y2=\"0\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"0\" x2=\"5\" y2=\"-1\" stroke=\"black\" />\n      <line x1=\"8\" y1=\"0\" x2=\"5\" y2=\"1\" stroke=\"black\" />\n    </g>\n    <g id=\"gas_ventilator\">\n      <polygon points=\"-6,5.2 0,-5.2 6,5.2\" fill=\"black\" stroke=\"black\" />\n    </g>\n    <g id=\"gas_atmosferisch\">\n      <polygon points=\"-6,5.2 0,-5.2 6,5.2\" fill=\"white\" stroke=\"black\" />\n    </g>\n    <g id=\"bliksem\">\n      <line x1=\"0\" y1=\"-5.2\" x2=\"-3\" y2=\"0\" stroke=\"black\"/>\n      <line x1=\"-3\" y1=\"0\" x2=\"3\" y2=\"0\" stroke=\"black\"/>\n      <line x1=\"3\" y1=\"0\" x2=\"0\" y2=\"5.2\" stroke=\"black\"/>\n      <line x1=\"0\" y1=\"5.2\" x2=\"0\" y2=\"2.2\" stroke=\"black\"/>\n      <line x1=\"0\" y1=\"5.2\" x2=\"2.6\" y2=\"3.7\" stroke=\"black\"/>\n    </g>\n    <g id=\"moving_man\"\n       transform=\"matrix(0.0152987,0,0,0.01530866,0,0)\">\n       <path\n         d=\"M 710.7,10.1 C 904.8,5.2 908.6,261.4 730.9,278.4 637.5,287.3 566.3,181.5 603.8,90.8 623.4,43.4 668.7,12.9 711.4,10.1 c 1.1,-0.1 2.8,26.1 1.7,26.2 -31.4,2 -74.8,32.1 -89.1,74.7 -26.8,79.9 47,156.6 125.1,139.2 123.9,-27.6 114.1,-218.5 -36.3,-214 -0.7,0 -3.2,-26 -2.1,-26.1 z\"\n         id=\"path4\" stroke=\"black\" stroke-width=\"10\" />\n       <path\n         d=\"m 545.3,225.9 c -67.8,-5 -133.2,0 -199.7,0 -20.7,13.6 -115,100.7 -121.1,121.1 -5.7,19.1 6.2,31.9 12.1,40.4 60.1,18.3 96.7,-60.4 133.2,-88.8 29.6,0 59.2,0 88.8,0 -59.2,78.9 -190.7,169.9 -58.5,264.3 -27.6,31.6 -55.1,63.2 -82.7,94.8 -46.9,-14.7 -165.6,-41.3 -199.7,-18.2 -7,21 -4.8,32.1 6.1,48.4 34.1,10.3 205.5,53.2 232,36.3 34.3,-37.7 68.6,-75.3 102.9,-113 32.3,27.6 64.6,55.2 96.9,82.7 -1,62.6 -14.6,249.9 24.2,266.3 10.2,3 19.1,0.5 28.2,-2 5.4,-7.4 10.8,-14.8 16.1,-22.2 6.9,-27 0.3,-272.6 -6.1,-282.5 -37.7,-32.9 -75.3,-65.9 -113,-98.9 1.3,-1.3 2.7,-2.7 4,-4 45.7,-48.4 91.5,-96.9 137.2,-145.3 20.2,19.5 40.4,39 60.5,58.5 16.7,35.8 152.2,25.4 179.6,6.1 2,-8.1 4,-16.1 6.1,-24.2 -16,-40.1 -71.7,-31.8 -127.1,-30.3 C 741.8,384.3 590.6,253 545.5,225.7 c -1.7,-1 14.9,-23.3 15.4,-22.4 -2.2,-3.5 126,97.7 134.4,107.4 9.4,9.1 55.2,51.5 82.1,78.4 68.5,-2 122,-6.5 137.2,46.4 4.9,17.1 1.9,37.1 -8.1,50.4 -18.8,25.3 -156,39.1 -197.7,18.2 -20.2,-20.2 -40.4,-40.4 -60.5,-60.5 -18.8,18.2 -37.7,36.3 -56.5,54.5 -16.8,18.2 -33.6,36.3 -50.4,54.5 32.9,28.9 65.9,57.8 98.9,86.8 11.2,17.9 18.9,272.3 8.1,306.7 -4.8,15.2 -19.9,32.9 -34.3,38.3 C 498.3,1028.1 527.8,798.3 529.4,706 505.9,686.5 482.3,667 458.8,647.5 427.9,676.7 402,732.8 362,750.4 333.5,762.9 140.3,728.4 113.8,712.1 100.1,703.6 89.3,686 85.6,667.7 59.7,543.2 281.5,646 321.3,617.4 334.7,601.3 348.2,585.1 361.7,569 266.4,454.2 335.5,414.9 402.1,326.9 c 0,-0.7 0,-1.3 0,-2 -8.1,0 -16.1,0 -24.2,0 -26.3,36.3 -124.9,147 -173.5,64.6 -35.9,-60.8 103.6,-172.2 141.1,-189.8 56.7,-3.8 167.5,-11 215.9,4 0.8,0.7 -14.9,22.6 -16.1,22.2 z\"\n         id=\"path6\" stroke=\"black\" stroke-width=\"10\" /></g>\n    </defs>\n    ";
        return (output);
    };
    Hierarchical_List.prototype.toSVG = function (myParent, stack, minxleft) {
        //--- First read all underlying elements in an Array called inSVG ---
        if (minxleft === void 0) { minxleft = 0; }
        var inSVG = new Array(); //Results from nested calls will be added here
        var elementCounter = 0;
        var lastChildOrdinal = 0;
        for (var i = 0; i < this.length; i++) {
            //empty tekst at the end does not count as a valid last child
            if (this.active[i] && (this.data[i].keys[16][2] != "zonder kader") && (this.data[i].parent == myParent))
                lastChildOrdinal = i;
        }
        for (var i = 0; i < this.length; i++) {
            if (this.active[i] && (this.data[i].parent == myParent)) {
                switch (this.data[i].getKey("type")) {
                    case "Bord":
                        //get image of the entire bord
                        inSVG[elementCounter] = this.toSVG(this.id[i], "horizontal");
                        inSVG[elementCounter].xright += 10;
                        if (this.data[i].getKey("geaard")) {
                            if (inSVG[elementCounter].xleft <= 100) {
                                var toShift = 100 - inSVG[elementCounter].xleft;
                                inSVG[elementCounter].xleft = 100;
                                inSVG[elementCounter].xright -= toShift;
                            }
                        }
                        else {
                            if (inSVG[elementCounter].xleft <= 30) {
                                var toShift = 30 - inSVG[elementCounter].xleft;
                                inSVG[elementCounter].xleft = 30;
                                inSVG[elementCounter].xright -= toShift;
                            }
                        }
                        if (inSVG[elementCounter].xright <= 10)
                            inSVG[elementCounter].xright = 10;
                        //Ensure there is enough space to draw the bottom line
                        inSVG[elementCounter].ydown = Math.max(inSVG[elementCounter].ydown, 1);
                        //Draw the bottom line
                        inSVG[elementCounter].data = inSVG[elementCounter].data +
                            '<line x1="4" x2="' + (inSVG[elementCounter].xleft + inSVG[elementCounter].xright - 6) +
                            '" y1="' + inSVG[elementCounter].yup + '" y2="' + inSVG[elementCounter].yup + '" stroke="black" stroke-width="3" />';
                        //Add name of the board
                        if (this.data[i].getKey("naam") !== "") {
                            inSVG[elementCounter].data += '<text x="' + (0) + '" y="' + (inSVG[elementCounter].yup + 13) + '" ' +
                                'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10">&lt;' +
                                htmlspecialchars(this.data[i].getKey("naam")) + '&gt;</text>';
                        }
                        ;
                        //Add an image of the grounding
                        if (this.data[i].getKey("geaard")) {
                            inSVG[elementCounter].data += '<line x1="40" y1="' + (inSVG[elementCounter].yup + 0) + '" x2="40" y2="' + (inSVG[elementCounter].yup + 10) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="40" y1="' + (inSVG[elementCounter].yup + 15) + '" x2="40" y2="' + (inSVG[elementCounter].yup + 25) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="40" y1="' + (inSVG[elementCounter].yup + 30) + '" x2="40" y2="' + (inSVG[elementCounter].yup + 40) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 10) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 10) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 15) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 15) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 25) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 25) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 30) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 30) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="30" y1="' + (inSVG[elementCounter].yup + 40) + '" x2="50" y2="' + (inSVG[elementCounter].yup + 40) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="32.5" y1="' + (inSVG[elementCounter].yup + 43) + '" x2="47.5" y2="' + (inSVG[elementCounter].yup + 43) + '" stroke="black" />';
                            inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 46) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 46) + '" stroke="black" />';
                        }
                        ;
                        break;
                    case "Splitsing":
                        //Algoritme werkt gelijkaardig aan een "Bord", eerst maken we een tekening van het geheel
                        inSVG[elementCounter] = this.toSVG(this.id[i], "horizontal");
                        //If child of "meerdere verbruikers, shift everything by 24 pixels to the right
                        if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Meerdere verbruikers") {
                            if ((inSVG[elementCounter].xright + inSVG[elementCounter].xleft) <= 0)
                                inSVG[elementCounter].xrightmin = 15; // ensure we see there is a "splitsing"
                            if (inSVG[elementCounter].yup < 25)
                                inSVG[elementCounter].yup = 25;
                            if (inSVG[elementCounter].ydown < 25)
                                inSVG[elementCounter].ydown = 25;
                            inSVG[elementCounter].data = inSVG[elementCounter].data +
                                '<line x1="' + (1) + '" x2="' + (inSVG[elementCounter].xleft + inSVG[elementCounter].xrightmin) +
                                '" y1="' + inSVG[elementCounter].yup + '" y2="' + inSVG[elementCounter].yup + '" stroke="black" />';
                            var toShift = inSVG[elementCounter].xleft;
                            inSVG[elementCounter].xleft -= toShift - 1; //we leave one pixel for the bold kring-line at the left
                            inSVG[elementCounter].xright += toShift;
                        }
                        else {
                            inSVG[elementCounter].data = inSVG[elementCounter].data +
                                '<line x1="' + (inSVG[elementCounter].xleft) + '" x2="' + (inSVG[elementCounter].xleft + inSVG[elementCounter].xrightmin) +
                                '" y1="' + inSVG[elementCounter].yup + '" y2="' + inSVG[elementCounter].yup + '" stroke="black" />';
                        }
                        break;
                    case "Domotica":
                        //Algoritme werkt gelijkaardig aan een "Bord" en "Splitsing", eerst maken we een tekening van het geheel
                        inSVG[elementCounter] = this.toSVG(this.id[i], "horizontal");
                        //Make sure there is always enough space to display the element
                        if ((inSVG[elementCounter].xright + inSVG[elementCounter].xleft) <= 100)
                            inSVG[elementCounter].xright = (100 - inSVG[elementCounter].xleft);
                        inSVG[elementCounter].yup = Math.max(inSVG[elementCounter].yup + 20, 25);
                        inSVG[elementCounter].ydown += Math.max(inSVG[elementCounter].ydown, 25);
                        var width = (inSVG[elementCounter].xleft + inSVG[elementCounter].xright - 20);
                        inSVG[elementCounter].data = inSVG[elementCounter].data +
                            '<rect x="' + (20) + '" width="' + (width) +
                            '" y="' + (inSVG[elementCounter].yup - 20) + '" height="' + (40) + '" stroke="black" stroke-width="2" fill="white" />';
                        inSVG[elementCounter].data = inSVG[elementCounter].data +
                            '<line x1="0" x2="20" y1="' + (inSVG[elementCounter].yup) + '" y2="' + (inSVG[elementCounter].yup) + '" stroke="black" />';
                        inSVG[elementCounter].data +=
                            '<text x="' + (21 + width / 2) + '" y="' + (inSVG[elementCounter].yup + 3) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="bold">' + htmlspecialchars(this.data[i].keys[15][2]) + '</text>';
                        var toShift = inSVG[elementCounter].xleft;
                        inSVG[elementCounter].xleft -= toShift - 1; //we leave one pixel for the bold kring-line at the left
                        inSVG[elementCounter].xright += toShift - 1;
                        //If direct child of a Kring, put a vertical pipe and "nr" at the left
                        if (myParent != 0) {
                            if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") {
                                var y1, y2;
                                if (i !== lastChildOrdinal) {
                                    y1 = 0;
                                    y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                                }
                                else {
                                    y1 = inSVG[elementCounter].yup;
                                    y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                                }
                                inSVG[elementCounter].data = inSVG[elementCounter].data +
                                    '<line x1="' + inSVG[elementCounter].xleft +
                                    '" x2="' + inSVG[elementCounter].xleft +
                                    '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />';
                                inSVG[elementCounter].data +=
                                    '<text x="' + (inSVG[elementCounter].xleft + 9) + '" y="' + (inSVG[elementCounter].yup - 5) + '" ' +
                                        'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                                        htmlspecialchars(this.data[i].getKey("naam")) + '</text>';
                            }
                            ;
                        }
                        ;
                        break;
                    case "Meerdere verbruikers":
                        //Algoritme werkt gelijkaardig aan een "Bord", eerst maken we een tekening van het geheel
                        inSVG[elementCounter] = this.toSVG(this.id[i], "horizontal");
                        //We voorzien altijd verticale ruimte, zelfs als de kinderen nog niet gedefinieerd zijn
                        inSVG[elementCounter].ydown = Math.max(inSVG[elementCounter].ydown, 25);
                        inSVG[elementCounter].yup = Math.max(inSVG[elementCounter].yup, 25);
                        inSVG[elementCounter].xleft = Math.max(inSVG[elementCounter].xleft, 1);
                        //--plaats adres onderaan als nodig--
                        if (!(/^\s*$/.test(this.data[i].keys[15][2]))) { //check if adres contains only white space
                            inSVG[elementCounter].data += '<text x="' + ((inSVG[elementCounter].xright - 20) / 2 + 21) + '" y="' + (inSVG[elementCounter].yup + inSVG[elementCounter].ydown + 10)
                                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.data[i].keys[15][2]) + '</text>';
                            inSVG[elementCounter].ydown += 15;
                        }
                        //If direct child of a Kring, put a vertical pipe and "nr" at the left
                        if (myParent != 0) {
                            if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") {
                                var y1, y2;
                                if (i !== lastChildOrdinal) {
                                    y1 = 0;
                                    y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                                }
                                else {
                                    y1 = inSVG[elementCounter].yup;
                                    y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                                }
                                inSVG[elementCounter].data = inSVG[elementCounter].data +
                                    '<line x1="' + inSVG[elementCounter].xleft +
                                    '" x2="' + inSVG[elementCounter].xleft +
                                    '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />';
                                inSVG[elementCounter].data +=
                                    '<text x="' + (inSVG[elementCounter].xleft + 9) + '" y="' + (inSVG[elementCounter].yup - 5) + '" ' +
                                        'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                                        htmlspecialchars(this.data[i].getKey("naam")) + '</text>';
                            }
                            ;
                        }
                        ;
                        break;
                    case "Aansluiting":
                        //get image of the entire stack, make sure it is shifted to the right sufficiently so-that the counter can be added below
                        inSVG[elementCounter] = this.toSVG(this.id[i], "vertical", 150); //shift 100 to the right
                        //add the fuse below
                        inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                            '" x2="' + inSVG[elementCounter].xleft +
                            '" y1="' + inSVG[elementCounter].yup +
                            '" y2="' + (inSVG[elementCounter].yup + 20) + '" stroke="black" />';
                        inSVG[elementCounter].yup += 20;
                        switch (this.data[i].getKey("zekering")) {
                            case "automatisch":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_automatisch" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                break;
                            case "schakelaar":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_empty" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                break;
                            case "schemer":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_empty" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#arrow" x=\"' + (inSVG[elementCounter].xleft - 18) +
                                        '" y="' + (inSVG[elementCounter].yup - 15) + '" />';
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#arrow" x=\"' + (inSVG[elementCounter].xleft - 18) +
                                        '" y="' + (inSVG[elementCounter].yup - 12) + '" />';
                                break;
                            case "differentieel":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_automatisch" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 25) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 25) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    "\u0394" + htmlspecialchars(this.data[i].getKey("differentieel_waarde") + "mA") + "</text>";
                                break;
                            case "smelt":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_smelt" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                break;
                            case "geen":
                                inSVG[elementCounter].yup += 0;
                                break;
                        }
                        //draw the counter
                        inSVG[elementCounter].data += '<line x1="1" ' +
                            'y1="' + (inSVG[elementCounter].yup + 25) +
                            '" x2="21" ' +
                            'y2="' + (inSVG[elementCounter].yup + 25) + '" stroke="black"></line>';
                        //draw outgoing connecting lines
                        inSVG[elementCounter].data += '<line x1="60" ' +
                            'y1="' + (inSVG[elementCounter].yup + 25) +
                            '" x2="' + (inSVG[elementCounter].xleft) + '" ' +
                            'y2="' + (inSVG[elementCounter].yup + 25) + '" stroke="black"></line>';
                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft) +
                            '" y1="' + (inSVG[elementCounter].yup) +
                            '" x2="' + (inSVG[elementCounter].xleft) + '" ' +
                            'y2="' + (inSVG[elementCounter].yup + 25) + '" stroke="black"></line>';
                        //Draw the counter
                        inSVG[elementCounter].data += '<use xlink:href="#elektriciteitsmeter" x="21" y="' + (inSVG[elementCounter].yup + 25) + '"></use>';
                        //set kabel type Text
                        inSVG[elementCounter].data += '<text x="100" y="' + (inSVG[elementCounter].yup + 40) +
                            '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                            htmlspecialchars(this.data[i].getKey("kabel")) + '</text>';
                        //inSVG[elementCounter].xleft = Math.max(inSVG[elementCounter].xleft,60);
                        //inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,10);
                        //Foresee sufficient room below for the counter
                        inSVG[elementCounter].yup += 25;
                        inSVG[elementCounter].ydown = 25;
                        //If adres is not empty, put it below
                        if (!(/^\s*$/.test(this.data[i].keys[15][2]))) { //check if adres contains only white space
                            inSVG[elementCounter].data += '<text x="41" y="' + (inSVG[elementCounter].yup + inSVG[elementCounter].ydown + 10) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.data[i].keys[15][2]) + '</text>';
                            inSVG[elementCounter].ydown += 15;
                        }
                        //rework xleft and xright to ensure the entire structure is always at the right of a potential parent kring
                        var width = inSVG[elementCounter].xleft + inSVG[elementCounter].xright;
                        inSVG[elementCounter].xleft = 1;
                        inSVG[elementCounter].xright = width - 1;
                        //If direct child of a Kring, put a vertical pipe and "nr" at the left
                        if (myParent != 0) {
                            if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") {
                                var y1, y2;
                                if (i !== lastChildOrdinal) {
                                    y1 = 0;
                                    y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                                }
                                else {
                                    y1 = inSVG[elementCounter].yup;
                                    y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                                }
                                inSVG[elementCounter].data = inSVG[elementCounter].data +
                                    '<line x1="' + inSVG[elementCounter].xleft +
                                    '" x2="' + inSVG[elementCounter].xleft +
                                    '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />';
                                inSVG[elementCounter].data +=
                                    '<text x="' + (inSVG[elementCounter].xleft + 9) + '" y="' + (inSVG[elementCounter].yup - 5) + '" ' +
                                        'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                                        htmlspecialchars(this.data[i].getKey("naam")) + '</text>';
                            }
                            ;
                        }
                        ;
                        break;
                    case "Kring":
                        var cable_location_available = 0;
                        if ((this.data[i].getKey("kabel_aanwezig"))
                            && (this.data[i].keys[19][2] || contains(["Ondergronds", "Luchtleiding", "In wand", "Op wand"], this.data[i].keys[16][2]))) {
                            cable_location_available = 1;
                        }
                        //get image of the entire kring
                        inSVG[elementCounter] = this.toSVG(this.id[i], "vertical", 35 + 20 * cable_location_available);
                        if (this.data[i].getKey("kabel_aanwezig")) {
                            //foresee space for the conductor specifications
                            inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                                '" x2="' + inSVG[elementCounter].xleft +
                                '" y1="' + inSVG[elementCounter].yup +
                                '" y2="' + (inSVG[elementCounter].yup + 100) + '" stroke="black" />';
                            inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                "\" y=\"" + (inSVG[elementCounter].yup + 80) +
                                "\"" +
                                " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                "," + (inSVG[elementCounter].yup + 80) +
                                ")" +
                                "\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                htmlspecialchars(this.data[i].getKey("kabel")) + "</text>";
                            //Draw the cable location symbols
                            if (cable_location_available) {
                                if ((this.data[i].keys[19][2]) && (this.data[i].keys[16][2] != "Luchtleiding")) {
                                    inSVG[elementCounter].data += '<circle cx="' + (inSVG[elementCounter].xleft - 10)
                                        + '" cy="' + (inSVG[elementCounter].yup + 40)
                                        + '" r="4" style="stroke:black;fill:none" />';
                                }
                                switch (this.data[i].keys[16][2]) {
                                    case "Ondergronds":
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 13)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 13)
                                            + '" y1="' + (inSVG[elementCounter].yup + 60)
                                            + '" y2="' + (inSVG[elementCounter].yup + 80)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 10)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 10)
                                            + '" y1="' + (inSVG[elementCounter].yup + 62)
                                            + '" y2="' + (inSVG[elementCounter].yup + 78)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 7)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 7)
                                            + '" y1="' + (inSVG[elementCounter].yup + 64)
                                            + '" y2="' + (inSVG[elementCounter].yup + 76)
                                            + '" style="stroke:black" />';
                                        break;
                                    case "Luchtleiding":
                                        inSVG[elementCounter].data += '<circle cx="' + (inSVG[elementCounter].xleft)
                                            + '" cy="' + (inSVG[elementCounter].yup + 20)
                                            + '" r="4" style="stroke:black;fill:none" />';
                                        break;
                                    case "In wand":
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 15)
                                            + '" y1="' + (inSVG[elementCounter].yup + 10)
                                            + '" y2="' + (inSVG[elementCounter].yup + 30)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 10)
                                            + '" y2="' + (inSVG[elementCounter].yup + 10)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 20)
                                            + '" y2="' + (inSVG[elementCounter].yup + 20)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 30)
                                            + '" y2="' + (inSVG[elementCounter].yup + 30)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 15)
                                            + '" y1="' + (inSVG[elementCounter].yup + 65)
                                            + '" y2="' + (inSVG[elementCounter].yup + 85)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 85)
                                            + '" y2="' + (inSVG[elementCounter].yup + 85)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 65)
                                            + '" y2="' + (inSVG[elementCounter].yup + 65)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 75)
                                            + '" y2="' + (inSVG[elementCounter].yup + 75)
                                            + '" style="stroke:black" />';
                                        break;
                                    case "Op wand":
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 5)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 10)
                                            + '" y2="' + (inSVG[elementCounter].yup + 30)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 10)
                                            + '" y2="' + (inSVG[elementCounter].yup + 10)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 20)
                                            + '" y2="' + (inSVG[elementCounter].yup + 20)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 30)
                                            + '" y2="' + (inSVG[elementCounter].yup + 30)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 5)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 65)
                                            + '" y2="' + (inSVG[elementCounter].yup + 85)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 85)
                                            + '" y2="' + (inSVG[elementCounter].yup + 85)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 65)
                                            + '" y2="' + (inSVG[elementCounter].yup + 65)
                                            + '" style="stroke:black" />';
                                        inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft - 15)
                                            + '" x2="' + (inSVG[elementCounter].xleft - 5)
                                            + '" y1="' + (inSVG[elementCounter].yup + 75)
                                            + '" y2="' + (inSVG[elementCounter].yup + 75)
                                            + '" style="stroke:black" />';
                                        break;
                                }
                            }
                            inSVG[elementCounter].yup += 100;
                        }
                        else {
                            inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                                '" x2="' + inSVG[elementCounter].xleft +
                                '" y1="' + inSVG[elementCounter].yup +
                                '" y2="' + (inSVG[elementCounter].yup + 20) + '" stroke="black" />';
                            inSVG[elementCounter].yup += 20;
                        }
                        //add the fuse below
                        switch (this.data[i].getKey("zekering")) {
                            case "automatisch":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_automatisch" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                break;
                            case "schakelaar":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_empty" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                break;
                            case "schemer":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_empty" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#arrow" x=\"' + (inSVG[elementCounter].xleft - 18) +
                                        '" y="' + (inSVG[elementCounter].yup - 15) + '" />';
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#arrow" x=\"' + (inSVG[elementCounter].xleft - 18) +
                                        '" y="' + (inSVG[elementCounter].yup - 12) + '" />';
                                break;
                            case "differentieel":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_automatisch" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 25) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 25) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    "\u0394" + htmlspecialchars(this.data[i].getKey("differentieel_waarde") + "mA") + "</text>";
                                break;
                            case "smelt":
                                inSVG[elementCounter].yup += 30;
                                inSVG[elementCounter].data +=
                                    '<use xlink:href="#zekering_smelt" x=\"' + inSVG[elementCounter].xleft +
                                        '" y="' + inSVG[elementCounter].yup + '" />';
                                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft + 15) +
                                    "\" y=\"" + (inSVG[elementCounter].yup - 10) +
                                    "\"" +
                                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft + 15) +
                                    "," + (inSVG[elementCounter].yup - 10) +
                                    ")" +
                                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                                    htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                                break;
                            case "geen":
                                inSVG[elementCounter].yup += 0;
                                break;
                        }
                        //--Tekst naast de kring--
                        var tekstlocatie = (inSVG[elementCounter].yup - 40); //Standaard staat tekst boven de zekering
                        if (this.data[i].getKey("zekering") == "geen")
                            tekstlocatie += 25; //Als er geen zekering is kan tekst naar beneden
                        inSVG[elementCounter].data +=
                            '<text x="' + (inSVG[elementCounter].xleft - 6 - 20 * cable_location_available) + '" '
                                + 'y="' + (tekstlocatie) + '" '
                                + 'transform="rotate(-90 ' + (inSVG[elementCounter].xleft - 6 - 20 * cable_location_available) + ',' + (tekstlocatie) + ')" '
                                + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"'
                                + '>'
                                + htmlspecialchars(this.data[i].getKey("commentaar"))
                                + '</text>';
                        //--Naam onderaan zetten (links-onder)--
                        inSVG[elementCounter].data +=
                            '<text x="' + (inSVG[elementCounter].xleft - 6) + '" '
                                + 'y="' + (inSVG[elementCounter].yup + 3) + '" '
                                //+ 'transform="rotate(-90 ' + (inSVG[elementCounter].xleft-6) + ',' + (inSVG[elementCounter].yup+3) + ')" '
                                + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"'
                                + '>'
                                + htmlspecialchars(this.data[i].getKey("naam"))
                                + '</text>';
                        //--Lijntje onder de zekering--
                        inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                            '" x2="' + inSVG[elementCounter].xleft +
                            '" y1="' + inSVG[elementCounter].yup +
                            '" y2="' + (inSVG[elementCounter].yup + 15) + '" stroke="black" />';
                        inSVG[elementCounter].yup += 15;
                        //if there is nothing, still draw an empty one
                        if (inSVG[elementCounter].yup <= 0) {
                            inSVG[elementCounter].xleft = 20;
                            inSVG[elementCounter].xright = 20;
                            inSVG[elementCounter].yup = 50;
                            inSVG[elementCounter].ydown = 0;
                        }
                        break;
                    case "":
                        inSVG[elementCounter] = new SVGelement();
                        break;
                    default:
                        //get image of all lowest level elements
                        //First get the image itself
                        if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Meerdere verbruikers") {
                            //the following function takes true as an argument if there is still an element following in a horizontal chain.
                            //This is the case if the element is not last and/or not followed by empty tekst without border
                            inSVG[elementCounter] = this.data[i].toSVG(i !== lastChildOrdinal);
                        }
                        else {
                            inSVG[elementCounter] = this.data[i].toSVG(false);
                        }
                        //If direct child of a Kring, put a vertical pipe and "nr" at the left
                        if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") {
                            var y1, y2;
                            if (i !== lastChildOrdinal) {
                                y1 = 0;
                                y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                            }
                            else {
                                y1 = inSVG[elementCounter].yup;
                                y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                            }
                            inSVG[elementCounter].data = inSVG[elementCounter].data +
                                '<line x1="' + inSVG[elementCounter].xleft +
                                '" x2="' + inSVG[elementCounter].xleft +
                                '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />';
                            inSVG[elementCounter].data +=
                                '<text x="' + (inSVG[elementCounter].xleft + 9) + '" y="' + (inSVG[elementCounter].yup - 5) + '" ' +
                                    'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                                    htmlspecialchars(this.data[i].getKey("naam")) + '</text>';
                        }
                        ;
                }
                elementCounter++;
                //outSVG.xleft = Math.max(outSVG.xleft,inSVG[elementCounter].xleft);
            }
        }
        //--- If there are no elements, make at least an empty one to avoid problems here below ---
        if (elementCounter == 0) {
            inSVG[0] = new SVGelement();
        }
        //--- Now create the output element ---
        var outSVG = new SVGelement;
        outSVG.xleft = 0;
        outSVG.xright = 0;
        outSVG.yup = 0;
        outSVG.ydown = 0;
        outSVG.data = "";
        var width = 0; //How wide is the structure?
        var height = 0; //How high is the structure?
        switch (stack) {
            case "horizontal":
                var max_yup = 0; //What is the maximal distance above the horizontal line?
                var max_ydown = 0; //What is the maximal distance below the horizontal line?
                //analyse the size of the structure. Build horizontally
                for (var i = 0; i < elementCounter; i++) {
                    width = width + inSVG[i].xleft + inSVG[i].xright;
                    max_yup = Math.max(max_yup, inSVG[i].yup);
                    max_ydown = Math.max(max_ydown, inSVG[i].ydown);
                }
                height = max_yup + max_ydown;
                //decide on the output structure
                if (elementCounter > 0) {
                    outSVG.xleft = inSVG[0].xleft; //Leave space of the first element at the left
                    outSVG.xright = width - outSVG.xleft;
                    outSVG.xrightmin = outSVG.xright - inSVG[elementCounter - 1].xright;
                }
                else {
                    outSVG.xleft = 0;
                    outSVG.xright = 0;
                    outSVG.xrightmin = 0;
                }
                ;
                outSVG.yup = max_yup;
                outSVG.ydown = max_ydown;
                //--Create the output data--
                var xpos = 0;
                for (var i = 0; i < elementCounter; i++) {
                    outSVG.data += '<svg x="' + xpos + '" y="' + (max_yup - inSVG[i].yup) + '">';
                    outSVG.data += inSVG[i].data;
                    outSVG.data += '</svg>';
                    xpos += inSVG[i].xleft + inSVG[i].xright;
                }
                break;
            case "vertical":
                var max_xleft = 0; //What is the maximal distance left of the vertical line?
                var max_xright = 0; //What is the maximal distance right of the vertical line?
                //analyse the size of the structure. Build vertically
                for (var i = 0; i < elementCounter; i++) {
                    height = height + inSVG[i].yup + inSVG[i].ydown;
                    max_xleft = Math.max(max_xleft, inSVG[i].xleft);
                    max_xright = Math.max(max_xright, inSVG[i].xright);
                }
                max_xleft = Math.max(minxleft, max_xleft);
                width = max_xleft + max_xright;
                //decide on the output structure
                outSVG.yup = height; //As a general rule, there is no ydown, but to be confirmed
                outSVG.ydown = 0;
                outSVG.xleft = Math.max(max_xleft, 35); // foresee at least 35 for text at the left
                outSVG.xright = Math.max(max_xright, 25); // foresee at least 25 at the right
                //create the output data
                var ypos = 0;
                for (var i = elementCounter - 1; i >= 0; i--) {
                    outSVG.data += '<svg x="' + (outSVG.xleft - inSVG[i].xleft) + '" y="' + ypos + '">';
                    outSVG.data += inSVG[i].data;
                    outSVG.data += '</svg>';
                    ypos += inSVG[i].yup + inSVG[i].ydown;
                }
                break;
        }
        //alert("stack = " + stack + " width = " + width + "height = " + height  + " yup = " + outSVG.yup + "ydown = " + outSVG.ydown);
        outSVG.data += "\n";
        if (myParent == 0) { //We will always foresee a 20 pixel horizontal and 5 pixel vertical margin
            var header = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" transform=\"scale(1,1)\" width=\"" + (width + 20) + "\" height=\"" + (height + 5) + "\">";
            header += this.outputSVGDefs();
            var footer = "</svg>";
            outSVG.data = header + outSVG.data + footer;
        }
        return (outSVG);
    };
    return Hierarchical_List;
}());
var CONFIGPAGE_LEFT = "\n    <center>\n        <p><font size=\"+2\">\n          <b>Eendraadschema ontwerpen: </b>\n          Kies &eacute;&eacute;n van onderstaande voorbeelden om van te starten (u kan zelf kringen toevoegen achteraf) of\n          start van een leeg schema met voorgekozen aantal kringen (optie 3).\n        </font></p>\n      <font size=\"+1\">\n        <i>\n          <b>Tip: </b>Om de mogelijkheden van het programma te leren kennen is het vaak beter eerst een voorbeeldschema te\n          bekijken alvorens van een leeg schema te vertrekken.\n        </i>\n      </font>\n    </center><br><br>\n    <table border=\"1px\" style=\"border-collapse:collapse\" align=\"center\" width=\"100%\">\n      <tr>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Voorbeeld 1</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Voorbeeld 2</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Leeg schema</b>\n        </td>\n        <td width=\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n          <b>Openen</b>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/example000.svg\" height=\"300px\"><br><br>\n          Eenvoudig schema, enkel stopcontacten en lichtpunten.\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/example001.svg\" height=\"300px\"><br><br>\n          Iets complexer schema met teleruptoren, verbruikers achter stopcontacten en gesplitste kringen.\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/gear.svg\" height=\"100px\"><br><br>\n";
var CONFIGPAGE_RIGHT = "\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <img src=\"examples/import_icon.svg\" height=\"100px\"><br><br>\n          Open een schema dat u eerder heeft opgeslagen op uw computer (EDS-bestand). Enkel bestanden aangemaakt na 12 juli 2019 worden herkend.\n          <br><br>\n        </td>\n      </tr>\n      <tr>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"load_example(0)\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"load_example(1)\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"read_settings()\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n        <td width=\"25%\" align=\"center\">\n          <br>\n          <button onclick=\"importclicked()\">Verdergaan met deze optie</button>\n          <br><br>\n        </td>\n      </tr>\n    </table>\n  ";
var EXAMPLE0 = "EDS0010000eJztnV1v20Yahf+KwetZrDik5I+7uA2KIkmzWKfeokER0NLY5ooSBYpytin633dIMxFdU7akktbM8MlFYFsyKZF85rznHFn6w0vU/Ca/9c5CKbxJlEfe2cc/vHjinfnCW0SZmufe2UB48Xzy9ctxmiTRYqn0fa6jZKmEN1W/L/XvffTy3xfKE97F67evv/ugv3gVzZfJKs7j+Y33m/jo3agoyib6hvP379++fvWTJ/JspYpbpsUOsjsVJ/HNrYob7xONx6vZKonyWNVvLh9EeXs0z6Okvn9Z7jWJx7f5NNMP4tMiXW//273UfKqS8pby7nf6icZ6L2nWuJcvaqqKbdW3MImvr1VxrGKlknIj0WyhsuimPBof/v3jTz/oL8JBedM0ulJJ/efyf/6ovGUeRbP6Dd/rzZY3PNj+p8/FQXyw5WBQ2/QnfRw+qy/xTeMxLI+RrD94//5Zp0n+l8crg8HlP2V4Wd4+Tmcz/QD0rut3KW9aqkSNc7++zWUezSfluV7fQT53h2DzHa7SNPEbT0dxi9x4S9B4yzIvTqD/+ImUP5cbfh48+nmxh/DxHn4rGJkvVzOVFVh4+h5vqivmARB/invS5Jo0f02avxNp52l1pF4aMf+FEItWeTrTj2s5vt0ImNwA2C+X50fBD1IMGymDMBsJ+1dJzKcfczXzzlAsFAueXkKxHt2vFJ713S8WSZwvH8ibf7LmUq65lDtxibahbb1hsUHbmBHhCI6YEZkR4cmpGXHDRr9Nj8dbDI/FZfAEr9UWHSb17wjf5funhO8VpNpIKhMkEyQcMUEyQcKTSTwdYoIMaiPk8ZrYYCdiL/J0ofeTR+McAdxLAH2ItZHYBgXEkmHJAAlLZj5IWLJecIQlw5LBkxWW7NEt9d182+j36SzN43Gkv3ynlL6CMnV0p7KrbBVPi19t2q3w/rH5X7Hp8ko+T+NEZeUFqxZ3Way+3H+XpenNNFrm5der6XSeLvSXrxM11Qd0HOdK72Wm8vLO1U+1IKmjVCNYPBx9U7H5N6lKqs28SdPpdZrNV3HxeN8WYI/jbKyf6tdvF6t58fW7eJylN2lyXW3rXXrP8/vZXZrNyj1ejG8jDb6+xopt1b2o8D5k+gjqHc2qZeDni/OjJJqUv3cZRfnnaDmLxrfxvADmsr5gXKrsc5TN9MFb5qla3j+Dyyz+rzrK1bR8Ev+p//Kv6XyuFtFclXd8+mh/Pa3Vc3x1nUfTSZqWh0KpmjsPJe7cgFlIsnjbuHjjznHngNQNSLhz3Dkc4c5x5/CEO8ed99Kd+7hzA2ahgMXbxsUbd447B6RuQMKd487hCHeOO4cn3DnuvJfufIA7N2AWClm8bVy8cee4c0DqBiTcOe4cjnDnuHN4wp3jzvvozoNT3LkBs9CQxdvGxRt3jjsHpG5Awp3jzuEId447hyfcOe68l+78pAV3zgDEANSbBRtHjiMHpG5AwpEjSHCEI8eRwxOOvA1H7uG8O3De3g4Ouw2DXbuWGGwYbHqyEOO0cdqA1A1IOG0ECY5w2jhteMJp47RdcNq1F5qfrNfiEHNQ38KN0leAkcPMXw4Oq+/LTzNkVVgDYCKrIqsCJHNAIqtCkOCIrIqsCp7Iqsiq7M6qNp/0apWuLdOn62V6yPslvOjU47NM27hMN4w9xMLEwhBELGy3HiFHjsBELEwsDEjEwuaDhCD1giNiYWJheCIWJhY2MxbmpDt70isBDkj8t1bg7gZaiQLbqMAk/vuBROIPQST+BusRcuQITCT+JP6AROJvPkgIUi84IvEn8YcnEn/CXxJ/TvohEn/pQOJvgzN8eqANUGAbFZjEfz+QSPwhiMTfYD1CjhyBicSfxB+QSPzNBwlB6gVHJP4k/vBE4k/4S+LPST9A4h+ELST+jSedyXafyTZEim2UYqL//UAi+ocgon+D9Qg5cgQmon+if0Ai+jcfJASpFxwR/RP9wxPRPykw0T8n/RDR/3CtwEUN8FWCRztJ8IPDaO5Iqw+lylaL4jD3cKQdIMEvMdJSppkFFmWaK2RRplGmQRBlmt16hBw5AhNlGmUaIFGmmQ8SgtQLjijTKNPgiTKNXoUyjZN+2JNeO4sWnaba6dh0xqw+TVVDM2qj8zz0O5xhPBiUDDEeVJ5mgUXl6QpZVJ5UnhBE5Wm3HiFHjsBE5UnlCUhUnuaDhCD1giMqTypPeKLyNLtW6V37xUnv4Umn8jTxNFUNTeDAZzrhO5iTDPEd9DL0MhBEL4McIUcGwEQvQy8DSPQy5oOEIPWCI3oZehl4opcxO/vtXUTPSXf/pFcCPCChJKFEc0koMYQMsIeHiYSShBKQSCjNBwlB6gVHJJQklPBEQklYZWZCWa3StY8n8Qe8cPVQY8+QddrGdbpp7iEYJhgGIYJhuwUJPXIEJoJhgmFAIhg2HyQEqRccEQwTDMMTwTDBsJnBMCfd2ZNeCXBI5m/CRDtCgm2UYDL/PUki8wchMn+DBQk9cgQmMn8yf0Ai8zcfJASpFxyR+ZP5wxOZP/EvmT8n/QCZ/whH2M4gW6nrBkfobxhkz1FeG5UXR4gjhCMcIY4Qnkzi6WUdYQXsKSNk16g+rX078PoMrvTdB9c/5kjmSDhijrRHnJgjnePpEHOkrL1W0j/d96VeT0jft+OH9qF97rDapH1YMiwZOGHJkCVkyRyOsGRYMniywpJ1/LqfTf88Xg/UweuBnjjaW79OSNYWbznY9KeMz63e7puK7v545DvWbRvX7SY/QdKFpQAlki47zARJV29wIulCluCIpMsecSLpco4nki6PpOsQSdezr1CpjUfS5/3xDjUm+azrNq7rTX6DVJlUGZZIlZ3QJVByBCVSZVJlcGpPmUiVkSU4IlW2RpxIlZ3jiVTZI1U2K1XmIuEiefgi25M2CgbGZMbk3sg6pQKlAixRKiBLoGQ2SpQKlArg1J4yUSogS3BEqWCNOFEqOMcTpYJHXtyrUoGL4dCf2CND/grBhAlYItk2SjaFAYUBLFEYOKtLoOQIShQGFAbg1J4yURggS3BEYWCNOFEYOMcThYFHRtyrwoCLxJ6LpBqUT9soGB4cXnNH5snq6srYmTlA5G0UeSoGKgZYomIgywEls1GiYqBiAKf2lImKAVmCIyoGa8SJisE5nqgYPNJjKgYuEiMvknuBD+pxaC3CGfFGR4zJyPq2dpOizhCkKOqcYYqijqIOlijqthYmRj1Q6j4RpaijqAOn1pSJog5ZgiOKOmvEiaLOOZ4o6jw6GIo6LhIbLpJ1dTegumNwRuh3EHqqO6o7mOqeKao7qjtYorrbWpgY9UCp+4yU6o7qDpxaUyaqO2QJjqjurBEnqjvneKK682hlDGhluEi4SLav7uSw5kTDfas7PjmIGbqPmt/kRfkoLiOA4qO4nCGKDo8OD5bo8JzQJVByBCU6PDo8cGpPmejwkCU4osOzRpzo8JzjiQ7Po54xoJ7hIuEi2aHDG7XR4dUeOSM0I3RfJJ8Kz1igqPCcIYoKjwoPlqjwnNAlUHIEJSo8Kjxwak+ZqPCQJTiiwrNGnKjwnOOJCs+jnTGgneEi4SLZocI7bqPC473/HogoU3RvVJ8Wz1igaPGcIYoWjxYPlmjxnNAlUHIEJVo8Wjxwak+ZaPGQJTiixbNGnGjxnOOJFs+joDGgoOEi4SLZocULqByYodH89rwojQONAyzROCBLoGQOSjQONA7g1J4y0TggS3BE42CNONE4OMcTjYNHmGxAmPxyFwkXQxcXw3YnvRLs2hv3jfZNZPijnwcKuNcI7KPZNmp2www8IplpB6RqwN1QF/gbQDoHJEdAIpQhlIEjQhlCGXgilCGUsc2H/71Qplq7j13w5ya5Ct5CoEerN/Ycew5I3YCEPceewxH2HHsOT9hz7Hkf7XkgXbDn9g9DAau3jas39hx7DkjdgIQ9x57DEfYcew5P2HPseS/t+RZmwti37pAGrdmjYeOKvffkEwyeXqb5k+iDzz34B/wDHOEf8A/w1BP/cA9s7UObgg7eowrhQ/jcA7VB+DBfmC/YwXyhQXCE+cJ8wZNlPDlV3niUNAd+q6Hhei0OeR/1Fx9qAtZgC9fghpmGfApvAEfkU8Z4AvKp3rFDPoUGwRH5FPkUPJFPkU/ZnU9tPOn6ItNPIb5T+uflHx2W/90vyOvvm/67v09b/z+zm912+9wj1U+6kKaPvpDCPxHHIjgWoRShL8KBCE5FcCJOxKnwfeEHwpciCEUwFMFIBPrbgfCHwg/FSPinQg6E1FuRQp4IGQqpf9fX072QQyFHQh4LqX9D31PvQm9GhGJYUL3KypRD27NZqlfgM09N9BX55/8B9SuvuA==";
var EXAMPLE1 = "EDS0010000eJztnW1z2sYahv+KZz/vmYMkwC/f4jbT6SRpztSp22mmk5FhjXUQiBHCadPpf+9KKEGOhS2IbHZXVz5kMBISrPba+3num5e/Razmk+xGnAVDKcZhFoqz93+LaCzOPCkWYarmmTjrSRHNx59vjpI4DhdLpfe5DuOlkmKq/lrqx70X2V8LJaS4ePn65Xfv9I0X4XwZr6Ismk/EH/K9mKgwTMd6w/nbt69fvvhJyCxdqXzLND9BequiOJrcqKh2n3A0Ws1WcZhFqrq5eBLF9nCehXH1/H5x1jga3WTTVD+JD4tkc/wve6n5VMXFlmL3W/1CI32WJK09yyc1VfmxqkcYR9fXKh+rSKm4OEg4W6g0nBSj8e7nH3/6Qd/o94pN0/BKxdX7/T+9YbFlHoaz6obv9WGLDXeO/+FjPoh3jhz0Kof+oMfho/oUTWrHsBgjv/rkvfWrTuLsq+frB73L//r9y2L7KJnN9BPQp67uUmxaqliNMq96zGUWzsfFtd7s4D+2Q7B9h6skib3ay5Fv8bduCWq3LLP8Anr3X0hxv7/l/uDe/fkZ+vfP8EfOyHy5mqk0x0LoPV6VM+YOEP/INWn+hjRvQ5q3E2nnSTlSz42Y90yIhassmenntRzdbAXM3wLYb5fnR8EPvhzUUgZhNhL2v4KYDz9maibOUCwUC56eQ7Hu7VcIz2b3i0UcZcs78uadbLj0N1z6O3GJtqFtnWGxRtuoEeEIjqgRqRHhyakacctBv1SPxw2Kx3waPMBreUSHSf0W4bt8+5DwvYBUG0mlgqSChCMqSCpIeDKJp0NUkBX78XgDbLATsJUTon6oX0dorVE/2jHaMUCiHTMfJASpExzRjtGOwZMV7di9LdXTfDno98ksyaJRqG++UUrPoFQd3ar0Kl1F0/yhdaeV4j/b/+WHLmbyeRLFKi0mrFrcppH6tP4rTZLJNFxmxe3VdDpPFvrmy1hN9YCOokzps8xUVuxc3qsFSR0lGsH86ehN+eFfJSouD/MqSabXSTpfRfnzfZ2DPYrSkX6pn/9crOb57TfRKE0mSXxdHutNsub57ew2SWfFGS9GN6EGX8+x/FgXWbLQw5iFo/zh71I9gvpEs3IZ+OXi/CgOx8XjLsMw+xguZ+HoJprnwFxWF4xLlX4M05kevGWWqOX6FVym0f/VUaamxYv4tfrg35P5XC3CuSp2fHi0P1/W8jW+uM7C6ThJiqFQqtKZn27W7pPN2t2nmageYaL0zDCy+PlqcFitn7/6wduilQAmvC28LUAyByS8LQQJjvC28LbgCW8Lb6tb3tZj70fxKsv66WZZH+zWtFfGiippnyrJY1m3cVmvKZOwkbGRIQgb2W49Qo4cgQkbGRsZkLCRzQcJQeoER9jI2MjwhI2MjSycsJGZJEySO++j9QIShcYK/3QFs4/C26jwJAr7gUSiAEEkCgbrEXLkCEwkCiQKgESiYD5ICFInOCJRIFGAJxIFzGJhkVnMJGGSNE0UfAcSBRs6z4cL5gCFt1HhSRT2A4lEAYJIFAzWI+TIEZhIFEgUAIlEwXyQEKROcESiQKIATyQKmMXCIrOYScIkaZgoBP0WEoXaSULlvE/l3EfqbZR6ooX9QCJagCCiBYP1CDlyBCaiBaIFQCJaMB8kBKkTHBEtEC3AE9ECrrGwyDVmkjBJmkYLg43C5zHDZ4kf7mbgVAbI3IpZj7BKV4t89LtXMffQ92eol0nqzMKKpM4VskjqSOogiKTObj1CjhyBiaSOpA6QSOrMBwlB6gRHJHUkdfBEUkcIIywKYZgkTJLdJ0nlqjtwWSuXb9sVdvKylonRsJUAlh+goRHqYOFGBGs8WESwrpBFBEsEC0FEsHbrEXLkCExEsESwgEQEaz5ICFInOCKCJYKFJyJYO2MY0jUmCZOk6SQhgnXhspaJUeDAD3bRB1G3GdIHkRORE0EQORFyhBwZABM5ETkRIJETmQ8SgtQJjsiJyIngiZzITq+YCOCZJwmT4SkmQ7OLXgp2D0cTRxONxtGkgaTgPTxMOJo4moCEo2k+SAhSJzjC0cTRhCccTRxN4YSjWa7qld+G8Xq8MfZQZdKAdd3Gdb2uTsJIxkgGIYxkuwUJPXIEJoxkjGRAwkg2HyQEqRMcYSRjJMMTRjJGsnDCSOatsRZOhmYXvRTsPhmBCRXwEMm2UbLJCPYkiYwAhMgIDBYk9MgRmMgIyAgAiYzAfJAQpE5wREZARgBPZARkBIKMgIzA/IxgSAfZTuFbqvGWDtLbUvieo9Q2KjUdJB0kHNFB0kHCk0k8PW8HWQJ7Sgn51Kg+rH078PoIruTjB9c/6kjqSDiijrRHnKgjnePpEHWkX3lvpXe671vDHpC+L+OH9qF97rBap320ZLRk4ERLhiwhS+ZwREtGSwZPVrRkvDnMofcDfdubw8oaqLJ4+z0++vgEVdDDnzX5jmXbxmW7rp3A6KKjACWMLjt6CYyuzuCE0YUswRFGlz3ihNHlHE8YXQKjy6xPQZbVUaU88j2+Tu9QZZLHum7jul7Xb2AqYyqDEqayC7IESo6ghKmMqQxO7SkTpjKyBEeYytaIE6ayczxhKgtMZbNMZSYJk+TuW2xP2sgXKJMpkzsj62QKZAqgRKaAKoGS0SiRKZApgFN7ykSmgCzBEZmCNeJEpuAcT2QKAru4U5kCk+HQP9fj95tkBI80krUXnUp4n0rYR7ptlG5yA3IDUCI3cFWWQMkRlMgNyA3AqT1lIjdAluCI3MAacSI3cI4ncgOBVdyp3IBJYs8kKQvl0zY+i3BneM0tmcerqytja+YAkbdR5EkYSBhAiYQBKweUjEaJhIGEAZzaUyYSBmQJjkgYrBEnEgbneCJhEJjHJAxMEiMnyVrgg6obWrFwhnzbEWUyst603SSnMwQpcjpnmCKnI6cDJXI6Kj1QMgYlcjpyOnBqT5nI6ZAlOCKns0acyOmc44mcThDBkNMxSWyYJJvkrkdyR+GM0O8g9CR3JHcw9fRMkdyR3IESyR2VHigZgxLJHckdOLWnTCR3yBIckdxZI04kd87xRHInCGUMCGWYJEyS5smdP6h0ov19k7vqIFFDU0N3RfPrelF+jssosPg5LmfIIsojygMlojwXZAmUHEGJKI8oD5zaUyaiPGQJjojyrBEnojzneCLKE6Q0BqQ0TBImSYNJUrnqDlzWyuXbdoWdvKxl/zNsI4+tPE/6IPqgrtRtxLHGg0Uc6wxZxLHEsaBEHOuCLIGSIygRxxLHglN7ykQciyzBEXGsNeJEHOscT8SxgqTNiKSNScIkIY7tUhx73EYcy1dyVtWeVqg7pRuJrPEeA4msM2SRyJLIghKJrAuyBEqOoEQiSyILTu0pE4kssgRHJLLWiBOJrHM8kcgKwjYjwjYmCZPkGxJZky+fvclrs8tU9jNBGz96yBcQ09h0sRAjBSIFAiVSIFQJlIxGiRSIFAic2lMmUiBkCY5IgawRJ1Ig53giBRIY/EYY/M81SZgMh44LvMr3Yw73dWT4PNYdBdyrBPbQbBs1u6YGHuLMtANSWeBuiQu8LSCdA5IjIGHKYMrAEaYMpgw8YcpgytjWh3+bKVOu3ccu9OcmdRV8q0OHVm/ac9pzQHoakGjPac/hiPac9hyeaM9pz7vYnge+C+15s2JIj7BKV4t89I0rhgJWbxtXb9pz2nNAehqQaM9pz+GI9pz2HJ5oz2nPO9meN2gmHlu7D9ZN+Aat2cNB7Yq9d+UT9B5epvlI9MHrHvoH+gc4on+gf4CnjvQPa2Arv6cVPMF3VCF8CJ97oNYIH80XzRfs0HyhQXBE80XzBU+W8eRUeCMIaQ78VUODzVrc3/Y16sb2A0a9tWuvoiZgDbZwDa6pafCn6A3gCH/KmJ4Af6pz7OBPoUFwhD+FPwVP+FP4U3b7U1svup5k+iVEt0rfX3zosPhvvSBv/m7w324P+Xrv9d/N7r23qQSykJv3nvSldyKP5Yk8lZ4nvUB6vgz6MhjIYCgD/WdPegPp9eVQeqfS70lfP8aX/on0+9I/lYGn63PpD6Q/lP6x9PUj9J7HMtCHkX05yLlcpUV/dSzFLNFr6JlQYz2n/vkXd7FGiw==";
function exportjson() {
    var filename;
    //We use the Pako library to entropy code the data
    //Final data reads "EDS0010000" and thereafter a 64base encoding of the deflated output from Pako
    //filename = "eendraadschema.eds";
    filename = structure.properties.filename;
    var text = JSON.stringify(structure);
    try {
        var decoder = new TextDecoder("utf-8");
        var encoder = new TextEncoder();
        var pako_inflated = new Uint8Array(encoder.encode(text));
        var pako_deflated = new Uint8Array(pako.deflate(pako_inflated));
        text = "EDS0010000" + btoa(String.fromCharCode.apply(null, pako_deflated));
    }
    catch (error) {
        //We keep the non encoded text and do nothing
    }
    finally {
        download_by_blob(text, filename, 'data:text/plain;charset=utf-8');
    }
}
function HLCollapseExpand(my_id, state) {
    var ordinal;
    ordinal = structure.getOrdinalById(my_id);
    if (state == undefined) {
        structure.data[ordinal].collapsed = !structure.data[ordinal].collapsed;
    }
    else {
        structure.data[ordinal].collapsed = state;
    }
    HLRedrawTree();
}
function HLDelete(my_id) {
    structure.deleteById(my_id);
    HLRedrawTree();
}
function HLAdd(my_id) {
    structure.addItem(new Electro_Item());
    HLRedrawTree();
}
function HLInsertBefore(my_id) {
    structure.insertItemBeforeId(new Electro_Item(), my_id);
    HLRedrawTree();
}
function HLInsertAfter(my_id) {
    structure.insertItemAfterId(new Electro_Item(), my_id);
    HLRedrawTree();
}
function HLMoveDown(my_id) {
    structure.MoveDown(my_id);
    HLRedrawTree();
}
function HLMoveUp(my_id) {
    structure.MoveUp(my_id);
    HLRedrawTree();
}
function HLInsertChild(my_id) {
    structure.insertChildAfterId(new Electro_Item(), my_id);
    HLCollapseExpand(my_id, false);
    //No need to call HLRedrawTree as HLCollapseExpand already does that
}
function HLUpdate(my_id, key, type, docId) {
    switch (type) {
        case "SELECT":
            var setvalueselect = document.getElementById(docId).value;
            structure.data[structure.getOrdinalById(my_id)].setKey(key, setvalueselect);
            HLRedrawTreeHTML();
            break;
        case "STRING":
            var setvaluestr = document.getElementById(docId).value;
            structure.data[structure.getOrdinalById(my_id)].setKey(key, setvaluestr);
            break;
        case "BOOLEAN":
            var setvaluebool = document.getElementById(docId).checked;
            structure.data[structure.getOrdinalById(my_id)].setKey(key, setvaluebool);
            HLRedrawTreeHTML();
            break;
    }
    HLRedrawTreeSVG();
}
function HL_editmode() {
    structure.mode = document.getElementById("edit_mode").value;
    HLRedrawTreeHTML();
}
function HL_changeparent(my_id) {
    //-- See what the new parentid is --
    var str_newparentid = document.getElementById("id_parent_change_" + my_id).value;
    //-- Check that it is valid. It needs to be a number and the parent an active component --
    var error = 0;
    var parentOrdinal = 0;
    if (!isInt(str_newparentid)) {
        error = 1;
    }
    var int_newparentid = parseInt(str_newparentid);
    if (int_newparentid != 0) {
        parentOrdinal = structure.getOrdinalById(int_newparentid);
        if (typeof (parentOrdinal) == "undefined") {
            error = 1;
        }
        else {
            if (!structure.active[parentOrdinal]) {
                error = 1;
            }
        }
    }
    if (error == 1) {
        alert("Dat is geen geldig moeder-object. Probeer opnieuw.");
    }
    else {
        structure.data[structure.getOrdinalById(my_id)].parent = int_newparentid;
        structure.data[structure.getOrdinalById(my_id)].Parent_Item = structure.data[parentOrdinal];
    }
    HLRedrawTree();
}
function HL_changeFilename() {
    var regex = new RegExp('^[-_ A-Za-z0-9]{2,}\\.eds$');
    var filename = document.getElementById("filename").value;
    if (regex.test(filename)) {
        structure.properties.setFilename(document.getElementById("filename").value);
        document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
    }
}
function HL_enterSettings() {
    document.getElementById("settings").innerHTML = '<input type="text" id="filename" onchange="HL_changeFilename()" value="" pattern="^[-_ A-Za-z0-9]{2,}\\\.eds$">&nbsp;<i>Gebruik enkel alphanumerieke karakters a-z A-Z 0-9, streepjes en spaties. Eindig met ".eds". Druk daarna op enter.</i>';
}
function HLRedrawTreeHTML() {
    document.getElementById("configsection").innerHTML = "";
    document.getElementById("left_col_inner").innerHTML = structure.toHTML(0);
}
function HLRedrawTreeSVG() {
    document.getElementById("right_col_inner").innerHTML = '<b>Tekening: </b><button onclick=download("html")>Download als html</button>';
    document.getElementById("right_col_inner").innerHTML += '&nbsp;<button onclick=download("svg")>Download als svg</button>';
    document.getElementById("right_col_inner").innerHTML += '&nbsp;<input type="checkbox" id="noGroup" checked></input><small>SVG elementen niet groeperen (aanbevolen voor meeste tekenprogramma\'s)</small>';
    document.getElementById("right_col_inner").innerHTML += '<br><small><i>Noot: De knoppen hierboven laden enkel de tekening. Wenst u het schema ook later te bewerken, gebruik dan "Export" in het hoofdmenu.</i></small><br><br>';
    document.getElementById("right_col_inner").innerHTML += structure.toSVG(0, "horizontal").data;
    document.getElementById("right_col_inner").innerHTML += "\n    <h2>Legend:</h2>\n    <button style=\"background-color:green;\">&#9650;</button> Item hierboven invoegen (zelfde niveau)<br>\n    <button style=\"background-color:green;\">&#9660;</button> Item hieronder invoegen (zelfde niveau)<br>\n    <button style=\"background-color:green;\">&#9654;</button> Afhankelijk item hieronder toevoegen (niveau dieper)<br>\n    <button style=\"background-color:red;\">&#9851;</button> Item verwijderen<br>\n  ";
    document.getElementById("right_col_inner").innerHTML += '<i><br><small>Versie: ' + CONF_builddate +
        ' (C) Ivan Goethals -- <a href="license.html" target="popup" onclick="window.open(\'license.html\',\'popup\',\'width=800,height=600\'); return false;">GPLv3</a></small></i><br><br>';
}
function HLRedrawTree() {
    HLRedrawTreeHTML();
    HLRedrawTreeSVG();
}
function buildNewStructure(structure) {
    //Paremeterisation of the electro board
    var aantalDrogeKringen = CONF_aantal_droge_kringen;
    var aantalNatteKringen = CONF_aantal_natte_kringen;
    ;
    //Eerst het hoofddifferentieel maken
    var itemCounter = 0;
    structure.addItem(new Electro_Item());
    structure.data[0].setKey("type", "Aansluiting");
    structure.data[0].setKey("naam", "");
    structure.data[0].setKey("zekering", "differentieel");
    structure.data[0].setKey("aantal", CONF_aantal_fazen_droog);
    structure.data[0].setKey("amperage", CONF_hoofdzekering);
    structure.data[0].setKey("kabel", CONF_aantal_fazen_droog + "x16");
    structure.data[0].setKey("kabel_aanwezig", false);
    structure.data[0].setKey("differentieel_waarde", CONF_differentieel_droog);
    itemCounter++;
    //Dan het hoofdbord maken
    structure.insertChildAfterId(new Electro_Item(structure.data[itemCounter - 1]), itemCounter);
    structure.data[itemCounter].setKey("type", "Bord");
    itemCounter++;
    var droogBordCounter = itemCounter;
    //Nat bord voorzien
    structure.insertChildAfterId(new Electro_Item(structure.data[itemCounter - 1]), itemCounter);
    structure.data[itemCounter].setKey("type", "Kring");
    structure.data[itemCounter].setKey("naam", "");
    structure.data[itemCounter].setKey("zekering", "differentieel");
    structure.data[itemCounter].setKey("aantal", CONF_aantal_fazen_nat);
    structure.data[itemCounter].setKey("amperage", CONF_hoofdzekering);
    structure.data[itemCounter].setKey("kabel", "");
    structure.data[itemCounter].setKey("kabel_aanwezig", false);
    structure.data[itemCounter].setKey("differentieel_waarde", CONF_differentieel_nat);
    itemCounter++;
    structure.insertChildAfterId(new Electro_Item(structure.data[itemCounter - 1]), itemCounter);
    structure.data[itemCounter].setKey("type", "Bord");
    structure.data[itemCounter].setKey("geaard", false);
    itemCounter++;
    //3 kringen toevoegen aan nat bord
    var natBordCounter = itemCounter;
    for (var i = 0; i < aantalNatteKringen; i++) {
        structure.insertChildAfterId(new Electro_Item(structure.data[natBordCounter - 1]), natBordCounter);
        structure.data[structure.getOrdinalById(itemCounter + 1)].setKey("type", "Kring");
        structure.data[structure.getOrdinalById(itemCounter + 1)].setKey("naam", aantalDrogeKringen + aantalNatteKringen - i);
        itemCounter++;
    }
    ;
    //7 droge kringen toevoegen aan droog bord
    for (var i = 0; i < aantalDrogeKringen; i++) {
        structure.insertChildAfterId(new Electro_Item(structure.data[structure.getOrdinalById(droogBordCounter)]), droogBordCounter);
        structure.data[structure.getOrdinalById(itemCounter + 1)].setKey("type", "Kring");
        structure.data[structure.getOrdinalById(itemCounter + 1)].setKey("naam", aantalDrogeKringen - i);
        itemCounter++;
    }
}
function reset_all() {
    structure = new Hierarchical_List();
    buildNewStructure(structure);
    HLRedrawTree();
}
function restart_all() {
    var strleft = CONFIGPAGE_LEFT;
    strleft +=
        "\n    Hoofddifferentieel (in mA) <input id=\"differentieel_droog\" type=\"text\" size=\"5\" maxlength=\"5\" value=\"300\"><br>\n    Hoofdzekering (in A) <input id=\"hoofdzekering\" type=\"text\" size=\"4\" maxlength=\"4\" value=\"65\"><br><br>\n    Aantal fazen:\n    <select id=\"aantal_fazen_droog\"><option value=\"2\">2p</option><option value=\"3\">3p</option><option value=\"4\">4p (3p+n)</option></select>\n    <br><br>\n    Aantal kringen droog:\n    <select id=\"aantal_droge_kringen\">\n  ";
    for (var i = 1; i < 51; i++) {
        if (i == 7) {
            strleft = strleft + '<option selected="selected" value="' + i + '">' + i + '</option>';
        }
        else {
            strleft = strleft + '<option value="' + i + '">' + i + '</option>';
        }
    }
    strleft += "\n    </select>\n    <br>\n    Aantal kringen nat:\n    <select id=\"aantal_natte_kringen\">\n  ";
    for (var i = 1; i < 21; i++) {
        if (i == 3) {
            strleft = strleft + '<option selected="selected" value="' + i + '">' + i + '</option>';
        }
        else {
            strleft = strleft + '<option value="' + i + '">' + i + '</option>';
        }
    }
    strleft += "\n    </select><br><br>\n    Aantal fazen nat: <select id=\"aantal_fazen_nat\"><option value=\"2\">2p</option><option value=\"3\">3p</option><option value=\"4\">4p (3p+n)</option></select><br>\n    Differentieel nat (in mA) <input id=\"differentieel_nat\" type=\"text\" size=\"5\" maxlength=\"5\" value=\"30\"><br>\n  ";
    //<button onclick="read_settings()">Start</button>
    var strright = "<br><br><br><br>\n    Deze tool tekent een &eacute;&eacute;ndraadschema.\n    De tool is in volle ontwikkeling en laat thans toe meer complexe\n    schakelingen met gesplitste kringen en horizontale aaneenschakelingen\n    van gebruikers (bvb koelkast achter een stopcontact) uit te voeren.\n    <br><br>\n    Eveneens kunnen de schemas worden opgeslagen en weer ingeladen\n    voor latere aanpassing (zie knoppen \"export\" en \"bladeren\").\n    <br><br>\n    Op basis van een screenshot-tool (bvb snipping-tool in Windows) kan het gegenereerde\n    &eacute;&eacute;ndraadschema verder verwerkt worden in een meer complete schets.\n    Een andere mogelijkheid is het eendraadschema te exporteren (SVG-vector-graphics) en verder te verwerken\n    met een professionele tool zoals Inkscape (open source optie).\n    <br><br>\n     Nuttige tips:\n    <ul>\n      <li>Kies \"meerdere gebruikers\" om horizontale ketens te bouwen, bijvoorbeeld een koelkast na een stopcontact.</li>\n      <li>Een schakelbaar stopcontact kan gemaakt worden door onder \"meerdere gebruikers\" eerst een lichtcircuit met \"0\" lampen gevolgd door een stopcontact te voorzien.</li>\n    </ul>\n  ";
    strleft += CONFIGPAGE_RIGHT;
    document.getElementById("configsection").innerHTML = strleft;
    document.getElementById("left_col_inner").innerHTML = "";
    document.getElementById("right_col_inner").innerHTML = "";
    if (browser_ie_detected()) {
        alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
    }
}
function import_to_structure(mystring) {
    var text = "";
    //If first 3 bytes read "EDS", it is an entropy coded file
    //The first 3 bytes are EDS, the next 3 bytes indicate the version (currently only 001 implemented)
    //the next 4 bytes are decimal zeroes "0000"
    //thereafter is a base64 encoded data-structure
    if ((mystring.charCodeAt(0) == 69) && (mystring.charCodeAt(1) == 68) && (mystring.charCodeAt(2) == 83)) { //recognize as EDS
        mystring = atob(mystring.substring(10, mystring.length));
        var buffer = new Uint8Array(mystring.length);
        for (var i = 0; i < mystring.length; i++) {
            buffer[i - 0] = mystring.charCodeAt(i);
        }
        try { //See if the text decoder works, if not, we will do it manually (slower)
            var decoder = new TextDecoder("utf-8");
            text = decoder.decode(pako.inflate(buffer));
        }
        catch (error) { //Continue without the text decoder (old browsers)
            var inflated = pako.inflate(buffer);
            text = "";
            for (i = 0; i < inflated.length; i++) {
                text += String.fromCharCode(inflated[i]);
            }
        }
    }
    //If first 3 bytes do not read "EDS", the file is in the old non encoded format and can be used as is
    else {
        text = mystring;
    }
    var mystructure = new Hierarchical_List();
    structure = new Hierarchical_List();
    var obj = JSON.parse(text);
    Object.assign(mystructure, obj);
    if (typeof structure.properties.filename != "undefined") {
        structure.properties.filename = mystructure.properties.filename;
    }
    for (var i = 0; i < mystructure.length; i++) {
        if (mystructure.data[i].parent == 0) {
            structure.addItem(new Electro_Item());
            structure.data[i].parent = 0;
        }
        else {
            structure.addItem(new Electro_Item(structure.data[structure.getOrdinalById(mystructure.data[i].parent)]));
            structure.data[i].parent = mystructure.data[i].parent;
        }
        structure.active[i] = mystructure.active[i];
        structure.id[i] = mystructure.id[i];
        for (var j = 0; j < mystructure.data[i].keys.length; j++) {
            structure.data[i].keys[j] = mystructure.data[i].keys[j];
        }
        structure.data[i].id = mystructure.data[i].id;
        structure.data[i].indent = mystructure.data[i].indent;
        structure.data[i].collapsed = mystructure.data[i].collapsed;
        //Parent_Item: List_Item;
    }
    HLRedrawTree();
}
function load_example(nr) {
    switch (nr) {
        case 0:
            import_to_structure(EXAMPLE0);
            break;
        case 1:
            import_to_structure(EXAMPLE1);
            break;
    }
}
var importjson = function (event) {
    var input = event.target;
    var reader = new FileReader();
    var text = "";
    reader.onload = function () {
        var mystring = reader.result.toString();
        //If first 3 bytes read "EDS", it is an entropy coded file
        //The first 3 bytes are EDS, the next 3 bytes indicate the version (currently only 001 implemented)
        //the next 4 bytes are decimal zeroes "0000"
        //thereafter is a base64 encoded data-structure
        if ((mystring.charCodeAt(0) == 69) && (mystring.charCodeAt(1) == 68) && (mystring.charCodeAt(2) == 83)) { //recognize as EDS
            mystring = atob(mystring.substring(10, mystring.length));
            var buffer = new Uint8Array(mystring.length);
            for (var i = 0; i < mystring.length; i++) {
                buffer[i - 0] = mystring.charCodeAt(i);
            }
            try { //See if the text decoder works, if not, we will do it manually (slower)
                var decoder = new TextDecoder("utf-8");
                text = decoder.decode(pako.inflate(buffer));
            }
            catch (error) { //Continue without the text decoder (old browsers)
                var inflated = pako.inflate(buffer);
                text = "";
                for (i = 0; i < inflated.length; i++) {
                    text += String.fromCharCode(inflated[i]);
                }
            }
        }
        //If first 3 bytes do not read "EDS", the file is in the old non encoded format and can be used as is
        else {
            text = mystring;
        }
        //code to transform input read into memory structure
        import_to_structure(text);
    };
    reader.readAsText(input.files[0]);
};
function importclicked() {
    document.getElementById('importfile').click();
    document.getElementById('importfile').value = "";
}
function download_by_blob(text, filename, mimeType) {
    var element = document.createElement('a');
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(new Blob([text], {
            type: mimeType
        }), filename);
    }
    else if (URL && 'download' in element) {
        var uriContent = URL.createObjectURL(new Blob([text], { type: mimeType }));
        element.setAttribute('href', uriContent);
        //element.setAttribute('href', mimeType + ',' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        /*    const id = GetUniqueID();
            this.renderer.setAttribute(a, 'id', id);
            this.renderer.setAttribute(a, 'href', URL.createObjectURL(new Blob([content], {
              type: mimeType
            })));
        
            this.renderer.setAttribute(a, 'download', fileName);
            this.renderer.appendChild(document.body, a);
        
            const anchor = this.renderer.selectRootElement(`#${id}`);
            anchor.click();
        
            this.renderer.removeChild(document.body, a);*/
    }
    else {
        this.location.go(mimeType + "," + encodeURIComponent(text));
    }
}
function download(type) {
    var filename;
    switch (type) {
        case "html": {
            filename = "eendraadschema.html";
            break;
        }
        case "svg": {
            filename = "eendraadschema.svg";
            break;
        }
    }
    var text = structure.toSVG(0, "horizontal").data;
    //Experimental, flatten everything
    if (document.getElementById("noGroup").checked == true) {
        text = flattenSVGfromString(text);
    }
    download_by_blob(text, filename, 'data:text/plain;charset=utf-8');
}
function read_settings() {
    CONF_aantal_droge_kringen = parseInt(document.getElementById("aantal_droge_kringen").value);
    CONF_aantal_natte_kringen = parseInt(document.getElementById("aantal_natte_kringen").value);
    CONF_aantal_fazen_droog = parseInt(document.getElementById("aantal_fazen_droog").value);
    CONF_aantal_fazen_nat = parseInt(document.getElementById("aantal_fazen_nat").value);
    CONF_hoofdzekering = parseInt(document.getElementById("hoofdzekering").value);
    CONF_differentieel_droog = parseInt(document.getElementById("differentieel_droog").value);
    CONF_differentieel_nat = parseInt(document.getElementById("differentieel_nat").value);
    reset_all();
}
var CONF_aantal_droge_kringen = 7;
var CONF_aantal_natte_kringen = 3;
var CONF_aantal_fazen_droog = 2;
var CONF_aantal_fazen_nat = 2;
var CONF_hoofdzekering = 65;
var CONF_differentieel_droog = 300;
var CONF_differentieel_nat = 30;
var CONF_upload_OK = "ask"; //can be "ask", "yes", "no";
var structure;
restart_all();
