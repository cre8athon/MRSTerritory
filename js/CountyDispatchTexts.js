var dispatchesJSON = '[\
	{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16217505:09/20/2016 09:30:38:DIZZINESS:58 YOF: BRIDGEW-269 HEDGEROW RD"},\
	{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16217518:09/20/2016 10:01:56:EMS TRANSPORT:75 YOM: BRIDGEW-761 W FOOTHILL RD"},\
	{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16217605:09/20/2016 11:32:33:UNKNOWN MEDICAL: BRIDGEW-BRIDGEWATER COMMONS MALL / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16217907:09/20/2016 16:58:57:UNRESPONSIVE:51 YOM: BRIDGEW-1 WREN WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16217942:09/20/2016 17:43:55:SMOKE CONDITION: BRIDGEW-STELLA DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16218079:09/20/2016 20:55:10:NEAR FAINTING:11 YOM: BRIDGEW-791 EISENHOWER AV"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16218666:09/21/2016 14:16:04:CARDIAC:82 YOF: BRIDGEW-CHELSEA AT BRIDGEWATER / 680 U S HWY NOS 202 AND 206 HWY #206"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16218789:09/21/2016 15:43:44:ASSAULT: BRIDGEW-842 STAR VIEW WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16218923:09/21/2016 18:06:55:MVC WITH INJURY:KNEE INJURY: BRIDGEW-GREEN KNOLL GRILLE / 645 U S HWY NOS 202 AND 206 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16219149:09/21/2016 23:27:41:LEG INJURY:24 YOF: BRIDGEW-OUR HOUSE / 230 HELFREDS LNDG"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16219458:09/22/2016 09:59:52:DIFF BREATHING: BRIDGEW-MARTINSVILLE FAMILY PRACTICE / 1973 WASHINGTON VALLEY RD FL 1"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16219612:09/22/2016 12:51:00:LEG PAIN:91 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #421"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16219683:09/22/2016 14:22:24:FALLS:ELD MALE: BRIDGEW-680 U S HWY NOS 202 AND 206 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16219707:09/22/2016 14:56:36:PSYCH PROBLEMS:69YOF: BRIDGEW-RICHARD HALL MENTAL HEALTH CENTER / 500 N BRIDGE ST"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16219831:09/22/2016 16:51:58:FALLS:35 YOM: BRIDGEW-YOUTH CONSULTATION SERVICES HOME / 694 BURNING BUSH RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16220245:09/23/2016 06:22:15:DIZZINESS:58 YOM: BRIDGEW-1807 BOLMER FARM RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16220518:09/23/2016 12:57:28:FALLS:100 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #108"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16220629:09/23/2016 15:14:34:FALLS:8 YOM: BRIDGEW-APPLE STORE / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16220671:09/23/2016 15:54:03:HEAT EXPOSURE:16 YOF: BRIDGEW-GREEN KNOLL TENNIS COURTS / 587 GARRETSON RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16220716:09/23/2016 16:57:23:DIZZINESS: BRIDGEW-188 RTE 287 S"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16220774:09/23/2016 18:38:13:FALLS:74 YOF: BEDMINS-3 VILLAGE GREEN ROAD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16221104:09/24/2016 03:38:29:CHEST PAIN:37YOM: BRIDGEW-443 COUNTRY CLUB RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16221170:09/24/2016 07:53:58:DIFF BREATHING:83 YOM: BRIDGEW-7 LINDERBERRY CT"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16221182:09/24/2016 08:45:00:CHEST PAIN:90 YOF: BRIDGEW-73 HILLCREST RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16221333:09/24/2016 13:09:16:UNCONSCIOUS:ADULT MALE: BRIDGEW-BRIDGEWATER COMMONS MALL / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16221361:09/24/2016 13:53:53:FALLS:FEMALE 70S: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #108 FL 1"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16221497:09/24/2016 16:56:53:UNCONSCIOUS:MALE IN 30S: BRIDGEW-BRIDGEWATER COMMONS MALL / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16221668:09/24/2016 21:15:07:FAINTING:74 YOF: BRIDGEW-5 VAN PELT CT"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222039:09/25/2016 12:37:37:CARDIAC:97 YOF: BRIDGEW-CHELSEA AT BRIDGEWATER / 680 U S HWY NOS 202 AND 206 HWY #338"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222069:09/25/2016 13:26:06:STROKE:90 YOM: BRIDGEW-1116 CAMBRIDGE LN"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222208:09/25/2016 18:26:27:CHEST PAIN:86 YOF: BRIDGEW-MEHTA, DEVESH / 3 LOLLER DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222207:09/25/2016 18:26:49:FALLS:71 YOM: BRIDGEW-104 MOUNTAINSIDE LN"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222246:09/25/2016 19:54:08:DISORIENTED:59 YOM: BRIDGEW-466 COUNTRY CLUB RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222328:09/25/2016 22:55:34:FALLS:59 YOF: BRIDGEW-683 FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222577:09/26/2016 08:52:36:DIFF BREATHING:91 YOF: BRIDGEW-423 VAN HOLTEN RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222613:09/26/2016 09:51:00:FIRE ALARM:GENERAL: BRIDGEW-500 SOMERSET CORPORATE BLVD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222632:09/26/2016 09:59:16:LEG PAIN:82YOF: BRIDGEW-650 FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222794:09/26/2016 13:22:08:SICK PERSON:17 YOF: BRIDGEW-RVCC @ BRIDGEWATER / 14 VOGT DR #B"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222818:09/26/2016 13:57:04:SICK PERSON:78 YOM: BRIDGEW-9 SOLOMON DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16222879:09/26/2016 15:11:28:CARDIAC: BRIDGEW-1973 WASHINGTON VALLEY RD FL 1"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16223283:09/27/2016 04:53:55:DIFF BREATHING:62 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #319"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16224033:09/27/2016 21:38:45:VOMITING:24 YOM: BRIDGEW-EASTER SEALS / 279 STATE HWY NO 28 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16224165:09/28/2016 03:47:43:CHEST PAIN:25 YOM: BRIDGEW-ADVOSERVE (566 FOOTHILL) / 566 FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16224434:09/28/2016 11:12:27:BACK PAIN:56 YOM: BRIDGEW-MARTINSVILLE FAMILY PRACTICE / 1973 WASHINGTON VALLEY RD FL 1"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16224530:09/28/2016 12:51:06:FALLS:102 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #108"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16224550:09/28/2016 13:21:20:DIZZINESS:54 YOM: BRIDGEW-RICHARD HALL MENTAL HEALTH CENTER / 500 N BRIDGE ST"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16224783:09/28/2016 18:14:19:FALLS:MALE IN 60S: BRIDGEW-230 ORCHARD ST"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16224866:09/28/2016 20:26:05:STROKE:85YOF: BRIDGEW-62 HILLSIDE AV"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16225209:09/29/2016 09:22:33:MUTUAL AID: BRIDGEW-GREEN KNOLL RESCUE SQUAD / 608 N BRIDGE ST"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16225213:09/29/2016 09:26:11:FAINTING:CONSC AT THIS TIME: BRIDGEW-BRIDGEWATER RARITAN HIGH SCHOOL / 600 GARRETSON RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16225241:09/29/2016 10:01:53:UNKNOWN MEDICAL: BRIDGEW-STEINER RESIDENCE / 6 HARDY DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16225329:09/29/2016 12:03:49:FAINTING: BRIDGEW-BRIDGEWATER RARITAN HIGH SCHOOL / 600 GARRETSON RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16225359:09/29/2016 12:48:47:UNCONSCIOUS:62 YOF: BRIDGEW-1 LOLLER DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16225600:09/29/2016 18:09:29:FALLS:86 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR FL 2"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16226458:09/30/2016 20:04:55:SMOKE CONDITION:HAZE CONDITION: BRIDGEW-BRIDGEWATER COMMONS MALL / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16225886:09/30/2016 06:55:46:MVC WITH INJURY:CAR VS POLE: BRIDGEW-U S HWY NO 22 HWY (EB) & VOSSELLER AV"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16226015:09/30/2016 10:20:06:ALTERED MENTAL:86 YOF: BRIDGEW-CHELSEA AT BRIDGEWATER / 680 U S HWY NOS 202 AND 206 HWY FL 2"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16226020:09/30/2016 10:26:31:LOWER ABDOM PAI:68YOM: BOUND B-541 CARLETON ST"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16226161:09/30/2016 13:14:01:PANIC ATTACK:Z: 99: BRIDGEW-952 SUNSET RDG"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16226431:09/30/2016 19:24:01:FAINTING:19 FEMALE: BRIDGEW-LUSH HANDMADE COSMETICS / 400 COMMONS WAY #283"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16226458:09/30/2016 20:04:55:SMOKE CONDITION:HAZE CONDITION: BRIDGEW-BRIDGEWATER COMMONS MALL / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16227184:10/01/2016 19:59:47:911 NON EMERG: BRIDGEW-1280 OXFORD RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16227429:10/02/2016 03:08:09:DIFF BREATHING:50S FEMALE: BRIDGEW-BENCHMARK HUMAN SERVICES / 13 THRUWAY DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16227450:10/02/2016 03:53:59:DIZZINESS:68 YOM: BRIDGEW-BRIDGEWATER MARRIOTT / 700 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16227583:10/02/2016 10:35:01:CARDIAC:51 YOM: BRIDGEW-BRIDGEWATER RARITAN HIGH SCHOOL / 600 GARRETSON RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16227654:10/02/2016 12:55:12:DETAIL: BRIDGEW-BLESSED SACRAMENT CHURCH / 1890 WASHINGTON VALLEY RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16227809:10/02/2016 17:15:37:GEN WEAKNESS:92 YOF: BRIDGEW-96 LOFT DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16228050:10/03/2016 01:28:18:MEDICAL ALARM: BRIDGEW-NEEDELL, CHERYL / 14 GATESHEAD DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16228079:10/03/2016 03:12:11:STROKE:58 YOF: BRIDGEW-785 U S HWY NOS 202 AND 206 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16228133:10/03/2016 06:21:44:CHEST PAIN:62 YOF: BRIDGEW-1075 CARTERET RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16228228:10/03/2016 09:04:28:FALLS:22 YOM: BRIDGEW-ADVOSERVE (444 CCRD) / 444 COUNTRY CLUB RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16228308:10/03/2016 10:47:55:MEDICAL ALARM:ELDERLY F: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #215"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16228347:10/03/2016 11:48:22:DUMPSTER FIRE:SMOKING: BRIDGEW-533 BERRYWOOD LN"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16228443:10/03/2016 14:17:31:STROKE:74 YOM: BRIDGEW-376 VICTORIA DR FL 2"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16229445:10/04/2016 17:17:02:BACK PAIN:41 YOF: BRIDGEW-31 FAIRHAND CT"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16229475:10/04/2016 17:51:25:HEADACHE:92 YOF: BRIDGEW-1644 VALLEY VIEW RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16229509:10/04/2016 18:56:17:VOMITING:89 YOF: BRIDGEW-73 HILLCREST RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16229546:10/04/2016 20:00:07:FALLS:65 YOF: BRIDGEW-MACY*S / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16229785:10/05/2016 06:29:21:MEDICAL ALARM:80 YOF: BRIDGEW-1468 WASHINGTON VALLEY RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16229869:10/05/2016 08:41:38:MVC WITH INJURY:3 CARS: BOUND B-U S HWY NO 22 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16230128:10/05/2016 13:50:25:ALLERGIC REACTN:21 YOM: BRIDGEW-GEN PSYCH / 981 U S HWY NO 22 HWY FL 2"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16230313:10/05/2016 16:50:56:CHEST PAIN:58 YOM: BRIDGEW-1280 OXFORD RD FL %"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16230515:10/05/2016 21:18:58:FALLS: BRIDGEW-CENTERBRIDGE I / 491 SHASTA DR #110"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16230631:10/06/2016 00:09:01:DIFF BREATHING:ELD FEMALE: BRIDGEW-CENTERBRIDGE I / 491 SHASTA DR #313"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16230847:10/06/2016 08:47:24:CHEST PAIN:39 YOF: BRIDGEW-16 RTE 287 N"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16230863:10/06/2016 09:03:21:EMS TRANSPORT:57 YOM: BRIDGEW-MARTINSVILLE FAMILY PRACTICE / 1973 WASHINGTON VALLEY RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16231576:10/07/2016 00:30:20:OVERDOSE:22 YOM: BRIDGEW-737 W FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16231732:10/07/2016 07:59:02:DIFF BREATHING:90 YOM: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #211"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16231784:10/07/2016 08:51:15:ALLERGIC REACTN:1 YOF: BRIDGEW-26 HOAGLAND CT"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16232406:10/07/2016 21:29:27:FAINTING: BRIDGEW-MAGGIANOS / 600 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16232678:10/08/2016 08:15:25:BACK PAIN:48 YOF: BRIDGEW-9 LINDERBERRY CT"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16232746:10/08/2016 10:08:18:FALLS:60S YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #411"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16232754:10/08/2016 10:16:01:DIFF BREATHING:ELD FEM: BRIDGEW-CHELSEA AT BRIDGEWATER / 680 U S HWY NOS 202 AND 206 HWY #315"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16232882:10/08/2016 13:09:48:SICK PERSON:1 YOF: BRIDGEW-26 HOAGLAND CT"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16233062:10/08/2016 18:17:06:HEAD INJURY:55 YOM: BRIDGEW-255 CANDLEWICK LN"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16233419:10/09/2016 08:45:37:FALLS:85 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #323"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16233530:10/09/2016 13:30:52:DIZZINESS:89 YOM: BRIDGEW-1075 HOFFMAN RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16233631:10/09/2016 16:42:25:FIGHT: BRIDGEW-BRIDGEWATER COMMONS MALL / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16233651:10/09/2016 17:12:10:GI BLEED:89 YOF: BRIDGEW-CHELSEA AT BRIDGEWATER / 680 U S HWY NOS 202 AND 206 HWY #230 FL 2"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16233830:10/09/2016 23:25:10:FALLS:59 YOF: BRIDGEW-731 CHIMNEY ROCK RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234032:10/10/2016 09:11:41:FALLS:HEAD LAC: BRIDGEW-100 CORPORATE DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234041:10/10/2016 09:30:47:UNRESPONSIVE:76YOM: BRIDGEW-LANGENBERG RESIDENCE / 863 PAPEN RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234120:10/10/2016 11:37:06:SEIZURE:2 YOM: BRIDGEW-FOOTHILL RD & VAN NOSTRAND RISE"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234157:10/10/2016 12:23:01:LEG PAIN:72 YOM: BRIDGEW-6 GLENWOOD TER"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234204:10/10/2016 13:14:54:DIFF BREATHING:80 YOF: BRIDGEW-GREEN KNOLL REHAB CENTER / 875 U S HWY NOS 202 AND 206 HWY #107A"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234247:10/10/2016 14:08:09:CHEST PAIN:54 YOM: BRIDGEW-AAA - BRIDGEWATER / 976 U S HWY NO 22 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234303:10/10/2016 15:11:27:CARDIAC:86 YOF: BRIDGEW-MARTINSVILLE FAMILY PRACTICE / 1973 WASHINGTON VALLEY RD FL 1"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234351:10/10/2016 16:17:15:MVC WITH INJURY: BRIDGEW-COMMONS WAY & SOMERSET CORPORATE BLVD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234385:10/10/2016 17:00:33:CHEST PAIN:43 YOM: BRIDGEW-ADVOSERVE (685 FOOTHILL) / 685 FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234498:10/10/2016 19:48:53:DIZZINESS:54YOM: BRIDGEW-745 HART DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234722:10/11/2016 04:03:49:EMS TRANSPORT:84YOF: BRIDGEW-GREEN KNOLL REHAB CENTER / 875 U S HWY NOS 202 AND 206 HWY #218"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16234812:10/11/2016 07:45:54:NOSE BLEED:62 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #419"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16235023:10/11/2016 11:29:04:DIZZINESS:74 YOM: BRIDGEW-BAGELSMITH / 1330 PRINCE RODGERS AV"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16235503:10/11/2016 21:59:17:OVERTURNED MV: BRIDGEW-1380 WASHINGTON VALLEY RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16235736:10/12/2016 08:19:28:UNRESPONSIVE:77 YOM: BRIDGEW-19 CAIN CT"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16235988:10/12/2016 13:18:55:CHEST PAIN:70 YOF: BRIDGEW-975 BROWN RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16236291:10/12/2016 19:35:19:PSYCH/SUICIDAL:2ND FLR NURSES SUITE: BRIDGEW-RICHARD HALL MENTAL HEALTH CENTER / 500 N BRIDGE ST"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16236357:10/12/2016 20:57:01:UNRESPONSIVE:APROX 80 YO M: BRIDGEW-RED LOBSTER / 1271 U S HWY NO 22 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16236749:10/13/2016 10:32:06:MVC WITH INJURY: BRIDGEW-WENDYS / 977 U S HWY NO 22 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16237029:10/13/2016 15:53:09:DIFF BREATHING:76 YOF: BRIDGEW-GREEN KNOLL REHAB CENTER / 875 U S HWY NOS 202 AND 206 HWY #218B"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16237154:10/13/2016 18:21:02:ALTERED MENTAL:82 YOF: BRIDGEW-650 FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16237181:10/13/2016 19:20:09:VOMITING:95 YOF: BRIDGEW-774 NEWMANS LN"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16237248:10/13/2016 21:28:52:VOMITING:19 YOM: BRIDGEW-PASSAGES GROUP HOME / 16 4TH AV"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16238435:10/15/2016 08:32:37:MV FIRE: BRIDGEW-187 RTE 287 S"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16238616:10/15/2016 12:09:22:MVC WITH INJURY: BRIDGEW-COMMONS WAY (SB) RAMP & U S HWY NOS 202 AND 206 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16238668:10/15/2016 12:44:06:DETAIL: FAR HIL-FAR HILLS FAIRGROUNDS / 1 PEAPACK ROAD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16238723:10/15/2016 13:57:04:ALCOHOL RELATED: FAR HIL-FAR HILLS TRAIN STATION / 61 RTE 202"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16238774:10/15/2016 15:03:11:FALLS:59 YOF: BRIDGEW-785 U S HWY NOS 202 AND 206 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16238805:10/15/2016 15:33:33:MVC WITH INJURY: BRIDGEW-BRIDGEWATER ACURA / 1231 U S HWY NO 22 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16239115:10/15/2016 20:40:20:MVC WITH INJURY: BRIDGEW-COMMONS WAY & U S HWY NO 22 HWY (EB)"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16239756:10/16/2016 18:33:40:UNKNOWN MEDICAL:21 YOF: BRIDGEW-25 MCDOWELL CT"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16239758:10/16/2016 18:38:30:CHEST PAIN:34 YOM: BRIDGEW-AMC THEATERS / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16240106:10/17/2016 07:44:14:HAND INJURY: BRIDGEW-ADVOSERVE (685 FOOTHILL) / 685 FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16240283:10/17/2016 11:25:06:GEN WEAKNESS:86 YOF: BRIDGEW-CENTERBRIDGE I / 491 SHASTA DR #405"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16240560:10/17/2016 15:54:36:BACK PAIN:83 YOF: BRIDGEW-964 N SHORE DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16240587:10/17/2016 16:27:53:FALLS:FEMALE: BRIDGEW-SANOFI AVENTIS / 55 CORPORATE DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16240685:10/17/2016 17:53:07:DIABETIC:84 YOF: BRIDGEW-CHELSEA AT BRIDGEWATER / 680 U S HWY NOS 202 AND 206 HWY #304"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16240712:10/17/2016 18:33:06:DETAIL: HILLSBO-SOMERSET CTY EMERGENCY SERV / 402 ROYCEFIELD ROAD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16241169:10/18/2016 09:25:17:CHEST PAIN:34 YOM: BRIDGEW-BAKER & TAYLOR / 1120 U S HWY NO 22 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16241250:10/18/2016 10:59:08:FALLS:85YO FEMALE: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR FL 1"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16241383:10/18/2016 13:23:47:DIFF BREATHING:81 YOM: BRIDGEW-479 MEADOW RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16241676:10/18/2016 19:02:59:CARDIAC:FEMALE 50S: BEDMINS-1555 BURNT MILLS ROAD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16241810:10/18/2016 22:11:59:FALLS:60 YOF: BRIDGEW-785 U S HWY NOS 202 AND 206 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16241866:10/18/2016 23:40:10:SICK PERSON:82 YOF: BRIDGEW-CHELSEA AT BRIDGEWATER / 680 U S HWY NOS 202 AND 206 HWY #321"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16242082:10/19/2016 08:45:43:LABOR/MATERNITY: BRIDGEW-71 VILLAGE CIR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16242209:10/19/2016 10:53:23:LEG PAIN:96 YOM: BRIDGEW-971 CARTERET RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16242401:10/19/2016 14:21:43:EMS TRANSPORT:87 YOF: BRIDGEW-506 LYME ROCK RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16242494:10/19/2016 16:10:34:SICK PERSON:36 YOM: BRIDGEW-DUNKIN DONUTS (WVR) / 1918 WASHINGTON VALLEY RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16242783:10/19/2016 22:46:42:BRUSH FIRE: BRIDGEW-2081 GILBRIDE RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16242783:10/19/2016 23:11:43:BRUSH FIRE: BRIDGEW-2081 GILBRIDE RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16242864:10/20/2016 00:56:28:SICK PERSON:48 YOF: BRIDGEW-CENTERBRIDGE I / 491 SHASTA DR #205"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16242928:10/20/2016 04:19:07:VOMITING BLOOD:62 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #208 FL 1"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16243049:10/20/2016 08:29:26:MEDICAL ALARM:71 YOM: BRIDGEW-248 HEDGEROW RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16243093:10/20/2016 09:30:17:CHEST PAIN: BRIDGEW-780 OLD FARM RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16243147:10/20/2016 10:48:26:LIFT ASSIST:87 YOF: BRIDGEW-CENTERBRIDGE I / 491 SHASTA DR #405"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16243298:10/20/2016 13:25:44:DIFF BREATHING:50S YOF: BRIDGEW-BRIDGEWATER MARRIOTT / 700 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16243628:10/20/2016 20:40:02:BACK PAIN:36 YOM: BRIDGEW-ADVOSERVE (566 FOOTHILL) / 566 FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16243885:10/21/2016 05:15:55:CHEST PAIN:43 YOM: BRIDGEW-ADVOSERVE (685 FOOTHILL) / 685 FOOTHILL RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16243911:10/21/2016 06:19:28:CHEST PAIN:59 YOM: BRIDGEW-1031 SUNSET DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16244210:10/21/2016 12:59:41:FOOT INJURY:20 YOF: BRIDGEW-SEPHORA / 400 COMMONS WAY #141"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16244261:10/21/2016 14:24:03:LEG INJURY:93 YOF: BRIDGEW-GREEN KNOLL REHAB CENTER / 875 U S HWY NOS 202 AND 206 HWY FL 3"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16244279:10/21/2016 14:41:29:CHEST PAIN:26 YOF: BRIDGEW-CHEESECAKE FACTORY / 400 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16244373:10/21/2016 16:13:21:LOWER ABDOM PAI:78 YOF: BRIDGEW-8 FROHLIN DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16245263:10/22/2016 19:06:10:UNCONSCIOUS:30S FEMALE: BRIDGEW-BRIDGEWATER MARRIOTT / 700 COMMONS WAY"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16245289:10/22/2016 19:50:29:MEDICAL ALARM:92 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #102"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16245486:10/23/2016 01:44:46:MVC WITH INJURY: BRIDGEW-184 RTE 287 N"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16245692:10/23/2016 11:54:50:CARDIAC:69 YOM: BRIDGEW-6 CEDAR ST"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16245970:10/23/2016 19:37:26:MEDICAL ALARM: BRIDGEW-1105 U S HWY NOS 202 AND 206 HWY"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16246136:10/24/2016 01:09:20:UNRESPONSIVE:75 YOM: BRIDGEW-69 MUIRFIELD LN"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16246367:10/24/2016 10:07:32:SEIZURE:33 YOM: BRIDGEW-BRIDGEWATER LIBRARY / 1 VOGT DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16246439:10/24/2016 11:32:04:CHEST PAIN:92 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #412"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16246491:10/24/2016 12:21:21:PSYCH PROBLEMS: BRIDGEW-GREEN KNOLL REHAB CENTER / 875 U S HWY NOS 202 AND 206 HWY #201"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16246694:10/24/2016 15:55:18:SICK PERSON:22 YOM: BRIDGEW-ADVOSERVE (444 CCRD) / 444 COUNTRY CLUB RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16246719:10/24/2016 16:22:44:MULCH FIRE: BRIDGEW-COMMONS WAY & CROSSING BLVD"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16246765:10/24/2016 17:15:53:ALLERGIC REACTN:79 YOF: BRIDGEW-350 VICTORIA DR"},\
{"dispatch":"scctxt@co.somerset.nj.us:MTV-RS:16246885:10/24/2016 19:51:48:ARM INJURY:9 YOM: BRIDGEW-BASILONE FIELD / 600 GARRETSON RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16266409:11/17/2016 00:24:12:BACK PAIN:32 YOF: BRIDGEW-434 COUNTRY CLUB RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16266409:11/17/2016 00:24:12:BACK PAIN:32 YOF: BRIDGEW-501 GLEN RIDGE DRIVE S"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16266409:11/17/2016 00:24:12:BACK PAIN:32 YOF: BRIDGEW-HEATH DR & RUNNING BROOK RD"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16267021:11/17/2016 17:21:25:FALLS:92 YOM: BRIDGEW-1370 ROGER AV"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16271263:11/23/2016 05:23:23:DIFF BREATHING:62 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR FL 3 "},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16270283:11/21/2016 22:33:48:GEN WEAKNESS:69 YOF: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #522 FL 5"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16273790:11/26/2016 17:11:31:SICK PERSON:60 YOM: SOMERVI-SOMERSET CTY JAIL / 40 GROVE ST"},\
{"dispatch":"scctxt@co.somerset.nj.us:GKL-RS:16265329:11/15/2016 17:49:14:DIFF BREATHING:ELDERLY FEMALE: BRIDGEW-CENTERBRIDGE II / 459 SHASTA DR #208 "}]';