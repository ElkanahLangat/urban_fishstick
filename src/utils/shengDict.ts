/**
 * Nairobi Sheng & Swahili Semantics Engine
 * Covers authentic vocabulary, idioms, and audio-context helpers
 */

export interface ShengEntry {
  sheng: string;
  english: string;
  swahili: string;
  context: string;
  category: 'booking' | 'conductor' | 'safety' | 'transit' | 'slang';
  example: string;
}

export const SHENG_DICTIONARY: ShengEntry[] = [
  {
    sheng: "Nganya / Manyanga",
    english: "Custom-modified, artistically designed matatu with sound system & screens",
    swahili: "Matatu ya kisasa yenye michoro na mziki mzito",
    context: "Refers to the iconic customized Nairobi minibuses",
    category: "transit",
    example: "Hiyo nganya ya Rongai inaitwa Matrix ina graphics kali sana!"
  },
  {
    sheng: "Nishushe Hapo!",
    english: "Drop me off right here!",
    swahili: "Niteremshe hapa tafadhali",
    context: "Passenger calling out to the conductor to alight at their stop",
    category: "conductor",
    example: "Dere nishushe hapo kwa roundi ya Westlands!"
  },
  {
    sheng: "Makanga / Donda / Conodi",
    english: "Matatu conductor / fare collector",
    swahili: "Mhudumu wa matatu anayekusanya nauli",
    context: "The energetic crew member coordinating boarding, seats, and fares",
    category: "conductor",
    example: "Donda amenichotea change yangu bila delay."
  },
  {
    sheng: "Dere",
    english: "Driver / Pilot of the matatu",
    swahili: "Dereva",
    category: "transit",
    context: "Short for dereva, the driver",
    example: "Dere amepiga cutcorner kutoroka jam ya Uhuru Highway."
  },
  {
    sheng: "Bob / Chapaa / Ganji",
    english: "Money / Kenya Shillings (KES)",
    swahili: "Pesa / Shilingi",
    category: "booking",
    context: "Currency and fare payment",
    example: "Nauli ni mbao hamsini (KES 50) ukibook mapema."
  },
  {
    sheng: "Sare Noma",
    english: "No worries / Stress-free / Instant refund guarantee",
    swahili: "Hakuna shida / bila wasiwasi",
    category: "booking",
    context: "Assuring the passenger their delayed office ride gets auto-refunded",
    example: "Ukilate kwa ofisi, sare noma—bob zako zinarudi chap chap!"
  },
  {
    sheng: "Weka Form",
    english: "Book a seat / Make a reservation plan",
    swahili: "Weka nafasi ya safari",
    category: "booking",
    context: "Locking down a seat ahead of time while in the office",
    example: "Nimeweka form ya Super Metro ya saa kumi na mbili jioni."
  },
  {
    sheng: "Kaa Rada / Kuwa Macho",
    english: "Stay alert / Be aware of surroundings",
    swahili: "Kuwa mwangalifu",
    category: "safety",
    context: "Safety reminder at busy terminals like River Road and Odeon",
    example: "Kaa rada kwa stage ya Odeon jioni, shika simu fiti."
  },
  {
    sheng: "Jam Kali",
    english: "Heavy Nairobi gridlock / Traffic congestion",
    swahili: "Msongamano mkubwa wa magari",
    category: "transit",
    context: "Traffic jams along Waiyaki Way, Thika Road, Mombasa Road",
    example: "Kuna jam kali kwa Nyayo Stadium, dere anatumia lane ya Express."
  },
  {
    sheng: "Gonga Chuma",
    english: "Conductor tapping metallic bodywork to signal driver to move/stop",
    swahili: "Kugonga bodi ya gari kuashiria kung'oa nanga",
    category: "conductor",
    context: "Signaling communication between conductor and driver",
    example: "Makanga amegonga chuma mara mbili gari ianze kuenda."
  },
  {
    sheng: "Shukisha",
    english: "Alight / Drop off a passenger",
    swahili: "Teremsha abiria",
    category: "conductor",
    context: "Dropping a passenger off at their designated bus stop",
    example: "Shukisha mtu mmoja hapo Serena."
  },
  {
    sheng: "Wazi Mkubwa",
    english: "Clear / Understood / All good, boss!",
    swahili: "Sawa kabisa mkuu",
    category: "slang",
    context: "Friendly agreement between passenger and crew",
    example: "Wazi mkubwa, seat yako No. 4 imelockiwa!"
  },
  {
    sheng: "Toka Ofisi bila Stress",
    english: "Leave the office stress-free with guaranteed seats",
    swahili: "Toka kazini kwa utulivu",
    category: "booking",
    context: "Office workers booking departure ahead of time",
    example: "Toka ofisi bila stress, matatu inakungoja stage."
  },
  {
    sheng: "Rada Safi",
    english: "All clear / Safe zone / No traffic or hazard",
    swahili: "Hali ni shwari kabisa",
    category: "safety",
    context: "Safety advisory status",
    example: "Stage ya Kencom iko rada safi na walinzi wako."
  }
];

export type LanguageMode = 'sheng' | 'english' | 'swahili';

export const TRANSLATION_MAP: Record<string, { sheng: string; swahili: string; english: string }> = {
  "Book Matatu": {
    sheng: "Weka Form ya Nganya",
    swahili: "Katia Tiketi ya Matatu",
    english: "Book Matatu"
  },
  "Drop Me Here": {
    sheng: "Nishushe Hapo!",
    swahili: "Niteremshe Hapa",
    english: "Drop Me Here"
  },
  "Live Tracking": {
    sheng: "Fuata Nganya Live",
    swahili: "Ufuatiliaji wa Moja kwa Moja",
    english: "Live GPS Tracking"
  },
  "Office Delay Refund": {
    sheng: "Umekwama Ofisi? Sare Noma (Refund)",
    swahili: "Umechelewa Kazini? Rejeshewa Nauli",
    english: "Delayed at Office? Auto Refund"
  },
  "Conductor Workboard": {
    sheng: "Kazi ya Makanga / Donda Desk",
    swahili: "Dawati la Mhudumu wa Gari",
    english: "Conductor Operations Board"
  },
  "Safety Radar": {
    sheng: "Rada ya Mtaa & Usalama",
    swahili: "Rada ya Usalama wa Jiji",
    english: "Nairobi Safety & Hazard Radar"
  },
  "Nairobi Adventure": {
    sheng: "Flavour & Vibe za Kanairo",
    swahili: "Matukio na Uzoefu wa Nairobi",
    english: "Nairobi Commuter Culture & Tips"
  },
  "Code Engine": {
    sheng: "Engine ya C++ & Python (Algorithms)",
    swahili: "Mitambo ya Hesabu na Uelekezaji",
    english: "High-Speed C++ & Python Routing Core"
  }
};
