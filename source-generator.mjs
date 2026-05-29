import { mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

const outputDir = "C:\\patelsvine.in";
const siteUrl = "https://www.patelsvine.in";
const siteName = "PatelsVine";
const author = {
  name: "PatelsVine Editorial Desk",
  url: `${siteUrl}/about/`,
};
const today = "2026-05-26";
const adsenseScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7743257472612824"
     crossorigin="anonymous"></script>`;

const categories = [
  { slug: "technology", name: "Technology", description: "AI, chips, digital public infrastructure, data, and consumer technology in India." },
  { slug: "politics", name: "Politics", description: "Election systems, governance, Parliament, public institutions, and policy choices." },
  { slug: "economy", name: "Economy", description: "Credit, industry, finance, agriculture, supply chains, and growth signals." },
  { slug: "infrastructure", name: "Infrastructure", description: "Railways, ports, logistics, energy systems, and public infrastructure." },
  { slug: "security", name: "Security", description: "Defence technology, strategic affairs, conflict impact, and national preparedness." },
  { slug: "events", name: "Events", description: "Major Indian events in sports, culture, technology, and public life." },
  { slug: "agriculture", name: "Agriculture", description: "Farm policy, rural markets, productivity missions, and commodity updates." },
];

const sources = {
  eciIndex: { label: "Election Commission of India results dashboard", url: "https://results.eci.gov.in/ResultAcGenMay2026/index.htm" },
  eciAssam: { label: "ECI Assam party-wise result", url: "https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S03.htm" },
  eciKerala: { label: "ECI Kerala party-wise result", url: "https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S11.htm" },
  eciTamilNadu: { label: "ECI Tamil Nadu party-wise result", url: "https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S22.htm" },
  eciWestBengal: { label: "ECI West Bengal party-wise result", url: "https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S25.htm" },
  eciPuducherry: { label: "ECI Puducherry party-wise result", url: "https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-U07.htm" },
  eciQr: { label: "PIB: ECI QR-based ID system", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256955&lang=1&reg=1" },
  supremeCourt: { label: "PIB: Supreme Court judge strength proposal", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2258131&lang=1&reg=1" },
  semiconductor: { label: "PIB: Two semiconductor units approved", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2258119&lang=1&reg=1" },
  indiaAi: { label: "PIB: IndiaAI compute and startup support", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2245069&lang=1&reg=1" },
  aiModels: { label: "PIB: IndiaAI sovereign model progress", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2239614&lang=1&reg=1" },
  upi: { label: "PIB: UPI completes 10 years", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2257087&lang=1&reg=1" },
  eclgs: { label: "PIB: ECLGS 5.0 for credit support", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2258448&lang=1&reg=1" },
  vadinar: { label: "PIB: Vadinar ship repair facility", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2258115&lang=1&reg=1" },
  rail: { label: "PIB: Three railway multitracking projects", url: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2258124" },
  cotton: { label: "PIB: Mission for Cotton Productivity", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2258120&lang=1&reg=1" },
  sugarcane: { label: "PIB: Sugarcane FRP for 2026-27", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2258113&lang=1&reg=1" },
  rugby: { label: "NDTV Sports: Rugby Premier League 2026 Hyderabad", url: "https://sports.ndtv.com/othersports/rugby-india-announces-2nd-edition-of-rugby-premier-league-in-hyderabad-11317499" },
  defence: { label: "PIB: North Tech Symposium and defence production", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2257798&lang=1&reg=1" },
  padmaAwards: { label: "President of India: Padma Awards 2026 ceremony", url: "https://www.presidentofindia.gov.in/press_releases/president-india-presents-padma-awards-2026-civil-investiture-ceremony-i" },
  coldWaterFisheries: { label: "PIB: Cold water fisheries and Blue Economy", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2264535&lang=1&reg=1" },
  indiaUsTrust: { label: "PIB: India-US natural partnership and supply chains", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2263649&lang=1&reg=3" },
  coreIndustriesApril: { label: "PIB: Index of Eight Core Industries April 2026", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2263287&lang=1&reg=3" },
  balancedFertilisers: { label: "PIB: ICAR balanced fertiliser campaign for Kharif 2026", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2263372&lang=1&reg=3" },
  waterMetroPolicy: { label: "PIB: Draft National Water Metro Policy 2026", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2262535&lang=1&reg=1" },
  stateCyber: { label: "PIB: Cyber security frameworks for state data", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2261823&lang=1&reg=1" },
  rajasthanSemicon: { label: "PIB: Rajasthan's first semiconductor plant", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2261509&lang=1&reg=1" },
  plfsApril: { label: "PIB: PLFS monthly bulletin April 2026", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2261386&lang=1&reg=1" },
  pmayMaharashtra: { label: "PIB: PMAY-G houses and PMGSY-IV roads for Maharashtra", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2261081&lang=1&reg=3" },
};

const imageCredits = {
  "padma-awards-2026.jpg": { credit: "Lakyanaik", url: "https://commons.wikimedia.org/wiki/File:The_President,_Shri_Ram_Nath_Kovind_presenting_the_Padma_Shri_Award,_2022_to_Shri_Neeraj_Chopra_for_Athletics,_Rashtrapati_Bhavan,_in_in_New_Delhi_on_March_08,_2022.jpg", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
  "cold-water-fisheries-2026.jpg": { credit: "Suhayl091", url: "https://commons.wikimedia.org/wiki/File:Fish_farm_kokernag.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  "india-us-trusted-supply-chains.jpg": { credit: "U.S. Department of State", url: "https://commons.wikimedia.org/wiki/File:Secretary_Blinken_Delivers_Remarks_at_the_U.S.-India_Business_Council%E2%80%99s_India_Ideas_Summit_-_52970602424.jpg", license: "Public domain", licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain" },
  "core-industries-april-2026.jpg": { credit: "Neelabh2007", url: "https://commons.wikimedia.org/wiki/File:Steel_Plant,_Bokaro_Steel_City.jpg", license: "Public domain", licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain" },
  "kharif-fertiliser-balance-2026.jpg": { credit: "kiran kumar", url: "https://commons.wikimedia.org/wiki/File:An_Indian_farmer_spreading_fertilizer_over_a_crop.jpg", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
  "national-water-metro-policy-2026.jpg": { credit: "Rohit Saw27", url: "https://commons.wikimedia.org/wiki/File:Kochi_water_metro_junction.jpg", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
  "state-data-cybersecurity-2026.jpg": { credit: "Abigor", url: "https://commons.wikimedia.org/wiki/File:Servers_in_a_Rack.jpg", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" },
  "rajasthan-semiconductor-plant-bhiwadi.jpg": { credit: "2x910", url: "https://commons.wikimedia.org/wiki/File:Si_wafer.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  "plfs-april-2026-labour-market.jpg": { credit: "Michael Cannon", url: "https://commons.wikimedia.org/wiki/File:GurgaonWomenConstructionWorkers.jpg", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
  "pmay-g-maharashtra-rural-housing-2026.jpg": { credit: "Sagar555", url: "https://commons.wikimedia.org/wiki/File:Rural_india_house_in_Maharashtra.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  "assembly-verdict-2026.jpg": { credit: "Election Commission of India / Government of India", url: "https://commons.wikimedia.org/wiki/File:The_voters_registering_their_names_at_a_polling_booth_at_Dolamandap_Sahi,_Puri,_Orissa,_during_the_2nd_Phase_of_General_Election-2009_on_April_23,_2009.jpg", license: "GODL-India", licenseUrl: "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf" },
  "eci-qr-counting-centres.jpg": { credit: "Aaron Parecki", url: "https://commons.wikimedia.org/wiki/File:QR_Codez.jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  "supreme-court-judges-37.jpg": { credit: "Subhashish Panigrahi", url: "https://commons.wikimedia.org/wiki/File:Supreme_Court_of_India.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  "semiconductor-gujarat-2026.jpg": { credit: "Inductiveload", url: "https://commons.wikimedia.org/wiki/File:Silicon_wafer.jpg", license: "Public domain", licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain" },
  "indiaai-compute-2026.jpg": { credit: "Carl Lender", url: "https://commons.wikimedia.org/wiki/File:Datacenter_Server_Racks_(22370909788).jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  "upi-10-years-2026.jpg": { credit: "Ministry of Electronics and IT, Government of India", url: "https://commons.wikimedia.org/wiki/File:The_Minister_of_State_for_Tourism_(IC)_and_Electronics_%26_Information_Technology,_Shri_Alphons_Kannanthanam_launching_the_Digital_Payment_Security_Awareness_Campaign,_in_New_Delhi_(1).jpg", license: "GODL-India", licenseUrl: "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf" },
  "eclgs-airlines-west-asia.jpg": { credit: "Ashwin Kumar", url: "https://commons.wikimedia.org/wiki/File:Air_India_aircraft_at_Kempegowda_International_Airport_(13032288843).jpg", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
  "vadinar-ship-repair.jpg": { credit: "Georgy11", url: "https://commons.wikimedia.org/wiki/File:Cochin_shipyard.jpg", license: "Public domain", licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain" },
  "railway-multitracking-901km.jpg": { credit: "Adityamadhav83", url: "https://commons.wikimedia.org/wiki/File:VSKP_based_Twin_WDG3A_Locomotives_with_a_freight_train_02.jpg", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" },
  "cotton-productivity-mission.jpg": { credit: "P Jeganathan", url: "https://commons.wikimedia.org/wiki/File:Cotton_field_in_sathanur,_perambalur_JEG2973_.jpg", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" },
  "sugarcane-frp-2026.jpg": { credit: "Thamizhpparithi Maari", url: "https://commons.wikimedia.org/wiki/File:Sugarcane_field_of_Kachirapalayam.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  "rugby-premier-league-hyderabad.jpg": { credit: "Asish Maitra", url: "https://commons.wikimedia.org/wiki/File:Wales_v_South_Africa_2010_Comm_Games.jpg", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
  "defence-tech-2026.jpg": { credit: "DRDO / Government of India", url: "https://commons.wikimedia.org/wiki/File:Hypersonic_LRASHM.jpg", license: "GODL-India", licenseUrl: "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf" },
};

const realImageFiles = Object.keys(imageCredits);

const posts = [
  {
    title: "Padma Awards 2026: Why the Civil Investiture Still Matters",
    slug: "padma-awards-2026-civil-investiture-national-honours",
    category: "events",
    tags: ["Padma Awards", "Rashtrapati Bhavan", "public life", "culture"],
    date: "2026-05-25",
    updated: "2026-05-26",
    excerpt: "The first Civil Investiture Ceremony for the Padma Awards 2026 put national recognition back at the centre of India's public conversation.",
    dek: "A national honour is not only a medal moment. It is a public record of whose work India chooses to remember.",
    readingMinutes: 5,
    image: "padma-awards-2026.jpg",
    imageAlt: "President of India presenting a Padma Shri award at Rashtrapati Bhavan",
    sources: [sources.padmaAwards],
    content: `
      <p>The President of India, Smt Droupadi Murmu, presented the Padma Awards 2026 at the first Civil Investiture Ceremony held at Rashtrapati Bhavan on May 25, 2026. The President's Secretariat noted that the Vice President, Prime Minister, and Union Home Minister were among the dignitaries present. The ceremony was formal, but the larger meaning of the moment is public and democratic: the country pauses to recognise work that may otherwise stay outside daily headlines.</p>
      <p>The Padma awards matter because they create a bridge between national memory and individual contribution. India is too large for every valuable life to become widely known. Artists, doctors, social workers, teachers, scientists, sportspersons, administrators, entrepreneurs, and community leaders often spend decades building institutions or preserving traditions before national attention reaches them. An investiture ceremony brings those stories into the centre of the republic.</p>
      <p>There is also a cultural function. Public honours tell citizens what kinds of service are worth admiring. If the list includes grassroots work, traditional knowledge, scientific achievement, cultural preservation, and quiet institution-building, it expands the national idea of success. Recognition does not have to belong only to high visibility. It can also belong to sustained usefulness.</p>
      <p>That is why the setting matters. Rashtrapati Bhavan is not simply a venue; it is a constitutional symbol. When recipients walk through that space, their work is placed inside the story of the Indian state. A small community initiative, a lifetime in the arts, or a scientific contribution becomes part of a national archive.</p>
      <p>For readers, the important thing is to look beyond the ceremonial photograph. Each awardee's journey usually points to a field that needs deeper public attention. A folk artist's award may point to language preservation. A public health worker's award may point to frontline care. A scientist's award may point to patient research that never goes viral but changes capability over time.</p>
      <p>The Padma Awards also invite a healthy question: how does India discover excellence? A country with thousands of districts, hundreds of languages, and deep social diversity needs nomination and evaluation systems that can find people beyond elite networks. The legitimacy of honours grows when citizens see that recognition can travel to small towns, difficult geographies, and under-documented fields.</p>
      <p>There will always be debate around any award system. That is normal in a democracy. But the existence of debate does not reduce the value of public recognition. It should instead make the system more transparent, inclusive, and careful about the distinction between fame and contribution.</p>
      <p>The May 25 ceremony is therefore more than an annual event. It is a reminder that nations are built not only through budgets, elections, and policies, but also through the stories they choose to preserve. The most useful way to follow the Padma Awards is to treat each name as an entry point into a larger India.</p>
    `,
  },
  {
    title: "Cold Water Fisheries: India's Mountain Blue Economy Is Getting Serious",
    slug: "cold-water-fisheries-blue-economy-himalayan-livelihoods",
    category: "agriculture",
    tags: ["fisheries", "Blue Economy", "Himalayas", "rural livelihoods"],
    date: "2026-05-23",
    updated: "2026-05-26",
    excerpt: "Cold water fisheries are moving from remote streams to organised aquaculture, livelihood support, conservation, and mountain enterprise.",
    dek: "The new fisheries story is not only about catch. It is about hatcheries, raceways, cold chains, tourism, nutrition, and local entrepreneurship.",
    readingMinutes: 6,
    image: "cold-water-fisheries-2026.jpg",
    imageAlt: "Trout raceways at a fish farm in Kokernag, Kashmir",
    sources: [sources.coldWaterFisheries],
    content: `
      <p>India's cold water fisheries sector is being framed as a growing pillar of the Blue Economy. A PIB update from May 23, 2026 says the sector now supports livelihoods, nutrition, eco-tourism, biodiversity conservation, and sustainable mountain development. That is a meaningful shift. Cold water fisheries were once discussed mainly as traditional activity in Himalayan streams. They are now being connected to modern aquaculture infrastructure and rural enterprise.</p>
      <p>The geography is specialised. Cold-water fisheries operate in high-altitude snow-fed rivers, streams, lakes, and reservoirs where temperatures usually sit between 5 and 25 degrees Celsius, dissolved oxygen is above 6 mg per litre, and pH levels stay between 6.5 and 8.0. Species such as rainbow trout, golden mahseer, and snow trout need this kind of ecological discipline. They cannot simply be scaled anywhere.</p>
      <p>The source note says cold-water fisheries flourish across Jammu and Kashmir, Ladakh, Himachal Pradesh, Uttarakhand, Arunachal Pradesh, Sikkim, Meghalaya, Nagaland, and hill districts of West Bengal, Kerala, Karnataka, and Tamil Nadu. Together, these ecosystems cover more than 5.33 lakh square km of mountainous terrain. India has identified over 278 cold-water fish species, which makes the sector important for both production and conservation.</p>
      <p>The production numbers are still modest compared with India's full fisheries economy, but they are no longer trivial. Total fish production reached about 197.75 lakh tonnes in 2024-25, while cold-water fisheries contributed nearly 3 percent of inland fish production. National cold-water fish production is around 7,000 metric tonnes, and trout production alone has risen nearly 1.8 times over the last decade to about 6,000 metric tonnes in 2024-25.</p>
      <p>What makes this story interesting is the infrastructure layer. Hatcheries, raceways, recirculating aquaculture systems, biofloc systems, cold chain facilities, fish kiosks, transport vehicles, and integrated aqua parks are turning scattered activity into a value chain. The government note points to aqua parks at Anantnag, Udham Singh Nagar, Ziro, and Mokokchung, plus notified cold water fisheries clusters at Anantnag, Pithoragarh, Kullu, and Kargil.</p>
      <p>For mountain communities, the economic logic is strong. Agriculture in high-altitude regions can be limited by climate, terrain, and market access. Fisheries can add a new income stream if seed supply, feed, disease management, cold transport, and local branding are reliable. Trout and other cold-water species can serve tourism markets, restaurants, urban consumers, and nutrition programmes.</p>
      <p>The risk is that commercial growth could damage the very ecosystems that make the sector possible. Cold streams are sensitive. Poor waste handling, excessive stocking, disease spread, or careless infrastructure can hurt native biodiversity. That is why guidelines on hatchery standards, site selection, disease management, biosecurity, certification, and e-trading matter.</p>
      <p>International collaboration with Norway and Iceland is also worth watching. Both countries have experience in cold-water aquaculture systems, hatchery management, and export strategy. India does not need to copy their models exactly, but knowledge transfer can help avoid mistakes in genetics, disease control, feed efficiency, and farm-level economics.</p>
      <p>The next test is whether the sector can stay farmer-friendly. Capital-heavy systems can exclude small producers unless cooperatives, SHGs, startups, credit access, and insurance are designed carefully. If cold water fisheries become only a high-end niche, the rural development promise weakens. If cluster-based models bring small farmers into reliable markets, the sector can become a serious mountain livelihood engine.</p>
    `,
  },
  {
    title: "India-US Supply Chains: Why Trust Is Becoming an Economic Asset",
    slug: "india-us-trusted-supply-chains-msme-export-mission",
    category: "economy",
    tags: ["India-US", "supply chains", "MSME", "exports", "manufacturing"],
    date: "2026-05-21",
    updated: "2026-05-26",
    excerpt: "Commerce Minister Piyush Goyal's May 2026 remarks underline how India is pitching trust, talent, scale, and testing infrastructure to global industry.",
    dek: "The next phase of trade policy is about whether Indian firms can meet quality, certification, and delivery expectations at global scale.",
    readingMinutes: 6,
    image: "india-us-trusted-supply-chains.jpg",
    imageAlt: "India and United States flags at the U.S.-India Business Council India Ideas Summit",
    sources: [sources.indiaUsTrust],
    content: `
      <p>At the American Chamber of Commerce Annual Leadership Summit in New Delhi, Commerce and Industry Minister Piyush Goyal described India and the United States as natural partners with complementarity across technology innovation, high-precision defence, digital data centres, quantum computing, and medical devices. The May 21, 2026 PIB release framed the relationship around a word that is becoming central to trade policy: trust.</p>
      <p>Trust is now an economic asset because companies are rethinking supply chains after repeated shocks. Pandemic disruption, geopolitical conflict, tariff uncertainty, energy volatility, and logistics bottlenecks have made boardrooms ask not only where production is cheapest, but where it is dependable. India's pitch is that it can combine scale, skills, domestic demand, democratic institutions, and a growing manufacturing base.</p>
      <p>The release says commitments from American industry in the previous six months were estimated above US$60 billion, including large data centre investments by companies such as Amazon and Google. Data centres are not just real estate with servers. They require power reliability, fibre connectivity, cooling, cybersecurity, land permissions, cloud demand, and local talent. Their growth signals confidence in digital consumption and enterprise infrastructure.</p>
      <p>Goyal also pointed to 2,117 global capability centres in India, employing about 2.35 million people directly and generating nearly US$98 billion in revenue. That number matters because GCCs are no longer only back offices. Many now handle engineering, analytics, cybersecurity, product development, cloud operations, design, and research functions. They are part of India's shift from cost centre to capability centre.</p>
      <p>The MSME angle may be even more important. The proposed Export Promotion Mission is expected to help smaller firms secure globally recognised certifications needed to enter international supply chains. This is practical policy. A small manufacturer can have a good product and still fail globally if testing, quality documentation, standards compliance, traceability, packaging, and inspection systems are weak.</p>
      <p>The release mentions agencies such as the Export Inspection Council, Bureau of Indian Standards, and FSSAI working together to build testing and quality infrastructure. That is where the real export story sits. Big announcements attract attention, but quality systems decide whether repeat orders arrive. For global buyers, dependable certification reduces risk.</p>
      <p>Industrial geography is another thread. The Minister referred to an area-based approach and a Bhavya scheme aimed at creating 100 new industrial parks. If such parks integrate worker housing, recreation, logistics, utilities, and social amenities, they can reduce friction for both workers and manufacturers. Industrial parks work best when they are ecosystems, not isolated plots.</p>
      <p>India's challenge is execution discipline. Trust is hard to earn and easy to lose. Delayed shipments, inconsistent quality, contract uncertainty, slow dispute resolution, or infrastructure gaps can undermine the pitch. The opportunity is large, but it requires a boring kind of excellence: testing labs that work, ports that clear cargo, power that stays on, and firms that pay MSME suppliers on time.</p>
      <p>The India-US supply-chain conversation is therefore not just about diplomacy. It is about whether Indian industry can convert strategic alignment into factory-level reliability. If that happens, trust will become a measurable export advantage.</p>
    `,
  },
  {
    title: "Eight Core Industries in April 2026: Steel, Cement and Electricity Hold the Line",
    slug: "eight-core-industries-april-2026-steel-cement-electricity",
    category: "economy",
    tags: ["core industries", "IIP", "steel", "cement", "electricity"],
    date: "2026-05-20",
    updated: "2026-05-26",
    excerpt: "April 2026 core industries data shows modest overall growth, with steel, cement, and electricity offsetting weakness in coal, crude oil, gas, refinery products, and fertilisers.",
    dek: "The headline 1.7 percent growth hides a split economy inside India's industrial base.",
    readingMinutes: 6,
    image: "core-industries-april-2026.jpg",
    imageAlt: "Bokaro Steel Plant industrial complex",
    sources: [sources.coreIndustriesApril],
    content: `
      <p>The combined Index of Eight Core Industries increased by 1.7 percent provisionally in April 2026 compared with April 2025. The Ministry of Commerce and Industry release says cement, steel, and electricity recorded positive growth, while coal, crude oil, natural gas, refinery products, and fertilisers contracted. The number is modest, but the split inside it is more revealing than the headline.</p>
      <p>The eight industries are coal, crude oil, natural gas, refinery products, fertilisers, steel, cement, and electricity. Together they carry 40.27 percent of the weight in the Index of Industrial Production. That makes this data a useful early signal for infrastructure demand, construction activity, energy production, and industrial momentum.</p>
      <p>Cement grew 9.4 percent in April 2026 over April 2025. Steel grew 6.2 percent. Electricity generation grew 4.1 percent. These three positive readings point to continued activity in construction, infrastructure, real estate, manufacturing, and power demand. Cement and steel are especially important because they often move with project execution.</p>
      <p>The weaker side was concentrated in energy and inputs. Coal production declined 8.7 percent, crude oil production fell 3.9 percent, natural gas dropped 4.3 percent, petroleum refinery products slipped 0.5 percent, and fertiliser production fell 8.6 percent. That mix suggests the overall industrial picture is uneven rather than broadly weak or broadly strong.</p>
      <p>One month of data should not be overread. Core industry numbers are revised as source agencies update information, and April can carry seasonal and operational effects. Still, the combination matters because the core industries feed into broader industrial output. If weakness in coal, gas, and fertilisers continues, it can affect energy supply chains, farm input planning, and manufacturing costs.</p>
      <p>The final growth rate for March 2026 was observed at 1.2 percent, while cumulative ICI growth during April to March 2025-26 was 2.7 percent over the previous year. That suggests the economy is growing, but not in a uniform boom pattern. Some capital goods and construction-linked areas look firmer than upstream energy production.</p>
      <p>For policy watchers, the April data raises two questions. First, can infrastructure and housing demand keep steel and cement strong through the year? Second, will lower production in coal, crude oil, natural gas, and fertilisers prove temporary or become a pressure point for prices and supply?</p>
      <p>For businesses, the practical message is to track the details, not just the index. A contractor sees cement and steel. A fertiliser dealer sees input supply. A power distributor sees demand and generation. A manufacturer sees energy and logistics costs. The core industries are called core because they sit underneath many other decisions.</p>
      <p>April 2026 therefore looks like a mixed but useful signal. India's industrial base is still moving, but the growth is being carried by specific pillars. The next few monthly releases will show whether those pillars broaden into a stronger cycle.</p>
    `,
  },
  {
    title: "Kharif 2026 and Balanced Fertilisers: Soil Health Is Back in the Field",
    slug: "kharif-2026-balanced-fertiliser-campaign-soil-health",
    category: "agriculture",
    tags: ["Kharif 2026", "fertilisers", "soil health", "ICAR", "farmers"],
    date: "2026-05-20",
    updated: "2026-05-26",
    excerpt: "ICAR's nationwide campaign ahead of Kharif 2026 is pushing soil-test-based nutrient management, bio-fertilisers, vermicomposting, and integrated nutrient practices.",
    dek: "The campaign is a reminder that farm productivity depends as much on input balance as on input volume.",
    readingMinutes: 5,
    image: "kharif-fertiliser-balance-2026.jpg",
    imageAlt: "Indian farmer spreading fertiliser across a crop field",
    sources: [sources.balancedFertilisers],
    content: `
      <p>The Indian Council of Agricultural Research has intensified a nationwide campaign on balanced use of fertilisers ahead of Kharif 2026. PIB's May 20 update describes field camps, farmer-scientist interactions, school awareness sessions, and training programmes across states. The message is simple but important: more fertiliser is not always better fertiliser.</p>
      <p>Balanced fertiliser use means matching crop needs, soil condition, and nutrient timing. When farmers apply nutrients without soil testing, they can spend more money while damaging productivity over time. Excessive or poorly timed chemical fertiliser can affect soil biology, water quality, and input efficiency. Underuse of key nutrients can also weaken yields. Balance is the hard middle.</p>
      <p>The campaign's emphasis on soil-test-based nutrient management is therefore practical. A soil test gives farmers a clearer view of what the field needs. It can help decide nitrogen, phosphorus, potassium, micronutrient, organic matter, and pH management. This is especially useful before Kharif, when monsoon timing, seed choice, and fertiliser planning intersect.</p>
      <p>The release lists activities in Punjab, West Bengal, Odisha, Madhya Pradesh, Rajasthan, Telangana, Uttar Pradesh, and Uttarakhand. These are not all the same farming systems. Paddy nurseries in one region, soybean fields in another, mustard research in Rajasthan, and organic fertiliser demonstrations in hill areas need different advice. That local delivery is why Krishi Vigyan Kendras matter.</p>
      <p>Integrated Nutrient Management is the key phrase. It brings chemical fertilisers, bio-fertilisers, vermicompost, farmyard manure, livestock-based nutrient recycling, green manuring, crop residue management, and precision practices into the same discussion. The goal is not to romanticise one method. The goal is to reduce waste, protect soil, and keep yields viable.</p>
      <p>Cost is another reason farmers may listen. Fertiliser misuse can quietly raise the cost of cultivation. If a farmer applies expensive inputs that the crop cannot use efficiently, money is lost before harvest begins. Better nutrient management can improve margins even if the headline yield does not jump dramatically in the first season.</p>
      <p>The campaign also has a food security dimension. India cannot depend only on expanding acreage. Productivity and resilience must improve on existing farmland. Healthy soil holds water better, supports root growth, and responds more predictably to weather stress. In a climate-volatile farming year, soil health becomes risk management.</p>
      <p>The hard part is behaviour change. Farmers need advice that is timely, local, credible, and available in their language. They also need access to soil testing, reliable input quality, and follow-up support after demonstration camps end. A one-day awareness programme can start the conversation, but field-level trust is built across seasons.</p>
      <p>Kharif 2026 will test whether balanced fertiliser messaging can move from poster to practice. If it does, the benefit will not only be lower chemical use. It will be better nutrient efficiency, lower avoidable cost, and soil that can keep producing without being exhausted.</p>
    `,
  },
  {
    title: "National Water Metro Policy 2026: Can Indian Cities Use Their Rivers Again?",
    slug: "national-water-metro-policy-2026-urban-mobility",
    category: "infrastructure",
    tags: ["water metro", "urban mobility", "inland waterways", "public transport"],
    date: "2026-05-18",
    updated: "2026-05-26",
    excerpt: "The draft National Water Metro Policy points to an 18-city rollout, with Phase I cities including Guwahati, Srinagar, Patna, Varanasi, Ayodhya, and Prayagraj.",
    dek: "Water-based mobility sounds elegant, but it will work only if cities treat it as daily transport rather than a tourist novelty.",
    readingMinutes: 6,
    image: "national-water-metro-policy-2026.jpg",
    imageAlt: "Kochi Water Metro junction and waterfront mobility infrastructure",
    sources: [sources.waterMetroPolicy],
    content: `
      <p>The Ministry of Ports, Shipping and Waterways has circulated the Draft National Water Metro Policy, 2026 for inter-ministerial consultation. The May 18 PIB release says the Centre is planning water metro services in 18 cities, with Guwahati identified for Phase I. Srinagar, Patna, Varanasi, Ayodhya, and Prayagraj are also part of Phase I, while Tezpur and Dibrugarh have been proposed for Phase II.</p>
      <p>The idea is attractive because many Indian cities grew around rivers, lakes, backwaters, and canals, yet their modern transport systems often ignore water. Roads became crowded. Land for new corridors became expensive. Metro rail is powerful but capital intensive. A water metro promises a lower-land, lower-civil-infrastructure alternative where navigable waterways already exist.</p>
      <p>The release builds on the Kochi Water Metro experience and argues that water-based urban mobility can reduce congestion while offering cleaner, more comfortable commuting. The policy language also points to electric and hybrid ferries, lower land requirements, faster construction timelines, and reduced operational costs. Those are meaningful advantages if the service is planned carefully.</p>
      <p>The biggest test is integration. A ferry stop is useful only if commuters can reach it easily and continue their journey after disembarking. Water metro stations need bus links, metro or rail interchange where possible, safe walkways, cycle parking, digital ticketing, last-mile options, and reliable schedules. Without that, water transport becomes a weekend ride rather than a weekday network.</p>
      <p>City selection matters too. Guwahati, Srinagar, Patna, Varanasi, Ayodhya, and Prayagraj all have different river conditions, tourism patterns, flood risks, navigation constraints, and seasonal flows. A national policy can set standards, but each city will need a local operating model. What works on one water body may not work on another.</p>
      <p>Safety and environmental safeguards will decide public trust. Ferries must meet standards for stability, emergency response, crowd control, accessibility, lighting, surveillance, and weather-related suspension. Water quality, bank protection, jetty construction, dredging, and habitat sensitivity should be managed transparently. A public transport project should not damage the water ecosystem it depends on.</p>
      <p>There is also a tourism upside, but it should not dominate the service design. Cities like Varanasi, Srinagar, and Guwahati can attract visitors through scenic water routes. However, the strongest public case is daily mobility for residents. A system that serves schoolchildren, office workers, vendors, pilgrims, and local families will be more durable than one designed mainly for photo opportunities.</p>
      <p>The policy consultation phase is important because state governments and urban bodies will carry much of the implementation burden. They need clarity on funding, fare policy, asset ownership, operator contracts, safety regulation, environmental approvals, and integration with existing transport agencies.</p>
      <p>If done well, the National Water Metro Policy can reconnect Indian cities with their waterways in a modern way. If done casually, it risks producing isolated ferry projects with weak ridership. The difference will be whether policymakers treat water as a serious mobility corridor.</p>
    `,
  },
  {
    title: "State Data Cybersecurity: Why India's Digital Governance Needs a Common Baseline",
    slug: "state-data-cybersecurity-framework-dpdp-nispg",
    category: "security",
    tags: ["cybersecurity", "state data", "DPDP Act", "digital governance"],
    date: "2026-05-16",
    updated: "2026-05-26",
    excerpt: "MeitY's state data cybersecurity workshop is part of a four-stage process to build a national framework with inputs from all 36 states and Union Territories.",
    dek: "As more welfare, identity, health, land, and education systems go digital, weak state data security becomes a public risk.",
    readingMinutes: 6,
    image: "state-data-cybersecurity-2026.jpg",
    imageAlt: "Server racks representing secure public digital infrastructure",
    sources: [sources.stateCyber],
    content: `
      <p>The Ministry of Electronics and Information Technology convened a National Consultative Workshop on strengthening cybersecurity frameworks for state data at The Ashok Hotel, New Delhi, on May 11, 2026. PIB's May 16 release says the workshop included senior officials from state and Union Territory governments, CERT-In, NIC, MeitY, and NeGD.</p>
      <p>This may sound like an administrative meeting, but it addresses a serious public issue. State governments handle large volumes of sensitive data: welfare beneficiaries, land records, health schemes, school systems, pensions, labour records, local body databases, grievance portals, and identity-linked services. A breach or ransomware incident can disrupt services and expose citizens.</p>
      <p>The workshop is stage II of a four-stage departmental process initiated after directions at the 5th National Conference of Chief Secretaries. It aims to produce a comprehensive national cybersecurity policy framework for state governments through structured consultations with all 36 states and Union Territories. That all-India coverage is essential because digital governance is only as strong as its weakest operational layer.</p>
      <p>The release mentions regulatory obligations connected with the Digital Personal Data Protection Act, 2023 and NISPG. This is important because cybersecurity is no longer only an IT department matter. Data protection creates legal, administrative, and reputational responsibility. States need to know what data they hold, where it sits, who can access it, how it is backed up, and how incidents are reported.</p>
      <p>Cybersecurity frameworks must also be realistic. A large state, a small Union Territory, a municipal body, and a rural department may have very different staffing and budgets. A common baseline should define minimum controls while allowing phased improvement. Password policy alone will not solve state data risk. Asset inventory, access management, encryption, logging, backups, vendor controls, vulnerability management, and incident drills all matter.</p>
      <p>The next steps in the release are clear. States and Union Territories are expected to conduct internal state-level workshops by June 30, 2026. Structured inputs will then be submitted to MeitY. A final note with action points and priority reform areas will be discussed at a National Departmental Summit scheduled for August 2026, and the outcome will be submitted to the Cabinet Secretariat.</p>
      <p>That timeline matters because cyber risk does not wait for perfect policy. State systems face phishing, misconfiguration, weak procurement, unsupported software, poor logging, and third-party risk every day. The consultation process should quickly move from diagnosis to implementation checklists and funding models.</p>
      <p>Citizens often experience cybersecurity only after something breaks. A pension portal goes offline. A land record is unavailable. A hospital system is delayed. A database leak appears online. Better state data security is therefore not abstract. It protects continuity of public services and trust in digital government.</p>
      <p>The best outcome would be a framework that is practical, measurable, and regularly audited. India's digital governance story has scaled fast. The security layer now has to scale with it.</p>
    `,
  },
  {
    title: "Rajasthan's First Semiconductor Plant: Why Bhiwadi Matters",
    slug: "rajasthan-first-semiconductor-plant-bhiwadi-sahasra",
    category: "technology",
    tags: ["semiconductors", "Rajasthan", "Bhiwadi", "electronics manufacturing"],
    date: "2026-05-15",
    updated: "2026-05-26",
    excerpt: "The Bhiwadi semiconductor ATMP/OSAT facility and electronics manufacturing cluster show how India's chip ambitions are spreading beyond one or two states.",
    dek: "Packaging capacity, component clusters, training centres, and exports are the practical middle layer of India's semiconductor journey.",
    readingMinutes: 6,
    image: "rajasthan-semiconductor-plant-bhiwadi.jpg",
    imageAlt: "Close view of a silicon wafer used in semiconductor manufacturing",
    sources: [sources.rajasthanSemicon],
    content: `
      <p>Rajasthan entered India's semiconductor map on May 15, 2026 with the inauguration of an Electronics Manufacturing Cluster at Salarpur, Khushkhera, Bhiwadi, and the Sahasra Semiconductors ATMP/OSAT facility. The PIB release describes the Sahasra unit as India's first SME-led semiconductor facility and the first SME to start commercial production of semiconductor chips.</p>
      <p>This matters because semiconductor ecosystems do not grow only through headline fabrication plants. Assembly, testing, marking, packaging, electronics components, cleanrooms, testing labs, skill centres, and supplier clusters are all part of the chain. ATMP and OSAT capacity can give India a practical entry point into global semiconductor workflows while larger fabrication ambitions mature.</p>
      <p>The ELCINA Electronics Manufacturing Cluster at Bhiwadi has been developed over 50.3 acres with a project cost of Rs 46.09 crore, including Rs 20.24 crore of Government of India support under the EMC scheme. The release says it includes uninterrupted power and water supply, internal roads, centralised administrative facilities, testing and training centres, and a dedicated skill development centre.</p>
      <p>The cluster has already attracted planned investments of more than Rs 1,200 crore by 20 companies, with 11 companies operational. Those operational companies have cumulative investment above Rs 900 crore and employment for more than 2,700 people. That cluster logic is important. Electronics manufacturing needs proximity between parts makers, packaging units, training facilities, logistics, and quality systems.</p>
      <p>The Sahasra facility itself has been set up with investment above Rs 150 crore under MeitY's SPECS scheme. It spans 57,000 sq ft and includes Class 10K and 100K cleanrooms. The unit packages memory chips for products such as Micro SD and flash storage, along with LED driver ICs, eSIMs, and RFID products.</p>
      <p>The annual packaging capacity is currently 60 million semiconductor units, with SPECS-supported projected capacity of about 43 million units and plans to scale to nearly 400-600 million units annually over the next two to three years. That scale-up will be the real test. Semiconductors reward consistency, yield, process control, and customer confidence.</p>
      <p>The export detail is also notable. The facility is already exporting more than 60 percent of its production to markets including the United States, Germany, France, Eastern Europe, China, and Nepal. Exports show that the facility is not only being built for symbolic domestic consumption. It is being tested by external customers.</p>
      <p>For Rajasthan, the location near the National Capital Region gives Bhiwadi road, rail, air, and industrial connectivity advantages. For India, the broader point is geographic diversification. A resilient electronics economy cannot depend on a handful of clusters. More states need to build credible niches.</p>
      <p>The next stage should focus on supplier depth, training quality, reliability, and local product R&D. If Bhiwadi can move from packaging service to stronger design and component capability, Rajasthan's first semiconductor plant could become more than a milestone. It could become a platform.</p>
    `,
  },
  {
    title: "PLFS April 2026: What the Latest Labour Numbers Actually Say",
    slug: "plfs-april-2026-labour-market-urban-female-unemployment",
    category: "economy",
    tags: ["PLFS", "jobs", "labour market", "urban unemployment", "women"],
    date: "2026-05-15",
    updated: "2026-05-26",
    excerpt: "The April 2026 PLFS bulletin shows slight softening in labour force participation, stable urban worker-population ratio, and a one-year low in urban female unemployment.",
    dek: "Monthly labour data should be read carefully: the direction matters, but so do definitions, rural-urban splits, and participation rates.",
    readingMinutes: 6,
    image: "plfs-april-2026-labour-market.jpg",
    imageAlt: "Women construction workers at a work site in Gurgaon",
    sources: [sources.plfsApril],
    content: `
      <p>The Periodic Labour Force Survey monthly bulletin for April 2026 gives a fresh snapshot of India's labour market. The National Statistical Office release says overall labour force participation for people aged 15 and above stood at 55.0 percent, compared with 55.4 percent in March 2026 and 55.6 percent in April 2025. That is a slight softening, not a dramatic shift.</p>
      <p>PLFS uses the Current Weekly Status approach for these monthly indicators. That means it looks at activity status during a short reference period, making it useful for current trends but still requiring careful interpretation. A single month can move because of seasonality, rural work cycles, education schedules, migration, and temporary labour demand.</p>
      <p>The worker-population ratio for people aged 15 and above was 52.2 percent in April 2026, down from 52.6 percent in March. Urban WPR, however, remained unchanged at 46.8 percent. This stability in urban WPR matters because urban jobs often receive more attention in public debate, especially for salaried work, services, construction, retail, transport, and platform-linked employment.</p>
      <p>Unemployment moved slightly lower in cities. Urban unemployment for people aged 15 and above eased to 6.6 percent in April from 6.8 percent in March. Urban female unemployment declined to 8.5 percent, the lowest level recorded since April 2025 according to the release. That is encouraging, but it must be read with participation data.</p>
      <p>Female labour force participation for people aged 15 and above stood at 33.9 percent in April 2026, compared with 34.4 percent in March and 34.2 percent in April 2025. Rural female LFPR was 38.2 percent, while urban female LFPR was 25.0 percent. A fall in unemployment can look positive, but if participation also softens, the story becomes more nuanced.</p>
      <p>That is why labour numbers should be read as a set. LFPR tells us how many people are working or looking for work. WPR tells us how many are actually working. UR tells us how many in the labour force are unemployed. No single metric can describe job quality, wages, informality, hours, or security.</p>
      <p>The release notes that the estimates are based on information from 3,74,243 persons surveyed, including 2,13,027 in rural areas and 1,61,216 in urban areas. A sample of that size gives the bulletin statistical weight, but readers still need to compare month after month before drawing strong conclusions.</p>
      <p>The policy implications are familiar. India needs more work opportunities for women, better urban job matching, improved skilling, safer transport, childcare support, formalisation, and labour-intensive growth. Female participation especially depends on social norms, household responsibilities, local job availability, safety, and wage attractiveness.</p>
      <p>April 2026 does not tell a simple jobs boom or jobs crisis story. It tells a mixed story: slightly lower participation, stable urban WPR, marginally lower urban unemployment, and an encouraging but incomplete signal for urban women. The best reading is cautious optimism with a demand for deeper job quality data.</p>
    `,
  },
  {
    title: "PMAY-G in Maharashtra: Five Lakh Houses and the Rural Infrastructure Link",
    slug: "pmay-g-maharashtra-five-lakh-houses-rural-roads",
    category: "infrastructure",
    tags: ["PMAY-G", "Maharashtra", "rural housing", "PMGSY", "welfare"],
    date: "2026-05-14",
    updated: "2026-05-26",
    excerpt: "Maharashtra's PMAY-G event combines Grih Pravesh for 5 lakh houses with a Rs 8,368.50 crore central-share sanction and 35 PMGSY-IV rural road works.",
    dek: "Rural housing policy works best when it is linked with roads, services, local livelihoods, and beneficiary dignity.",
    readingMinutes: 6,
    image: "pmay-g-maharashtra-rural-housing-2026.jpg",
    imageAlt: "Rural house construction in Maharashtra",
    sources: [sources.pmayMaharashtra],
    content: `
      <p>The Ministry of Rural Development's May 14, 2026 release announced a major PMAY-G event in Satara, Maharashtra. Union Minister Shivraj Singh Chouhan was scheduled to launch Grih Pravesh for 5 lakh completed Pradhan Mantri Awaas Yojana-Gramin houses, issue a PMAY-G mother sanction involving Rs 8,368.50 crore central share assistance for Maharashtra in FY 2026-27, and approve 35 PMGSY-IV road works worth Rs 122.98 crore.</p>
      <p>The numbers are large, but the significance is local. A completed rural house changes everyday security for a family. It affects privacy, health, study space, asset ownership, resilience during monsoon, and social dignity. The policy language of "pucca houses with basic amenities" becomes real only when families can actually move in.</p>
      <p>The release says PMAY-G has a cumulative national target of 4.15 crore houses for states and Union Territories. As of May 11, 2026, 3.91 crore houses had been sanctioned and more than 3.03 crore completed. Maharashtra had a cumulative target of 43.80 lakh houses, with 41.42 lakh sanctioned and 17.92 lakh completed. Satara district had 55,052 targeted houses, 54,759 sanctioned, and 24,848 completed.</p>
      <p>Those figures show both progress and unfinished work. Sanctioning is not the same as completion. Completion depends on land clarity, beneficiary contribution, fund flow, material prices, labour availability, local monitoring, convergence with toilets, electricity, water, and road access, and the ability of households to navigate paperwork.</p>
      <p>The rural road component is important. Housing without connectivity can still leave families cut off from schools, health centres, markets, banks, and public transport. PMGSY-IV road works worth Rs 122.98 crore for 35 rural habitations connect the housing story to mobility. A village home becomes more valuable when the road outside it works across seasons.</p>
      <p>Housing policy is also a platform for other welfare delivery. Once a household has a stable address and basic services, other programmes can reach more reliably. Banking, LPG, sanitation, electricity, digital records, and local governance all become easier when housing is formal and traceable.</p>
      <p>There is a gender dimension too. Rural housing titles and beneficiary selection can affect women's bargaining power and family security when designed carefully. A house is not only a construction unit. It is a social asset, and the ownership pattern matters.</p>
      <p>The risk in large housing programmes is that quantity can overshadow quality. Wall strength, roof durability, drainage, ventilation, climate resilience, toilet usability, and access to water should matter as much as counting completion. Beneficiary feedback should remain part of monitoring after the ceremony ends.</p>
      <p>Maharashtra's May 2026 package is therefore best read as a rural infrastructure bundle: housing, roads, welfare recognition, and future funding. The outcome will be judged not only by how many houses are counted, but by how many families can live in them safely, affordably, and with better access to opportunity.</p>
    `,
  },
  {
    title: "India's 2026 Assembly Verdict: What Five State Results Signal",
    slug: "india-2026-assembly-verdict-five-state-results",
    category: "politics",
    tags: ["elections", "states", "democracy", "ECI"],
    date: "2026-05-13",
    updated: "2026-05-13",
    excerpt: "The May 2026 assembly results across Assam, Kerala, Tamil Nadu, West Bengal, and Puducherry point to a more competitive and fragmented federal map.",
    dek: "A clear, neutral reading of the official Election Commission tallies and what they mean for India's political map.",
    readingMinutes: 6,
    image: "assembly-verdict-2026.jpg",
    imageAlt: "Voters registering their names at an Indian polling booth",
    sources: [sources.eciIndex, sources.eciAssam, sources.eciKerala, sources.eciTamilNadu, sources.eciWestBengal, sources.eciPuducherry],
    content: `
      <p>The May 2026 assembly verdict is important because it is not one story. It is five regional stories arriving at the same time, each with a different message about party strength, local leadership, alliance arithmetic, and voter expectations. The Election Commission of India results dashboard, last updated on May 5, 2026, showed completed tallies for Assam, Kerala, Tamil Nadu, West Bengal, and Puducherry. Read together, the numbers describe a federal political map that is both decisive in some states and coalition-heavy in others.</p>
      <p>Assam delivered the most straightforward continuity signal. The Bharatiya Janata Party won 82 of 126 seats, while the Indian National Congress won 19. Bodoland Peoples Front and Asom Gana Parishad each won 10 seats. In a state where regional identity, welfare delivery, migration, infrastructure, and ethnic balance all shape politics, the result gives the leading party a comfortable legislative base. The smaller party numbers also show why Assam's politics cannot be understood only through a national lens. Regional parties continue to matter in local negotiation and issue framing.</p>
      <p>Kerala produced a very different picture. The Congress won 63 of 140 seats, CPI(M) won 26, Indian Union Muslim League won 22, CPI won 8, Kerala Congress won 7, BJP won 3, and independents plus smaller parties filled the rest. This kind of tally makes coalition management central. In Kerala, the electoral story is less about one-party sweep and more about whether alliances can convert social breadth into stable administration. Education, health, migration, employment, coastal livelihoods, and state finances will stay at the centre of the conversation.</p>
      <p>Tamil Nadu was the result that drew the sharpest national attention. Tamilaga Vettri Kazhagam won 108 of 234 seats, ahead of DMK at 59 and AIADMK at 47. A first-place finish at this scale changes the grammar of state politics, but it also leaves the practical question of government formation, majority support, and legislative durability. The official tally shows a strong break from old assumptions, yet governance will depend on whether campaign energy can become cabinet discipline, policy detail, and constituency-level delivery.</p>
      <p>West Bengal was the most decisive verdict by seat share. The BJP won 207 seats in a 294-member assembly, while All India Trinamool Congress won 80. Congress won 2, Aam Janata Unnayan party won 2, CPI(M) won 1, and All India Secular Front won 1. For a state with long histories of ideological mobilisation, rural networks, border politics, labour migration, and urban aspiration, a result of this size marks a major structural shift. The test now moves from campaign consolidation to administrative reach.</p>
      <p>Puducherry's result was smaller in scale but still useful as a signal from the Tamil-speaking political belt. All India N.R. Congress won 12 of 30 seats, DMK won 5, BJP won 4, TVK won 2, Congress won 1, LJK won 1, ADMK won 1, NYMK won 1, and independents won 3. In compact assemblies, the distance between a verdict and a functioning government can be narrow. Local alliances, individual legislators, and issue-by-issue negotiation matter more visibly than in large states.</p>
      <p>The big lesson is that India in 2026 is not moving in one uniform political direction. Voters are using state elections to reward continuity in one region, disrupt old formations in another, and demand coalition responsiveness elsewhere. That makes the next phase more policy-heavy than headline-heavy. Parties that won big will have to convert mandate into administration. Parties that lost ground will need to rebuild organisation, credibility, and local issue ownership.</p>
      <p>For readers, the best way to follow the story is to separate final seat arithmetic from post-result interpretation. The seat tallies tell us who has legislative strength. The next six months will tell us who has governing depth.</p>
    `,
  },
  {
    title: "QR Codes at Counting Centres: Why ECI's New Access System Matters",
    slug: "eci-qr-code-counting-centres-election-security",
    category: "politics",
    tags: ["Election Commission", "ECINET", "governance", "election security"],
    date: "2026-05-12",
    updated: "2026-05-13",
    excerpt: "The Election Commission's QR-based identity cards add a digital layer to the most sensitive point of the counting process.",
    dek: "The new ID module is a small technical change with large implications for trust, access control, and election transparency.",
    readingMinutes: 5,
    image: "eci-qr-counting-centres.jpg",
    imageAlt: "A mobile phone scanning a QR code",
    sources: [sources.eciQr, sources.eciIndex],
    content: `
      <p>The Election Commission of India introduced a QR code-based Photo Identity Card module on ECINET for authorised entry into counting centres and counting halls. The system began with the counting held on May 4, 2026, for assembly elections in Assam, Kerala, Tamil Nadu, West Bengal, and Puducherry, along with by-elections in seven assembly constituencies across five states. It is planned for future Lok Sabha, state assembly, and by-election counting as well.</p>
      <p>The counting centre is one of the most sensitive spaces in an election. It is where political competition, public expectation, media scrutiny, and administrative procedure converge. Even a small access-control failure can become a legitimacy issue. That is why the shift to QR-based verification matters. It does not replace institutional trust on its own, but it makes access more traceable and less dependent on paper checks alone.</p>
      <p>According to the Election Commission's release, the new system creates a three-tier security mechanism. At the first two levels, photo identity cards issued by the Returning Officer are checked manually. At the innermost security cordon near the counting hall, entry is permitted only after successful QR code scanning. This layered method is important because election security depends on redundancy. A single checkpoint can fail; a layered process reduces that risk.</p>
      <p>The system applies to categories of people authorised to enter counting spaces. That includes Returning Officers, Assistant Returning Officers, counting staff, technical personnel, candidates, election agents, and counting agents. The ECI also clarified that media access continues through authority letters under existing instructions, with media centres set up near counting halls for facilitation.</p>
      <p>Digital verification can improve the audit trail, but implementation will decide its real value. District Election Officers and Returning Officers have been directed to deploy trained personnel at designated checkpoints. Training is not a side issue. A QR system is only useful if staff can handle device failures, mismatched identity details, power or connectivity issues, and crowd pressure without creating confusion.</p>
      <p>The larger trend is the digitisation of election management. ECINET, standardised ID formats, data dashboards, and improved counting protocols are all part of the same institutional direction. The goal should not be technology for display. It should be technology that makes procedure clearer, faster, and easier to verify.</p>
      <p>There are also privacy and data governance questions that deserve attention. Identity systems used in elections must collect only necessary data, restrict access, and retain records according to clear rules. Voters and parties need confidence that security does not quietly become over-collection. The best election technology is therefore boring in the right way: limited, transparent, documented, and reliable.</p>
      <p>For citizens watching from outside the counting hall, QR-based access control may sound like a small administrative update. But elections are built on small administrative details. A secure doorway helps protect a democratic outcome.</p>
    `,
  },
  {
    title: "Supreme Court Judge Strength May Rise to 37: The Governance Case",
    slug: "supreme-court-judge-strength-37-governance-case",
    category: "politics",
    tags: ["Supreme Court", "judiciary", "Parliament", "governance"],
    date: "2026-05-12",
    updated: "2026-05-13",
    excerpt: "The Cabinet has approved a proposal to increase Supreme Court judge strength from 33 to 37, excluding the Chief Justice of India.",
    dek: "More judges can help throughput, but the deeper challenge is how cases move through the system.",
    readingMinutes: 5,
    image: "supreme-court-judges-37.jpg",
    imageAlt: "Central wing of the Supreme Court of India building in New Delhi",
    sources: [sources.supremeCourt],
    content: `
      <p>The Union Cabinet has approved a proposal to introduce the Supreme Court (Number of Judges) Amendment Bill, 2026. The proposal would amend the Supreme Court (Number of Judges) Act, 1956 and increase the number of Supreme Court judges from 33 to 37, excluding the Chief Justice of India. The stated objective is to help the Court function more efficiently and support speedy justice.</p>
      <p>At first glance, the logic is simple. More judges should mean more bench capacity, more matters heard, and less pressure on existing rosters. But the Supreme Court is not a factory line where adding four seats automatically removes backlog. The Court handles constitutional questions, civil and criminal appeals, bail matters, transfer petitions, special leave petitions, election disputes, regulatory questions, and public law issues. The workload is diverse, and each category moves at a different speed.</p>
      <p>Still, judge strength matters. When a court is understaffed relative to its docket, every procedural choice becomes harder. Constitution benches can be delayed because regular benches are overloaded. Urgent matters can crowd out final hearings. Judges have less time for deep judgment writing. A larger bench pool gives the institution more scheduling flexibility.</p>
      <p>The proposal also signals that judicial capacity is now part of a larger governance conversation. Citizens experience the state through courts as much as through welfare schemes, police stations, tax offices, municipal bodies, and digital portals. If a commercial dispute takes years, business confidence is affected. If a criminal appeal waits too long, liberty is affected. If constitutional matters are delayed, federal and democratic clarity is affected.</p>
      <p>However, capacity cannot stop at the top court. A significant part of Supreme Court pressure comes from the way cases travel upward. High Court vacancies, tribunal capacity, procedural delays, and inconsistent filtering of appeals all influence the Supreme Court's docket. Four additional judges can help, but they cannot replace systemic case management.</p>
      <p>Three reforms will matter alongside the amendment. First, appointment timelines need discipline so sanctioned strength does not remain theoretical. Second, case listing and categorisation should make final hearings more predictable. Third, technology should assist cause-list transparency, document management, and research support without turning justice into a black box.</p>
      <p>The expenditure for judge salaries, support staff, and related facilities will come from the Consolidated Fund of India, according to the Cabinet note. That is expected. The more important public question is return on institutional capacity. If the additional strength is matched with better listing, clearer prioritisation, and sustained appointments, the proposal can make a visible difference.</p>
      <p>For now, the amendment is a useful step, not a complete answer. The real test will be whether citizens see faster, clearer, and more consistent resolution in the years after the increase.</p>
    `,
  },
  {
    title: "Two New Semiconductor Units in Gujarat: Why the May 2026 Approval Is Bigger Than One State",
    slug: "two-new-semiconductor-units-gujarat-may-2026",
    category: "technology",
    tags: ["semiconductors", "Gujarat", "electronics", "manufacturing"],
    date: "2026-05-11",
    updated: "2026-05-13",
    excerpt: "India's semiconductor push added two more projects, including a commercial Mini/Micro-LED display facility and a packaging unit.",
    dek: "The fresh approvals strengthen a domestic chip ecosystem that now has to move from announcement momentum to execution depth.",
    readingMinutes: 6,
    image: "semiconductor-gujarat-2026.jpg",
    imageAlt: "Photograph of a silicon wafer used in semiconductor packaging",
    sources: [sources.semiconductor],
    content: `
      <p>The Union Cabinet approved two more semiconductor projects under the India Semiconductor Mission on May 5, 2026. The projects include India's first commercial Mini/Micro-LED display facility based on Gallium Nitride technology and a semiconductor packaging facility. Both are planned in Gujarat, with a cumulative investment of about Rs 3,936 crore and expected employment for 2,230 skilled professionals.</p>
      <p>The significance is not only that two more units were approved. It is that the approved mix points to a broader understanding of the semiconductor ecosystem. A chip economy is not just about advanced logic fabs. It includes compound semiconductors, sensors, display technologies, assembly, testing, marking, packaging, design tools, supply chains, workforce training, and reliable utilities. Countries that focus only on one layer usually discover that the rest of the value chain still sits elsewhere.</p>
      <p>The Mini/Micro-LED project is especially interesting because display manufacturing is closely tied to consumer electronics, automotive screens, industrial equipment, augmented reality devices, and public digital infrastructure. Gallium Nitride-based display technology can support bright, efficient, high-performance modules. If India can build capability here, it may reduce dependence on imported display modules over time and create opportunities for domestic electronics brands.</p>
      <p>Packaging is the other quiet but critical layer. Advanced packaging decides how chips are connected, protected, tested, and made usable inside devices. Even when a wafer is fabricated elsewhere, packaging capability can capture value, create skilled jobs, and support local design companies. It also allows India to participate in semiconductor supply chains before every part of fabrication is localised.</p>
      <p>The Cabinet release notes that India already has approved projects in various stages of execution, with two projects having started commercial shipments and two more expected to begin shipments soon. That detail matters because the semiconductor industry is judged by delivery, not intent. Investors, customers, and equipment suppliers watch whether timelines are met, whether quality is consistent, and whether local talent can scale.</p>
      <p>The policy challenge now is coordination. Semiconductor units need clean power, water management, specialty gases, chemicals, logistics, testing infrastructure, and fast customs processes. They also need universities and skilling institutions to produce technicians, process engineers, reliability experts, and equipment maintenance teams. The strongest chip clusters in the world are ecosystems, not isolated buildings.</p>
      <p>For Gujarat, the approvals deepen its role as a manufacturing hub. For India, the larger value is strategic resilience. Semiconductors sit inside phones, cars, defence systems, medical equipment, power grids, telecom networks, and AI infrastructure. Supply disruptions can ripple through the whole economy. Building domestic capacity is therefore both an industrial policy and a national capability project.</p>
      <p>The May 2026 approvals are a useful step in that direction. The next milestone will be visible production, reliable customer contracts, and a supplier base that grows around these units rather than remaining dependent on imports for every specialised input.</p>
    `,
  },
  {
    title: "IndiaAI in 2026: Compute, Sovereign Models, and the Race to Make AI Useful",
    slug: "indiaai-2026-compute-sovereign-models-startups",
    category: "technology",
    tags: ["IndiaAI", "AI", "startups", "compute", "LLM"],
    date: "2026-05-10",
    updated: "2026-05-13",
    excerpt: "IndiaAI's 2026 progress shows a practical focus: cheaper compute, Indian-language models, startup support, and public-good AI infrastructure.",
    dek: "The important question is whether subsidised infrastructure can become real products, research, and public services.",
    readingMinutes: 6,
    image: "indiaai-compute-2026.jpg",
    imageAlt: "Rows of server racks inside a data centre",
    sources: [sources.indiaAi, sources.aiModels],
    content: `
      <p>India's artificial intelligence strategy in 2026 is becoming more concrete. Under the IndiaAI Mission, the government has highlighted affordable compute access, startup support, datasets, and indigenous foundational models. PIB updates in March 2026 said more than 38,000 GPUs had been onboarded through the AI compute portal for Indian startups and academia. Another government update noted that common compute is being provided through empanelled providers and that capacity is being expanded further.</p>
      <p>This matters because compute has become one of the biggest barriers in AI. Training and deploying serious models requires expensive GPUs, reliable data centres, specialised software, and experienced engineers. Without shared infrastructure, only the largest companies can afford to experiment at scale. The IndiaAI approach treats compute as a public capability, making it easier for smaller teams to build models, tools, and applications.</p>
      <p>The second important strand is sovereign model development. Government updates have said multiple teams were shortlisted for indigenous foundational AI models and large language models, with some models launched during the IndiaAI Impact Summit 2026. The point is not to build a model only for symbolism. Indian languages, mixed-script communication, local documents, public-service workflows, agriculture, healthcare, and education all need models that understand Indian contexts deeply.</p>
      <p>English-first AI can be useful, but India is not an English-only market. A farmer using a voice assistant in Bengali, a nurse reading a local-language medical advisory, a district officer summarising applications, or a small manufacturer translating compliance documents all need AI that handles Indian languages and domain vocabulary reliably. Sovereign models can help if they are benchmarked honestly, documented well, and made accessible to developers.</p>
      <p>The third piece is data. AI systems improve when developers can access high-quality datasets with clear permissions and privacy safeguards. Platforms such as AIKosha have been described as shared resources for models, tools, and datasets across sectors such as health, agriculture, and education. The governance challenge is to balance openness with privacy. India cannot build trustworthy AI by casually releasing sensitive data. It needs strong anonymisation, licensing, consent, and audit practices.</p>
      <p>For startups, the practical question is whether the mission reduces time from idea to product. Affordable GPUs help, but founders also need procurement access, cloud credits, mentoring, testbeds, legal clarity, and early customers. Public institutions can play a role by creating problem statements in healthcare triage, crop advisory, citizen grievance handling, language translation, skilling, and accessibility.</p>
      <p>The risks are familiar. Subsidies can be captured by well-connected firms. Model benchmarks can become marketing. Public-sector AI can automate bad processes instead of improving them. Safety can be treated as paperwork. To avoid that, IndiaAI should reward measurable usefulness: lower service cost, faster delivery, better language access, and clearer accountability when systems fail.</p>
      <p>India's AI moment will not be decided by one summit or one model launch. It will be decided by whether compute, data, models, and skills come together in tools that ordinary people actually use. In 2026, the foundation is being laid. The hard work now is disciplined execution.</p>
    `,
  },
  {
    title: "UPI at 10: India's Payments Network Is Now Public Infrastructure",
    slug: "upi-at-10-india-payments-public-infrastructure",
    category: "technology",
    tags: ["UPI", "digital payments", "NPCI", "fintech"],
    date: "2026-05-09",
    updated: "2026-05-13",
    excerpt: "UPI's first decade moved it from a payment feature to a national transaction layer used by consumers, merchants, banks, and startups.",
    dek: "The next decade will be about reliability, fraud control, cross-border use, and merchant economics.",
    readingMinutes: 6,
    image: "upi-10-years-2026.jpg",
    imageAlt: "Digital payment security awareness campaign launch in New Delhi",
    sources: [sources.upi],
    content: `
      <p>UPI completed 10 years in April 2026. According to a PIB release, annual UPI transaction volume rose from 2 crore transactions in FY 2016-17 to more than 24,162 crore transactions in FY 2025-26. Transaction value rose from Rs 0.07 lakh crore to about Rs 314 lakh crore over the same period. The release also noted more than 700 banks live on UPI and a large share of India's digital payments running through the system.</p>
      <p>Those numbers tell a familiar success story, but the deeper point is institutional. UPI is no longer just a payment mode inside apps. It is a public transaction layer. Merchants use it for small retail payments. Families use it for transfers. Gig workers use it to receive income. Startups build checkout, lending, accounting, and rewards products around it. Banks and payment service providers compete on user experience while sharing common rails.</p>
      <p>That architecture is India's biggest payments lesson. Instead of leaving instant payments only to closed private networks, UPI created interoperable rails where multiple apps and banks can participate. This lowered switching friction for users and allowed small merchants to accept digital payments with minimal setup. The QR code at a tea stall is now as important to financial inclusion as a branch counter once was.</p>
      <p>UPI's growth has also changed the fintech business model. For years, consumer payments attracted users even when direct payment margins were thin. Companies built adjacent revenue through credit, insurance, wealth products, merchant services, and data-enabled risk scoring. The public benefit is convenience; the policy challenge is ensuring that adjacent monetisation does not become exploitative or opaque.</p>
      <p>Fraud is the unavoidable next frontier. As transaction volume rises, social-engineering scams, mule accounts, fake customer support numbers, and phishing attempts also grow. Technical safeguards help, but user education, bank accountability, faster dispute resolution, and better law-enforcement coordination are equally important. A payment network becomes trusted not only when payments succeed, but when failed or fraudulent payments are handled fairly.</p>
      <p>Merchant economics will also need attention. Small merchants value UPI because it is simple and low-cost. Larger merchants and payment companies want sustainable economics for infrastructure, fraud management, reconciliation, and support. The next decade will involve balancing affordability with investment in reliability and service quality.</p>
      <p>Cross-border acceptance is another area to watch. The PIB release lists UPI acceptance or linkage in countries such as Singapore, UAE, France, Bhutan, Nepal, Sri Lanka, Mauritius, and Qatar. For tourists, students, migrant workers, and small exporters, international interoperability can reduce friction. But cross-border payments bring compliance, foreign exchange, and consumer-protection complexity.</p>
      <p>UPI's first decade proved that digital public infrastructure can scale. The second decade will test whether it can remain secure, open, competitive, and user-friendly at even larger scale. That is the difference between a viral product and durable infrastructure.</p>
    `,
  },
  {
    title: "ECLGS 5.0 and West Asia Stress: Why Indian Airlines Needed a Credit Buffer",
    slug: "eclgs-5-west-asia-airline-credit-buffer",
    category: "economy",
    tags: ["aviation", "West Asia", "ECLGS", "credit"],
    date: "2026-05-08",
    updated: "2026-05-13",
    excerpt: "The Cabinet's ECLGS 5.0 approval links airline credit support to fuel prices, airspace closures, and route disruptions connected to West Asia tensions.",
    dek: "The aviation story shows how distant conflict can quickly become a domestic cost and liquidity problem.",
    readingMinutes: 5,
    image: "eclgs-airlines-west-asia.jpg",
    imageAlt: "Air India aircraft at Kempegowda International Airport",
    sources: [sources.eclgs],
    content: `
      <p>The Union Cabinet approved the Emergency Credit Line Guarantee Scheme 5.0 in May 2026, with targeted support for eligible borrowers including the airline sector. A PIB release from the Ministry of Civil Aviation said the scheme responds to financial stress caused by higher Aviation Turbine Fuel prices, airspace closures, reduced operations on international routes, lower aircraft utilisation, and liquidity constraints. Out of the additional credit flow, Rs 5,000 crore was earmarked for airlines.</p>
      <p>The aviation sector is highly exposed to external shocks. Fuel is one of the largest cost items for airlines. International routes depend on open airspace, predictable flight times, and stable demand. When conflict in West Asia affects oil prices or flight paths, Indian carriers can face longer routes, higher fuel burn, aircraft scheduling pressure, crew-hour complications, and passenger fare sensitivity at the same time.</p>
      <p>Credit guarantees do not erase those costs. They reduce lender risk so banks and financial institutions are more willing to extend working capital or emergency credit. Under ECLGS 5.0, the release describes credit guarantee coverage of 100 percent for MSMEs and 90 percent for non-MSMEs as well as the airline sector through the National Credit Guarantee Trustee Company Limited. Loans sanctioned under the scheme are applicable up to March 31, 2027, according to the government note.</p>
      <p>The policy logic is stabilisation. If airlines suddenly lose liquidity, the impact spreads beyond company balance sheets. Airports, ground handlers, maintenance firms, catering companies, travel agents, tourism businesses, exporters, and employees all feel the pressure. Aviation also has a connectivity role. Reduced international or domestic capacity can affect business travel, student movement, medical travel, and cargo flows.</p>
      <p>There is a fair debate about when public credit support is justified. Airlines are private businesses, and repeated bailouts can create moral hazard if companies assume the state will cushion every shock. But the 2026 case is framed as a temporary liquidity response to external disruption rather than a permanent subsidy. That distinction matters. Good support should be targeted, time-bound, transparent, and linked to real operational stress.</p>
      <p>Passengers may still see pressure on fares if fuel and routing costs remain elevated. Credit support can help airlines avoid sharper capacity cuts, but it cannot fully offset global energy volatility. The better consumer outcome is not necessarily cheaper tickets immediately; it is fewer cancellations, more stable schedules, and less severe capacity withdrawal.</p>
      <p>The wider lesson is that global conflict is not distant from household economics. A security crisis in one region can raise the cost of flying from India, affect corporate travel budgets, alter tourism flows, and increase pressure on government policy. ECLGS 5.0 is one example of how economic resilience now requires watching geopolitics, energy, finance, and logistics together.</p>
    `,
  },
  {
    title: "Vadinar Ship Repair Facility: A Maritime Bet on Keeping Value in India",
    slug: "vadinar-ship-repair-facility-maritime-india-2030",
    category: "infrastructure",
    tags: ["ports", "shipping", "Gujarat", "ship repair"],
    date: "2026-05-08",
    updated: "2026-05-13",
    excerpt: "The approved Vadinar facility aims to repair large vessels domestically and reduce dependence on foreign shipyards.",
    dek: "A 650-metre jetty, floating dry docks, and workshops could turn a gap in maritime capacity into an industrial opportunity.",
    readingMinutes: 5,
    image: "vadinar-ship-repair.jpg",
    imageAlt: "Shipyard view at Cochin with vessels and repair infrastructure",
    sources: [sources.vadinar],
    content: `
      <p>The Cabinet Committee on Economic Affairs approved a state-of-the-art Ship Repair Facility at Vadinar, Gujarat, in May 2026. The project will be jointly implemented by Deendayal Port Authority and Cochin Shipyard Limited, with a combined investment of Rs 1,570 crore. The plan includes a 650-metre jetty, two large floating dry docks, workshops, and supporting marine infrastructure.</p>
      <p>Ship repair is not usually a headline sector, but it is strategically important. India has a long coastline, major ports, growing cargo movement, offshore energy assets, and ambitions under Maritime India Vision 2030 and Maritime Amrit Kaal Vision 2047. If large vessels operating near Indian waters must travel abroad for repair, India loses time, foreign exchange, skilled work, and ancillary business.</p>
      <p>The government release says India currently lacks adequate domestic capacity to repair large vessels exceeding 230 metres in length. The Vadinar facility is expected to handle vessels up to 300 metres. That capability can attract high-value repair work, especially for large commercial and foreign-flagged vessels using western coast shipping routes.</p>
      <p>Vadinar's location is central to the proposal. Its natural deep draft, connection to shipping routes, and proximity to ports such as Mundra and Kandla make it suitable for repair operations. In maritime economics, geography matters as much as machinery. A repair facility located away from shipping lanes may struggle even with good equipment. A facility near heavy traffic can become part of routine fleet planning.</p>
      <p>The employment numbers are modest but meaningful: about 290 direct jobs and around 1,100 indirect jobs, according to the release. The indirect side could be more important over time. Ship repair needs steel fabrication, electrical systems, coating, precision machining, logistics, safety services, equipment maintenance, marine engineering, and local MSME suppliers. A strong repair cluster can create skills that spill into shipbuilding and offshore infrastructure.</p>
      <p>The project also supports resilience. Global shipyards can become congested, expensive, or geopolitically sensitive. Domestic repair capacity gives Indian ports and operators more options. For foreign vessels, competitive turnaround can create a service export opportunity. For Indian operators, it can reduce downtime and currency outflow.</p>
      <p>Execution will determine whether Vadinar becomes a serious maritime node or just another underused asset. The facility will need reliable project timelines, world-class safety standards, skilled technicians, environmental controls, transparent pricing, and strong customer acquisition. Shipowners choose repair yards on trust, speed, cost, certification, and proven quality.</p>
      <p>India's maritime ambitions require more than new ports. They require services around ships across their lifecycle. Vadinar is a bet that repair, maintenance, and industrial services can keep more maritime value inside India.</p>
    `,
  },
  {
    title: "901 Km of Railway Multitracking: The Logistics Story Behind Three Projects",
    slug: "railway-multitracking-901-km-logistics-projects",
    category: "infrastructure",
    tags: ["railways", "logistics", "freight", "infrastructure"],
    date: "2026-05-07",
    updated: "2026-05-13",
    excerpt: "Three approved railway multitracking projects will add capacity across 19 districts in six states and aim to improve freight and passenger reliability.",
    dek: "Extra lines are not glamorous, but they are exactly the kind of capacity that makes logistics more predictable.",
    readingMinutes: 5,
    image: "railway-multitracking-901km.jpg",
    imageAlt: "Twin diesel locomotives pulling a freight train on Indian Railways",
    sources: [sources.rail],
    content: `
      <p>The Cabinet Committee on Economic Affairs approved three railway multitracking projects in May 2026 with an estimated cost of Rs 23,437 crore. The projects cover 19 districts across Madhya Pradesh, Rajasthan, Uttar Pradesh, Karnataka, Andhra Pradesh, and Telangana, and will increase the existing Indian Railways network by about 901 km. The projects are Nagda-Mathura third and fourth line, Guntakal-Wadi third and fourth line, and Burhwal-Sitapur third and fourth line.</p>
      <p>Multitracking is a capacity investment. It does not have the glamour of a new train launch, but it changes how reliably a rail corridor can function. When a busy route has too few tracks, passenger trains, freight trains, maintenance blocks, and unexpected delays compete for limited slots. Extra lines allow traffic to move with fewer conflicts.</p>
      <p>The freight impact can be substantial. India wants rail to carry a larger share of bulk goods, industrial inputs, foodgrain, coal, cement, steel, containers, and agricultural commodities. But shippers choose rail only when timings, availability, and handling are predictable. Congested corridors push freight toward roads even when rail is cheaper or cleaner over long distances.</p>
      <p>The Nagda-Mathura corridor matters because it sits within the wider north-west and central movement of goods and passengers. The Guntakal-Wadi route links important southern and Deccan freight movements. Burhwal-Sitapur strengthens connectivity in Uttar Pradesh. Together, the projects are not a single story of one city getting a line. They are about improving network fluidity across regions.</p>
      <p>The government release says the projects will improve operational efficiency and service reliability. Those words sound administrative, but they affect daily life. A passenger train that does not wait outside a junction for a path, a freight rake that reaches a factory on schedule, and a maintenance team that gets a safer work block all depend on available line capacity.</p>
      <p>There is also an environmental dimension. Rail freight is generally more energy-efficient than long-haul road freight. If better capacity helps shift more cargo to rail, it can reduce road congestion, fuel use, and emissions. But that shift will happen only if last-mile logistics, terminals, warehousing, and customer service improve alongside track capacity.</p>
      <p>The expected completion timeline extends up to 2030-31. That means land, engineering, signalling, bridges, station remodelling, safety approvals, and construction sequencing will define the outcome. Delays can reduce the economic return of infrastructure projects, especially when costs escalate.</p>
      <p>India's logistics competitiveness depends on these unglamorous upgrades. More tracks mean more room for growth. The real victory will be visible when freight users and passengers experience the network as boringly reliable.</p>
    `,
  },
  {
    title: "Mission for Cotton Productivity: India's 2031 Target and the 5F Supply Chain",
    slug: "mission-for-cotton-productivity-2031-5f-supply-chain",
    category: "agriculture",
    tags: ["cotton", "farmers", "textiles", "agriculture"],
    date: "2026-05-07",
    updated: "2026-05-13",
    excerpt: "The Rs 5,659.22 crore cotton mission aims to raise lint productivity, support farmers, improve quality, and strengthen textile competitiveness.",
    dek: "Cotton is not just a crop. It is the starting point of a farm-to-fashion export chain.",
    readingMinutes: 5,
    image: "cotton-productivity-mission.jpg",
    imageAlt: "Cotton field in Sathanur, Perambalur",
    sources: [sources.cotton],
    content: `
      <p>The Union Cabinet approved Rs 5,659.22 crore for the Mission for Cotton Productivity covering 2026-27 to 2030-31. The mission aims to address bottlenecks, declining growth, and quality concerns in India's cotton sector. It is aligned with the government's 5F vision: Farm to Fibre to Factory to Fashion to Foreign.</p>
      <p>The target is ambitious. The mission envisages production of 498 lakh bales, each of 170 kg lint, by raising lint productivity from 440 kg per hectare to 755 kg per hectare by 2031. The government expects about 32 lakh farmers to benefit. It also points to high-yielding varieties, pest and disease resistance, technology adoption, better quality, traceability, and promotion of Kasturi Cotton Bharat.</p>
      <p>Cotton matters because it connects rural incomes with textile manufacturing, garment exports, employment, and fashion retail. A weak cotton crop raises input costs for mills. Poor fibre quality reduces competitiveness. Contamination affects spinning efficiency. Low productivity keeps farmer income under pressure even when total area remains large.</p>
      <p>The 5F framing is useful because it forces policymakers to see cotton as a supply chain rather than a field-only issue. Farmers need quality seeds, irrigation support, pest management, extension services, credit, and price confidence. Ginners need cleaner arrivals. Mills need consistent fibre. Exporters need traceability and quality certification. Fashion brands need reliable sourcing stories. Failure at one stage reduces value at the next.</p>
      <p>Technology adoption will be central. The mission mentions scaling crop production technologies through state governments, Krishi Vigyan Kendras, and State Agricultural Universities. That extension network will decide whether the mission reaches farmers beyond demonstration plots. Productivity gains usually require timely sowing advice, weather information, pest alerts, soil management, seed quality, and localised agronomy.</p>
      <p>Quality is equally important. The release points to reducing trash content below 2 percent and promoting traceability. Indian cotton has often faced discounting in global markets because of contamination and inconsistent quality. If traceability and cleaner handling improve, higher value can flow through the chain.</p>
      <p>The mission also mentions natural fibres such as flax, ramie, sisal, milkweed, bamboo, and banana. That suggests a wider fibre diversification agenda. For India, this could support rural enterprise and sustainable textile innovation, but only if markets, processing technologies, and buyer demand are built together.</p>
      <p>The risk is implementation fragmentation. Agriculture is state-sensitive, climate-sensitive, and market-sensitive. A central mission can set targets, but local delivery will decide yield, quality, and farmer trust. If the mission succeeds, it can strengthen both farm income and India's textile competitiveness. If it remains a scheme on paper, the 5F chain will keep losing value at the first step.</p>
    `,
  },
  {
    title: "Sugarcane FRP at Rs 365/qtl for 2026-27: What Farmers and Mills Should Watch",
    slug: "sugarcane-frp-365-2026-27-farmers-mills",
    category: "agriculture",
    tags: ["sugarcane", "FRP", "farm income", "ethanol"],
    date: "2026-05-06",
    updated: "2026-05-13",
    excerpt: "The approved Fair and Remunerative Price for sugarcane in the 2026-27 sugar season is Rs 365 per quintal at a basic recovery rate of 10.25 percent.",
    dek: "FRP is a farm-price decision, but it also shapes sugar mills, ethanol supply, arrears, and state-level politics.",
    readingMinutes: 5,
    image: "sugarcane-frp-2026.jpg",
    imageAlt: "Sugarcane field in Kachirapalayam",
    sources: [sources.sugarcane],
    content: `
      <p>The Cabinet Committee on Economic Affairs approved the Fair and Remunerative Price of sugarcane for the 2026-27 sugar season at Rs 365 per quintal. The rate applies at a basic recovery rate of 10.25 percent. The government also approved a premium of Rs 3.56 per quintal for every 0.1 percent increase in recovery above 10.25 percent, with a corresponding reduction for lower recovery.</p>
      <p>For farmers, FRP is a crucial income signal before the season. Sugarcane is a long-duration crop with high water needs, labour intensity, and significant input costs. A clear price helps farmers plan acreage, manage credit, and assess whether cane remains attractive compared with other crops. But the headline FRP is only part of the story. Timely payment matters as much as the announced rate.</p>
      <p>For mills, the recovery-linked structure is central. Sugar recovery measures how much sugar can be produced from cane. Higher recovery improves mill economics and justifies higher farmer payment. Lower recovery creates pressure because mills pay for cane while extracting less sugar. That is why varietal choice, weather, harvesting time, transport speed, and crushing efficiency all matter.</p>
      <p>The sugar economy is also tied to ethanol. India's ethanol blending programme has changed the way sugarcane is discussed. Mills can divert sugar or cane juice-based feedstock into ethanol depending on policy, prices, and supply conditions. This can help manage surplus sugar and create additional revenue, but it also requires careful balancing with food supply, farmer payments, and fuel-policy goals.</p>
      <p>State politics adds another layer. In major cane-growing states, state advised prices, arrears, cooperative mill health, and farmer organisations can influence the effective economics. A national FRP sets a floor-like benchmark, but local outcomes depend on state policies and mill finances.</p>
      <p>Water sustainability cannot be ignored. Sugarcane is valuable, but in water-stressed regions it can create long-term pressure on groundwater and irrigation systems. Better varieties, drip irrigation, crop planning, and regional diversification should accompany price policy. Otherwise, higher prices may reinforce patterns that are economically attractive in the short run but ecologically costly over time.</p>
      <p>The 2026-27 FRP decision gives farmers a clear price signal and mills a recovery-linked framework. The next things to watch are actual cane acreage, monsoon performance, sugar output forecasts, ethanol diversion rules, and payment discipline. In sugarcane, policy success is measured not only by the announced price but by whether farmers receive money on time without pushing mills into a cycle of stress.</p>
    `,
  },
  {
    title: "Rugby Premier League 2026 in Hyderabad: Why This Event Matters Beyond One Tournament",
    slug: "rugby-premier-league-2026-hyderabad-sports-economy",
    category: "events",
    tags: ["Rugby Premier League", "Hyderabad", "sports", "events"],
    date: "2026-05-06",
    updated: "2026-05-13",
    excerpt: "The second Rugby Premier League will be held at Gachibowli Stadium from June 16 to 28, 2026, giving Hyderabad another sports-economy moment.",
    dek: "The event is a test of whether non-cricket leagues can build audience, athlete pipelines, and host-city value.",
    readingMinutes: 5,
    image: "rugby-premier-league-hyderabad.jpg",
    imageAlt: "Rugby sevens match action at the 2010 Commonwealth Games in Delhi",
    sources: [sources.rugby],
    content: `
      <p>Rugby India announced that the second edition of the Rugby Premier League will be held at Gachibowli Stadium in Hyderabad from June 16 to 28, 2026. The league will use the Rugby 7s format and feature six franchises from the first edition. The announcement positions Hyderabad as a host city for a fast, compact, spectator-friendly version of rugby.</p>
      <p>The event matters because Indian sport is trying to widen its base beyond cricket while still learning from cricket's league model. Rugby 7s is well suited to a new audience. Matches are shorter, the pace is high, and the format can be packaged for stadium spectators, television, and digital platforms. For a developing rugby market, that matters.</p>
      <p>Hyderabad is also a logical host. Gachibowli has hosted major sporting events before, and the city has the airport, hotels, broadcast infrastructure, and corporate base needed for league operations. The announcement also connects with a broader sports-infrastructure push in Telangana, including the idea of developing sporting ecosystems rather than one-off events.</p>
      <p>For athletes, the biggest benefit is exposure to higher-performance environments. A league that brings together Indian and international players can improve training standards, match intensity, coaching, and professional expectations. Young athletes need visible pathways. Without them, rugby remains a campus or services sport rather than a credible professional option.</p>
      <p>For fans, the league has to solve a different problem: familiarity. Many Indian viewers understand cricket strategy instinctively because they grew up with it. Rugby must teach without lecturing. Broadcast graphics, commentary, social clips, school outreach, and simple explainers can help new audiences understand rules, scoring, and tactics quickly.</p>
      <p>The commercial challenge is sponsorship durability. New leagues often launch with enthusiasm but struggle to maintain attention after novelty fades. RPL 2026 will need strong scheduling, franchise storytelling, affordable tickets, local partnerships, and a clean digital presence. The league should make it easy for a casual viewer in Hyderabad to become a repeat fan.</p>
      <p>Host-city impact is another reason to watch. Sports events can support tourism, hospitality, local transport, security services, and media visibility. But the larger payoff comes when events leave behind participation growth: more school programmes, more coaching clinics, more community clubs, and more young athletes trying the sport.</p>
      <p>Rugby Premier League 2026 is not just a tournament on the calendar. It is a test of whether India can build a multi-sport market where new formats get room to breathe. Hyderabad's job is to host it well. Rugby's job is to make people want to come back.</p>
    `,
  },
  {
    title: "Defence Tech in 2026: AI, Hypersonics, Quantum, and the New Preparedness Debate",
    slug: "defence-tech-2026-ai-hypersonics-quantum-preparedness",
    category: "security",
    tags: ["defence", "AI", "hypersonics", "quantum", "security"],
    date: "2026-05-05",
    updated: "2026-05-13",
    excerpt: "The North Tech Symposium underscored India's push toward emerging defence technologies and a larger domestic production base.",
    dek: "Future readiness now depends on research depth, industrial transfer, and the speed at which new tools reach soldiers.",
    readingMinutes: 6,
    image: "defence-tech-2026.jpg",
    imageAlt: "DRDO long-range hypersonic missile flight trial launch",
    sources: [sources.defence],
    content: `
      <p>At the North Tech Symposium 2026 in Prayagraj, the Defence Minister emphasised research, surprise, and technological adaptation as central to future readiness. The government release highlighted emerging domains such as directed energy, hypersonic weapons, underwater and space technologies, quantum technology, artificial intelligence, and machine learning. It also cited defence production at a record high of Rs 1.54 lakh crore in FY 2025-26 and defence exports at Rs 38,424 crore.</p>
      <p>The message is clear: defence preparedness is no longer only about troop numbers or platform counts. It is about how quickly a country can sense, decide, adapt, and integrate technology into operations. Drones, electronic warfare, satellite imagery, AI-assisted intelligence, secure communications, cyber defence, and precision weapons have changed the pace of conflict.</p>
      <p>AI and machine learning are especially important because modern conflict creates too much data for manual analysis alone. Sensor feeds, imagery, radar signals, logistics data, and open-source intelligence all require rapid filtering. AI can help detect patterns, prioritise alerts, and support decision-making. But defence AI must be reliable, explainable enough for command use, secure against manipulation, and governed by human accountability.</p>
      <p>Hypersonics and directed energy represent another layer of competition. They are technically demanding and expensive, but they shape deterrence conversations because speed, precision, and interception difficulty can alter operational assumptions. Quantum technologies may affect secure communication, sensing, and computing over time. Space and underwater capabilities are now essential because conflict can extend across domains before a traditional battlefield is visible.</p>
      <p>The industrial side matters as much as the science. The release noted more than 2,200 technologies transferred to industries by DRDO. Technology transfer is a bridge between laboratory work and production. If the bridge is slow, prototypes stay impressive but operational availability remains weak. If industry absorbs technology well, maintenance, upgrades, exports, and scale improve.</p>
      <p>Domestic production growth is strategically valuable, but numbers should be read carefully. A larger production base is useful when it improves quality, speed, self-reliance, and export credibility. It is less useful if supply chains still depend heavily on imported critical subsystems. The next phase should focus on depth: engines, sensors, chips, materials, secure software, propulsion, and high-end manufacturing.</p>
      <p>There is also a civil spillover opportunity. Defence research can strengthen electronics, aerospace, materials, robotics, cybersecurity, and advanced manufacturing. But spillover happens only when procurement rules, intellectual property terms, testing facilities, and startup participation are designed well.</p>
      <p>The preparedness debate in 2026 is therefore about speed and integration. India needs research ambition, industrial capacity, battlefield feedback, and procurement discipline to move together. Future readiness will belong to systems that learn fast and deliver reliably, not simply to systems that sound advanced on paper.</p>
    `,
  },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog/", label: "Latest" },
  { href: "/sections/technology/", label: "Technology" },
  { href: "/sections/politics/", label: "Politics" },
  { href: "/sections/economy/", label: "Economy" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00+05:30`));
}

