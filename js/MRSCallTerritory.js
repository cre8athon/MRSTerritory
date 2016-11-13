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
        territorySpan = '<span style="color:red">';
    } else if( territory == 'Martinsville' ) {
        territorySpan = '<span style="color:green">';
    } else if( territory == 'Green Knoll' ) {
        territorySpan = '<span style="color:blue">';
    }
    return territorySpan;
}

function processMainViewChildren() {
    $('#tblDispatchMessages').children().each(function() {
        if( $(this).find('#territory').length === 0 ) {
            var territory = findTerritory(parseText($(this).text()));
            var territorySpan = makeTerritorySpanElement(territory);
            $(this).append("<div id='territory'><b>" + territorySpan + territory + "</span></b></div>");
        }
    });
}

function processAltViewChildren(incidentList) {
//    console.log(">> in processAltViewChildren");
	$('#tblDispatchMessages:').find('li').each(function(idx, li) {
		console.log('Checking li: ' + parseText($(li).text()));
        if( $(li).find('#territory').length === 0 ) {
			var territory = findTerritory(parseText($(this).text()));
	        var territorySpan = makeTerritorySpanElement(territory);
	        $(this).find('label').append("<div id='territory'><b>" + territorySpan + territory + "</span></b></div>");
	    }
	});
}

var testIncidents = function() {
//console.log(">> in testIncidents");
	if( $('#tblDispatchMessages:first-child').is("ul") ) {
//        console.log('...processing altViewChildren');
		processAltViewChildren();
	} else if( $('#tblDispatchMessages:first-child').is('div') ) {
//        console.log('...processing mainViewChildren');
		processMainViewChildren();

	} else {
        console.log('##### dont know which view!!!');
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

var LOG_E = 3;
var LOG_F = 2;
var LOG_D = 1;
var LOG_T = 0;


function log(level, message) {
	console.log(message);
}

var streetModifiers = {
	'rd' : 'road',
	'lane' : 'ln',
	'drive' : 'dr',
	'street' : 'st',
	'trail' : 'tr',
	'court' : 'ct',
	'place' : 'pl',
	'avenue' : 'ave',
	'north' : 'n',
	'south' : 's',
	'av' : 'ave',
    'rdg' : 'ridge'
};

var absoluteValues = {
	'rt. 202/206' : GREEN_KNOLL,
	'rt. 22' : GREEN_KNOLL,
	'u s hwy' : GREEN_KNOLL,
	'commons way' : GREEN_KNOLL
};

var nsew = ['n','s','e','w'];

// To consider:
// Glen Ridge Drive S
// Rt. 202/206
// Rt. 22
// Stone Gate
// HEATH DR & RUNNING BROOK RD

function normalizeStreetName(street) {
	if( street.indexOf('#') > 0 ) {
		street = street.substring(0, street.indexOf('#'));
		street = street.trim();
	}
	return street.replace(/ /g, '_').toLowerCase().trim();
}

function replaceStreetAbbr(street) {
	var lastUnder = street.lastIndexOf('_');
	if( lastUnder <= 0 ) {
		return street;
	}

	var name = street.substring(0, lastUnder);
	var lastPart = street.substring(lastUnder+1);

	log(LOG_D, "split street: " + street + " into: " + name + " and " + lastPart);
	if( lastPart in streetModifiers ) {
		return name + "_" + streetModifiers[lastPart];
	}

	return street;
}

function findStreetByName(street) {
	var retStreetValue;

	$.each(locatorBook.street_addresses, function(streetKey, streetValue) {
		if( streetKey === street ) {
			retStreetValue = streetValue;
			return false; // breaks the loop
		}
	});

	log(LOG_D, "\t\t<< findStreetByname called with: |" + street + "| returning: " + retStreetValue);
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

	log(LOG_D, '\t\t<< findStreetByAlias caled with: ' + street + ' returning: ' + retStreetValue);
	return retStreetValue;
}

function findRange(streetNum, ranges) {
	var retTerritory;

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
		}
	});
	log(LOG_D, 'findRange(' + streetNum + ") returning: " + retTerritory);
	return retTerritory;
}

