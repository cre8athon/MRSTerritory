// ==UserScript==
// @name         MRS Call Territory
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.iamresponding.com/v3/*
// @grant        none
// ==/UserScript==

//TODO ==================================================================
//TODO: 1) If on "Directions" view - update different set of divs
// 2) If '&' received - Find each street, and if all are the same territory - use that territory.  Otherwise, not found.  (example: HODGE DR & LINBERGER DR)
// 3) I think it is ok to hardcode all highways to Green Knoll (check that)
//
// TODO: 10:18:21 Nov 3, 2016:
//     scctxt@co.somerset.nj.us:GKL-RS:16255597:11/03/2016 10:18:05:STRUCTURE FIRE: BOUND B-123 VOSSELLER AVE
//     undefinedundefined

var parseText = function(text) {
//    console.log('About to parse text: ' + text);
    var addressText = text.split(':').pop().split('-').pop();
    var addressDescr;

    var slashIdx = addressText.indexOf('\/');
    if( slashIdx > 0 ) {
        addressDescr = addressText.substring(0, slashIdx);
        addressText = addressText.substring(slashIdx+1);
  }
  return addressText.trim();
};

function makeTerritorySpanElement(territory) {
	var territorySpan;
    if( territory == 'Not Found' ) {
        territorySpan = '<span style="color:red;background-color:yellow;border-style:solid;border-color:black;border-width:1px;padding:2px;">';
    } else if( territory == 'Martinsville' ) {
        territorySpan = '<span style="color:white;background-color:blue;border-style:solid;border-color:black;border-width:1px;padding:2px;">';
    } else if( territory == 'Green Knoll' ) {
        territorySpan = '<span style="color:white;background-color:green;border-style:solid;border-color:black;border-width:1px;padding:2px;">';
    } else {
    	territorySpan = '<span style="color:black;background-color:yellow;border-style:solid;border-color:black;border-width:1px;padding:2px;">';
    }
    return territorySpan;
}

function processMainViewChildren() {
    console.log('>> processMainViewChildren children: ');
    $('#tblDispatchMessages').children().each(function() {
        if( $(this).find('#territory').length === 0 ) {
            var territory = findTerritory(parseText($(this).text()));
            var territorySpan = makeTerritorySpanElement(territory);
            console.log('>> old height: ' + $(this).height());
            $(this).height('+=40');
            console.log('<< new height: ' + $(this).height());
            //$(this).css('height', $(this).height() + 10);
            $(this).append("<div id='territory'><b>" + territorySpan + territory + "</span></b></div>");
        }
    });
}

function processAltViewChildren() {
    console.log(">> in processAltViewChildren");
	$('#tblDispatchMessages').find('li').each(function(idx, li) {
		console.log('Checking li: ' + parseText($(li).text()));
        if( $(li).find('#territory').length === 0 ) {
			var territory = findTerritory(parseText($(this).text()));
	        var territorySpan = makeTerritorySpanElement(territory);
	        $(this).find('label').append("<div id='territory'><b>" + territorySpan + territory + "</span></b></div>");
	    }
	});
}

var testIncidents = function() {
    if( $('#tblDispatchMessages').children(':first').is('div') ) {
		processMainViewChildren();
    } else if( $('#tblDispatchMessages').find('li').length == 1 ) {
        processAltViewChildren();
    }
};

$(document).ready(function() {
    readJson();
    setInterval(testIncidents, 1000*3);
});


// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// Locator book below:
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

var locatorBook;
var streetAlias;
var NOT_FOUND = 'Not Found';
var MARTINSVILLE = 'Martinsville';
var GREEN_KNOLL = 'Green Knoll';
var MUTUAL_AID = 'Mutual Aid';

var loggingEnabled = false;


function log(message) {
	if( loggingEnabled ) {
		console.log(message);
	}
}

var streetModifiers = {
	'rd' : 'road',
	'ln':'lane',
	'dr': 'drive',
	'st': 'street',
	'tr' : 'trail',
	'ct': 'court',
	'pl': 'place',
	'ave': 'avenue',
	'n': 'north',
	's': 'south',
	'av': 'avenue',
	'rdg': 'ridge',
    'cir': 'circle',
    'ter': 'terrace',
    'lndg': 'landing'
};

var absoluteValues = {
	'rt. 202/206' : GREEN_KNOLL,
	'rt. 22' : GREEN_KNOLL,
	'u s hwy' : GREEN_KNOLL,
	'commons way' : GREEN_KNOLL,
	'rte 287' : MUTUAL_AID,
	'rte 202': GREEN_KNOLL,
	'hwy no 28': MUTUAL_AID
};

var nsewMap = {n:'north', s:'south', e:'east', w:'west'};

function normalizeStreetName(street) {
	if( street.indexOf('#') > 0 ) {
		street = street.substring(0, street.indexOf('#'));
		street = street.trim();
	}
	return street.replace(/ /g, '_').toLowerCase().trim();
}

function findStreetByName(street) {
	var retStreetValue;

	$.each(locatorBook.street_addresses, function(streetKey, streetValue) {
		if( streetKey === street ) {
			retStreetValue = streetValue;
			return false; // breaks the loop
		}
	});

	log("\t\t<< findStreetByname called with: |" + street + "| returning: " + JSON.stringify(retStreetValue));
	return retStreetValue;
}

function findStreetByAlias(street) {
	var retStreetValue;

	$.each(streetAlias.street_alias, function(streetKey, streetAlias) {
		if( streetKey == street ) {
			retStreetValue = findStreetByName(streetAlias);
			return false; // breaks the loop
		}
	});

	log('\t\t<< findStreetByAlias caled with: ' + street + ' returning: ' + retStreetValue);
	return retStreetValue;
}

function findRange(streetNum, ranges) {
	var retTerritory = NOT_FOUND;

	// If there is no street number provided, all ranges must be for same territory
	if( streetNum === 0 ) {
		$.each(ranges, function(range, territory) {
			if( retTerritory.length == 0 ) {
				retTerritory = territory;
			} else if( retTerritory != territory ) {
				log("findRange: Unable to find territory because streetNumber was not provided and street spans multiple territories");
				return false;
			}
		});

	} else {
		// If there is a zero, the whole street applies
		$.each(ranges, function(range, territory) {
			if( range === "0" ) {
				retTerritory = territory;
				return false;
			}

			if( range.indexOf('-') > 0 ) {
				var lowRange = parseInt(range.substring(0, range.indexOf('-')));
				var highRange = parseInt(range.substring(range.indexOf('-')+1));

				if( streetNum >= lowRange && streetNum <= highRange ) {
					retTerritory = territory;
					return false;
				}
			} else if( range.indexOf('and') > 0 ) {
				if( streetNum == range.split('and')[0] || streetNum == range.split('and')[1] ) {
					retTerritory = territory;
					return false;
				}
			} 
		});
	}
	log('findRange(' + streetNum + ") returning: " + retTerritory);
	return retTerritory;
}

function chopLast(street) {
	return street.substring(0, street.lastIndexOf('_'));
}

function chopFirst(street) {
	var retval = [];
	var firstUnder = street.indexOf('_');	
	retval[0] = street.substring(0, firstUnder);
	retval[1] = street.substring(firstUnder+1);

	return retval;
}

function checkAbsoluteValues(rawStreetName) {
	var lowerStreetName = rawStreetName.toLowerCase();
	var retval;

	$.each(absoluteValues, function(key, value) {
		if( lowerStreetName.includes(key) ) {
			retval = value;
			return false;
		}
	});
	return retval;
}

// ================================================
var findPlain = function(streetName) {
	return streetName;
}

var replaceStreetAbbr = function(street) {
	var lastUnder = street.lastIndexOf('_');
	if( lastUnder <= 0 ) {
		return street;
	}

	var name = street.substring(0, lastUnder);
	var lastPart = street.substring(lastUnder+1);

	log("split street: " + street + " into: " + name + " and " + lastPart);
	if( lastPart in streetModifiers ) {
		return name + "_" + streetModifiers[lastPart];
	}

	return street;
}

var reverseReplaceStreetAbbr = function(street) {
	var lastUnder = street.lastIndexOf('_');
	if( lastUnder <= 0 ) {
		return street;
	}

	var name = street.substring(0, lastUnder);
	var lastPart = street.substring(lastUnder+1);

	log("split street: " + street + " into: " + name + " and " + lastPart);
	var retVal = street;

	$.map(streetModifiers, function(value, key) {
		if( lastPart == value ) {
			retVal = name + "_" + key;
			return false;
		}
	});

	return retVal;
}

var findReplaceGeoSuffix = function(streetName) {
	var parts = chopFirst(streetName);
	for( key in nsewMap ) {
		if( parts[0] == key ) {
			return nsewMap[key]+'_'+parts[1];
		}
	}
}

var suffixStreetAbbr = function(streetName) {
	var replaced = findReplaceGeoSuffix(streetName);
	if( replaced !== undefined ) {
		return replaceStreetAbbr(replaced);
	}
}

var dropFloor = function(streetName) {
	var flIdx = streetName.indexOf('_fl_');
	if( flIdx < 0 ) {
		flIdx = streetName.indexOf("_floor_");
	}
	if( flIdx < 0 ) {
		flIdx = streetName.indexOf("_#");
	}

	if( flIdx > 0 ) {
		return streetName.substring(0, flIdx);
	} else {
		return streetName;
	}
}

var dropFloorReplaceAbbr = function(streetName) {
	return replaceStreetAbbr(dropFloor(streetName));
}

var dropFloorRevReplaceAbbr = function(streetName) {
	return reverseReplaceStreetAbbr(dropFloor(streetName));
}

var functors = {
	findPlain,
	replaceStreetAbbr,
	reverseReplaceStreetAbbr,
	findReplaceGeoSuffix,
	suffixStreetAbbr,
	dropFloor,
	dropFloorReplaceAbbr,
	dropFloorRevReplaceAbbr
}

function findStreet(rawStreetName) {
	var streetName = normalizeStreetName(rawStreetName);

	var ret;
	$.each(functors, function(idx, functor) {
		ret = findStreetByName(functor(streetName));
		if( ret === null || ret === undefined ) {
			ret = findStreetByAlias(functor(streetName));
		}		
		if( ret !== null && ret !== undefined ) {
			return false;
		}		
	});

	return ret;
}

// ================================================

// =================================
// =================================
// Main entry point
// =================================
// =================================
function findTerritory(streetAddress) {
	log('findTerritory(' + streetAddress.trim() + ')');

	var hardcodedVal = checkAbsoluteValues(streetAddress);
	if( hardcodedVal !== undefined ) {
		log('<<<<<<<<<<<<<<<<<<<<<<< findStreet returning: ' + hardcodedVal);
		return hardcodedVal;
	}

	var territory = NOT_FOUND;
	var streetNum = streetAddress.replace(/^\s+|\s+$/g,'').split(' ')[0];
	var streetName = streetAddress.replace(/^\s+|\s+$/g,'').substring(streetNum.length+1);

	if( !isNumber(streetNum) ) {
		streetNum = 0;
		streetName = streetAddress.replace(/^\s+|\s+$/g,'');

	}
	log("For address: " + streetAddress + " broke into number: " + streetNum + " and name: " + streetName);

	if( streetAddress.includes('&') ) {
		var streets = streetAddress.split('&');
		var street1 = findStreet(streets[0]);
		var street2 = findStreet(streets[1]);

		if( street1 !== undefined && street2 !== undefined ) {
			territory1 = findRange(0, street1);
			territory2 = findRange(0, street2);
			log('for: ' + streetAddress + ' found territory1 = ' + territory1 + ", territory2 = " + territory2);

			if( territory1 == territory2 ) {
				territory = territory1;
			}
		}
	} else {

		var streetObject = findStreet(streetName);
		if( streetObject !== null && streetObject !== undefined ) {
			range = findRange(parseInt(streetNum), streetObject);
			if( range === null ) {
				territory = NOT_FOUND;
			} else {
				territory = range;
			}
		}
	}

	return territory;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function assertTest(address, expectedLookup, result) {
	function formatProblem() {
		return "Unable to find address: " + address;
	}

	if( findTerritory(address) != expectedLookup ) {
		result.push(formatProblem());
	}
}

function readJson() {
    var locatorBookJSON = '{"street_addresses": {"kathleen_place": {"3-13": "Green Knoll"}, "twin_crook_road": {"1-3": "Martinsville"}, "garfield_avenue": {"792-961": "Green Knoll"}, "papen_road": {"1109-1187": "Martinsville", "887-1089": "Martinsville", "775-879": "Martinsville"}, "tillman_court": {"9-16": "Martinsville"}, "spring_valley_drive": {"500-550": "Green Knoll"}, "adams_court": {"1-8": "Martinsville"}, "crossfield_court": {"0": "Far Hills-Bedminster"}, "roosevelt_street": {"742-899": "Green Knoll", "500-599": "Green Knoll"}, "birch_drive": {"1283-1318": "Martinsville"}, "lawton_road": {"1-27": "Green Knoll"}, "van_holten_road": {"240-480": "Green Knoll"}, "ricky_drive": {"1037-1045": "Martinsville"}, "turnberry_court": {"900-999": "Green Knoll"}, "laurel_trail": {"989-1034": "Martinsville"}, "juleo_court": {"0": "Green Knoll"}, "well_road": {"1354-1390": "Martinsville"}, "cowperthwaite_road": {"1-700": "Far Hills-Bedminster"}, "grandner_court": {"67-72": "Martinsville"}, "anlee_road": {"481-496": "Green Knoll"}, "coventry_square": {"1-99": "Green Knoll"}, "timberline_drive": {"1-42": "Martinsville"}, "amsterdam_road": {"759-804": "Green Knoll"}, "van_nostrand_rise": {"1-99": "Green Knoll"}, "cedar_court": {"0": "Far Hills-Bedminster"}, "hodge_drive": {"1-9": "Martinsville"}, "cardinal_lane": {"843-858": "Green Knoll", "400-499": "Far Hills-Bedminster"}, "mcnab_court": {"1-7": "Martinsville"}, "hillside_avenue": {"1-199": "Green Knoll"}, "brookside_lane": {"1-99": "Far Hills-Bedminster"}, "fall_mountain_court": {"1024-1026": "Martinsville"}, "partridge_drive": {"778-827": "Martinsville"}, "vogt_drive": {"1-99": "Green Knoll"}, "victor_street": {"900-999": "Green Knoll"}, "meyers_way": {"1-7": "Martinsville"}, "linderberry_court": {"3-9": "Martinsville"}, "heritage_court": {"1-99": "Green Knoll"}, "miller_lane": {"799-823": "Martinsville", "100-199": "Green Knoll"}, "wildflower_lane": {"1-99": "Far Hills-Bedminster"}, "william_street": {"900-999": "Green Knoll"}, "somerset_corporate_blvd": {"100-799": "Green Knoll"}, "coriell_drive": {"1354-1397": "Martinsville"}, "exeter_road": {"1-100": "Far Hills-Bedminster"}, "forest_avenue": {"1-39": "Green Knoll"}, "gilbride_road": {"1990-2181": "Martinsville"}, "opal_way": {"0": "Martinsville"}, "lakeview_drive": {"990-1031": "Martinsville"}, "wingate_drive": {"700-799": "Green Knoll"}, "rattlesnake_bridge_rd": {"0": "Far Hills-Bedminster"}, "stangle_road": {"502-654": "Martinsville"}, "glen_eagles_drive": {"1-99": "Green Knoll"}, "catalpa_drive": {"1377-1396": "Martinsville"}, "glenwood_terrace": {"4-20": "Green Knoll"}, "westbrook_road": {"1095-1100": "Martinsville"}, "calgery_lane": {"1-10": "Far Hills-Bedminster"}, "windmill_court": {"200-299": "Green Knoll"}, "ardsley_lane": {"875-961": "Green Knoll"}, "harrow_lane": {"1-10": "Far Hills-Bedminster"}, "tilton_road": {"1332-1342": "Martinsville"}, "shadow_oak_lane": {"997-1009": "Martinsville"}, "seventh_avenue": {"946-950": "Green Knoll"}, "north_shore_drive": {"950-1041": "Martinsville"}, "corporate_drive": {"55and95": "Green Knoll"}, "warren_avenue": {"100-199": "Green Knoll"}, "hoffman_road": {"1000-1099": "Green Knoll"}, "brookdale_drive": {"1643-1689": "Martinsville"}, "hardgrove_road": {"700-799": "Green Knoll"}, "leah_court": {"600-699": "Green Knoll"}, "valley_view_court": {"1-100": "Far Hills-Bedminster"}, "allen_road": {"10-38": "Green Knoll"}, "branch_road": {"100-135": "Green Knoll"}, "bellis_court": {"100-398": "Green Knoll"}, "linberger_drive": {"1-45": "Martinsville"}, "forest_view_drive": {"2-8": "Martinsville"}, "mcmanus_drive": {"1-8": "Martinsville"}, "kennesaw_way": {"1808-1825": "Martinsville"}, "dunbar_court": {"0": "Far Hills-Bedminster"}, "elm_drive": {"1041-1060": "Martinsville"}, "hastings_court": {"1-99": "Green Knoll"}, "chimney_rock_road": {"684-813": "Martinsville"}, "wilde_hollow": {"2-9": "Martinsville"}, "hart_drive": {"713-741": "Green Knoll"}, "ray_court": {"1-100": "Far Hills-Bedminster"}, "wentworth_road": {"1-100": "Far Hills-Bedminster"}, "pennlyn_place": {"610-619": "Green Knoll"}, "somerset_avenue": {"1-199": "Green Knoll"}, "village_circle": {"68-91": "Green Knoll"}, "sherlin_drive": {"1155-1276": "Martinsville"}, "alisyn_place": {"4-8": "Green Knoll"}, "vosseller_avenue": {"798-1048": "Martinsville"}, "magnolia_drive": {"991-998": "Martinsville"}, "longview_road": {"212-240": "Green Knoll"}, "appleman_way": {"2-3": "Martinsville"}, "twin_oaks_road": {"1-99": "Green Knoll"}, "hartwell_court": {"1-99": "Green Knoll"}, "stonehenge_lane": {"1-99": "Green Knoll"}, "claire_drive": {"4-82": "Green Knoll"}, "hemlock_drive": {"1297-1312": "Martinsville"}, "cheshire_road": {"1300-1320": "Martinsville"}, "cabot_hill_road": {"547-600": "Green Knoll"}, "love_road": {"100-299": "Green Knoll"}, "stella_drive": {"1-67": "Green Knoll"}, "mountain_court": {"1-72": "Far Hills-Bedminster"}, "dutch_farm_road": {"200-299": "Green Knoll"}, "adrian_terrace": {"4-5": "Martinsville"}, "rt._22": {"EvenNos.>1000": "Green Knoll", "EvenNos.<1000": "Green Knoll", "OddNos.": "Green Knoll"}, "mayfield_road": {"1-99": "Far Hills-Bedminster"}, "spencer_lane": {"1-100": "Far Hills-Bedminster"}, "west_circle_drive": {"1722-1798": "Martinsville"}, "peters_lane": {"749-763": "Martinsville"}, "brown_road": {"800-899": "Green Knoll", "900-1079": "Martinsville"}, "southbrook_drive": {"1624-1645": "Martinsville"}, "van_pelt_court": {"2-5": "Martinsville"}, "coyle_trail": {"1-6": "Martinsville"}, "hunter_road": {"1414-1457": "Martinsville"}, "joshua_lane": {"1-4": "Martinsville"}, "argonne_farm_drive": {"1-19": "Martinsville"}, "westview_lane": {"100-150": "Far Hills-Bedminster"}, "jaguar_lane": {"300-499": "Green Knoll"}, "south_edgewood_road": {"1-100": "Far Hills-Bedminster"}, "third_avenue": {"1-20": "Green Knoll"}, "cedar_street": {"3-15": "Green Knoll"}, "washington_valley_rd": {"930-1226": "Martinsville", "100-900": "Far Hills-Bedminster", "930-1178": "Martinsville", "2158-2255": "Martinsville", "1395-1603": "Martinsville", "1607-1869": "Martinsville", "1246-1391": "Martinsville", "1872-1973": "Martinsville", "1979-2153": "Martinsville"}, "winding_brook_way": {"400-499": "Green Knoll"}, "cambridge_lane": {"1080-1178": "Martinsville"}, "eddy_lane": {"1-10": "Green Knoll"}, "petron_place": {"700-799": "Green Knoll"}, "winslow_drive": {"2-37": "Martinsville"}, "bellerive_court": {"650-663": "Green Knoll"}, "hill_lane": {"0": "Green Knoll"}, "madison_avenue": {"821-944": "Green Knoll"}, "waterford_lane": {"2": "Martinsville"}, "wimple_way": {"1-10": "Martinsville"}, "lenape_trail": {"450-460": "Green Knoll"}, "assante_lane": {"6-22": "Martinsville"}, "tullo_farm_road": {"980-1093": "Martinsville"}, "timber_lane": {"1006": "Martinsville", "900": "Martinsville"}, "jeffrey_lane": {"3-19": "Martinsville"}, "hagerman_court": {"81-114": "Green Knoll"}, "mount_vernon_rd": {"1232-1400": "Martinsville"}, "quarry_lane": {"749-834": "Martinsville"}, "harding_road": {"700-803": "Green Knoll"}, "spring_run_lane": {"941-997": "Martinsville"}, "blossom_drive": {"3-26": "Martinsville"}, "newmans_lane": {"632-921": "Martinsville"}, "eisenhower_avenue": {"700-899": "Green Knoll"}, "pine_court": {"1-100": "Far Hills-Bedminster"}, "sky_high_terrace": {"1301-1302": "Martinsville", "2-4": "Martinsville"}, "owens_court": {"1-5": "Martinsville"}, "haelig_court": {"4-12": "Martinsville"}, "falcon_court": {"705-720": "Green Knoll"}, "pond_road": {"364-377": "Green Knoll"}, "van_nest_drive": {"706-793": "Martinsville"}, "vicki_drive": {"400-599": "Green Knoll"}, "lawton_place": {"4-7": "Green Knoll"}, "alletra_avenue": {"539-563": "Green Knoll"}, "bittle_court": {"5-10": "Martinsville"}, "baltusrol_way": {"661-685": "Green Knoll"}, "wilpert_road": {"1-10": "Martinsville"}, "mayflower_court": {"1012-1106": "Martinsville"}, "bonney_court": {"92-153": "Green Knoll"}, "solomon_drive": {"7-34": "Martinsville"}, "mine_road": {"715-826": "Green Knoll"}, "monmouth_avenue": {"109": "Green Knoll", "4-39": "Green Knoll"}, "byrd_avenue": {"751-794": "Green Knoll"}, "mount_prospect_rd": {"16-20": "Martinsville"}, "white_oak_ridge_road": {"200-299": "Green Knoll"}, "lockhaven_court": {"1-100": "Far Hills-Bedminster"}, "bluestone_lane": {"820-885": "Green Knoll"}, "dow_road": {"755-884": "Green Knoll"}, "plymouth_rd": {"1344-1412": "Martinsville"}, "carnoustie_drive": {"811-872": "Green Knoll"}, "gibson_terrace": {"1-99": "Green Knoll"}, "short_hills_drive": {"100-299": "Green Knoll"}, "dorset_lane": {"1-100": "Far Hills-Bedminster"}, "wendover_court": {"1-99": "Far Hills-Bedminster"}, "muirfield_lane": {"1-99": "Green Knoll"}, "powelson_lane": {"2-12": "Green Knoll"}, "red_lion_way": {"675-775": "Green Knoll"}, "sussex_avenue": {"902-950": "Green Knoll"}, "ten_eyck_road": {"228-299": "Green Knoll"}, "hedgerow_road": {"241-269": "Green Knoll"}, "new_hill_road": {"200-299": "Green Knoll"}, "hills_drive": {"1-550": "Far Hills-Bedminster"}, "cross_road": {"0": "Green Knoll"}, "schley_mountain_road": {"0": "Far Hills-Bedminster"}, "somerville_road": {"400-582": "Green Knoll"}, "hoagland_court": {"1-30": "Green Knoll"}, "highland_avenue": {"1-199": "Green Knoll"}, "valley_view_road": {"1619-1688": "Martinsville"}, "mountainview_avenue": {"100-140": "Green Knoll"}, "arnold_place": {"1005-1006": "Martinsville"}, "brookside_drive": {"2217-2314": "Martinsville"}, "brightwood_lane": {"1-100": "Far Hills-Bedminster"}, "king_arthurs_court": {"1-99": "Green Knoll"}, "knollcrest_road": {"1-99": "Far Hills-Bedminster"}, "old_stage_coach_road": {"20": "Martinsville"}, "wilkins_lane": {"1-99": "Far Hills-Bedminster"}, "fawn_lane": {"2-8": "Martinsville"}, "wight_street": {"1-99": "Green Knoll"}, "downey_road": {"560-566": "Green Knoll"}, "pluckemin_park_court": {"0": "Far Hills-Bedminster"}, "kale_drive": {"1-10": "Martinsville"}, "northern_drive": {"1-11": "Green Knoll"}, "todd_court": {"2-9": "Martinsville"}, "foxcroft_road": {"607-613": "Green Knoll"}, "sunset_ridge": {"828-1020": "Martinsville"}, "village_green_road": {"1-100": "Far Hills-Bedminster"}, "hawkes_court": {"1-10": "Martinsville"}, "heller_drive": {"1-14": "Green Knoll"}, "vail_court": {"1-8": "Martinsville"}, "ronson_road": {"0": "Green Knoll"}, "ridge_road": {"1812-1890": "Martinsville"}, "eastbrook_rd": {"1030-1097": "Martinsville"}, "fourth_avenue": {"1-22": "Green Knoll"}, "steele_gap_road": {"1530-1999": "Green Knoll", "400-661": "Green Knoll"}, "mallard_drive": {"1315-1393": "Martinsville"}, "steeplechase_lane": {"400-499": "Green Knoll"}, "fairway_court": {"4-12": "Green Knoll"}, "rambler_drive": {"1-99": "Green Knoll"}, "reynard_road": {"200-299": "Green Knoll"}, "bayberry_road": {"451-474": "Green Knoll"}, "blair_court": {"1355-1379": "Martinsville"}, "meiners_drive": {"1361-1390": "Martinsville"}, "hillcrest_rd": {"14-84": "Martinsville"}, "merriwood_drive": {"0": "Green Knoll"}, "wicklow_way": {"101-706": "Green Knoll"}, "riverview_drive": {"250-299": "Green Knoll"}, "wolf_hill_terrace": {"3-21": "Martinsville"}, "thistle_lane": {"200-299": "Far Hills-Bedminster"}, "henry_street": {"1-3": "Green Knoll"}, "fairfield_road": {"1154-1201": "Martinsville"}, "hickory_drive": {"0": "Martinsville"}, "russett_lane": {"78-87": "Martinsville"}, "old_tullo_road": {"917-936": "Martinsville"}, "tower_road": {"2-16": "Martinsville"}, "victoria_drive": {"100-400": "Green Knoll"}, "country_club_road": {"1-800": "Far Hills-Bedminster", "400-600": "Green Knoll", "800-1100": "Green Knoll", "601-800": "Green Knoll"}, "cory_lane": {"2-22": "Green Knoll"}, "cedarbrook_road": {"600-799": "Green Knoll"}, "staffler_road": {"1150-1182": "Martinsville"}, "mckinley_street": {"500-999": "Green Knoll"}, "adamsville_road": {"310-312": "Green Knoll", "317-319": "Green Knoll"}, "grove_street": {"283-399": "Green Knoll"}, "dogwood_lane": {"1-99": "Far Hills-Bedminster"}, "running_brook_road": {"4-35": "Martinsville"}, "berrywood_lane": {"534-546": "Green Knoll"}, "pinevale_road": {"0": "Far Hills-Bedminster"}, "westbrook_court": {"17-22": "Martinsville"}, "severin_drive": {"934-1013": "Martinsville"}, "mahnken_drive": {"400-499": "Green Knoll"}, "concord_drive": {"1100-1150": "Martinsville"}, "byk_place": {"217-226": "Green Knoll"}, "meadow_view_drive": {"100-199": "Green Knoll"}, "arthur_road": {"1-21": "Green Knoll"}, "totten_drive": {"3-65": "Martinsville"}, "cold_spring_lane": {"191-299": "Green Knoll"}, "housten_court": {"3-8": "Martinsville"}, "buchman_court": {"2-5": "Martinsville"}, "helfreds_landing": {"100-299": "Green Knoll"}, "reagan_drive": {"1-10": "Green Knoll"}, "yohn_drive": {"3-8": "Green Knoll"}, "prospect_avenue": {"1-199": "Green Knoll"}, "robin_way": {"1-2": "Green Knoll"}, "airport_road": {"1-500": "Far Hills-Bedminster"}, "carlene_drive": {"600-799": "Green Knoll"}, "bittersweet_terrace": {"534-560": "Green Knoll"}, "ashley_court": {"0": "Far Hills-Bedminster"}, "north_gaston_avenue": {"341-399": "Green Knoll"}, "bunn_road": {"1-500": "Far Hills-Bedminster"}, "dellwood_road": {"1049-1073": "Martinsville"}, "north_edgewood_road": {"1-100": "Far Hills-Bedminster"}, "bell_lane": {"5": "Green Knoll"}, "ash_street": {"1-11": "Green Knoll", "12-99": "Green Knoll"}, "wishnow_way": {"1-6": "Martinsville"}, "prince_rodgers_avenue": {"1300-1500": "Green Knoll"}, "north_crossing": {"1-99": "Green Knoll"}, "bartle_lane": {"1900-1965": "Martinsville"}, "bentley_court": {"1-100": "Far Hills-Bedminster"}, "rosewood_court": {"1-6": "Martinsville"}, "goldfinch_drive": {"200-399": "Green Knoll"}, "pannone_drive": {"0": "Green Knoll"}, "neskell_drive": {"2-10": "Martinsville"}, "curtis_trail": {"1-15": "Martinsville"}, "finch_lane": {"300-399": "Far Hills-Bedminster"}, "rosemary_drive": {"970-1007": "Martinsville"}, "april_drive": {"2204-2252": "Martinsville"}, "ray_street": {"1-99": "Green Knoll"}, "klines_mill_road": {"100-1800": "Far Hills-Bedminster"}, "logan_rd": {"1970": "Martinsville"}, "perrine_rd": {"2150-2207": "Martinsville"}, "great_hills_road": {"100-299": "Green Knoll"}, "peach_tree_road": {"1-10": "Martinsville"}, "croyden_road": {"970-1401": "Martinsville"}, "john_christian_drive": {"673-703": "Green Knoll"}, "st._georges_road": {"680-768": "Green Knoll"}, "frohlin_drive": {"2-37": "Martinsville"}, "gateshead_drive": {"1-29": "Martinsville"}, "terrace_lane": {"300-399": "Far Hills-Bedminster"}, "mckay_drive": {"1-14": "Martinsville"}, "talamini_road": {"598-786": "Green Knoll"}, "birch_hill_drive": {"679-704": "Green Knoll"}, "merriam_drive": {"1711-1759": "Martinsville"}, "buxton_road": {"983-1087": "Martinsville"}, "compton_way": {"3-7": "Martinsville"}, "drysdale_lane": {"2-24": "Green Knoll"}, "gregory_avenue": {"500-599": "Green Knoll"}, "crestmont_road": {"0": "Far Hills-Bedminster"}, "arbor_way": {"2072-2110": "Martinsville"}, "rt._202/206": {"500-845": "Green Knoll", "845-1300": "Green Knoll"}, "south_shore_drive": {"960-1064": "Martinsville"}, "stone_edge_road": {"1-100": "Far Hills-Bedminster"}, "berkley_lane": {"1-100": "Far Hills-Bedminster"}, "glen_ridge_drive_s": {"500-599": "Green Knoll"}, "stevens_lane": {"2-39": "Martinsville"}, "camelot_drive": {"0": "Green Knoll"}, "north_branch_road": {"854-870": "Green Knoll"}, "donald_drive_north": {"665-702": "Green Knoll"}, "deer_run_drive": {"1-99": "Green Knoll"}, "weaver_drive": {"3-28": "Martinsville"}, "edgewood_drive": {"100-199": "Green Knoll"}, "donegal_drive": {"801-1307": "Green Knoll"}, "sarah_court": {"10-19": "Martinsville"}, "mountainside_lane": {"100-199": "Green Knoll"}, "rolling_knolls_way": {"200-399": "Green Knoll"}, "west_foothill_road": {"700-860": "Green Knoll"}, "caruso_court": {"2-8": "Martinsville"}, "abbott_hollow_court": {"2-7": "Martinsville"}, "linvale_lane": {"2-200": "Martinsville"}, "masterpeter_road": {"1919-1924": "Martinsville"}, "tansy_court": {"1-100": "Far Hills-Bedminster"}, "crestwood_drive": {"1-99": "Green Knoll"}, "arrowsmith_drive": {"2-11": "Martinsville"}, "enclave_lane": {"200-399": "Far Hills-Bedminster"}, "candlewick_lane": {"143-273": "Green Knoll"}, "tullo_road": {"1090-1386": "Martinsville"}, "mark_drive": {"1631-1637": "Martinsville"}, "benner_court": {"1-10": "Green Knoll"}, "heath_drive": {"1-26": "Martinsville"}, "beaumonte_way": {"176-198": "Martinsville"}, "martin_court": {"2-12": "Martinsville"}, "greenfield_road": {"270-363": "Green Knoll"}, "walcutt_drive": {"990-1016": "Martinsville"}, "preston_terrace": {"1-200": "Far Hills-Bedminster"}, "oxford_rd": {"1269-1290": "Martinsville"}, "pembrook_lane": {"1-100": "Far Hills-Bedminster"}, "fairacres_drive": {"2-6": "Martinsville"}, "mitchell_lane": {"656-680": "Martinsville"}, "falmouth_place": {"200-299": "Green Knoll"}, "delaware_drive": {"1143-1186": "Martinsville"}, "turnbull_place": {"500-599": "Green Knoll"}, "drum_hill_road": {"1623": "Martinsville", "1404-1451": "Martinsville"}, "spur_court": {"1356-1378": "Martinsville"}, "mcdowell_court": {"23-28": "Martinsville"}, "floral_drive": {"200-299": "Green Knoll"}, "marlin_street": {"1-99": "Green Knoll"}, "sylvan_drive": {"1-99": "Green Knoll"}, "sudbury_lane": {"500-699": "Green Knoll"}, "mountain_top_rd": {"1570-1752": "Martinsville", "1756-1966": "Martinsville", "1400-1555": "Martinsville"}, "stone_gate": {"53-58": "Martinsville"}, "mohawk_trail": {"200-299": "Green Knoll"}, "rose_lane": {"2-8": "Martinsville"}, "ron_court": {"700-710": "Green Knoll"}, "oakura_lane": {"1-99": "Far Hills-Bedminster"}, "fairhand_court": {"29-35": "Martinsville"}, "old_farm_road": {"700-811": "Green Knoll"}, "holland_court": {"200-299": "Green Knoll"}, "geiger_lane": {"1200-1204": "Martinsville"}, "thruway_drive": {"600-700": "Green Knoll", "1-100": "Green Knoll"}, "holmes_court": {"1-4": "Green Knoll"}, "weemac_road": {"764-781": "Martinsville"}, "chamberlin_way": {"1-37": "Martinsville"}, "adams_road": {"4-24": "Martinsville"}, "raymond_court": {"304-323": "Green Knoll"}, "north_stone_edge_road": {"1-100": "Far Hills-Bedminster"}, "edgewood_road": {"1-100": "Far Hills-Bedminster"}, "jason_court": {"878-887": "Green Knoll"}, "larkspur_court": {"1-100": "Far Hills-Bedminster"}, "spruce_court": {"1-100": "Far Hills-Bedminster"}, "shasta_drive": {"449-491": "Green Knoll"}, "peter_par_road": {"400-499": "Green Knoll"}, "wren_lane": {"200-399": "Far Hills-Bedminster"}, "carolkim_drive": {"963-970": "Martinsville"}, "timberbrooke_drive": {"100-1200": "Far Hills-Bedminster"}, "fox_run": {"1-99": "Green Knoll"}, "woodlawn_avenue": {"11-129": "Green Knoll"}, "sunset_drive": {"1010-1031": "Martinsville"}, "richard_street": {"0": "Green Knoll"}, "north_bridge_street": {"444-609": "Green Knoll"}, "black_court": {"2-10": "Martinsville"}, "cushing_drive": {"3-21": "Martinsville"}, "garretson_road": {"300-750": "Green Knoll"}, "south_knob": {"1837-1844": "Martinsville"}, "sage_court": {"1-99": "Far Hills-Bedminster"}, "amur_road": {"1-3": "Martinsville"}, "juniper_lane": {"400-599": "Green Knoll"}, "brandywine_road": {"500-599": "Green Knoll"}, "blazier_road": {"49-70": "Martinsville"}, "orchard_street": {"100-299": "Green Knoll"}, "brian_drive": {"1-9": "Green Knoll"}, "woodfield_road": {"1725-1841": "Martinsville"}, "loller_drive": {"1-3": "Martinsville"}, "hamilton_lane": {"1-10": "Martinsville"}, "farmer_road": {"200-499": "Green Knoll"}, "tok_place": {"891-897": "Martinsville"}, "lyme_rock_road": {"506-570": "Green Knoll"}, "crim_road": {"1143-1391": "Martinsville"}, "diamond_place": {"0": "Martinsville"}, "sherwood_road": {"840-942": "Martinsville"}, "barrington_drive": {"257-309": "Green Knoll"}, "harrison_court": {"3": "Green Knoll", "5": "Green Knoll", "7": "Green Knoll"}, "beadle_court": {"2-5": "Martinsville"}, "waldron_drive": {"1-12": "Martinsville"}, "tobia_road": {"764-789": "Green Knoll"}, "meadow_road": {"520-600": "Green Knoll", "600-900": "Green Knoll", "441-518": "Green Knoll"}, "bolmer_farm_road": {"1792-1895": "Martinsville"}, "fuller_court": {"41-47": "Martinsville"}, "ivanhoe_avenue": {"1-99": "Green Knoll"}, "eileen_way": {"300-399": "Green Knoll"}, "carteret_road": {"955-1114": "Martinsville"}, "presidents_drive": {"0": "Green Knoll"}, "timothy_lane": {"1-100": "Far Hills-Bedminster"}, "strawbridge_street": {"602-699": "Green Knoll"}, "knollwood_drive": {"400-499": "Green Knoll"}, "hauck_road": {"400-499": "Green Knoll"}, "donald_drive_south": {"668-709": "Green Knoll"}, "henley_row": {"1286-1315": "Martinsville"}, "emerald_trail": {"515-618": "Martinsville"}, "commons_way": {"100-700": "Green Knoll"}, "ryan_way": {"1-25": "Martinsville"}, "dogwood_drive": {"1250-1320": "Martinsville"}, "donna_court": {"1-5": "Martinsville"}, "redwood_road": {"1-23": "Martinsville"}, "cornell_road": {"1233-1275": "Martinsville"}, "primrose_lane": {"2086-2134": "Martinsville"}, "crestview_road": {"181-211": "Green Knoll"}, "crossing_blvd": {"200": "Green Knoll", "400": "Green Knoll"}, "cricket_lane": {"1370-1371": "Martinsville"}, "gate_road": {"730-731": "Martinsville"}, "mercer_street": {"509-525": "Green Knoll"}, "star_view_way": {"778-860": "Green Knoll"}, "burning_bush_road": {"684-735": "Green Knoll"}, "somerset_terrace": {"1-200": "Far Hills-Bedminster"}, "milcrip_road": {"0": "Green Knoll"}, "sixth_avenue": {"950-953": "Green Knoll"}, "riverview_road": {"100-263": "Green Knoll"}, "golf_links_drive": {"500-599": "Green Knoll"}, "stryker_court": {"11-134": "Green Knoll"}, "arrowbrook_drive": {"1716-1745": "Martinsville"}, "braemar_place": {"14-38": "Green Knoll"}, "stony_brook_drive": {"300-599": "Green Knoll"}, "long_road": {"1420-1490": "Martinsville"}, "victory_road": {"1-200": "Far Hills-Bedminster"}, "church_road": {"100-300": "Green Knoll"}, "north_view_drive": {"600-799": "Green Knoll"}, "dumont_court": {"0": "Green Knoll"}, "lynne_way": {"2050-2065": "Martinsville"}, "leeham_avenue": {"231-293": "Green Knoll"}, "waterview_road": {"378-392": "Green Knoll"}, "reed_lane": {"100-299": "Far Hills-Bedminster"}, "cambridge_road": {"1-100": "Far Hills-Bedminster"}, "foothill_road": {"618-720": "Green Knoll", "300-587": "Green Knoll", "588-617": "Green Knoll"}, "northfield_road": {"154-180": "Green Knoll"}, "robertson_drive": {"1-100": "Far Hills-Bedminster"}, "old_forge_road": {"700-898": "Green Knoll"}, "griggs_drive": {"100-604": "Green Knoll"}, "cloverleaf_drive": {"0": "Green Knoll"}, "barbara_drive": {"1-5": "Green Knoll"}, "wren_way": {"1-10": "Green Knoll"}, "middle_road": {"1796-1843": "Martinsville"}, "hudson_street": {"4-5": "Green Knoll"}, "mount_horeb_rd": {"1173-1305": "Martinsville"}, "burnt_mills_road": {"0": "Far Hills-Bedminster"}, "evergreen_drive": {"1262-1316": "Martinsville", "1148-1263": "Martinsville"}, "heather_hill_way": {"1-99": "Green Knoll"}, "foxwood_court": {"0": "Far Hills-Bedminster"}, "darby_place": {"0": "Green Knoll"}, "sunnybrook_court": {"21-23": "Martinsville"}, "copper_hill_road": {"3-18": "Green Knoll"}, "loft_drive": {"2-126": "Martinsville"}, "fieldstone_road": {"1-100": "Far Hills-Bedminster", "1930-1957": "Martinsville"}, "lockwood_drive": {"3-5": "Martinsville"}, "roger_ave": {"1301-1397": "Martinsville"}, "edgemont_lane": {"1-100": "Far Hills-Bedminster"}, "colonial_way": {"1101-1300": "Martinsville"}, "maxwell_terrace": {"48-52": "Martinsville"}, "rolling_hills_road": {"400-599": "Green Knoll"}, "davis_court": {"1-20": "Martinsville"}, "cain_court": {"1-81": "Green Knoll"}, "voorhees_lane": {"0": "Green Knoll"}, "stone_run_road": {"1-102": "Far Hills-Bedminster"}, "newland_court": {"36-40": "Martinsville"}, "whitney_court": {"1-2": "Green Knoll"}, "chambers_court": {"981-1047": "Green Knoll"}, "morningside_drive": {"500-599": "Green Knoll"}, "eton_court": {"1-100": "Far Hills-Bedminster"}, "lincoln_street": {"4-5": "Green Knoll"}, "summit_ridge_drive": {"819-828": "Martinsville", "800-816": "Martinsville"}, "howell_road": {"1-2": "Martinsville"}, "sky_hill_road": {"1074-1131": "Green Knoll"}, "glen_ridge_drive": {"590-663": "Green Knoll"}, "beth_court": {"2-6": "Green Knoll"}, "federal_drive": {"800-899": "Green Knoll"}, "nicole_terrace": {"59-66": "Martinsville"}, "overlook_drive": {"1-12": "Green Knoll"}, "rector_road": {"973-1097": "Martinsville"}, "tall_oaks_drive": {"1047-1060": "Green Knoll"}, "hardy_drive": {"1-8": "Martinsville"}, "grimm_drive": {"5-13": "Green Knoll"}, "long_meadow_road": {"100-299": "Far Hills-Bedminster"}}}';
    var streetAliasJSON = '{"street_alias":\
    {"wash_valley":"washington_valley_rd", \
    "roger_av": "roger_ave",\
    "wash_val":"washington_valley_rd",\
    "wash_valley":"washington_valley_rd",\
    "w_valley":"washington_valley_rd",\
    "washington_valley_rd":"washington_valley_rd", \
    "4th_av":"fourth_avenue",\
    "6th_av":"sixth_avenue", \
    "washington_valley_road":"washington_valley_rd"\
    },"group_homes":{"by_name":{"advoserve":true,"badvoserve":true},"by_address":{"1234343":"11 foothill rd","2223332":"263 washington valley rd"}}}';

    locatorBook = $.parseJSON(locatorBookJSON);
	streetAlias = $.parseJSON(streetAliasJSON);
}