function getCategory(slug) {
  return categories.find((category) => category.slug === slug);
}

function postUrl(post) {
  return `/posts/${post.slug}/`;
}

function absoluteUrl(url) {
  if (url.startsWith("http")) return url;
  return `${siteUrl}${url}`;
}

function toPosix(file) {
  return file.replaceAll("\\", "/");
}

function outputPathForUrl(url) {
  if (url === "/") return "index.html";
  const clean = url.replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return "index.html";
  if (/\.[a-z0-9]+$/i.test(clean)) return clean;
  return `${clean}/index.html`;
}

function relativeFile(currentFile, targetFile) {
  const fromDir = path.posix.dirname(toPosix(currentFile));
  return path.posix.relative(fromDir === "." ? "" : fromDir, toPosix(targetFile)) || path.posix.basename(targetFile);
}

function pageHref(url, currentFile) {
  if (url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("#")) return url;
  return relativeFile(currentFile, outputPathForUrl(url));
}

function assetUrl(file, currentFile) {
  const target = `assets/images/${file}`;
  return currentFile ? relativeFile(currentFile, target) : `/assets/images/${file}`;
}

function pageTitle(title) {
  return title ? `${title} | ${siteName}` : `${siteName} | India News, Technology, Politics and Events`;
}

function layout({ title, description, canonical, body, currentFile, extraHead = "", pageClass = "", ogType = "website", ogImage = `${siteUrl}/assets/images/social-card.svg` }) {
  const canonicalUrl = absoluteUrl(canonical);
  const metaTitle = pageTitle(title);
  const file = currentFile || outputPathForUrl(canonical);
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(metaTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="author" content="${escapeHtml(author.name)}">
  <meta name="theme-color" content="#15372c">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(siteName)} RSS" href="${pageHref("/rss.xml", file)}">
  <link rel="manifest" href="${pageHref("/manifest.webmanifest", file)}">
  <link rel="icon" href="${assetUrl("favicon.svg", file)}" type="image/svg+xml">
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  <meta property="og:title" content="${escapeHtml(metaTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(metaTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="preload" href="${relativeFile(file, "assets/css/styles.css")}" as="style">
  <link rel="stylesheet" href="${relativeFile(file, "assets/css/styles.css")}">
  ${adsenseScript}
  ${extraHead}
</head>
<body class="${pageClass}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${siteHeader(file)}
  <main id="main">
    ${body}
  </main>
  ${siteFooter(file)}
  <script src="${relativeFile(file, "assets/js/main.js")}" defer></script>
</body>
</html>`;
}

function siteHeader(currentFile) {
  return `<header class="site-header" data-site-header>
  <div class="container header-inner">
    <a class="brand" href="${pageHref("/", currentFile)}" aria-label="${siteName} home">
      <span class="brand-mark" aria-hidden="true">PV</span>
      <span class="brand-copy">
        <strong>${siteName}</strong>
        <span>India explained clearly</span>
      </span>
    </a>
    <button class="nav-toggle icon-button" type="button" aria-label="Open navigation" aria-expanded="false" data-nav-toggle>
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" aria-label="Primary navigation" data-site-nav>
      ${navLinks.map((link) => `<a href="${pageHref(link.href, currentFile)}">${link.label}</a>`).join("")}
    </nav>
    <button class="theme-toggle icon-button" type="button" aria-label="Toggle dark mode" data-theme-toggle>
      <span class="theme-toggle-icon" aria-hidden="true"></span>
    </button>
  </div>
</header>`;
}

function siteFooter(currentFile) {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a class="brand footer-brand" href="${pageHref("/", currentFile)}" aria-label="${siteName} home">
        <span class="brand-mark" aria-hidden="true">PV</span>
        <span class="brand-copy">
          <strong>${siteName}</strong>
          <span>Original India-focused explainers</span>
        </span>
      </a>
      <p>PatelsVine publishes concise, source-linked explainers on India news, policy, technology, events, economy, and public life.</p>
    </div>
    <div>
      <h2>Sections</h2>
      <ul>
        ${categories.slice(0, 6).map((category) => `<li><a href="${pageHref(`/sections/${category.slug}/`, currentFile)}">${category.name}</a></li>`).join("")}
      </ul>
    </div>
    <div>
      <h2>Trust</h2>
      <ul>
        <li><a href="${pageHref("/about/", currentFile)}">About</a></li>
        <li><a href="${pageHref("/editorial-policy/", currentFile)}">Editorial Policy</a></li>
        <li><a href="${pageHref("/privacy-policy/", currentFile)}">Privacy Policy</a></li>
        <li><a href="${pageHref("/terms/", currentFile)}">Terms</a></li>
        <li><a href="${pageHref("/disclaimer/", currentFile)}">Disclaimer</a></li>
        <li><a href="${pageHref("/contact/", currentFile)}">Contact</a></li>
      </ul>
    </div>
    <div>
      <h2>Follow</h2>
      <p>Bookmark the site or subscribe through the RSS feed for new explainers.</p>
      <a class="button secondary" href="${pageHref("/rss.xml", currentFile)}">RSS Feed</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; 2026 ${siteName}. All rights reserved.</p>
    <p><a href="${pageHref("/sitemap.xml", currentFile)}">Sitemap</a> <span aria-hidden="true">/</span> <a href="${pageHref("/robots.txt", currentFile)}">Robots</a></p>
  </div>
</footer>`;
}