function chopLast(street) {
	return street.substring(0, street.lastIndexOf('_'));
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

function findStreet(rawStreetName) {

	var streetName = normalizeStreetName(rawStreetName);

	// unmodified name
	var streetObject = findStreetByName(streetName);
	if( streetObject === null || streetObject === undefined) {
			log(LOG_D, '---0 About to call after having received a street object of: ' + streetObject);
		streetObject = findStreetByAlias(streetName);
	}

	var geographicDesignation;

	if( chopLast(streetName) in nsew ) {
		geographicDesignation = chopLast(streetName);
	}

	// With last part replaced ('rd' => 'road')
	if( streetObject === null || streetObject === undefined ) {
		var adjustedStreetName = replaceStreetAbbr(streetName);
		if( geographicDesignation !== undefined ) {
			adjustedStreetName = adjustedStreetName + '_' + geographicDesignation;
		}
		if( adjustedStreetName != streetName ) {
			streetObject = findStreetByName(adjustedStreetName);
		}
		if( streetObject === null || streetObject === undefined ) {
			log(LOG_D, '---1 About to call after having received a street object of: ' + streetObject);
			streetObject = findStreetByAlias(adjustedStreetName);
		}
	}

	// Remove last part
	if( streetObject === null || streetObject === undefined ) {
		var withoutRoad = chopLast(streetName);
		if( withoutRoad != streetName ) {
			streetObject = findStreetByName(withoutRoad);
		}
		if( streetObject === null || streetObject === undefined ) {
			log(LOG_D, '---2 About to call after having received a street object of: ' + streetObject);
			streetObject = findStreetByAlias(withoutRoad);
		}
	}

	if( streetObject === null || streetObject === undefined ) {
		handleStreetNotFound(rawStreetName);
		streetObject = null;
	}

	return streetObject;
}

function handleStreetNotFound(rawStreetName) {
	log(LOG_D, "Unable to find street: " + rawStreetName);
}

// =================================
// =================================
// Main entry point
// =================================
// =================================
function findTerritory(streetAddress) {
	log(LOG_D, 'findTerritory(' + streetAddress.trim() + ')');

	var hardcodedVal = checkAbsoluteValues(streetAddress);
	if( hardcodedVal !== undefined ) {
		log(LOG_D, '<<<<<<<<<<<<<<<<<<<<<<< findStreet returning: ' + hardcodedVal);
		return hardcodedVal;
	}

	var territory = NOT_FOUND;
	var streetNum = streetAddress.replace(/^\s+|\s+$/g,'').split(' ')[0];
	var streetName = streetAddress.replace(/^\s+|\s+$/g,'').substring(streetNum.length+1);

	var streetObject = findStreet(streetName);
	if( streetObject !== null && streetObject !== undefined ) {
		range = findRange(parseInt(streetNum), streetObject);
		if( range === null ) {
			territory = NOT_FOUND;
		} else {
			territory = range;
		}
	}

	return territory;
}

function assertTest(address, expectedLookup, result) {
	function formatProblem() {
		return "Unable to find address: " + address;
	}

	console.log("FindTerritory returning: " + findTerritory(address) + " Expected: " + expectedLookup);
	if( findTerritory(address) != expectedLookup ) {
		result.push(formatProblem());
	}
}

    var locatorBookJSON = '{"street_addresses": {"haelig_ct": {"4-12": "Martinsville"}, "somerville_rd": {"400-582": "Green Knoll"}, "van_holten_rd": {"240-480": "Green Knoll"}, "howell_rd": {"1-2": "Martinsville"}, "solomon_dr": {"7-34": "Martinsville"}, "voorhees_ln": {"0": "Green Knoll"}, "roosevelt_st": {"742-899": "Green Knoll", "500-599": "Green Knoll"}, "south_shore_dr": {"960-1064": "Martinsville"}, "turnbull_pl": {"500-599": "Green Knoll"}, "woodfield_rd": {"1725-1841": "Martinsville"}, "hemlock_dr": {"1297-1312": "Martinsville"}, "holmes_ct": {"1-4": "Green Knoll"}, "meadow_view_dr": {"100-199": "Green Knoll"}, "mountainview_ave": {"100-140": "Green Knoll"}, "grandner_ct": {"67-72": "Martinsville"}, "drum_hill_rd": {"1623": "Martinsville", "1404-1451": "Martinsville"}, "burning_bush_rd": {"684-735": "Green Knoll"}, "westbrook_rd": {"1095-1100": "Martinsville"}, "joshua_ln": {"1-4": "Martinsville"}, "valley_view_rd": {"1619-1688": "Martinsville"}, "summit_ridge_dr": {"819-828": "Martinsville", "800-816": "Martinsville"}, "coventry_square": {"1-99": "Green Knoll"}, "longview_rd": {"212-240": "Green Knoll"}, "edgewood_rd": {"1-100": "Far Hills-Bedminster"}, "marlin_st": {"1-99": "Green Knoll"}, "sunnybrook_ct": {"21-23": "Martinsville"}, "robertson_dr": {"1-100": "Far Hills-Bedminster"}, "black_ct": {"2-10": "Martinsville"}, "eton_ct": {"1-100": "Far Hills-Bedminster"}, "van_nostrand_rise": {"1-99": "Green Knoll"}, "cambridge_rd": {"1-100": "Far Hills-Bedminster"}, "byk_pl": {"217-226": "Green Knoll"}, "todd_ct": {"2-9": "Martinsville"}, "dellwood_rd": {"1049-1073": "Martinsville"}, "gateshead_dr": {"1-29": "Martinsville"}, "warren_ave": {"100-199": "Green Knoll"}, "powelson_ln": {"2-12": "Green Knoll"}, "mahnken_dr": {"400-499": "Green Knoll"}, "meyers_way": {"1-7": "Martinsville"}, "dogwood_dr": {"1250-1320": "Martinsville"}, "arthur_rd": {"1-21": "Green Knoll"}, "timberbrooke_dr": {"100-1200": "Far Hills-Bedminster"}, "hoffman_rd": {"1000-1099": "Green Knoll"}, "john_christian_dr": {"673-703": "Green Knoll"}, "cain_ct": {"1-81": "Green Knoll"}, "sussex_ave": {"902-950": "Green Knoll"}, "bartle_ln": {"1900-1965": "Martinsville"}, "davis_ct": {"1-20": "Martinsville"}, "love_rd": {"100-299": "Green Knoll"}, "buxton_rd": {"983-1087": "Martinsville"}, "well_rd": {"1354-1390": "Martinsville"}, "star_view_way": {"778-860": "Green Knoll"}, "april_dr": {"2204-2252": "Martinsville"}, "foxcroft_rd": {"607-613": "Green Knoll"}, "hamilton_ln": {"1-10": "Martinsville"}, "redwood_rd": {"1-23": "Martinsville"}, "woodlawn_ave": {"11-129": "Green Knoll"}, "barrington_dr": {"257-309": "Green Knoll"}, "opal_way": {"0": "Martinsville"}, "hardgrove_rd": {"700-799": "Green Knoll"}, "cardinal_ln": {"843-858": "Green Knoll", "400-499": "Far Hills-Bedminster"}, "wentworth_rd": {"1-100": "Far Hills-Bedminster"}, "pannone_dr": {"0": "Green Knoll"}, "glenwood_terrace": {"4-20": "Green Knoll"}, "mercer_st": {"509-525": "Green Knoll"}, "lockhaven_ct": {"1-100": "Far Hills-Bedminster"}, "gibson_terrace": {"1-99": "Green Knoll"}, "magnolia_dr": {"991-998": "Martinsville"}, "north_stone_edge_rd": {"1-100": "Far Hills-Bedminster"}, "hastings_ct": {"1-99": "Green Knoll"}, "cedar_st": {"3-15": "Green Knoll"}, "tower_rd": {"2-16": "Martinsville"}, "abbott_hollow_ct": {"2-7": "Martinsville"}, "bittle_ct": {"5-10": "Martinsville"}, "ten_eyck_rd": {"228-299": "Green Knoll"}, "housten_ct": {"3-8": "Martinsville"}, "branch_rd": {"100-135": "Green Knoll"}, "frohlin_dr": {"2-37": "Martinsville"}, "robin_way": {"1-2": "Green Knoll"}, "eddy_ln": {"1-10": "Green Knoll"}, "pennlyn_pl": {"610-619": "Green Knoll"}, "amsterdam_rd": {"759-804": "Green Knoll"}, "kennesaw_way": {"1808-1825": "Martinsville"}, "wishnow_way": {"1-6": "Martinsville"}, "griggs_dr": {"100-604": "Green Knoll"}, "steeplechase_ln": {"400-499": "Green Knoll"}, "sherlin_dr": {"1155-1276": "Martinsville"}, "wilde_hollow": {"2-9": "Martinsville"}, "talamini_rd": {"598-786": "Green Knoll"}, "meadow_rd": {"520-600": "Green Knoll", "600-900": "Green Knoll", "441-518": "Green Knoll"}, "ridge_rd": {"1812-1890": "Martinsville"}, "papen_rd": {"1109-1187": "Martinsville", "887-1089": "Martinsville", "775-879": "Martinsville"}, "ardsley_ln": {"875-961": "Green Knoll"}, "yohn_dr": {"3-8": "Green Knoll"}, "village_circle": {"68-91": "Green Knoll"}, "miller_ln": {"799-823": "Martinsville", "100-199": "Green Knoll"}, "allen_rd": {"10-38": "Green Knoll"}, "klines_mill_rd": {"100-1800": "Far Hills-Bedminster"}, "gregory_ave": {"500-599": "Green Knoll"}, "north_branch_rd": {"854-870": "Green Knoll"}, "appleman_way": {"2-3": "Martinsville"}, "highland_ave": {"1-199": "Green Knoll"}, "holland_ct": {"200-299": "Green Knoll"}, "birch_dr": {"1283-1318": "Martinsville"}, "northern_dr": {"1-11": "Green Knoll"}, "westbrook_ct": {"17-22": "Martinsville"}, "goldfinch_dr": {"200-399": "Green Knoll"}, "anlee_rd": {"481-496": "Green Knoll"}, "mcnab_ct": {"1-7": "Martinsville"}, "hunter_rd": {"1414-1457": "Martinsville"}, "adrian_terrace": {"4-5": "Martinsville"}, "fairway_ct": {"4-12": "Green Knoll"}, "golf_links_dr": {"500-599": "Green Knoll"}, "reynard_rd": {"200-299": "Green Knoll"}, "north_bridge_st": {"444-609": "Green Knoll"}, "alisyn_pl": {"4-8": "Green Knoll"}, "bayberry_rd": {"451-474": "Green Knoll"}, "west_circle_dr": {"1722-1798": "Martinsville"}, "lakeview_dr": {"990-1031": "Martinsville"}, "rolling_hills_rd": {"400-599": "Green Knoll"}, "buchman_ct": {"2-5": "Martinsville"}, "church_rd": {"100-300": "Green Knoll"}, "sage_ct": {"1-99": "Far Hills-Bedminster"}, "downey_rd": {"560-566": "Green Knoll"}, "mine_rd": {"715-826": "Green Knoll"}, "crestview_rd": {"181-211": "Green Knoll"}, "south_edgewood_rd": {"1-100": "Far Hills-Bedminster"}, "bonney_ct": {"92-153": "Green Knoll"}, "hill_ln": {"0": "Green Knoll"}, "wimple_way": {"1-10": "Martinsville"}, "copper_hill_rd": {"3-18": "Green Knoll"}, "cold_spring_ln": {"191-299": "Green Knoll"}, "tansy_ct": {"1-100": "Far Hills-Bedminster"}, "brookdale_dr": {"1643-1689": "Martinsville"}, "totten_dr": {"3-65": "Martinsville"}, "cabot_hill_rd": {"547-600": "Green Knoll"}, "cheshire_rd": {"1300-1320": "Martinsville"}, "ash_st": {"1-11": "Green Knoll", "12-99": "Green Knoll"}, "grimm_dr": {"5-13": "Green Knoll"}, "tall_oaks_dr": {"1047-1060": "Green Knoll"}, "merriwood_dr": {"0": "Green Knoll"}, "harding_rd": {"700-803": "Green Knoll"}, "madison_ave": {"821-944": "Green Knoll"}, "dorset_ln": {"1-100": "Far Hills-Bedminster"}, "adamsville_rd": {"310-312": "Green Knoll", "317-319": "Green Knoll"}, "sky_high_terrace": {"1301-1302": "Martinsville", "2-4": "Martinsville"}, "owens_ct": {"1-5": "Martinsville"}, "fieldstone_rd": {"1-100": "Far Hills-Bedminster", "1930-1957": "Martinsville"}, "lockwood_dr": {"3-5": "Martinsville"}, "rt._22": {"EvenNos.>1000": "Green Knoll", "EvenNos.<1000": "Green Knoll", "OddNos.": "Green Knoll"}, "chambers_ct": {"981-1047": "Green Knoll"}, "newland_ct": {"36-40": "Martinsville"}, "bellis_ct": {"100-398": "Green Knoll"}, "laurel_tr": {"989-1034": "Martinsville"}, "donegal_dr": {"801-1307": "Green Knoll"}, "middle_rd": {"1796-1843": "Martinsville"}, "spring_valley_dr": {"500-550": "Green Knoll"}, "dogwood_ln": {"1-99": "Far Hills-Bedminster"}, "baltusrol_way": {"661-685": "Green Knoll"}, "seventh_ave": {"946-950": "Green Knoll"}, "linberger_dr": {"1-45": "Martinsville"}, "amur_rd": {"1-3": "Martinsville"}, "brookside_ln": {"1-99": "Far Hills-Bedminster"}, "merriam_dr": {"1711-1759": "Martinsville"}, "mount_prospect_rd": {"16-20": "Martinsville"}, "adams_rd": {"4-24": "Martinsville"}, "blair_ct": {"1355-1379": "Martinsville"}, "ron_ct": {"700-710": "Green Knoll"}, "plymouth_rd": {"1344-1412": "Martinsville"}, "stangle_rd": {"502-654": "Martinsville"}, "weaver_dr": {"3-28": "Martinsville"}, "braemar_pl": {"14-38": "Green Knoll"}, "hartwell_ct": {"1-99": "Green Knoll"}, "linvale_ln": {"2-200": "Martinsville"}, "bellerive_ct": {"650-663": "Green Knoll"}, "mckinley_st": {"500-999": "Green Knoll"}, "twin_crook_rd": {"1-3": "Martinsville"}, "linderberry_ct": {"3-9": "Martinsville"}, "orchard_st": {"100-299": "Green Knoll"}, "stryker_ct": {"11-134": "Green Knoll"}, "red_lion_way": {"675-775": "Green Knoll"}, "jaguar_ln": {"300-499": "Green Knoll"}, "garfield_ave": {"792-961": "Green Knoll"}, "washington_valley_rd": {"930-1226": "Martinsville", "100-900": "Far Hills-Bedminster", "930-1178": "Martinsville", "2158-2255": "Martinsville", "1395-1603": "Martinsville", "1607-1869": "Martinsville", "1246-1391": "Martinsville", "1872-1973": "Martinsville", "1979-2153": "Martinsville"}, "mcmanus_dr": {"1-8": "Martinsville"}, "gate_rd": {"730-731": "Martinsville"}, "winding_brook_way": {"400-499": "Green Knoll"}, "wilpert_rd": {"1-10": "Martinsville"}, "north_view_dr": {"600-799": "Green Knoll"}, "glen_eagles_dr": {"1-99": "Green Knoll"}, "victoria_dr": {"100-400": "Green Knoll"}, "lincoln_st": {"4-5": "Green Knoll"}, "jason_ct": {"878-887": "Green Knoll"}, "croyden_rd": {"970-1401": "Martinsville"}, "sunset_dr": {"1010-1031": "Martinsville"}, "winslow_dr": {"2-37": "Martinsville"}, "mountainside_ln": {"100-199": "Green Knoll"}, "pine_ct": {"1-100": "Far Hills-Bedminster"}, "hoagland_ct": {"1-30": "Green Knoll"}, "stevens_ln": {"2-39": "Martinsville"}, "bluestone_ln": {"820-885": "Green Knoll"}, "van_nest_dr": {"706-793": "Martinsville"}, "sherwood_rd": {"840-942": "Martinsville"}, "north_shore_dr": {"950-1041": "Martinsville"}, "west_foothill_rd": {"700-860": "Green Knoll"}, "juleo_ct": {"0": "Green Knoll"}, "crestmont_rd": {"0": "Far Hills-Bedminster"}, "donna_ct": {"1-5": "Martinsville"}, "spring_run_ln": {"941-997": "Martinsville"}, "waldron_dr": {"1-12": "Martinsville"}, "larkspur_ct": {"1-100": "Far Hills-Bedminster"}, "cedarbrook_rd": {"600-799": "Green Knoll"}, "beadle_ct": {"2-5": "Martinsville"}, "glen_ridge_dr": {"590-663": "Green Knoll"}, "forest_ave": {"1-39": "Green Knoll"}, "mohawk_tr": {"200-299": "Green Knoll"}, "overlook_dr": {"1-12": "Green Knoll"}, "wren_ln": {"200-399": "Far Hills-Bedminster"}, "eastbrook_rd": {"1030-1097": "Martinsville"}, "tobia_rd": {"764-789": "Green Knoll"}, "alletra_ave": {"539-563": "Green Knoll"}, "wilkins_ln": {"1-99": "Far Hills-Bedminster"}, "staffler_rd": {"1150-1182": "Martinsville"}, "heller_dr": {"1-14": "Green Knoll"}, "village_green_rd": {"1-100": "Far Hills-Bedminster"}, "dumont_ct": {"0": "Green Knoll"}, "twin_oaks_rd": {"1-99": "Green Knoll"}, "morningside_dr": {"500-599": "Green Knoll"}, "hardy_dr": {"1-8": "Martinsville"}, "donald_drive_s": {"668-709": "Green Knoll"}, "coyle_tr": {"1-6": "Martinsville"}, "tullo_rd": {"1090-1386": "Martinsville"}, "hillcrest_rd": {"14-84": "Martinsville"}, "heritage_ct": {"1-99": "Green Knoll"}, "carnoustie_dr": {"811-872": "Green Knoll"}, "berrywood_ln": {"534-546": "Green Knoll"}, "dow_rd": {"755-884": "Green Knoll"}, "prince_rodgers_ave": {"1300-1500": "Green Knoll"}, "donald_drive_n": {"665-702": "Green Knoll"}, "pluckemin_park_ct": {"0": "Far Hills-Bedminster"}, "wicklow_way": {"101-706": "Green Knoll"}, "shadow_oak_ln": {"997-1009": "Martinsville"}, "wolf_hill_terrace": {"3-21": "Martinsville"}, "curtis_tr": {"1-15": "Martinsville"}, "mcdowell_ct": {"23-28": "Martinsville"}, "hodge_dr": {"1-9": "Martinsville"}, "third_ave": {"1-20": "Green Knoll"}, "fairhand_ct": {"29-35": "Martinsville"}, "fawn_ln": {"2-8": "Martinsville"}, "windmill_ct": {"200-299": "Green Knoll"}, "stella_dr": {"1-67": "Green Knoll"}, "hillside_ave": {"1-199": "Green Knoll"}, "benner_ct": {"1-10": "Green Knoll"}, "delaware_dr": {"1143-1186": "Martinsville"}, "schley_mountain_rd": {"0": "Far Hills-Bedminster"}, "cambridge_ln": {"1080-1178": "Martinsville"}, "ray_ct": {"1-100": "Far Hills-Bedminster"}, "kathleen_pl": {"3-13": "Green Knoll"}, "forest_view_dr": {"2-8": "Martinsville"}, "hickory_dr": {"0": "Martinsville"}, "william_st": {"900-999": "Green Knoll"}, "running_brook_rd": {"4-35": "Martinsville"}, "timber_ln": {"1006": "Martinsville", "900": "Martinsville"}, "tilton_rd": {"1332-1342": "Martinsville"}, "foothill_rd": {"618-720": "Green Knoll", "300-587": "Green Knoll", "588-617": "Green Knoll"}, "victor_st": {"900-999": "Green Knoll"}, "cory_ln": {"2-22": "Green Knoll"}, "pond_rd": {"364-377": "Green Knoll"}, "somerset_corporate_blvd": {"100-799": "Green Knoll"}, "evergreen_dr": {"1262-1316": "Martinsville", "1148-1263": "Martinsville"}, "peters_ln": {"749-763": "Martinsville"}, "coriell_dr": {"1354-1397": "Martinsville"}, "helfreds_landing": {"100-299": "Green Knoll"}, "sunset_ridge": {"828-1020": "Martinsville"}, "harrow_ln": {"1-10": "Far Hills-Bedminster"}, "bittersweet_terrace": {"534-560": "Green Knoll"}, "diamond_pl": {"0": "Martinsville"}, "sixth_ave": {"950-953": "Green Knoll"}, "sudbury_ln": {"500-699": "Green Knoll"}, "brightwood_ln": {"1-100": "Far Hills-Bedminster"}, "arrowsmith_dr": {"2-11": "Martinsville"}, "mitchell_ln": {"656-680": "Martinsville"}, "fairfield_rd": {"1154-1201": "Martinsville"}, "grove_st": {"283-399": "Green Knoll"}, "tullo_farm_rd": {"980-1093": "Martinsville"}, "victory_rd": {"1-200": "Far Hills-Bedminster"}, "north_crossing": {"1-99": "Green Knoll"}, "rosewood_ct": {"1-6": "Martinsville"}, "mount_vernon_rd": {"1232-1400": "Martinsville"}, "farmer_rd": {"200-499": "Green Knoll"}, "leeham_ave": {"231-293": "Green Knoll"}, "riverview_rd": {"100-263": "Green Knoll"}, "walcutt_dr": {"990-1016": "Martinsville"}, "hauck_rd": {"400-499": "Green Knoll"}, "tok_pl": {"891-897": "Martinsville"}, "arrowbrook_dr": {"1716-1745": "Martinsville"}, "cloverleaf_dr": {"0": "Green Knoll"}, "brookside_dr": {"2217-2314": "Martinsville"}, "logan_rd": {"1970": "Martinsville"}, "burnt_mills_rd": {"0": "Far Hills-Bedminster"}, "perrine_rd": {"2150-2207": "Martinsville"}, "sarah_ct": {"10-19": "Martinsville"}, "vogt_dr": {"1-99": "Green Knoll"}, "bolmer_farm_rd": {"1792-1895": "Martinsville"}, "peter_par_rd": {"400-499": "Green Knoll"}, "timothy_ln": {"1-100": "Far Hills-Bedminster"}, "edgemont_ln": {"1-100": "Far Hills-Bedminster"}, "north_edgewood_rd": {"1-100": "Far Hills-Bedminster"}, "compton_way": {"3-7": "Martinsville"}, "vosseller_ave": {"798-1048": "Martinsville"}, "hagerman_ct": {"81-114": "Green Knoll"}, "fourth_ave": {"1-22": "Green Knoll"}, "byrd_ave": {"751-794": "Green Knoll"}, "fairacres_dr": {"2-6": "Martinsville"}, "arbor_way": {"2072-2110": "Martinsville"}, "adams_ct": {"1-8": "Martinsville"}, "chimney_rock_rd": {"684-813": "Martinsville"}, "hills_dr": {"1-550": "Far Hills-Bedminster"}, "white_oak_ridge_rd": {"200-299": "Green Knoll"}, "glen_ridge_drive_s": {"500-599": "Green Knoll"}, "whitney_ct": {"1-2": "Green Knoll"}, "airport_rd": {"1-500": "Far Hills-Bedminster"}, "spruce_ct": {"1-100": "Far Hills-Bedminster"}, "lyme_rock_rd": {"506-570": "Green Knoll"}, "vail_ct": {"1-8": "Martinsville"}, "southbrook_dr": {"1624-1645": "Martinsville"}, "emerald_tr": {"515-618": "Martinsville"}, "eisenhower_ave": {"700-899": "Green Knoll"}, "ivanhoe_ave": {"1-99": "Green Knoll"}, "crim_rd": {"1143-1391": "Martinsville"}, "muirfield_ln": {"1-99": "Green Knoll"}, "dunbar_ct": {"0": "Far Hills-Bedminster"}, "mckay_dr": {"1-14": "Martinsville"}, "crossfield_ct": {"0": "Far Hills-Bedminster"}, "jeffrey_ln": {"3-19": "Martinsville"}, "wildflower_ln": {"1-99": "Far Hills-Bedminster"}, "loller_dr": {"1-3": "Martinsville"}, "rosemary_dr": {"970-1007": "Martinsville"}, "partridge_dr": {"778-827": "Martinsville"}, "hudson_st": {"4-5": "Green Knoll"}, "short_hills_dr": {"100-299": "Green Knoll"}, "colonial_way": {"1101-1300": "Martinsville"}, "cushing_dr": {"3-21": "Martinsville"}, "preston_terrace": {"1-200": "Far Hills-Bedminster"}, "van_pelt_ct": {"2-5": "Martinsville"}, "oxford_rd": {"1269-1290": "Martinsville"}, "thistle_ln": {"200-299": "Far Hills-Bedminster"}, "fuller_ct": {"41-47": "Martinsville"}, "exeter_rd": {"1-100": "Far Hills-Bedminster"}, "deer_run_dr": {"1-99": "Green Knoll"}, "rt._202/206": {"500-845": "Green Knoll", "845-1300": "Green Knoll"}, "corporate_dr": {"55and95": "Green Knoll"}, "thruway_dr": {"600-700": "Green Knoll", "1-100": "Green Knoll"}, "rattlesnake_bridge_rd": {"0": "Far Hills-Bedminster"}, "elm_dr": {"1041-1060": "Martinsville"}, "pembrook_ln": {"1-100": "Far Hills-Bedminster"}, "stonehenge_ln": {"1-99": "Green Knoll"}, "brown_rd": {"800-899": "Green Knoll", "900-1079": "Martinsville"}, "blossom_dr": {"3-26": "Martinsville"}, "sky_hill_rd": {"1074-1131": "Green Knoll"}, "northfield_rd": {"154-180": "Green Knoll"}, "spencer_ln": {"1-100": "Far Hills-Bedminster"}, "stony_brook_dr": {"300-599": "Green Knoll"}, "crestwood_dr": {"1-99": "Green Knoll"}, "north_gaston_ave": {"341-399": "Green Knoll"}, "mountain_top_rd": {"1570-1752": "Martinsville", "1756-1966": "Martinsville", "1400-1555": "Martinsville"}, "cricket_ln": {"1370-1371": "Martinsville"}, "stone_gate": {"53-58": "Martinsville"}, "sylvan_dr": {"1-99": "Green Knoll"}, "weemac_rd": {"764-781": "Martinsville"}, "ronson_rd": {"0": "Green Knoll"}, "chamberlin_way": {"1-37": "Martinsville"}, "turnberry_ct": {"900-999": "Green Knoll"}, "birch_hill_dr": {"679-704": "Green Knoll"}, "shasta_dr": {"449-491": "Green Knoll"}, "terrace_ln": {"300-399": "Far Hills-Bedminster"}, "new_hill_rd": {"200-299": "Green Knoll"}, "kale_dr": {"1-10": "Martinsville"}, "gilbride_rd": {"1990-2181": "Martinsville"}, "vicki_dr": {"400-599": "Green Knoll"}, "severin_dr": {"934-1013": "Martinsville"}, "drysdale_ln": {"2-24": "Green Knoll"}, "dutch_farm_rd": {"200-299": "Green Knoll"}, "newmans_ln": {"632-921": "Martinsville"}, "spur_ct": {"1356-1378": "Martinsville"}, "fox_run": {"1-99": "Green Knoll"}, "richard_st": {"0": "Green Knoll"}, "carolkim_dr": {"963-970": "Martinsville"}, "hedgerow_rd": {"241-269": "Green Knoll"}, "federal_dr": {"800-899": "Green Knoll"}, "falcon_ct": {"705-720": "Green Knoll"}, "bunn_rd": {"1-500": "Far Hills-Bedminster"}, "brandywine_rd": {"500-599": "Green Knoll"}, "south_knob": {"1837-1844": "Martinsville"}, "old_farm_rd": {"700-811": "Green Knoll"}, "strawbridge_st": {"602-699": "Green Knoll"}, "raymond_ct": {"304-323": "Green Knoll"}, "reed_ln": {"100-299": "Far Hills-Bedminster"}, "long_rd": {"1420-1490": "Martinsville"}, "candlewick_ln": {"143-273": "Green Knoll"}, "falmouth_pl": {"200-299": "Green Knoll"}, "blazier_rd": {"49-70": "Martinsville"}, "steele_gap_rd": {"1530-1999": "Green Knoll", "400-661": "Green Knoll"}, "bell_ln": {"5": "Green Knoll"}, "mayfield_rd": {"1-99": "Far Hills-Bedminster"}, "country_club_rd": {"1-800": "Far Hills-Bedminster", "400-600": "Green Knoll", "800-1100": "Green Knoll", "601-800": "Green Knoll"}, "old_forge_rd": {"700-898": "Green Knoll"}, "carteret_rd": {"955-1114": "Martinsville"}, "hart_dr": {"713-741": "Green Knoll"}, "mallard_dr": {"1315-1393": "Martinsville"}, "westview_ln": {"100-150": "Far Hills-Bedminster"}, "harrison_ct": {"3": "Green Knoll", "5": "Green Knoll", "7": "Green Knoll"}, "eileen_way": {"300-399": "Green Knoll"}, "russett_ln": {"78-87": "Martinsville"}, "henry_st": {"1-3": "Green Knoll"}, "rose_ln": {"2-8": "Martinsville"}, "long_meadow_rd": {"100-299": "Far Hills-Bedminster"}, "wight_st": {"1-99": "Green Knoll"}, "juniper_ln": {"400-599": "Green Knoll"}, "lawton_rd": {"1-27": "Green Knoll"}, "prospect_ave": {"1-199": "Green Knoll"}, "argonne_farm_dr": {"1-19": "Martinsville"}, "henley_row": {"1286-1315": "Martinsville"}, "commons_way": {"100-700": "Green Knoll"}, "ryan_way": {"1-25": "Martinsville"}, "fall_mountain_ct": {"1024-1026": "Martinsville"}, "arnold_pl": {"1005-1006": "Martinsville"}, "waterford_ln": {"2": "Martinsville"}, "heath_dr": {"1-26": "Martinsville"}, "assante_ln": {"6-22": "Martinsville"}, "crossing_blvd": {"200": "Green Knoll", "400": "Green Knoll"}, "riverview_dr": {"250-299": "Green Knoll"}, "old_tullo_rd": {"917-936": "Martinsville"}, "darby_pl": {"0": "Green Knoll"}, "catalpa_dr": {"1377-1396": "Martinsville"}, "mark_dr": {"1631-1637": "Martinsville"}, "somerset_terrace": {"1-200": "Far Hills-Bedminster"}, "rambler_dr": {"1-99": "Green Knoll"}, "ashley_ct": {"0": "Far Hills-Bedminster"}, "valley_view_ct": {"1-100": "Far Hills-Bedminster"}, "berkley_ln": {"1-100": "Far Hills-Bedminster"}, "wendover_ct": {"1-99": "Far Hills-Bedminster"}, "knollcrest_rd": {"1-99": "Far Hills-Bedminster"}, "ricky_dr": {"1037-1045": "Martinsville"}, "lynne_way": {"2050-2065": "Martinsville"}, "reagan_dr": {"1-10": "Green Knoll"}, "rector_rd": {"973-1097": "Martinsville"}, "monmouth_ave": {"109": "Green Knoll", "4-39": "Green Knoll"}, "masterpeter_rd": {"1919-1924": "Martinsville"}, "cowperthwaite_rd": {"1-700": "Far Hills-Bedminster"}, "cornell_rd": {"1233-1275": "Martinsville"}, "foxwood_ct": {"0": "Far Hills-Bedminster"}, "loft_dr": {"2-126": "Martinsville"}, "petron_pl": {"700-799": "Green Knoll"}, "oakura_ln": {"1-99": "Far Hills-Bedminster"}, "carlene_dr": {"600-799": "Green Knoll"}, "wren_way": {"1-10": "Green Knoll"}, "knollwood_dr": {"400-499": "Green Knoll"}, "peach_tree_rd": {"1-10": "Martinsville"}, "mount_horeb_rd": {"1173-1305": "Martinsville"}, "stone_run_rd": {"1-102": "Far Hills-Bedminster"}, "heather_hill_way": {"1-99": "Green Knoll"}, "lenape_tr": {"450-460": "Green Knoll"}, "geiger_ln": {"1200-1204": "Martinsville"}, "caruso_ct": {"2-8": "Martinsville"}, "stone_edge_rd": {"1-100": "Far Hills-Bedminster"}, "milcrip_rd": {"0": "Green Knoll"}, "lawton_pl": {"4-7": "Green Knoll"}, "quarry_ln": {"749-834": "Martinsville"}, "st._georges_rd": {"680-768": "Green Knoll"}, "cross_rd": {"0": "Green Knoll"}, "floral_dr": {"200-299": "Green Knoll"}, "brian_dr": {"1-9": "Green Knoll"}, "rolling_knolls_way": {"200-399": "Green Knoll"}, "roger_ave": {"1301-1397": "Martinsville"}, "primrose_ln": {"2086-2134": "Martinsville"}, "beaumonte_way": {"176-198": "Martinsville"}, "great_hills_rd": {"100-299": "Green Knoll"}, "maxwell_terrace": {"48-52": "Martinsville"}, "concord_dr": {"1100-1150": "Martinsville"}, "garretson_rd": {"300-750": "Green Knoll"}, "meiners_dr": {"1361-1390": "Martinsville"}, "somerset_ave": {"1-199": "Green Knoll"}, "bentley_ct": {"1-100": "Far Hills-Bedminster"}, "martin_ct": {"2-12": "Martinsville"}, "beth_ct": {"2-6": "Green Knoll"}, "barbara_dr": {"1-5": "Green Knoll"}, "camelot_dr": {"0": "Green Knoll"}, "cedar_ct": {"0": "Far Hills-Bedminster"}, "claire_dr": {"4-82": "Green Knoll"}, "enclave_ln": {"200-399": "Far Hills-Bedminster"}, "calgery_ln": {"1-10": "Far Hills-Bedminster"}, "finch_ln": {"300-399": "Far Hills-Bedminster"}, "ray_st": {"1-99": "Green Knoll"}, "greenfield_rd": {"270-363": "Green Knoll"}, "presidents_dr": {"0": "Green Knoll"}, "mayflower_ct": {"1012-1106": "Martinsville"}, "neskell_dr": {"2-10": "Martinsville"}, "mountain_ct": {"1-72": "Far Hills-Bedminster"}, "king_arthurs_ct": {"1-99": "Green Knoll"}, "waterview_rd": {"378-392": "Green Knoll"}, "old_stage_coach_rd": {"20": "Martinsville"}, "timberline_dr": {"1-42": "Martinsville"}, "hawkes_ct": {"1-10": "Martinsville"}, "leah_ct": {"600-699": "Green Knoll"}, "nicole_terrace": {"59-66": "Martinsville"}, "wingate_dr": {"700-799": "Green Knoll"}, "pinevale_rd": {"0": "Far Hills-Bedminster"}, "tillman_ct": {"9-16": "Martinsville"}, "edgewood_dr": {"100-199": "Green Knoll"}}}';
    var streetAliasJSON = '{"street_alias":{"wash_valley":"washington_valley_rd", "wash_val":"washington_valley_rd","wash_valley":"washington_valley_rd","w_valley":"washington_valley_rd","washington_valley_rd":"washington_valley_rd"},"group_homes":{"by_name":{"advoserve":true,"badvoserve":true},"by_address":{"1234343":"11 foothill rd","2223332":"263 washington valley rd"}}}';

function readJson() {
	locatorBook = $.parseJSON(locatorBookJSON);
	streetAlias = $.parseJSON(streetAliasJSON);
}

function readJson() {
    var locatorBookJSON = '{"street_addresses": {"haelig_ct": {"4-12": "Martinsville"}, "somerville_rd": {"400-582": "Green Knoll"}, "van_holten_rd": {"240-480": "Green Knoll"}, "howell_rd": {"1-2": "Martinsville"}, "solomon_dr": {"7-34": "Martinsville"}, "voorhees_ln": {"0": "Green Knoll"}, "roosevelt_st": {"742-899": "Green Knoll", "500-599": "Green Knoll"}, "south_shore_dr": {"960-1064": "Martinsville"}, "turnbull_pl": {"500-599": "Green Knoll"}, "woodfield_rd": {"1725-1841": "Martinsville"}, "hemlock_dr": {"1297-1312": "Martinsville"}, "holmes_ct": {"1-4": "Green Knoll"}, "meadow_view_dr": {"100-199": "Green Knoll"}, "mountainview_ave": {"100-140": "Green Knoll"}, "grandner_ct": {"67-72": "Martinsville"}, "drum_hill_rd": {"1623": "Martinsville", "1404-1451": "Martinsville"}, "burning_bush_rd": {"684-735": "Green Knoll"}, "westbrook_rd": {"1095-1100": "Martinsville"}, "joshua_ln": {"1-4": "Martinsville"}, "valley_view_rd": {"1619-1688": "Martinsville"}, "summit_ridge_dr": {"819-828": "Martinsville", "800-816": "Martinsville"}, "coventry_square": {"1-99": "Green Knoll"}, "longview_rd": {"212-240": "Green Knoll"}, "edgewood_rd": {"1-100": "Far Hills-Bedminster"}, "marlin_st": {"1-99": "Green Knoll"}, "sunnybrook_ct": {"21-23": "Martinsville"}, "robertson_dr": {"1-100": "Far Hills-Bedminster"}, "black_ct": {"2-10": "Martinsville"}, "eton_ct": {"1-100": "Far Hills-Bedminster"}, "van_nostrand_rise": {"1-99": "Green Knoll"}, "cambridge_rd": {"1-100": "Far Hills-Bedminster"}, "byk_pl": {"217-226": "Green Knoll"}, "todd_ct": {"2-9": "Martinsville"}, "dellwood_rd": {"1049-1073": "Martinsville"}, "gateshead_dr": {"1-29": "Martinsville"}, "warren_ave": {"100-199": "Green Knoll"}, "powelson_ln": {"2-12": "Green Knoll"}, "mahnken_dr": {"400-499": "Green Knoll"}, "meyers_way": {"1-7": "Martinsville"}, "dogwood_dr": {"1250-1320": "Martinsville"}, "arthur_rd": {"1-21": "Green Knoll"}, "timberbrooke_dr": {"100-1200": "Far Hills-Bedminster"}, "hoffman_rd": {"1000-1099": "Green Knoll"}, "john_christian_dr": {"673-703": "Green Knoll"}, "cain_ct": {"1-81": "Green Knoll"}, "sussex_ave": {"902-950": "Green Knoll"}, "bartle_ln": {"1900-1965": "Martinsville"}, "davis_ct": {"1-20": "Martinsville"}, "love_rd": {"100-299": "Green Knoll"}, "buxton_rd": {"983-1087": "Martinsville"}, "well_rd": {"1354-1390": "Martinsville"}, "star_view_way": {"778-860": "Green Knoll"}, "april_dr": {"2204-2252": "Martinsville"}, "foxcroft_rd": {"607-613": "Green Knoll"}, "hamilton_ln": {"1-10": "Martinsville"}, "redwood_rd": {"1-23": "Martinsville"}, "woodlawn_ave": {"11-129": "Green Knoll"}, "barrington_dr": {"257-309": "Green Knoll"}, "opal_way": {"0": "Martinsville"}, "hardgrove_rd": {"700-799": "Green Knoll"}, "cardinal_ln": {"843-858": "Green Knoll", "400-499": "Far Hills-Bedminster"}, "wentworth_rd": {"1-100": "Far Hills-Bedminster"}, "pannone_dr": {"0": "Green Knoll"}, "glenwood_terrace": {"4-20": "Green Knoll"}, "mercer_st": {"509-525": "Green Knoll"}, "lockhaven_ct": {"1-100": "Far Hills-Bedminster"}, "gibson_terrace": {"1-99": "Green Knoll"}, "magnolia_dr": {"991-998": "Martinsville"}, "north_stone_edge_rd": {"1-100": "Far Hills-Bedminster"}, "hastings_ct": {"1-99": "Green Knoll"}, "cedar_st": {"3-15": "Green Knoll"}, "tower_rd": {"2-16": "Martinsville"}, "abbott_hollow_ct": {"2-7": "Martinsville"}, "bittle_ct": {"5-10": "Martinsville"}, "ten_eyck_rd": {"228-299": "Green Knoll"}, "housten_ct": {"3-8": "Martinsville"}, "branch_rd": {"100-135": "Green Knoll"}, "frohlin_dr": {"2-37": "Martinsville"}, "robin_way": {"1-2": "Green Knoll"}, "eddy_ln": {"1-10": "Green Knoll"}, "pennlyn_pl": {"610-619": "Green Knoll"}, "amsterdam_rd": {"759-804": "Green Knoll"}, "kennesaw_way": {"1808-1825": "Martinsville"}, "wishnow_way": {"1-6": "Martinsville"}, "griggs_dr": {"100-604": "Green Knoll"}, "steeplechase_ln": {"400-499": "Green Knoll"}, "sherlin_dr": {"1155-1276": "Martinsville"}, "wilde_hollow": {"2-9": "Martinsville"}, "talamini_rd": {"598-786": "Green Knoll"}, "meadow_rd": {"520-600": "Green Knoll", "600-900": "Green Knoll", "441-518": "Green Knoll"}, "ridge_rd": {"1812-1890": "Martinsville"}, "papen_rd": {"1109-1187": "Martinsville", "887-1089": "Martinsville", "775-879": "Martinsville"}, "ardsley_ln": {"875-961": "Green Knoll"}, "yohn_dr": {"3-8": "Green Knoll"}, "village_circle": {"68-91": "Green Knoll"}, "miller_ln": {"799-823": "Martinsville", "100-199": "Green Knoll"}, "allen_rd": {"10-38": "Green Knoll"}, "klines_mill_rd": {"100-1800": "Far Hills-Bedminster"}, "gregory_ave": {"500-599": "Green Knoll"}, "north_branch_rd": {"854-870": "Green Knoll"}, "appleman_way": {"2-3": "Martinsville"}, "highland_ave": {"1-199": "Green Knoll"}, "holland_ct": {"200-299": "Green Knoll"}, "birch_dr": {"1283-1318": "Martinsville"}, "northern_dr": {"1-11": "Green Knoll"}, "westbrook_ct": {"17-22": "Martinsville"}, "goldfinch_dr": {"200-399": "Green Knoll"}, "anlee_rd": {"481-496": "Green Knoll"}, "mcnab_ct": {"1-7": "Martinsville"}, "hunter_rd": {"1414-1457": "Martinsville"}, "adrian_terrace": {"4-5": "Martinsville"}, "fairway_ct": {"4-12": "Green Knoll"}, "golf_links_dr": {"500-599": "Green Knoll"}, "reynard_rd": {"200-299": "Green Knoll"}, "north_bridge_st": {"444-609": "Green Knoll"}, "alisyn_pl": {"4-8": "Green Knoll"}, "bayberry_rd": {"451-474": "Green Knoll"}, "west_circle_dr": {"1722-1798": "Martinsville"}, "lakeview_dr": {"990-1031": "Martinsville"}, "rolling_hills_rd": {"400-599": "Green Knoll"}, "buchman_ct": {"2-5": "Martinsville"}, "church_rd": {"100-300": "Green Knoll"}, "sage_ct": {"1-99": "Far Hills-Bedminster"}, "downey_rd": {"560-566": "Green Knoll"}, "mine_rd": {"715-826": "Green Knoll"}, "crestview_rd": {"181-211": "Green Knoll"}, "south_edgewood_rd": {"1-100": "Far Hills-Bedminster"}, "bonney_ct": {"92-153": "Green Knoll"}, "hill_ln": {"0": "Green Knoll"}, "wimple_way": {"1-10": "Martinsville"}, "copper_hill_rd": {"3-18": "Green Knoll"}, "cold_spring_ln": {"191-299": "Green Knoll"}, "tansy_ct": {"1-100": "Far Hills-Bedminster"}, "brookdale_dr": {"1643-1689": "Martinsville"}, "totten_dr": {"3-65": "Martinsville"}, "cabot_hill_rd": {"547-600": "Green Knoll"}, "cheshire_rd": {"1300-1320": "Martinsville"}, "ash_st": {"1-11": "Green Knoll", "12-99": "Green Knoll"}, "grimm_dr": {"5-13": "Green Knoll"}, "tall_oaks_dr": {"1047-1060": "Green Knoll"}, "merriwood_dr": {"0": "Green Knoll"}, "harding_rd": {"700-803": "Green Knoll"}, "madison_ave": {"821-944": "Green Knoll"}, "dorset_ln": {"1-100": "Far Hills-Bedminster"}, "adamsville_rd": {"310-312": "Green Knoll", "317-319": "Green Knoll"}, "sky_high_terrace": {"1301-1302": "Martinsville", "2-4": "Martinsville"}, "owens_ct": {"1-5": "Martinsville"}, "fieldstone_rd": {"1-100": "Far Hills-Bedminster", "1930-1957": "Martinsville"}, "lockwood_dr": {"3-5": "Martinsville"}, "rt._22": {"EvenNos.>1000": "Green Knoll", "EvenNos.<1000": "Green Knoll", "OddNos.": "Green Knoll"}, "chambers_ct": {"981-1047": "Green Knoll"}, "newland_ct": {"36-40": "Martinsville"}, "bellis_ct": {"100-398": "Green Knoll"}, "laurel_tr": {"989-1034": "Martinsville"}, "donegal_dr": {"801-1307": "Green Knoll"}, "middle_rd": {"1796-1843": "Martinsville"}, "spring_valley_dr": {"500-550": "Green Knoll"}, "dogwood_ln": {"1-99": "Far Hills-Bedminster"}, "baltusrol_way": {"661-685": "Green Knoll"}, "seventh_ave": {"946-950": "Green Knoll"}, "linberger_dr": {"1-45": "Martinsville"}, "amur_rd": {"1-3": "Martinsville"}, "brookside_ln": {"1-99": "Far Hills-Bedminster"}, "merriam_dr": {"1711-1759": "Martinsville"}, "mount_prospect_rd": {"16-20": "Martinsville"}, "adams_rd": {"4-24": "Martinsville"}, "blair_ct": {"1355-1379": "Martinsville"}, "ron_ct": {"700-710": "Green Knoll"}, "plymouth_rd": {"1344-1412": "Martinsville"}, "stangle_rd": {"502-654": "Martinsville"}, "weaver_dr": {"3-28": "Martinsville"}, "braemar_pl": {"14-38": "Green Knoll"}, "hartwell_ct": {"1-99": "Green Knoll"}, "linvale_ln": {"2-200": "Martinsville"}, "bellerive_ct": {"650-663": "Green Knoll"}, "mckinley_st": {"500-999": "Green Knoll"}, "twin_crook_rd": {"1-3": "Martinsville"}, "linderberry_ct": {"3-9": "Martinsville"}, "orchard_st": {"100-299": "Green Knoll"}, "stryker_ct": {"11-134": "Green Knoll"}, "red_lion_way": {"675-775": "Green Knoll"}, "jaguar_ln": {"300-499": "Green Knoll"}, "garfield_ave": {"792-961": "Green Knoll"}, "washington_valley_rd": {"930-1226": "Martinsville", "100-900": "Far Hills-Bedminster", "930-1178": "Martinsville", "2158-2255": "Martinsville", "1395-1603": "Martinsville", "1607-1869": "Martinsville", "1246-1391": "Martinsville", "1872-1973": "Martinsville", "1979-2153": "Martinsville"}, "mcmanus_dr": {"1-8": "Martinsville"}, "gate_rd": {"730-731": "Martinsville"}, "winding_brook_way": {"400-499": "Green Knoll"}, "wilpert_rd": {"1-10": "Martinsville"}, "north_view_dr": {"600-799": "Green Knoll"}, "glen_eagles_dr": {"1-99": "Green Knoll"}, "victoria_dr": {"100-400": "Green Knoll"}, "lincoln_st": {"4-5": "Green Knoll"}, "jason_ct": {"878-887": "Green Knoll"}, "croyden_rd": {"970-1401": "Martinsville"}, "sunset_dr": {"1010-1031": "Martinsville"}, "winslow_dr": {"2-37": "Martinsville"}, "mountainside_ln": {"100-199": "Green Knoll"}, "pine_ct": {"1-100": "Far Hills-Bedminster"}, "hoagland_ct": {"1-30": "Green Knoll"}, "stevens_ln": {"2-39": "Martinsville"}, "bluestone_ln": {"820-885": "Green Knoll"}, "van_nest_dr": {"706-793": "Martinsville"}, "sherwood_rd": {"840-942": "Martinsville"}, "north_shore_dr": {"950-1041": "Martinsville"}, "west_foothill_rd": {"700-860": "Green Knoll"}, "juleo_ct": {"0": "Green Knoll"}, "crestmont_rd": {"0": "Far Hills-Bedminster"}, "donna_ct": {"1-5": "Martinsville"}, "spring_run_ln": {"941-997": "Martinsville"}, "waldron_dr": {"1-12": "Martinsville"}, "larkspur_ct": {"1-100": "Far Hills-Bedminster"}, "cedarbrook_rd": {"600-799": "Green Knoll"}, "beadle_ct": {"2-5": "Martinsville"}, "glen_ridge_dr": {"590-663": "Green Knoll"}, "forest_ave": {"1-39": "Green Knoll"}, "mohawk_tr": {"200-299": "Green Knoll"}, "overlook_dr": {"1-12": "Green Knoll"}, "wren_ln": {"200-399": "Far Hills-Bedminster"}, "eastbrook_rd": {"1030-1097": "Martinsville"}, "tobia_rd": {"764-789": "Green Knoll"}, "alletra_ave": {"539-563": "Green Knoll"}, "wilkins_ln": {"1-99": "Far Hills-Bedminster"}, "staffler_rd": {"1150-1182": "Martinsville"}, "heller_dr": {"1-14": "Green Knoll"}, "village_green_rd": {"1-100": "Far Hills-Bedminster"}, "dumont_ct": {"0": "Green Knoll"}, "twin_oaks_rd": {"1-99": "Green Knoll"}, "morningside_dr": {"500-599": "Green Knoll"}, "hardy_dr": {"1-8": "Martinsville"}, "donald_drive_s": {"668-709": "Green Knoll"}, "coyle_tr": {"1-6": "Martinsville"}, "tullo_rd": {"1090-1386": "Martinsville"}, "hillcrest_rd": {"14-84": "Martinsville"}, "heritage_ct": {"1-99": "Green Knoll"}, "carnoustie_dr": {"811-872": "Green Knoll"}, "berrywood_ln": {"534-546": "Green Knoll"}, "dow_rd": {"755-884": "Green Knoll"}, "prince_rodgers_ave": {"1300-1500": "Green Knoll"}, "donald_drive_n": {"665-702": "Green Knoll"}, "pluckemin_park_ct": {"0": "Far Hills-Bedminster"}, "wicklow_way": {"101-706": "Green Knoll"}, "shadow_oak_ln": {"997-1009": "Martinsville"}, "wolf_hill_terrace": {"3-21": "Martinsville"}, "curtis_tr": {"1-15": "Martinsville"}, "mcdowell_ct": {"23-28": "Martinsville"}, "hodge_dr": {"1-9": "Martinsville"}, "third_ave": {"1-20": "Green Knoll"}, "fairhand_ct": {"29-35": "Martinsville"}, "fawn_ln": {"2-8": "Martinsville"}, "windmill_ct": {"200-299": "Green Knoll"}, "stella_dr": {"1-67": "Green Knoll"}, "hillside_ave": {"1-199": "Green Knoll"}, "benner_ct": {"1-10": "Green Knoll"}, "delaware_dr": {"1143-1186": "Martinsville"}, "schley_mountain_rd": {"0": "Far Hills-Bedminster"}, "cambridge_ln": {"1080-1178": "Martinsville"}, "ray_ct": {"1-100": "Far Hills-Bedminster"}, "kathleen_pl": {"3-13": "Green Knoll"}, "forest_view_dr": {"2-8": "Martinsville"}, "hickory_dr": {"0": "Martinsville"}, "william_st": {"900-999": "Green Knoll"}, "running_brook_rd": {"4-35": "Martinsville"}, "timber_ln": {"1006": "Martinsville", "900": "Martinsville"}, "tilton_rd": {"1332-1342": "Martinsville"}, "foothill_rd": {"618-720": "Green Knoll", "300-587": "Green Knoll", "588-617": "Green Knoll"}, "victor_st": {"900-999": "Green Knoll"}, "cory_ln": {"2-22": "Green Knoll"}, "pond_rd": {"364-377": "Green Knoll"}, "somerset_corporate_blvd": {"100-799": "Green Knoll"}, "evergreen_dr": {"1262-1316": "Martinsville", "1148-1263": "Martinsville"}, "peters_ln": {"749-763": "Martinsville"}, "coriell_dr": {"1354-1397": "Martinsville"}, "helfreds_landing": {"100-299": "Green Knoll"}, "sunset_ridge": {"828-1020": "Martinsville"}, "harrow_ln": {"1-10": "Far Hills-Bedminster"}, "bittersweet_terrace": {"534-560": "Green Knoll"}, "diamond_pl": {"0": "Martinsville"}, "sixth_ave": {"950-953": "Green Knoll"}, "sudbury_ln": {"500-699": "Green Knoll"}, "brightwood_ln": {"1-100": "Far Hills-Bedminster"}, "arrowsmith_dr": {"2-11": "Martinsville"}, "mitchell_ln": {"656-680": "Martinsville"}, "fairfield_rd": {"1154-1201": "Martinsville"}, "grove_st": {"283-399": "Green Knoll"}, "tullo_farm_rd": {"980-1093": "Martinsville"}, "victory_rd": {"1-200": "Far Hills-Bedminster"}, "north_crossing": {"1-99": "Green Knoll"}, "rosewood_ct": {"1-6": "Martinsville"}, "mount_vernon_rd": {"1232-1400": "Martinsville"}, "farmer_rd": {"200-499": "Green Knoll"}, "leeham_ave": {"231-293": "Green Knoll"}, "riverview_rd": {"100-263": "Green Knoll"}, "walcutt_dr": {"990-1016": "Martinsville"}, "hauck_rd": {"400-499": "Green Knoll"}, "tok_pl": {"891-897": "Martinsville"}, "arrowbrook_dr": {"1716-1745": "Martinsville"}, "cloverleaf_dr": {"0": "Green Knoll"}, "brookside_dr": {"2217-2314": "Martinsville"}, "logan_rd": {"1970": "Martinsville"}, "burnt_mills_rd": {"0": "Far Hills-Bedminster"}, "perrine_rd": {"2150-2207": "Martinsville"}, "sarah_ct": {"10-19": "Martinsville"}, "vogt_dr": {"1-99": "Green Knoll"}, "bolmer_farm_rd": {"1792-1895": "Martinsville"}, "peter_par_rd": {"400-499": "Green Knoll"}, "timothy_ln": {"1-100": "Far Hills-Bedminster"}, "edgemont_ln": {"1-100": "Far Hills-Bedminster"}, "north_edgewood_rd": {"1-100": "Far Hills-Bedminster"}, "compton_way": {"3-7": "Martinsville"}, "vosseller_ave": {"798-1048": "Martinsville"}, "hagerman_ct": {"81-114": "Green Knoll"}, "fourth_ave": {"1-22": "Green Knoll"}, "byrd_ave": {"751-794": "Green Knoll"}, "fairacres_dr": {"2-6": "Martinsville"}, "arbor_way": {"2072-2110": "Martinsville"}, "adams_ct": {"1-8": "Martinsville"}, "chimney_rock_rd": {"684-813": "Martinsville"}, "hills_dr": {"1-550": "Far Hills-Bedminster"}, "white_oak_ridge_rd": {"200-299": "Green Knoll"}, "glen_ridge_drive_s": {"500-599": "Green Knoll"}, "whitney_ct": {"1-2": "Green Knoll"}, "airport_rd": {"1-500": "Far Hills-Bedminster"}, "spruce_ct": {"1-100": "Far Hills-Bedminster"}, "lyme_rock_rd": {"506-570": "Green Knoll"}, "vail_ct": {"1-8": "Martinsville"}, "southbrook_dr": {"1624-1645": "Martinsville"}, "emerald_tr": {"515-618": "Martinsville"}, "eisenhower_ave": {"700-899": "Green Knoll"}, "ivanhoe_ave": {"1-99": "Green Knoll"}, "crim_rd": {"1143-1391": "Martinsville"}, "muirfield_ln": {"1-99": "Green Knoll"}, "dunbar_ct": {"0": "Far Hills-Bedminster"}, "mckay_dr": {"1-14": "Martinsville"}, "crossfield_ct": {"0": "Far Hills-Bedminster"}, "jeffrey_ln": {"3-19": "Martinsville"}, "wildflower_ln": {"1-99": "Far Hills-Bedminster"}, "loller_dr": {"1-3": "Martinsville"}, "rosemary_dr": {"970-1007": "Martinsville"}, "partridge_dr": {"778-827": "Martinsville"}, "hudson_st": {"4-5": "Green Knoll"}, "short_hills_dr": {"100-299": "Green Knoll"}, "colonial_way": {"1101-1300": "Martinsville"}, "cushing_dr": {"3-21": "Martinsville"}, "preston_terrace": {"1-200": "Far Hills-Bedminster"}, "van_pelt_ct": {"2-5": "Martinsville"}, "oxford_rd": {"1269-1290": "Martinsville"}, "thistle_ln": {"200-299": "Far Hills-Bedminster"}, "fuller_ct": {"41-47": "Martinsville"}, "exeter_rd": {"1-100": "Far Hills-Bedminster"}, "deer_run_dr": {"1-99": "Green Knoll"}, "rt._202/206": {"500-845": "Green Knoll", "845-1300": "Green Knoll"}, "corporate_dr": {"55and95": "Green Knoll"}, "thruway_dr": {"600-700": "Green Knoll", "1-100": "Green Knoll"}, "rattlesnake_bridge_rd": {"0": "Far Hills-Bedminster"}, "elm_dr": {"1041-1060": "Martinsville"}, "pembrook_ln": {"1-100": "Far Hills-Bedminster"}, "stonehenge_ln": {"1-99": "Green Knoll"}, "brown_rd": {"800-899": "Green Knoll", "900-1079": "Martinsville"}, "blossom_dr": {"3-26": "Martinsville"}, "sky_hill_rd": {"1074-1131": "Green Knoll"}, "northfield_rd": {"154-180": "Green Knoll"}, "spencer_ln": {"1-100": "Far Hills-Bedminster"}, "stony_brook_dr": {"300-599": "Green Knoll"}, "crestwood_dr": {"1-99": "Green Knoll"}, "north_gaston_ave": {"341-399": "Green Knoll"}, "mountain_top_rd": {"1570-1752": "Martinsville", "1756-1966": "Martinsville", "1400-1555": "Martinsville"}, "cricket_ln": {"1370-1371": "Martinsville"}, "stone_gate": {"53-58": "Martinsville"}, "sylvan_dr": {"1-99": "Green Knoll"}, "weemac_rd": {"764-781": "Martinsville"}, "ronson_rd": {"0": "Green Knoll"}, "chamberlin_way": {"1-37": "Martinsville"}, "turnberry_ct": {"900-999": "Green Knoll"}, "birch_hill_dr": {"679-704": "Green Knoll"}, "shasta_dr": {"449-491": "Green Knoll"}, "terrace_ln": {"300-399": "Far Hills-Bedminster"}, "new_hill_rd": {"200-299": "Green Knoll"}, "kale_dr": {"1-10": "Martinsville"}, "gilbride_rd": {"1990-2181": "Martinsville"}, "vicki_dr": {"400-599": "Green Knoll"}, "severin_dr": {"934-1013": "Martinsville"}, "drysdale_ln": {"2-24": "Green Knoll"}, "dutch_farm_rd": {"200-299": "Green Knoll"}, "newmans_ln": {"632-921": "Martinsville"}, "spur_ct": {"1356-1378": "Martinsville"}, "fox_run": {"1-99": "Green Knoll"}, "richard_st": {"0": "Green Knoll"}, "carolkim_dr": {"963-970": "Martinsville"}, "hedgerow_rd": {"241-269": "Green Knoll"}, "federal_dr": {"800-899": "Green Knoll"}, "falcon_ct": {"705-720": "Green Knoll"}, "bunn_rd": {"1-500": "Far Hills-Bedminster"}, "brandywine_rd": {"500-599": "Green Knoll"}, "south_knob": {"1837-1844": "Martinsville"}, "old_farm_rd": {"700-811": "Green Knoll"}, "strawbridge_st": {"602-699": "Green Knoll"}, "raymond_ct": {"304-323": "Green Knoll"}, "reed_ln": {"100-299": "Far Hills-Bedminster"}, "long_rd": {"1420-1490": "Martinsville"}, "candlewick_ln": {"143-273": "Green Knoll"}, "falmouth_pl": {"200-299": "Green Knoll"}, "blazier_rd": {"49-70": "Martinsville"}, "steele_gap_rd": {"1530-1999": "Green Knoll", "400-661": "Green Knoll"}, "bell_ln": {"5": "Green Knoll"}, "mayfield_rd": {"1-99": "Far Hills-Bedminster"}, "country_club_rd": {"1-800": "Far Hills-Bedminster", "400-600": "Green Knoll", "800-1100": "Green Knoll", "601-800": "Green Knoll"}, "old_forge_rd": {"700-898": "Green Knoll"}, "carteret_rd": {"955-1114": "Martinsville"}, "hart_dr": {"713-741": "Green Knoll"}, "mallard_dr": {"1315-1393": "Martinsville"}, "westview_ln": {"100-150": "Far Hills-Bedminster"}, "harrison_ct": {"3": "Green Knoll", "5": "Green Knoll", "7": "Green Knoll"}, "eileen_way": {"300-399": "Green Knoll"}, "russett_ln": {"78-87": "Martinsville"}, "henry_st": {"1-3": "Green Knoll"}, "rose_ln": {"2-8": "Martinsville"}, "long_meadow_rd": {"100-299": "Far Hills-Bedminster"}, "wight_st": {"1-99": "Green Knoll"}, "juniper_ln": {"400-599": "Green Knoll"}, "lawton_rd": {"1-27": "Green Knoll"}, "prospect_ave": {"1-199": "Green Knoll"}, "argonne_farm_dr": {"1-19": "Martinsville"}, "henley_row": {"1286-1315": "Martinsville"}, "commons_way": {"100-700": "Green Knoll"}, "ryan_way": {"1-25": "Martinsville"}, "fall_mountain_ct": {"1024-1026": "Martinsville"}, "arnold_pl": {"1005-1006": "Martinsville"}, "waterford_ln": {"2": "Martinsville"}, "heath_dr": {"1-26": "Martinsville"}, "assante_ln": {"6-22": "Martinsville"}, "crossing_blvd": {"200": "Green Knoll", "400": "Green Knoll"}, "riverview_dr": {"250-299": "Green Knoll"}, "old_tullo_rd": {"917-936": "Martinsville"}, "darby_pl": {"0": "Green Knoll"}, "catalpa_dr": {"1377-1396": "Martinsville"}, "mark_dr": {"1631-1637": "Martinsville"}, "somerset_terrace": {"1-200": "Far Hills-Bedminster"}, "rambler_dr": {"1-99": "Green Knoll"}, "ashley_ct": {"0": "Far Hills-Bedminster"}, "valley_view_ct": {"1-100": "Far Hills-Bedminster"}, "berkley_ln": {"1-100": "Far Hills-Bedminster"}, "wendover_ct": {"1-99": "Far Hills-Bedminster"}, "knollcrest_rd": {"1-99": "Far Hills-Bedminster"}, "ricky_dr": {"1037-1045": "Martinsville"}, "lynne_way": {"2050-2065": "Martinsville"}, "reagan_dr": {"1-10": "Green Knoll"}, "rector_rd": {"973-1097": "Martinsville"}, "monmouth_ave": {"109": "Green Knoll", "4-39": "Green Knoll"}, "masterpeter_rd": {"1919-1924": "Martinsville"}, "cowperthwaite_rd": {"1-700": "Far Hills-Bedminster"}, "cornell_rd": {"1233-1275": "Martinsville"}, "foxwood_ct": {"0": "Far Hills-Bedminster"}, "loft_dr": {"2-126": "Martinsville"}, "petron_pl": {"700-799": "Green Knoll"}, "oakura_ln": {"1-99": "Far Hills-Bedminster"}, "carlene_dr": {"600-799": "Green Knoll"}, "wren_way": {"1-10": "Green Knoll"}, "knollwood_dr": {"400-499": "Green Knoll"}, "peach_tree_rd": {"1-10": "Martinsville"}, "mount_horeb_rd": {"1173-1305": "Martinsville"}, "stone_run_rd": {"1-102": "Far Hills-Bedminster"}, "heather_hill_way": {"1-99": "Green Knoll"}, "lenape_tr": {"450-460": "Green Knoll"}, "geiger_ln": {"1200-1204": "Martinsville"}, "caruso_ct": {"2-8": "Martinsville"}, "stone_edge_rd": {"1-100": "Far Hills-Bedminster"}, "milcrip_rd": {"0": "Green Knoll"}, "lawton_pl": {"4-7": "Green Knoll"}, "quarry_ln": {"749-834": "Martinsville"}, "st._georges_rd": {"680-768": "Green Knoll"}, "cross_rd": {"0": "Green Knoll"}, "floral_dr": {"200-299": "Green Knoll"}, "brian_dr": {"1-9": "Green Knoll"}, "rolling_knolls_way": {"200-399": "Green Knoll"}, "roger_ave": {"1301-1397": "Martinsville"}, "primrose_ln": {"2086-2134": "Martinsville"}, "beaumonte_way": {"176-198": "Martinsville"}, "great_hills_rd": {"100-299": "Green Knoll"}, "maxwell_terrace": {"48-52": "Martinsville"}, "concord_dr": {"1100-1150": "Martinsville"}, "garretson_rd": {"300-750": "Green Knoll"}, "meiners_dr": {"1361-1390": "Martinsville"}, "somerset_ave": {"1-199": "Green Knoll"}, "bentley_ct": {"1-100": "Far Hills-Bedminster"}, "martin_ct": {"2-12": "Martinsville"}, "beth_ct": {"2-6": "Green Knoll"}, "barbara_dr": {"1-5": "Green Knoll"}, "camelot_dr": {"0": "Green Knoll"}, "cedar_ct": {"0": "Far Hills-Bedminster"}, "claire_dr": {"4-82": "Green Knoll"}, "enclave_ln": {"200-399": "Far Hills-Bedminster"}, "calgery_ln": {"1-10": "Far Hills-Bedminster"}, "finch_ln": {"300-399": "Far Hills-Bedminster"}, "ray_st": {"1-99": "Green Knoll"}, "greenfield_rd": {"270-363": "Green Knoll"}, "presidents_dr": {"0": "Green Knoll"}, "mayflower_ct": {"1012-1106": "Martinsville"}, "neskell_dr": {"2-10": "Martinsville"}, "mountain_ct": {"1-72": "Far Hills-Bedminster"}, "king_arthurs_ct": {"1-99": "Green Knoll"}, "waterview_rd": {"378-392": "Green Knoll"}, "old_stage_coach_rd": {"20": "Martinsville"}, "timberline_dr": {"1-42": "Martinsville"}, "hawkes_ct": {"1-10": "Martinsville"}, "leah_ct": {"600-699": "Green Knoll"}, "nicole_terrace": {"59-66": "Martinsville"}, "wingate_dr": {"700-799": "Green Knoll"}, "pinevale_rd": {"0": "Far Hills-Bedminster"}, "tillman_ct": {"9-16": "Martinsville"}, "edgewood_dr": {"100-199": "Green Knoll"}}}';
    var streetAliasJSON = '{"street_alias":{"wash_valley":"washington_valley_rd", "wash_val":"washington_valley_rd","wash_valley":"washington_valley_rd","w_valley":"washington_valley_rd","washington_valley_rd":"washington_valley_rd"},"group_homes":{"by_name":{"advoserve":true,"badvoserve":true},"by_address":{"1234343":"11 foothill rd","2223332":"263 washington valley rd"}}}';

    locatorBook = $.parseJSON(locatorBookJSON);
	streetAlias = $.parseJSON(streetAliasJSON);
}