function postCard(post, featured = false, currentFile = "index.html") {
  const category = getCategory(post.category);
  return `<article class="post-card ${featured ? "featured-card" : ""}" data-post-card data-title="${escapeHtml(`${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase())}" data-category="${post.category}">
    <a class="post-media" href="${pageHref(postUrl(post), currentFile)}" aria-label="Read ${escapeHtml(post.title)}">
      <img src="${assetUrl(post.image, currentFile)}" alt="${escapeHtml(post.imageAlt)}" loading="${featured ? "eager" : "lazy"}" width="1200" height="675">
    </a>
    <div class="post-card-body">
      <div class="post-meta">
        <a class="category-pill" href="${pageHref(`/sections/${category.slug}/`, currentFile)}">${category.name}</a>
        <time datetime="${post.date}">${formatDate(post.date)}</time>
      </div>
      <h2><a href="${pageHref(postUrl(post), currentFile)}">${post.title}</a></h2>
      <p>${post.excerpt}</p>
      <div class="card-footer">
        <span>${post.readingMinutes} min read</span>
        <a class="text-link" href="${pageHref(postUrl(post), currentFile)}">Read article</a>
      </div>
    </div>
  </article>`;
}

function sourceList(sourceItems) {
  return `<section class="source-list" aria-labelledby="sources-heading">
    <h2 id="sources-heading">Sources Checked</h2>
    <p>These links were used for fact checking and context. The article above is original analysis and summary.</p>
    <ul>
      ${sourceItems.map((source) => `<li><a href="${source.url}" rel="nofollow noopener noreferrer" target="_blank">${escapeHtml(source.label)}</a></li>`).join("")}
    </ul>
  </section>`;
}

function imageCreditLine(image) {
  const credit = imageCredits[image];
  if (!credit) return "";
  return `<figcaption>Image: <a href="${credit.url}" rel="nofollow noopener noreferrer" target="_blank">${escapeHtml(credit.credit)}</a>, <a href="${credit.licenseUrl}" rel="nofollow noopener noreferrer" target="_blank">${escapeHtml(credit.license)}</a>; cropped and resized.</figcaption>`;
}

function breadcrumbs(items, currentFile = "index.html") {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="${pageHref("/", currentFile)}">Home</a></li>
      ${items.map((item) => `<li>${item.href ? `<a href="${pageHref(item.href, currentFile)}">${escapeHtml(item.label)}</a>` : `<span>${escapeHtml(item.label)}</span>`}</li>`).join("")}
    </ol>
  </nav>`;
}

function buildHome() {
  const currentFile = "index.html";
  const featured = posts[0];
  const latest = posts.slice(1, 7);
  const popular = [posts[3], posts[4], posts[5], posts[10]];
  const body = `
  <section class="home-hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">Independent India explainers</p>
        <h1>${siteName}: India news, technology, politics and events.</h1>
        <p class="hero-lede">Explained simply through fresh, source-linked articles on elections, AI, semiconductors, infrastructure, agriculture, sport, security, and the economy.</p>
        <div class="hero-actions">
          <a class="button" href="${pageHref("/blog/", currentFile)}">Read Latest</a>
          <a class="button secondary" href="${pageHref("/about/", currentFile)}">Our Editorial Promise</a>
        </div>
      </div>
      <div class="hero-feature">
        ${postCard(featured, true, currentFile)}
      </div>
    </div>
  </section>
  <section class="section-block">
    <div class="container section-heading-row">
      <div>
        <p class="eyebrow">Freshly published</p>
        <h2>Latest explainers</h2>
      </div>
      <a class="text-link" href="${pageHref("/blog/", currentFile)}">View all posts</a>
    </div>
    <div class="container post-grid">
      ${latest.map((post) => postCard(post, false, currentFile)).join("")}
    </div>
  </section>
  <section class="section-block muted-band">
    <div class="container two-column">
      <div>
        <p class="eyebrow">Explore by section</p>
        <h2>Built for readers and AdSense review</h2>
        <p>PatelsVine includes clear navigation, original long-form articles, author and policy pages, source links, mobile-friendly design, no copied photos, no prohibited content, and indexable SEO pages.</p>
      </div>
      <div class="section-chip-grid">
        ${categories.map((category) => `<a href="${pageHref(`/sections/${category.slug}/`, currentFile)}"><strong>${category.name}</strong><span>${category.description}</span></a>`).join("")}
      </div>
    </div>
  </section>
  <section class="section-block">
    <div class="container section-heading-row">
      <div>
        <p class="eyebrow">Important reads</p>
        <h2>Policy, tech and events to watch</h2>
      </div>
    </div>
    <div class="container post-grid compact">
      ${popular.map((post) => postCard(post, false, currentFile)).join("")}
    </div>
  </section>`;
  return layout({
    title: "",
    description: "PatelsVine is an India-focused blogging site with latest explainers on news, technology, politics, events, economy, infrastructure, agriculture, and security.",
    canonical: "/",
    currentFile,
    pageClass: "home-page",
    extraHead: `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/blog/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: siteName,
        logo: `${siteUrl}/assets/images/logo.svg`,
      },
    })}</script>`,
    body,
  });
}

function buildBlogIndex() {
  const currentFile = "blog/index.html";
  const body = `
  <section class="page-hero compact-hero">
    <div class="container">
      ${breadcrumbs([{ label: "Latest" }], currentFile)}
      <p class="eyebrow">All articles</p>
      <h1>Latest India explainers</h1>
      <p>Search by topic or filter by section. Every article includes source links and original analysis.</p>
      ${searchTools()}
    </div>
  </section>
  <section class="section-block">
    <div class="container post-grid" data-post-list>
      ${posts.map((post) => postCard(post, false, currentFile)).join("")}
    </div>
    <p class="container empty-state" hidden data-empty-state>No articles match your search yet.</p>
  </section>`;
  return layout({
    title: "Latest Blog Posts",
    description: "Browse all PatelsVine articles on India news, technology, politics, economy, events, security, agriculture, and infrastructure.",
    canonical: "/blog/",
    currentFile,
    body,
  });
}

function searchTools() {
  return `<div class="search-tools" data-search-tools>
    <label class="search-box">
      <span>Search articles</span>
      <input type="search" placeholder="Search IndiaAI, elections, UPI, railways..." data-post-search>
    </label>
    <div class="filter-row" aria-label="Filter by category">
      <button type="button" class="filter-chip active" data-category-filter="all">All</button>
      ${categories.map((category) => `<button type="button" class="filter-chip" data-category-filter="${category.slug}">${category.name}</button>`).join("")}
    </div>
  </div>`;
}

function buildCategoryPage(category) {
  const currentFile = `sections/${category.slug}/index.html`;
  const categoryPosts = posts.filter((post) => post.category === category.slug);
  const body = `
  <section class="page-hero compact-hero">
    <div class="container">
      ${breadcrumbs([{ label: category.name }], currentFile)}
      <p class="eyebrow">Section</p>
      <h1>${category.name}</h1>
      <p>${category.description}</p>
    </div>
  </section>
  <section class="section-block">
    <div class="container post-grid">
      ${categoryPosts.map((post) => postCard(post, false, currentFile)).join("")}
    </div>
  </section>`;
  return layout({
    title: `${category.name} Articles`,
    description: `${category.description} Read source-linked PatelsVine explainers in the ${category.name} section.`,
    canonical: `/sections/${category.slug}/`,
    currentFile,
    body,
  });
}

function buildPost(post) {
  const currentFile = `posts/${post.slug}/index.html`;
  const category = getCategory(post.category);
  const related = posts
    .filter((candidate) => candidate.slug !== post.slug && (candidate.category === post.category || candidate.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);
  const body = `
  <article class="article-page">
    <header class="article-header">
      <div class="container article-header-grid">
        <div>
          ${breadcrumbs([{ label: category.name, href: `/sections/${category.slug}/` }, { label: post.title }], currentFile)}
          <div class="post-meta">
            <a class="category-pill" href="${pageHref(`/sections/${category.slug}/`, currentFile)}">${category.name}</a>
            <time datetime="${post.date}">${formatDate(post.date)}</time>
            <span>${post.readingMinutes} min read</span>
          </div>
          <h1>${post.title}</h1>
          <p class="dek">${post.dek}</p>
        </div>
        <figure class="article-figure">
          <img src="${assetUrl(post.image, currentFile)}" alt="${escapeHtml(post.imageAlt)}" width="1200" height="675">
          ${imageCreditLine(post.image)}
        </figure>
      </div>
    </header>
    <div class="reading-progress" aria-hidden="true" data-reading-progress></div>
    <div class="container article-layout">
      <aside class="article-aside">
        <div class="aside-box">
          <p class="eyebrow">Article info</p>
          <dl>
            <div><dt>Published</dt><dd>${formatDate(post.date)}</dd></div>
            <div><dt>Updated</dt><dd>${formatDate(post.updated)}</dd></div>
            <div><dt>Author</dt><dd>${author.name}</dd></div>
          </dl>
          <button class="button secondary full-width" type="button" data-copy-link>Copy link</button>
        </div>
      </aside>
      <div class="article-content">
        ${post.content}
        ${sourceList(post.sources)}
      </div>
    </div>
  </article>
  ${related.length ? `<section class="section-block related-block">
    <div class="container section-heading-row"><div><p class="eyebrow">Keep reading</p><h2>Related articles</h2></div></div>
    <div class="container post-grid compact">${related.map((relatedPost) => postCard(relatedPost, false, currentFile)).join("")}</div>
  </section>` : ""}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}${assetUrl(post.image)}`,
    datePublished: post.date,
    dateModified: post.updated,
    mainEntityOfPage: `${siteUrl}${postUrl(post)}`,
    author: {
      "@type": "Organization",
      name: author.name,
      url: author.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/images/logo.svg`,
      },
    },
    articleSection: category.name,
    keywords: post.tags.join(", "),
  };
  return layout({
    title: post.title,
    description: post.excerpt,
    canonical: postUrl(post),
    currentFile,
    pageClass: "post-page",
    ogType: "article",
    ogImage: `${siteUrl}${assetUrl(post.image)}`,
    extraHead: `
      <meta property="article:published_time" content="${post.date}">
      <meta property="article:modified_time" content="${post.updated}">
      <meta property="article:section" content="${escapeHtml(category.name)}">
      <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`,
    body,
  });
}

function buildStaticPage({ title, slug, description, content }) {
  const currentFile = `${slug}/index.html`;
  const body = `
  <section class="page-hero compact-hero">
    <div class="container">
      ${breadcrumbs([{ label: title }], currentFile)}
      <p class="eyebrow">${siteName}</p>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
  </section>
  <section class="section-block">
    <div class="container narrow-page">
      ${content}
    </div>
  </section>`;
  return layout({
    title,
    description,
    canonical: `/${slug}/`,
    currentFile,
    body,
  });
}

const pages = [
  {
    title: "About PatelsVine",
    slug: "about",
    description: "Learn about PatelsVine, an India-focused blog that publishes clear, source-linked explainers.",
    content: `
      <h2>What we publish</h2>
      <p>PatelsVine is a reader-first blogging site for India-focused explainers. We cover public policy, technology, elections, economy, agriculture, infrastructure, sports events, and security issues with a focus on clarity and usefulness.</p>
      <p>Our articles are written as original summaries and analysis. When a story depends on official data, government releases, election results, or public reports, we link the sources at the end of the article so readers can verify the context.</p>
      <h2>Editorial promise</h2>
      <p>We avoid copied articles, copyrighted images, sensational claims, hate speech, adult content, and misleading headlines. Our goal is to make complex India stories easier to understand without pretending that every issue has a simple answer.</p>
      <h2>Ownership</h2>
      <p>This website is prepared for the domain www.patelsvine.in. For editorial or advertising questions, use the contact page.</p>
    `,
  },
  {
    title: "Contact",
    slug: "contact",
    description: "Contact the PatelsVine editorial desk for corrections, feedback, advertising, or general queries.",
    content: `
      <h2>Get in touch</h2>
      <p>For corrections, source suggestions, collaboration, or advertising queries, email the editorial desk.</p>
      <p><a class="button" href="mailto:editor@patelsvine.in?subject=PatelsVine%20Website%20Query">Email editor@patelsvine.in</a></p>
      <form class="contact-form" data-contact-form>
        <label><span>Your name</span><input name="name" required autocomplete="name"></label>
        <label><span>Email</span><input name="email" type="email" required autocomplete="email"></label>
        <label><span>Message</span><textarea name="message" rows="6" required></textarea></label>
        <button class="button" type="submit">Prepare email</button>
        <p class="form-note">This static form opens your email app with the message filled in. No personal data is stored on this website.</p>
      </form>
    `,
  },
  {
    title: "Editorial Policy",
    slug: "editorial-policy",
    description: "Read PatelsVine's editorial standards for sourcing, corrections, neutrality, and content quality.",
    content: `
      <h2>Source standards</h2>
      <p>We prefer primary sources such as official releases, Election Commission data, ministry notes, public reports, and direct event announcements. When using media reports, we use them for context and avoid copying protected expression.</p>
      <h2>Original writing</h2>
      <p>Every article is written in original language. We summarise facts, explain implications, and link sources so readers can check the basis of the article.</p>
      <h2>Corrections</h2>
      <p>If an error is identified, we update the article, correct the relevant sentence, and adjust the updated date where appropriate. Send correction requests through the contact page.</p>
      <h2>Political coverage</h2>
      <p>Political articles are written in a neutral explanatory tone. We distinguish official results and verified facts from interpretation, and we avoid personal attacks or unverified allegations.</p>
    `,
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    description: "PatelsVine privacy policy covering analytics, contact email, cookies, local storage, and advertising disclosures.",
    content: `
      <h2>Information we collect</h2>
      <p>This static website does not require user registration. If you contact us by email, we receive the information you choose to send, such as your name, email address, and message.</p>
      <h2>Cookies and local storage</h2>
      <p>The site may use local storage to remember your theme preference. If analytics or advertising tools are added after hosting, they may use cookies according to their own policies.</p>
      <h2>Advertising</h2>
      <p>This site has been structured for future Google AdSense review. If AdSense is enabled, Google and its partners may use cookies to serve and measure ads. You can manage ad personalisation through your Google settings and browser controls.</p>
      <h2>Data sharing</h2>
      <p>We do not sell personal information. Emails may be retained for communication, correction handling, or business record purposes.</p>
      <h2>Contact</h2>
      <p>Questions about privacy can be sent to <a href="mailto:editor@patelsvine.in">editor@patelsvine.in</a>.</p>
    `,
  },
  {
    title: "Terms of Use",
    slug: "terms",
    description: "Terms for using PatelsVine, including content use, accuracy, acceptable use, and liability limitations.",
    content: `
      <h2>Use of content</h2>
      <p>PatelsVine content is provided for general information and commentary. You may share links to our articles. Republishing full articles without permission is not allowed.</p>
      <h2>Accuracy</h2>
      <p>We aim to keep articles accurate and source-linked, but news and policy contexts can change. Readers should verify critical decisions using official sources.</p>
      <h2>Acceptable use</h2>
      <p>Do not use this website to attempt unauthorised access, scraping that harms availability, spam, or misuse of contact channels.</p>
      <h2>External links</h2>
      <p>Articles link to external sources for verification and context. We are not responsible for the content, availability, or privacy practices of external websites.</p>
    `,
  },
  {
    title: "Disclaimer",
    slug: "disclaimer",
    description: "PatelsVine disclaimer on news analysis, external sources, corrections, and non-professional advice.",
    content: `
      <h2>General information</h2>
      <p>PatelsVine publishes general news explainers and commentary. Content should not be treated as legal, financial, medical, or professional advice.</p>
      <h2>Current affairs</h2>
      <p>News, policy, election, and event information may change after publication. Each article includes a publication date, updated date, and source links where relevant.</p>
      <h2>External sources</h2>
      <p>External links are included for reader verification. Their content can change independently of PatelsVine.</p>
    `,
  },
];

function build404() {
  const currentFile = "404.html";
  return layout({
    title: "Page Not Found",
    description: "The page you are looking for could not be found on PatelsVine.",
    canonical: "/404.html",
    currentFile,
    body: `
    <section class="page-hero compact-hero">
      <div class="container">
        <p class="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page may have moved or the address may be incorrect.</p>
        <a class="button" href="${pageHref("/blog/", currentFile)}">Browse latest articles</a>
      </div>
    </section>`,
  });
}

function buildSitemap() {
  const urls = [
    { loc: "/", changefreq: "daily", priority: "1.0", lastmod: today },
    { loc: "/blog/", changefreq: "daily", priority: "0.9", lastmod: today },
    ...categories.map((category) => ({ loc: `/sections/${category.slug}/`, changefreq: "weekly", priority: "0.8", lastmod: today })),
    ...pages.map((page) => ({ loc: `/${page.slug}/`, changefreq: "monthly", priority: "0.6", lastmod: today })),
    ...posts.map((post) => ({ loc: postUrl(post), changefreq: "monthly", priority: "0.85", lastmod: post.updated })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${absoluteUrl(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
}

function buildSitemapStylesheet() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>PatelsVine Sitemap</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root {
            color-scheme: light;
            --bg: #f8f5ee;
            --ink: #18211d;
            --muted: #5f6c63;
            --brand: #15372c;
            --teal: #1f7a8c;
            --accent: #c9552a;
            --line: #ded7c8;
            --surface: #ffffff;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--ink);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.55;
          }
          a { color: var(--brand); text-decoration: none; }
          a:hover { color: var(--accent); }
          .shell {
            width: min(1120px, calc(100% - 32px));
            margin: 0 auto;
            padding: 32px 0 48px;
          }
          .brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: var(--brand);
            font-weight: 800;
          }
          .brand-mark {
            display: inline-grid;
            place-items: center;
            width: 38px;
            height: 38px;
            border-radius: 8px;
            background: var(--brand);
            color: #fff;
            font-size: 0.9rem;
          }
          .hero {
            padding: 34px 0 26px;
            border-bottom: 1px solid var(--line);
          }
          .eyebrow {
            margin: 32px 0 8px;
            color: var(--teal);
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h1 {
            margin: 0;
            font-size: clamp(2rem, 6vw, 4.5rem);
            line-height: 0.95;
            letter-spacing: 0;
          }
          .description {
            max-width: 720px;
            margin: 18px 0 0;
            color: var(--muted);
            font-size: 1.05rem;
          }
          .table-wrap {
            overflow-x: auto;
            margin-top: 28px;
            border: 1px solid var(--line);
            border-radius: 8px;
            background: var(--surface);
          }
          table {
            width: 100%;
            min-width: 760px;
            border-collapse: collapse;
          }
          th, td {
            padding: 14px 16px;
            text-align: left;
            border-bottom: 1px solid var(--line);
            vertical-align: top;
          }
          th {
            color: var(--muted);
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          tr:last-child td {
            border-bottom: 0;
          }
          td {
            color: var(--muted);
            font-size: 0.95rem;
          }
          td:first-child {
            color: var(--brand);
            font-weight: 700;
          }
          footer {
            margin-top: 24px;
            color: var(--muted);
            font-size: 0.95rem;
          }
          code {
            padding: 3px 6px;
            border-radius: 6px;
            background: #ece6d9;
            color: var(--brand);
          }
          @media (max-width: 640px) {
            .shell {
              width: min(100% - 24px, 1120px);
              padding-top: 22px;
            }
          }
        </style>
      </head>
      <body>
        <main class="shell">
          <header class="hero">
            <a class="brand" href="${siteUrl}/">
              <span class="brand-mark">PV</span>
              <span>PatelsVine</span>
            </a>
            <p class="eyebrow">XML Sitemap</p>
            <h1>Sitemap</h1>
            <p class="description">A browser-friendly view of the public URLs search engines can crawl on PatelsVine.</p>
          </header>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Last modified</th>
                  <th>Change frequency</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="/sm:urlset/sm:url">
                  <tr>
                    <td>
                      <a>
                        <xsl:attribute name="href"><xsl:value-of select="sm:loc"/></xsl:attribute>
                        <xsl:value-of select="sm:loc"/>
                      </a>
                    </td>
                    <td><xsl:value-of select="sm:lastmod"/></td>
                    <td><xsl:value-of select="sm:changefreq"/></td>
                    <td><xsl:value-of select="sm:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
          <footer>
            Search engines can still read this as normal XML at <code>${siteUrl}/sitemap.xml</code>.
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
}

function buildRss() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeHtml(siteName)}</title>
    <link>${siteUrl}/</link>
    <description>India news, technology, politics, economy and events explained clearly.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date(`${today}T00:00:00+05:30`).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map((post) => `<item>
      <title>${escapeHtml(post.title)}</title>
      <link>${absoluteUrl(postUrl(post))}</link>
      <guid>${absoluteUrl(postUrl(post))}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00+05:30`).toUTCString()}</pubDate>
      <description>${escapeHtml(post.excerpt)}</description>
    </item>`).join("\n")}
  </channel>
</rss>`;
}

function buildRssStylesheet() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root {
            color-scheme: light;
            --bg: #f8f5ee;
            --surface: #ffffff;
            --ink: #18211d;
            --muted: #5f6c63;
            --brand: #15372c;
            --teal: #1f7a8c;
            --accent: #c9552a;
            --line: #ded7c8;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--ink);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.6;
          }
          a { color: inherit; text-decoration: none; }
          a:hover { color: var(--accent); }
          .feed-shell {
            width: min(1080px, calc(100% - 32px));
            margin: 0 auto;
            padding: 32px 0 48px;
          }
          .brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: var(--brand);
            font-weight: 800;
          }
          .brand-mark {
            display: inline-grid;
            place-items: center;
            width: 38px;
            height: 38px;
            border-radius: 8px;
            background: var(--brand);
            color: #fff;
            font-size: 0.9rem;
            letter-spacing: 0;
          }
          .feed-hero {
            padding: 34px 0 28px;
            border-bottom: 1px solid var(--line);
          }
          .eyebrow {
            margin: 32px 0 8px;
            color: var(--teal);
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h1 {
            margin: 0;
            font-size: clamp(2rem, 6vw, 4.5rem);
            line-height: 0.95;
            letter-spacing: 0;
          }
          .description {
            max-width: 720px;
            margin: 18px 0 0;
            color: var(--muted);
            font-size: 1.08rem;
          }
          .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 24px;
          }
          .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            padding: 0 18px;
            border-radius: 8px;
            background: var(--brand);
            color: #fff;
            font-weight: 750;
          }
          .button:hover {
            color: #fff;
            background: var(--accent);
          }
          .button.secondary {
            background: transparent;
            color: var(--brand);
            border: 1px solid var(--line);
          }
          .button.secondary:hover {
            color: var(--accent);
            border-color: var(--accent);
          }
          .feed-list {
            padding: 28px 0 0;
          }
          h2 {
            margin: 0 0 16px;
            color: var(--muted);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .feed-item {
            padding: 22px 0;
            border-top: 1px solid var(--line);
          }
          .feed-item:first-of-type {
            border-top: 0;
          }
          .feed-date {
            margin: 0 0 6px;
            color: var(--teal);
            font-size: 0.82rem;
            font-weight: 750;
          }
          h3 {
            margin: 0;
            font-size: clamp(1.25rem, 3vw, 2rem);
            line-height: 1.15;
            letter-spacing: 0;
          }
          .feed-item p:last-child {
            max-width: 820px;
            margin: 10px 0 0;
            color: var(--muted);
          }
          footer {
            margin-top: 36px;
            padding-top: 22px;
            border-top: 1px solid var(--line);
            color: var(--muted);
            font-size: 0.95rem;
          }
          code {
            padding: 3px 6px;
            border-radius: 6px;
            background: #ece6d9;
            color: var(--brand);
          }
          @media (max-width: 640px) {
            .feed-shell {
              width: min(100% - 24px, 1080px);
              padding-top: 22px;
            }
            .actions {
              display: grid;
            }
            .button {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <main class="feed-shell">
          <header class="feed-hero">
            <a class="brand" href="${siteUrl}/">
              <span class="brand-mark">PV</span>
              <span>PatelsVine</span>
            </a>
            <p class="eyebrow">RSS Feed</p>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
            <div class="actions">
              <a class="button" href="${siteUrl}/blog/">Read latest posts</a>
              <a class="button secondary" href="${siteUrl}/rss.xml">Feed XML</a>
            </div>
          </header>
          <section class="feed-list">
            <h2>Latest Posts</h2>
            <xsl:for-each select="/rss/channel/item">
              <article class="feed-item">
                <p class="feed-date"><xsl:value-of select="pubDate"/></p>
                <h3>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h3>
                <p><xsl:value-of select="description"/></p>
              </article>
            </xsl:for-each>
          </section>
          <footer>
            Subscribe in any feed reader with <code>${siteUrl}/rss.xml</code>.
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function buildManifest() {
  return JSON.stringify({
    name: "PatelsVine",
    short_name: "PatelsVine",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f5ee",
    theme_color: "#15372c",
    description: "India-focused explainers on news, technology, politics, economy and events.",
    icons: [
      { src: "/assets/images/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  }, null, 2);
}

function buildReadme() {
  return `# PatelsVine static website

This folder is ready to upload to hosting for https://www.patelsvine.in.

## What is included

- Responsive static HTML/CSS/JS site
- ${posts.length} original India-focused articles with source links
- Blog index, category pages, about, contact, editorial policy, privacy policy, terms, disclaimer
- SEO metadata, Article schema, RSS feed, sitemap.xml, robots.txt, manifest, favicon
- Local article thumbnail images sourced from reusable public-domain, CC, or GODL-India media with article-page credits

## Hosting

Upload everything inside this folder to your web host's public root. The sitemap and canonical tags use clean URLs such as /blog/ and /posts/article-slug/. Internal links are written with relative paths so the design also loads when you open index.html directly on your computer.

## Local preview

Open index.html directly for a quick preview, or run a local static server from this folder for the closest hosting-like preview.

## AdSense

AdSense script is included in generated pages using publisher ID ca-pub-7743257472612824. ads.txt also includes the matching publisher line.
`;
}

const css = `
:root {
  color-scheme: light;
  --bg: #fbfaf6;
  --surface: #ffffff;
  --surface-2: #f2efe7;
  --text: #17211d;
  --muted: #5f6d65;
  --border: #ddd6c8;
  --brand: #15372c;
  --brand-2: #24594a;
  --accent: #c9552a;
  --accent-2: #1f7a8c;
  --gold: #d89922;
  --shadow: 0 18px 40px rgba(32, 42, 37, 0.10);
  --radius: 8px;
  --container: 1180px;
  --header-h: 74px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #101715;
  --surface: #17211f;
  --surface-2: #1e2b27;
  --text: #f2f1e9;
  --muted: #bcc8bf;
  --border: #31443e;
  --brand: #8bd8bd;
  --brand-2: #9ce4cd;
  --accent: #f08a58;
  --accent-2: #7ed0df;
  --gold: #e8bb54;
  --shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-size: 16px;
  line-height: 1.65;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
}

a:hover {
  color: var(--accent);
}

h1, h2, h3 {
  margin: 0;
  line-height: 1.12;
  letter-spacing: 0;
}

h1 {
  font-size: clamp(2rem, 4.4vw, 3.75rem);
  max-width: 14ch;
}

h2 {
  font-size: clamp(1.55rem, 3vw, 2.45rem);
}

h3 {
  font-size: 1.2rem;
}

p {
  margin: 0;
}

.container {
  width: min(100% - 32px, var(--container));
  margin-inline: auto;
}

.skip-link {
  position: absolute;
  left: 16px;
  top: -80px;
  z-index: 20;
  background: var(--text);
  color: var(--bg);
  padding: 10px 14px;
  border-radius: var(--radius);
}

.skip-link:focus {
  top: 16px;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  min-height: var(--header-h);
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  min-height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 22px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  min-width: max-content;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--brand), var(--accent-2));
  color: white;
  font-weight: 900;
}

.brand-copy {
  display: grid;
  gap: 0;
}

.brand-copy strong {
  font-size: 1.04rem;
  line-height: 1.1;
}

.brand-copy span {
  color: var(--muted);
  font-size: 0.78rem;
}

.site-nav {
  margin-left: auto;
  display: flex;
  gap: 4px;
  align-items: center;
}

.site-nav a {
  text-decoration: none;
  color: var(--muted);
  padding: 10px 10px;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 0.93rem;
}

.site-nav a:hover {
  background: var(--surface-2);
  color: var(--text);
}

.icon-button {
  width: 42px;
  height: 42px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius);
  display: inline-grid;
  place-items: center;
  cursor: pointer;
}

.nav-toggle {
  display: none;
  margin-left: auto;
  gap: 4px;
}

.nav-toggle span {
  width: 18px;
  height: 2px;
  background: currentColor;
}

.theme-toggle-icon {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid currentColor;
  box-shadow: inset 7px -2px 0 currentColor;
}

.home-hero {
  min-height: min(620px, calc(100svh - var(--header-h) - 64px));
  padding: clamp(24px, 4vw, 42px) 0 26px;
  display: grid;
  align-items: center;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface-2) 88%, transparent) 0%, var(--bg) 54%, color-mix(in srgb, var(--accent) 10%, var(--bg)) 100%);
  border-bottom: 1px solid var(--border);
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(340px, 0.72fr);
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
}

.hero-copy {
  display: grid;
  gap: 22px;
}

.hero-copy h1 {
  max-width: 15ch;
}

.hero-lede {
  color: var(--muted);
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  max-width: 62ch;
}

.hero-actions,
.section-heading-row,
.card-footer,
.post-meta,
.footer-bottom {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.button {
  appearance: none;
  border: 1px solid var(--brand);
  border-radius: var(--radius);
  background: var(--brand);
  color: #fff;
  min-height: 44px;
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.button:hover {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
}

.button.secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.button.secondary:hover {
  background: var(--surface-2);
  color: var(--text);
}

.full-width {
  width: 100%;
}

.eyebrow {
  color: var(--accent);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.78rem;
}

.section-block {
  padding: clamp(44px, 7vw, 84px) 0;
}

.home-page .home-hero + .section-block {
  padding-top: 24px;
}

.muted-band {
  background: var(--surface-2);
  border-block: 1px solid var(--border);
}

.section-heading-row {
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-heading-row > div {
  display: grid;
  gap: 7px;
}

.text-link {
  font-weight: 900;
  color: var(--brand-2);
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.post-grid.compact {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.post-card {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: var(--radius);
  overflow: clip;
  box-shadow: var(--shadow);
  min-width: 0;
}

.post-card:hover .post-media img {
  transform: scale(1.035);
}

.post-media {
  display: block;
  overflow: hidden;
  background: var(--surface-2);
  aspect-ratio: 16 / 9;
}

.post-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 220ms ease;
}

.post-card-body {
  padding: 18px;
  display: grid;
  gap: 12px;
}

.post-card h2 {
  font-size: clamp(1.08rem, 2vw, 1.42rem);
}

.post-card h2 a {
  text-decoration: none;
}

.post-card p {
  color: var(--muted);
}

.post-meta {
  color: var(--muted);
  font-size: 0.86rem;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 3px 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-2) 13%, var(--surface));
  color: var(--brand-2);
  font-weight: 900;
  text-decoration: none;
}

.card-footer {
  justify-content: space-between;
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 4px;
}

.featured-card .post-card-body {
  padding: 16px;
  gap: 10px;
}

.featured-card h2 {
  font-size: clamp(1.25rem, 2.1vw, 1.75rem);
}

.hero-feature .post-media {
  aspect-ratio: 21 / 10;
}

.hero-feature .post-card p {
  font-size: 0.98rem;
}

.two-column {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr);
  gap: 36px;
  align-items: start;
}

.two-column > div:first-child {
  display: grid;
  gap: 12px;
}

.section-chip-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.section-chip-grid a {
  display: grid;
  gap: 4px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  text-decoration: none;
}

.section-chip-grid span {
  color: var(--muted);
  font-size: 0.92rem;
}

.page-hero {
  padding: clamp(42px, 7vw, 86px) 0;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}

.compact-hero .container {
  display: grid;
  gap: 14px;
}

.compact-hero h1 {
  max-width: 16ch;
}

.compact-hero p:not(.eyebrow) {
  max-width: 72ch;
  color: var(--muted);
}

.breadcrumbs ol {
  list-style: none;
  padding: 0;
  margin: 0 0 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--muted);
  font-size: 0.86rem;
}

.breadcrumbs li:not(:last-child)::after {
  content: "/";
  margin-left: 8px;
  color: var(--muted);
}

.search-tools {
  display: grid;
  gap: 14px;
  margin-top: 10px;
}

.search-box {
  display: grid;
  gap: 6px;
  max-width: 620px;
  font-weight: 800;
}

input,
textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
  padding: 12px 13px;
  font: inherit;
}

input:focus,
textarea:focus,
button:focus-visible,
a:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--accent-2) 55%, transparent);
  outline-offset: 2px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 800;
  cursor: pointer;
}

.filter-chip.active,
.filter-chip:hover {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
}

.empty-state {
  margin-top: 20px;
  color: var(--muted);
  font-weight: 800;
}

.article-header {
  padding: clamp(34px, 6vw, 70px) 0;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}

.article-header-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.7fr);
  gap: clamp(24px, 5vw, 54px);
  align-items: center;
}

.article-header-grid > div:first-child {
  display: grid;
  gap: 16px;
}

.article-header h1 {
  max-width: 15ch;
  font-size: clamp(1.9rem, 4vw, 3.45rem);
}

.dek {
  color: var(--muted);
  font-size: 1.16rem;
  max-width: 66ch;
}

.article-figure {
  margin: 0;
  border-radius: var(--radius);
  overflow: clip;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  background: var(--surface);
}

.article-figure figcaption {
  padding: 8px 10px;
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.45;
}

.article-figure figcaption a {
  font-weight: 700;
}

.reading-progress {
  position: fixed;
  top: var(--header-h);
  left: 0;
  width: 0;
  height: 3px;
  background: var(--accent);
  z-index: 11;
}

.article-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 760px);
  gap: 42px;
  align-items: start;
  padding-block: clamp(44px, 7vw, 82px);
}

.article-aside {
  position: sticky;
  top: calc(var(--header-h) + 24px);
}

.aside-box {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  padding: 16px;
  display: grid;
  gap: 14px;
}

.aside-box dl {
  margin: 0;
  display: grid;
  gap: 10px;
}

.aside-box div {
  display: grid;
  gap: 2px;
}

.aside-box dt {
  color: var(--muted);
  font-size: 0.82rem;
}

.aside-box dd {
  margin: 0;
  font-weight: 800;
}

.article-content {
  min-width: 0;
  display: grid;
  gap: 20px;
}

.article-content p {
  font-size: 1.07rem;
}

.article-content h2 {
  margin-top: 12px;
  font-size: 1.75rem;
}

.source-list {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  display: grid;
  gap: 12px;
}

.source-list h2 {
  font-size: 1.35rem;
}

.source-list p,
.source-list li {
  color: var(--muted);
}

.source-list ul {
  margin: 0;
  padding-left: 20px;
}

.related-block {
  background: var(--surface-2);
  border-top: 1px solid var(--border);
}

.narrow-page {
  max-width: 820px;
  display: grid;
  gap: 18px;
}

.narrow-page h2 {
  margin-top: 12px;
  font-size: 1.75rem;
}

.contact-form {
  display: grid;
  gap: 14px;
  margin-top: 8px;
}

.contact-form label {
  display: grid;
  gap: 6px;
  font-weight: 800;
}

.form-note {
  color: var(--muted);
  font-size: 0.93rem;
}

.site-footer {
  background: #0f1d19;
  color: #f8f3e8;
  padding: 46px 0 24px;
}

.site-footer a {
  color: inherit;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(260px, 1.3fr) repeat(3, minmax(150px, 0.7fr));
  gap: 28px;
}

.footer-grid h2 {
  font-size: 1rem;
  margin-bottom: 10px;
}

.footer-grid p,
.footer-grid li {
  color: #cfdad2;
}

.footer-grid ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.footer-brand {
  margin-bottom: 12px;
}

.footer-bottom {
  justify-content: space-between;
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  color: #cfdad2;
}

@media (max-width: 980px) {
  .nav-toggle {
    display: inline-grid;
  }

  .site-nav {
    position: absolute;
    inset: var(--header-h) 16px auto 16px;
    display: none;
    margin-left: 0;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    box-shadow: var(--shadow);
  }

  .site-nav.is-open {
    display: grid;
  }

  .site-nav a {
    padding: 12px;
  }

  .theme-toggle {
    margin-left: 0;
  }

  .hero-grid,
  .article-header-grid,
  .two-column,
  .article-layout {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    order: 1;
  }

  .hero-feature {
    order: 2;
  }

  .post-grid,
  .post-grid.compact {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .article-aside {
    position: static;
  }

  .aside-box {
    grid-template-columns: 1fr;
  }

  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  :root {
    --header-h: 68px;
  }

  body {
    font-size: 15px;
  }

  .container {
    width: min(100% - 24px, var(--container));
  }

  .brand-copy span {
    display: none;
  }

  .hero-actions .button,
  .page-hero .button,
  .contact-form .button {
    width: 100%;
  }

  .post-grid,
  .post-grid.compact,
  .section-chip-grid,
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .home-hero {
    min-height: auto;
  }

  h1,
  .article-header h1,
  .compact-hero h1 {
    max-width: 100%;
  }

  .footer-bottom {
    align-items: flex-start;
  }
}
`;

const js = `
(() => {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("patelsvine-theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    root.dataset.theme = storedTheme;
  }

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
  }

  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("patelsvine-theme", next);
    });
  }

  const searchInput = document.querySelector("[data-post-search]");
  const cards = Array.from(document.querySelectorAll("[data-post-card]"));
  const filters = Array.from(document.querySelectorAll("[data-category-filter]"));
  const emptyState = document.querySelector("[data-empty-state]");
  let activeCategory = new URLSearchParams(location.search).get("category") || "all";
  const q = new URLSearchParams(location.search).get("q");
  if (searchInput && q) searchInput.value = q;

  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matchesTerm = !term || card.dataset.title.includes(term);
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      const show = matchesTerm && matchesCategory;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  if (filters.length) {
    filters.forEach((button) => {
      if (button.dataset.categoryFilter === activeCategory) {
        filters.forEach((candidate) => candidate.classList.remove("active"));
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        activeCategory = button.dataset.categoryFilter;
        filters.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
        applyFilters();
      });
    });
  }
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  applyFilters();

  const progress = document.querySelector("[data-reading-progress]");
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const width = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      progress.style.width = width + "%";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  const copyButton = document.querySelector("[data-copy-link]");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        const original = copyButton.textContent;
        copyButton.textContent = "Copied";
        setTimeout(() => { copyButton.textContent = original; }, 1600);
      } catch {
        copyButton.textContent = "Copy failed";
      }
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const message = data.get("message") || "";
      const body = encodeURIComponent("Name: " + name + "\\nEmail: " + email + "\\n\\n" + message);
      location.href = "mailto:editor@patelsvine.in?subject=PatelsVine%20Website%20Message&body=" + body;
    });
  }
})();
`;

function svgTemplate({ title, subtitle, kind, colors = ["#15372c", "#1f7a8c", "#c9552a", "#d89922"] }) {
  const [a, b, c, d] = colors;
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = escapeHtml(subtitle);
  const icon = {
    ballot: `<rect x="760" y="150" width="250" height="350" rx="8" fill="#fff7" stroke="#fff" stroke-width="3"/><path d="M810 235h140M810 305h140M810 375h140" stroke="#fff" stroke-width="14" stroke-linecap="round"/><path d="M790 230l24 24 46-62" fill="none" stroke="${d}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`,
    qr: `<rect x="760" y="150" width="300" height="300" rx="8" fill="#fff"/><g fill="${a}"><rect x="800" y="190" width="70" height="70"/><rect x="950" y="190" width="70" height="70"/><rect x="800" y="340" width="70" height="70"/><rect x="910" y="320" width="38" height="38"/><rect x="970" y="350" width="50" height="50"/><rect x="900" y="230" width="30" height="30"/><rect x="850" y="290" width="42" height="42"/><rect x="940" y="285" width="26" height="26"/></g>`,
    court: `<path d="M760 450h330v42H760zM790 230h270l-135-80z" fill="#fff8"/><g fill="#fff"><rect x="805" y="255" width="34" height="170"/><rect x="872" y="255" width="34" height="170"/><rect x="939" y="255" width="34" height="170"/><rect x="1006" y="255" width="34" height="170"/></g><circle cx="1060" cy="210" r="42" fill="${d}"/><text x="1060" y="223" text-anchor="middle" font-size="38" font-weight="900" fill="${a}">+4</text>`,
    chip: `<rect x="760" y="170" width="300" height="300" rx="28" fill="#fff8" stroke="#fff" stroke-width="3"/><rect x="825" y="235" width="170" height="170" rx="18" fill="${a}"/><path d="M790 215h-50M790 270h-50M790 325h-50M790 380h-50M1080 215h50M1080 270h50M1080 325h50M1080 380h50" stroke="#fff" stroke-width="14" stroke-linecap="round"/><path d="M860 320h100M910 270v100" stroke="#fff" stroke-width="12" stroke-linecap="round"/>`,
    ai: `<circle cx="905" cy="310" r="145" fill="#fff7" stroke="#fff" stroke-width="3"/><g stroke="#fff" stroke-width="9" fill="${a}"><circle cx="905" cy="310" r="28"/><circle cx="805" cy="250" r="22"/><circle cx="1005" cy="250" r="22"/><circle cx="805" cy="380" r="22"/><circle cx="1005" cy="380" r="22"/></g><path d="M828 262l52 33M982 262l-52 33M828 370l52-36M982 370l-52-36" stroke="#fff" stroke-width="7"/>`,
    upi: `<rect x="740" y="185" width="340" height="250" rx="22" fill="#fff8"/><path d="M800 330h210" stroke="${a}" stroke-width="18" stroke-linecap="round"/><path d="M910 255l110 70-110 70z" fill="${d}"/><circle cx="805" cy="260" r="36" fill="${b}"/><circle cx="805" cy="400" r="36" fill="${c}"/>`,
    plane: `<path d="M760 325l330-150-95 150 95 150z" fill="#fff8"/><path d="M995 325H760" stroke="${a}" stroke-width="18"/><path d="M890 320l-80 115M900 330l-80-110" stroke="#fff" stroke-width="18" stroke-linecap="round"/>`,
    ship: `<path d="M735 370h390l-70 95H800z" fill="#fff8"/><path d="M805 305h230v65H805zM850 245h145v60H850z" fill="#fff"/><path d="M740 500c60-34 120 34 180 0s120 34 180 0" fill="none" stroke="${d}" stroke-width="16" stroke-linecap="round"/>`,
    rail: `<path d="M760 455l130-260h150l90 260" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/><path d="M825 285h250M800 345h295M775 405h340" stroke="#fff8" stroke-width="12" stroke-linecap="round"/><path d="M865 485h230" stroke="${d}" stroke-width="18" stroke-linecap="round"/>`,
    cotton: `<g fill="#fff"><circle cx="875" cy="250" r="55"/><circle cx="820" cy="315" r="55"/><circle cx="930" cy="315" r="55"/><circle cx="875" cy="360" r="55"/></g><path d="M875 405v90M875 455c-55-10-95-40-122-82M875 455c55-10 95-40 122-82" stroke="${a}" stroke-width="14" stroke-linecap="round"/>`,
    cane: `<path d="M800 495L980 165M860 505l180-330" stroke="#fff" stroke-width="28" stroke-linecap="round"/><path d="M845 410l-70-60M910 330l-75-52M970 250l-76-54" stroke="${d}" stroke-width="12" stroke-linecap="round"/><rect x="780" y="155" width="300" height="70" rx="8" fill="#fff8"/><text x="930" y="202" text-anchor="middle" font-size="34" font-weight="900" fill="${a}">Rs 365/qtl</text>`,
    rugby: `<ellipse cx="910" cy="320" rx="170" ry="88" transform="rotate(-18 910 320)" fill="#fff8"/><path d="M790 355c74-52 174-82 295-80M825 285c60 60 135 96 225 104" stroke="${a}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M855 320l95 32" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`,
    defence: `<path d="M900 150l160 70v115c0 95-62 150-160 198-98-48-160-103-160-198V220z" fill="#fff8"/><path d="M900 215v210M812 305h176M845 392l110-172" stroke="${a}" stroke-width="15" stroke-linecap="round"/>`,
  }[kind] || "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${escapedTitle}</title>
  <desc id="desc">${escapedSubtitle}</desc>
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="${a}" offset="0"/>
      <stop stop-color="${b}" offset="0.52"/>
      <stop stop-color="${c}" offset="1"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="#ffffff" stroke-opacity=".12"/>
    </pattern>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>
  <path d="M760 0h440v170c-112 54-235 72-370 44z" fill="${d}" opacity=".18"/>
  <path d="M0 525h470v150H0z" fill="#ffffff" opacity=".08"/>
  <path d="M85 138c98-48 200-60 306-36s203 19 292-16" fill="none" stroke="#fff" stroke-opacity=".20" stroke-width="18" stroke-linecap="round"/>
  ${icon}
  <g transform="translate(80 140)">
    <rect x="0" y="0" width="92" height="10" fill="${d}"/>
    <text x="0" y="92" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="58" font-weight="900" fill="#fff">${escapedTitle}</text>
    <foreignObject x="0" y="128" width="560" height="160">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Inter, Segoe UI, Arial, sans-serif; color: rgba(255,255,255,.88); font-size: 26px; line-height: 1.35; font-weight: 650;">${escapedSubtitle}</div>
    </foreignObject>
  </g>
</svg>`;
}

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="PatelsVine logo">
  <rect width="512" height="512" rx="82" fill="#15372c"/>
  <path d="M86 340c82-16 128-62 154-138 39 18 79 22 120 12-36 78-101 131-194 158 73 30 157 21 250-28-47 80-123 120-228 120-44 0-78-8-102-24z" fill="#1f7a8c"/>
  <text x="256" y="270" text-anchor="middle" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="142" font-weight="900" fill="#fff">PV</text>
</svg>`;
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="#15372c"/>
  <text x="32" y="41" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#fff">PV</text>
</svg>`;
}

async function write(filePath, content) {
  const fullPath = path.join(outputDir, filePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, "utf8");
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  await write("index.html", buildHome());
  await write("blog\\index.html", buildBlogIndex());
  for (const category of categories) {
    await write(`sections\\${category.slug}\\index.html`, buildCategoryPage(category));
  }
  for (const post of posts) {
    await write(`posts\\${post.slug}\\index.html`, buildPost(post));
  }
  for (const page of pages) {
    await write(`${page.slug}\\index.html`, buildStaticPage(page));
  }
  await write("404.html", build404());
  await write("sitemap.xml", buildSitemap());
  await write("sitemap.xsl", buildSitemapStylesheet());
  await write("rss.xml", buildRss());
  await write("rss.xsl", buildRssStylesheet());
  await write("robots.txt", buildRobots());
  await write("manifest.webmanifest", buildManifest());
  await write("README.md", buildReadme());
  await write("ads.txt", "google.com, pub-7743257472612824, DIRECT, f08c47fec0942fa0\n");
  await write("humans.txt", `${siteName}\\nDomain: www.patelsvine.in\\nBuilt: ${today}\\n`);
  await write("assets\\css\\styles.css", css.trim() + "\n");
  await write("assets\\js\\main.js", js.trim() + "\n");
  await write("assets\\images\\logo.svg", logoSvg());
  await write("assets\\images\\favicon.svg", faviconSvg());
  await write("assets\\images\\social-card.svg", svgTemplate({
    title: "PatelsVine",
    subtitle: "India news, technology, politics and events explained clearly",
    kind: "ai",
    colors: ["#15372c", "#1f7a8c", "#c9552a", "#d89922"],
  }));
  await mkdir(path.join(outputDir, "assets", "images"), { recursive: true });
  for (const file of realImageFiles) {
    await copyFile(path.join("assets", "images", file), path.join(outputDir, "assets", "images", file));
  }
  await write("data\\posts.json", JSON.stringify(posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    url: postUrl(post),
    category: post.category,
    tags: post.tags,
    date: post.date,
    updated: post.updated,
    excerpt: post.excerpt,
    readingMinutes: post.readingMinutes,
    image: assetUrl(post.image),
    imageCredit: imageCredits[post.image],
  })), null, 2));

  await copyFile(new URL(import.meta.url), path.join(outputDir, "source-generator.mjs"));
  console.log(`Built ${posts.length} posts and ${pages.length + categories.length + 4} core pages at ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
