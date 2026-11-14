/**
 * ============================================================================
 * بنية أنواع الفصول (Chapter Types Documentation):
 * ============================================================================
 * كل فصل يحتوي على حقل `type` يحدد طريقة العرض:
 * 
 * 1. text (نص سردي):
 *    - type: "text"
 *    - title: عنوان الفصل
 *    - content: نص أو فقرة السرد القصصي
 * 
 * 2. facts (حقائق ومعلومات سريعة):
 *    - type: "facts"
 *    - title: عنوان الفصل
 *    - items: مصفوفة من الحقائق والمعلومات (Array of strings)
 * 
 * 3. timeline (خط زمني للأحداث):
 *    - type: "timeline"
 *    - title: عنوان الفصل
 *    - events: مصفوفة أحداث خط زمني [{ year: "1969", title: "...", description: "..." }]
 * 
 * 4. numbers (أرقام وإحصائيات رئيسية):
 *    - type: "numbers"
 *    - title: عنوان الفصل
 *    - stats: مصفوفة إحصائيات وأرقام [{ value: "384,400 km", label: "..." }]
 * ============================================================================
 */

const uiText = {
    en: {
        siteTitle: "Left in Silence, Remembered in Science",
        siteDesc: "Discover the untold stories of NASA's discarded heroes on the Moon and Mars.",
        exploreMoon: "Explore The Moon",
        exploreMars: "Explore Mars",
        backToPlanets: "← Back to Planets Overview",
        langToggle: "عربي",
        moonSphereAria: "Interactive sphere of the Moon. Drag or use arrow keys to rotate, and mouse wheel or + and - to zoom.",
        marsSphereAria: "Interactive sphere of Mars. Drag or use arrow keys to rotate, and mouse wheel or + and - to zoom.",
        overviewSphereAria: "Interactive 3D view of the Moon and Mars. Hover to glow, click Mars to bring it forward, or click to zoom into full screen.",
        overviewHint: "Hover over the Moon to make it glow · Click Mars to bring it forward · Click to zoom in and explore landing sites",
        exploreHint: "Drag to rotate the globe · or use arrow keys (Enter to select marked artifact)",
        discoverStory: "Discover the Story",
        nextChapter: "Next Chapter",
        prevChapter: "Previous Chapter",
        finishStory: "Finish Story",
        closeStory: "Close",
        location: "Location",
        year: "Year",
        chapter: "Chapter",
        of: "of",
        coordinates: "Coordinates",
        moonSectionTitle: "The Moon: Relics of Human Footsteps",
        moonSectionDesc: "Select a landing site marker on the lunar globe to explore the abandoned spacecraft.",
        marsSectionTitle: "Mars: The Silent Explorers",
        marsSectionDesc: "Select a rover marker on the Martian globe to uncover its triumphs and final resting place.",
        moonMapCredit: "Moon map: NASA’s Scientific Visualization Studio, CGI Moon Kit",
        marsMapCredit: "Mars map: NASA / JPL / USGS, Viking MDIM 2.1",
        markerLabel: "Landing Site",
        activeArtifactsCount: "Artifacts on Globe",
        planetMoon: "Moon",
        planetMars: "Mars",
        moonDesc: "Explore Apollo Lunar Modules and Lunar Roving Vehicles",
        marsDesc: "Discover the epic journeys of Spirit, Opportunity, and Ingenuity",
        inFrontTag: "In Front (Active)",
        inBackTag: "In Background (Click to swap)",
        clickToExplore: "Click to zoom & explore →",
        clickToBringForward: "Click to bring forward →",
        scrollPrompt: "Scroll down to explore",
        moonQuote: "Eternal footprints on silver soil",
        marsQuote: "A journey into the heart of red dust",
        pauseMotion: "Pause Motion",
        playMotion: "Play Motion",
        motionToggleAriaPause: "Pause background starfield motion",
        motionToggleAriaPlay: "Play background starfield motion"
    },
    ar: {
        siteTitle: "تُركت في صمت، خُلِّدت في العلم",
        siteDesc: "اكتشف القصص المجهولة لأبطال ناسا المتروكين على سطح القمر والمريخ.",
        exploreMoon: "استكشف القمر",
        exploreMars: "استكشف المريخ",
        backToPlanets: "← نظرة عامة على الكواكب",
        langToggle: "English",
        moonSphereAria: "كرة تفاعلية للقمر. اسحب أو استخدم مفاتيح الأسهم للتدوير، وعجلة الفأرة أو + و - للتكبير.",
        marsSphereAria: "كرة تفاعلية للمريخ. اسحب أو استخدم مفاتيح الأسهم للتدوير، وعجلة الفأرة أو + و - للتكبير.",
        overviewSphereAria: "عرض ثلاثي الأبعاد للقمر والمريخ. مرر الفأرة للتوهج، انقر على المريخ لتقديمه، أو انقر على الجرم للتكبير والاستكشاف.",
        overviewHint: "مرر الفأرة على القمر ليتوهج · انقر على المريخ ليتقدم للأمام · انقر على الجرم للتكبير واستكشاف المواقع",
        exploreHint: "اسحب لتدوير الكرة · أو استخدم الأسهم (Enter لاختيار المركبة المحددة)",
        discoverStory: "اكتشف القصة",
        nextChapter: "الفصل التالي",
        prevChapter: "الفصل السابق",
        finishStory: "إنهاء القصة",
        closeStory: "إغلاق",
        location: "الموقع",
        year: "السنة",
        chapter: "فصل",
        of: "من",
        coordinates: "الإحداثيات",
        moonSectionTitle: "القمر: آثار خطى البشر الأولى",
        moonSectionDesc: "انقر على إحدى العلامات على سطح القمر أو استخدم لوحة المفاتيح لاستكشاف المركبات المتروكة.",
        marsSectionTitle: "المريخ: مستكشفو الكوكب الأحمر الصامتون",
        marsSectionDesc: "انقر على إحدى علامات المركبات على سطح المريخ لاستكشاف بطولاتها ومستقرها الأخير.",
        moonMapCredit: "Moon map: NASA’s Scientific Visualization Studio, CGI Moon Kit",
        marsMapCredit: "Mars map: NASA / JPL / USGS, Viking MDIM 2.1",
        markerLabel: "موقع الهبوط",
        activeArtifactsCount: "المعدات المعروضة على الكرة",
        planetMoon: "القمر",
        planetMars: "المريخ",
        moonDesc: "استكشف منصات هبوط أبولو وعربات التجوال القمرية",
        marsDesc: "استكشف مسارات سبيريت، أوبورتونيتي، ومروحية إنجنويتي",
        inFrontTag: "في الأمام (نشط)",
        inBackTag: "في الخلف (انقر للتقديم)",
        clickToExplore: "انقر للتكبير والاستكشاف ←",
        clickToBringForward: "انقر لتقديمه للأمام ←",
        scrollPrompt: "انزل للأسفل للاستكشاف",
        moonQuote: "آثار خالدة على تربة فضية",
        marsQuote: "رحلة في قلب الغبار الأحمر",
        pauseMotion: "إيقاف الحركة",
        playMotion: "تشغيل الحركة",
        motionToggleAriaPause: "إيقاف حركة حقل النجوم في الخلفية",
        motionToggleAriaPlay: "تشغيل حركة حقل النجوم في الخلفية"
    }
};

const spaceArtifacts = [
    {
        id: "apollo_lm",
        location: "Moon",
        image: "assets/images/apollo_lm.png",
        model3d: "assets/models/apollo_lm.glb", // اتركوه فارغاً "" إذا لم يتوفر مجسم
        coordinates: {
            lat: 0.67416,
            lng: 23.47314
        },
        en: {
            name: "Apollo Lunar Modules",
            location: "Moon",
            year: "1969-1972",
            story_parts: {
                intro: "Write the brief story/introduction here...",
                mission: "Write the reason for sending here...",
                achievement: "Write the achievements and duration here...",
                ending: "Write how it ended here..."
            },
            chapters: [
                {
                    type: "text",
                    title: "The Historic Eagle Landing",
                    content: "On July 20, 1969, the Apollo 11 Lunar Module 'Eagle' touched down at Tranquility Base. Neil Armstrong announced, 'The Eagle has landed.' When the crew prepared to return home, only the upper ascent stage lifted off, leaving the gold-sheathed descent stage standing in silent majesty on the lunar regolith."
                },
                {
                    type: "facts",
                    title: "Engineering & Craftsmanship",
                    items: [
                        "Equipped with throttleable rocket engines capable of slowing a 15-ton spacecraft to a gentle touchdown.",
                        "Insulated with 25 layers of aluminized Mylar and Kapton film to withstand extreme temperature swings.",
                        "Left-behind descent stages served as landing launchpads and scientific seismic experiment stations.",
                        "Carried commemorative plaques signed by the astronauts and the President of the United States."
                    ]
                },
                {
                    type: "timeline",
                    title: "Chronicle of Lunar Touchdowns",
                    events: [
                        { year: "July 20, 1969", title: "Apollo 11 (Eagle)", description: "First human landing on Mare Tranquillitatis." },
                        { year: "November 19, 1969", title: "Apollo 12 (Intrepid)", description: "Pinpoint landing near the Surveyor 3 robotic probe." },
                        { year: "February 5, 1971", title: "Apollo 14 (Antares)", description: "Exploration of the rugged Fra Mauro formation." },
                        { year: "December 11, 1972", title: "Apollo 17 (Challenger)", description: "Final crewed lunar descent stage left in Taurus-Littrow." }
                    ]
                },
                {
                    type: "numbers",
                    title: "The Lunar Modules in Numbers",
                    stats: [
                        { value: "6", label: "Descent Stages on the Moon" },
                        { value: "384,400 km", label: "Distance from Earth" },
                        { value: "21 hr 36 min", label: "Apollo 11 Surface Stay" },
                        { value: "382 kg", label: "Total Lunar Samples Brought Home" }
                    ]
                }
            ]
        },
        ar: {
            name: "مركبات الهبوط القمرية (أبولو)",
            location: "القمر",
            year: "1969-1972",
            story_parts: {
                intro: "هنا تكتب القصة باختصار...",
                mission: "هنا يكتب سبب الإرسال...",
                achievement: "هنا يكتب الإنجاز ومدة العمل...",
                ending: "هنا يكتب كيف انتهت..."
            },
            chapters: [
                {
                    type: "text",
                    title: "هبوط نسر الفضاء التاريخي",
                    content: "في 20 يوليو 1969، لامست أقدام مركبة الهبوط القمرية 'إيجل' (أبولو 11) أرض بحر الهدوء، معلنة وصول الإنسان لأول مرة إلى سطح القمر. وعندما حان وقت العودة للأرض، انطلقت مقصورة الصعود تاركة قاعدة الهبوط الذهبية قائمة في صمت أبدي على أديم القمر."
                },
                {
                    type: "facts",
                    title: "حقائق وتصميم هندسي فريد",
                    items: [
                        "صُممت منصة الهبوط بأربعة أرجل مجهزة بوسائد قرصية لتوزيع الوزن وتفادي الغوص في الغبار القمري.",
                        "غُلفت بأكثر من 25 طبقة من رقائق المايلار والكابتون الذهبية لعزل الحرارة الفضائية الحارقة والباردة.",
                        "شكلت منصة الهبوط قاعدة انطلاق لمقصورة الصعود ومحطة لحزم التجارب العلمية السيزمية.",
                        "حملت لوحة تذكارية منقوشة بعبارة: 'هنا وطأت أقدام رجال من كوكب الأرض سطح القمر لأول مرة.. جئنا بسلام لكل البشرية'."
                    ]
                },
                {
                    type: "timeline",
                    title: "مسيرة الهبوط البشري على القمر",
                    events: [
                        { year: "20 يوليو 1969", title: "أبولو 11 (إيجل)", description: "أول هبوط مأهول في بحر الهدوء (0.67° شمالاً، 23.47° شرقاً)." },
                        { year: "19 نوفمبر 1969", title: "أبولو 12 (إنتريبيد)", description: "هبوط فائق الدقة بالقرب من مسبار سيرفيور 3." },
                        { year: "5 فبراير 1971", title: "أبولو 14 (أنتاريس)", description: "استكشاف تضاريس فرا ماورو الصخرية الوعرة." },
                        { year: "11 ديسمبر 1972", title: "أبولو 17 (تشالنجر)", description: "آخر منصة هبوط قمرية مأهولة تُترك في وادي توروس-ليترو." }
                    ]
                },
                {
                    type: "numbers",
                    title: "مركبات أبولو في أرقام",
                    stats: [
                        { value: "6", label: "منصات هبوط باقية على سطح القمر" },
                        { value: "384,400 كم", label: "المسافة المقطوعة من كوكب الأرض" },
                        { value: "21 ساعة و36 دقيقة", label: "إقامة رواد أبولو 11 على السطح" },
                        { value: "382 كجم", label: "إجمالي العينات القمرية التي جُمعت" }
                    ]
                }
            ]
        }
    },
    {
        id: "lrv",
        location: "Moon",
        image: "assets/images/lrv.png",
        model3d: "assets/models/lrv.glb",
        coordinates: {
            lat: 26.1322,
            lng: 3.6339
        },
        en: {
            name: "Lunar Roving Vehicles (LRV)",
            location: "Moon",
            year: "1971-1972",
            story_parts: {
                intro: "Write the brief story/introduction here...",
                mission: "Write the reason for sending here...",
                achievement: "Write the achievements and duration here...",
                ending: "Write how it ended here..."
            },
            chapters: [
                {
                    type: "text",
                    title: "The Electric Rovers of the Moon",
                    content: "Dubbed the 'Moon Buggy', the Lunar Roving Vehicle was an open electric rover that revolutionized lunar exploration during Apollo 15, 16, and 17. Instead of being restricted to short walking excursions, astronauts drove across lunar plains and peered over the edges of colossal rilles and craters."
                },
                {
                    type: "facts",
                    title: "Groundbreaking Mobility Tech",
                    items: [
                        "Folded ingenious design tucked into a quadrant of the Lunar Module descent stage like an origami puzzle.",
                        "Each wheel featured an independent electric motor driven by zinc-silver batteries, wrapped in zinc-coated piano wire mesh instead of rubber.",
                        "Controlled using a simple T-shaped joystick positioned between the two astronaut seats.",
                        "Equipped with a high-gain antenna and color television camera controlled directly by Mission Control in Houston."
                    ]
                },
                {
                    type: "timeline",
                    title: "Traverses Across the Regolith",
                    events: [
                        { year: "July 31, 1971", title: "Apollo 15 Debut", description: "First drive around Hadley Rille and the Apennine Mountains covering 27.8 km." },
                        { year: "April 21, 1972", title: "Apollo 16 High-Speed Traverse", description: "Set an informal lunar speed record of 17.7 km/h across the Descartes Highlands." },
                        { year: "December 11, 1972", title: "Apollo 17 Long-Range Record", description: "Traversed 35.9 km exploring orange volcanic soil in Taurus-Littrow." }
                    ]
                },
                {
                    type: "numbers",
                    title: "Roving by the Numbers",
                    stats: [
                        { value: "90.5 km", label: "Total Distance Driven by All LRVs" },
                        { value: "3", label: "Rovers Left Resting on the Moon" },
                        { value: "210 kg", label: "Empty Weight on Earth (35 kg on Moon)" },
                        { value: "18 km/h", label: "Maximum Recorded Lunar Speed" }
                    ]
                }
            ]
        },
        ar: {
            name: "مركبات التجوال القمرية (LRV)",
            location: "القمر",
            year: "1971-1972",
            story_parts: {
                intro: "هنا تكتب القصة باختصار...",
                mission: "هنا يكتب سبب الإرسال...",
                achievement: "هنا يكتب الإنجاز ومدة العمل...",
                ending: "هنا يكتب كيف انتهت..."
            },
            chapters: [
                {
                    type: "text",
                    title: "عربات القمر الكهربائية",
                    content: "عُرفت شعبياً باسم 'عربة القمر' (Moon Buggy)، وكانت قفزة هائلة في استكشاف الفضاء خلال رحلات أبولو 15 و16 و17. فبدلاً من التقيد بالسير على الأقدام لمسافات قصيرة، أتاحت هذه العربات للرواد الانطلاق بحرية عبر السهول القمرية وبلوغ حواف الفوهات الشاهقة والأودية العميقة."
                },
                {
                    type: "facts",
                    title: "ابتكارات هندسية رائدة",
                    items: [
                        "تصميم فائق الذكاء كان يُطوى داخل تجويف ضيق في مركبة الهبوط ثم يُفرد آلياً بواسطة حبال وأذرع زنبركية.",
                        "زُوّدت كل عجلة بمحرك كهربائي مستقل، وصُنعت إطاراتها من شبكة أسلاك البيانو المنسوجة بدل المطاط لمقاومة التمزق.",
                        "قاد الرواد العربة بذراع تحكم واحدة على شكل حرف T مثبتة بين المقعدين لتسهيل القيادة بالقفازات الفضائية الضخمة.",
                        "زُوّدت بكاميرا ملونة وهوائي توجيهي يتم التحكم بهما عن بُعد مباشرة من مركز القيادة في هيوستن."
                    ]
                },
                {
                    type: "timeline",
                    title: "مسارات الرحلات على أديم القمر",
                    events: [
                        { year: "31 يوليو 1971", title: "أول قيادة في التاريخ (أبولو 15)", description: "استكشاف وادي هادلي ريل وجبال الأبينين بمسافة بلغت 27.8 كم." },
                        { year: "21 أبريل 1972", title: "المرتفعات القمرية (أبولو 16)", description: "تسجيل سرعة قياسية بلغت 17.7 كم/ساعة فوق تلال ديكارت الوعرة." },
                        { year: "11 ديسمبر 1972", title: "الرحلة الأطول (أبولو 17)", description: "قطع 35.9 كم واكتشاف التربة البركانية البرتقالية في وادي توروس-ليترو." }
                    ]
                },
                {
                    type: "numbers",
                    title: "عربة القمر في أرقام",
                    stats: [
                        { value: "90.5 كم", label: "إجمالي المسافات المقطوعة على القمر" },
                        { value: "3", label: "عربات ترقد بسلام على سطح القمر" },
                        { value: "210 كجم", label: "وزن العربة على الأرض (35 كجم على القمر)" },
                        { value: "18 كم/ساعة", label: "السرعة القصوى المسجلة على السطح" }
                    ]
                }
            ]
        }
    },
    {
        id: "spirit",
        location: "Mars",
        image: "assets/images/spirit.png",
        model3d: "assets/models/spirit.glb",
        coordinates: {
            lat: -14.5684,
            lng: 175.4726
        },
        en: {
            name: "Spirit Rover",
            location: "Mars",
            year: "2010",
            story_parts: {
                intro: "Write the brief story/introduction here...",
                mission: "Write the reason for sending here...",
                achievement: "Write the achievements and duration here...",
                ending: "Write how it ended here..."
            },
            chapters: [
                {
                    type: "text",
                    title: "The Iron Will in Gusev Crater",
                    content: "Spirit landed inside the impact crater Gusev on January 4, 2004. Designed for a 90-day mission, Spirit braved harsh Martian winters and dust-choked solar panels for over six years, revealing evidence of ancient hot springs and explosive volcanic activity."
                },
                {
                    type: "facts",
                    title: "Engineering Resilience",
                    items: [
                        "When its front-right wheel failed in 2006, engineers drove Spirit backwards, dragging the dead wheel across the Martian soil.",
                        "That dragging wheel accidentally scraped away topsoil to expose 90% pure silica—definitive proof of past hot hydrothermal springs.",
                        "Cleaned multiple times by serendipitous Martian dust devils that blew dust off its solar arrays.",
                        "Survived temperatures dropping below -100 degrees Celsius across several Martian winters."
                    ]
                },
                {
                    type: "timeline",
                    title: "Spirit's Epic Journey",
                    events: [
                        { year: "January 4, 2004", title: "Bouncing to a Halt", description: "Landed safely surrounded by airbags in Gusev Crater." },
                        { year: "August 2005", title: "Summiting Husband Hill", description: "Climbed 107 meters up the Columbia Hills, taking iconic summit panoramas." },
                        { year: "May 2009", title: "The Sand Trap at Troy", description: "Became trapped in soft sulfate sands while driving backward." },
                        { year: "March 22, 2010", title: "Final Transmission", description: "Sent its last communication before winter set in." }
                    ]
                },
                {
                    type: "numbers",
                    title: "Spirit by the Numbers",
                    stats: [
                        { value: "7.73 km", label: "Total Distance Traveled" },
                        { value: "2,210", label: "Martian Sols Survived (Planned: 90)" },
                        { value: "128,224", label: "Images Beamed Back to Earth" },
                        { value: "24x", label: "Mission Lifetime Multiplier" }
                    ]
                }
            ]
        },
        ar: {
            name: "المركبة سبيريت (Spirit)",
            location: "المريخ",
            year: "2010",
            story_parts: {
                intro: "هنا تكتب القصة باختصار...",
                mission: "هنا يكتب سبب الإرسال...",
                achievement: "هنا يكتب الإنجاز ومدة العمل...",
                ending: "هنا يكتب كيف انتهت..."
            },
            chapters: [
                {
                    type: "text",
                    title: "روح الإصرار في فوهة غوسيف",
                    content: "هبطت سبيريت في فوهة غوسيف على المريخ في 4 يناير 2004. صُممت لمهمة مدتها 90 يوماً فقط، لكنها قاومت شتاء المريخ القارس وعواصف الغبار لأكثر من 6 سنوات، مقدّمة أدلة حاسمة على وجود ينابيع مائية حارة ونشاط بركاني قديم."
                },
                {
                    type: "facts",
                    title: "صلابة وبراعة هندسية",
                    items: [
                        "عندما تعطلت عجلتها الأمامية اليمنى في 2006، قادها المهندسون بالرجوع للخلف مع سحب العجلة المعطلة على التراب.",
                        "تسببت العجلة المسحوبة بغير قصد في كشط القشرة السطحية وكشف سيليكا نقية بنسبة 90%، مؤكدة وجود ينابيع حارة قديمة.",
                        "أنقذتها دوامات الغبار المريخية عدة مرات بكنس الغبار المتراكم على ألواحها الشمسية.",
                        "تحملت درجات حرارة انخفضت إلى ما دون 100 درجة مئوية تحت الصفر."
                    ]
                },
                {
                    type: "timeline",
                    title: "المسيرة الخالدة لسبيريت",
                    events: [
                        { year: "4 يناير 2004", title: "الهبوط بالوسائد الهوائية", description: "الوصول الناجح إلى قاع فوهة غوسيف." },
                        { year: "أغسطس 2005", title: "صعود تلال كولومبيا", description: "تسلق تلة هازبند بارتفاع 107 أمتار والتقاط صور بانورامية تاريخية." },
                        { year: "مايو 2009", title: "فخ رمال طروادة", description: "علوق العجلات في رمال كبريتية ناعمة أثناء السير الخلفي." },
                        { year: "22 مارس 2010", title: "الإشارة الأخيرة", description: "إرسال آخر رسالة لاسلكية إلى الأرض قبل دخول الشتاء المريخي." }
                    ]
                },
                {
                    type: "numbers",
                    title: "سبيريت في أرقام",
                    stats: [
                        { value: "7.73 كم", label: "إجمالي المسافة المقطوعة على المريخ" },
                        { value: "2,210", label: "يوماً مريخياً عاشتها (المخطط: 90 يوماً)" },
                        { value: "128,224", label: "صورة علمية أُرسلت إلى الأرض" },
                        { value: "24 ضعفاً", label: "مضاعفة العمر الافتراضي للمهمة" }
                    ]
                }
            ]
        }
    },
    {
        id: "opportunity",
        location: "Mars",
        image: "assets/images/opportunity.png",
        model3d: "assets/models/opportunity.glb",
        coordinates: {
            lat: -1.9462,
            lng: 354.4734
        },
        en: {
            name: "Opportunity Rover",
            location: "Mars",
            year: "2018",
            story_parts: {
                intro: "Write the brief story/introduction here...",
                mission: "Write the reason for sending here...",
                achievement: "Write the achievements and duration here...",
                ending: "Write how it ended here..."
            },
            chapters: [
                {
                    type: "text",
                    title: "The Marathon Explorer",
                    content: "Touchdown in Meridiani Planum was hailed as an interplanetary 'hole-in-one' when Opportunity bounced right into Eagle Crater. Opportunity spent nearly 15 years roaming Mars, discovering hematite 'blueberries' and traversing over 45 kilometers."
                },
                {
                    type: "facts",
                    title: "Unmatched Discoveries",
                    items: [
                        "Found hematite spherules dubbed 'blueberries', providing the earliest irrefutable proof of past liquid water on Mars.",
                        "Completed the first full marathon distance (42.195 km) ever driven on an extraterrestrial world.",
                        "Explored giant craters including Endurance, Victoria, and the colossal 22-kilometer Endeavour crater.",
                        "Her poignant final telemetry to Earth was translated as: 'My battery is low and it's getting dark.'"
                    ]
                },
                {
                    type: "timeline",
                    title: "A Fifteen-Year Odyssey",
                    events: [
                        { year: "January 25, 2004", title: "Hole-in-One Landing", description: "Touched down in Eagle Crater, Meridiani Planum." },
                        { year: "March 2015", title: "Off-World Marathon", description: "Crossed the official Olympic marathon mark of 42.195 km." },
                        { year: "June 2018", title: "Global Dust Storm", description: "A planetary-scale dust storm blanketed the skies in darkness." },
                        { year: "February 13, 2019", title: "Mission Farewell", description: "NASA declared the mission complete after sending over 1,000 recovery signals." }
                    ]
                },
                {
                    type: "numbers",
                    title: "Opportunity by the Numbers",
                    stats: [
                        { value: "45.16 km", label: "Total Distance Driven on Mars" },
                        { value: "5,352", label: "Martian Sols of Exploration" },
                        { value: "217,594", label: "Raw Images Returned" },
                        { value: "55x", label: "Original Mission Duration Extended" }
                    ]
                }
            ]
        },
        ar: {
            name: "المركبة أوبورتونيتي (Opportunity)",
            location: "المريخ",
            year: "2018",
            story_parts: {
                intro: "هنا تكتب القصة باختصار...",
                mission: "هنا يكتب سبب الإرسال...",
                achievement: "هنا يكتب الإنجاز ومدة العمل...",
                ending: "هنا يكتب كيف انتهت..."
            },
            chapters: [
                {
                    type: "text",
                    title: "عداءة الماراثون على الكوكب الأحمر",
                    content: "هبطت أوبورتونيتي في سهل ميريدياني بلانوم، واستقرت داخل فوهة إيجل الصغيرة في هبوط وصف بأنه 'ضربة حفرة واحدة' في الفضاء. واصلت استكشاف المريخ لنحو 15 عاماً كاملة، كاشفة حبيبات الهيماتيت الصخرية وقاطعة أكثر من 45 كيلومتراً."
                },
                {
                    type: "facts",
                    title: "إنجازات علمية غير مسبوقة",
                    items: [
                        "اكتشفت كرات الهيماتيت الزرقاء متناهية الصغر، والتي شكّلت أول دليل قاطع على وجود ماء سائل في ماضي المريخ.",
                        "أول مركبة في تاريخ البشرية تقطع مسافة ماراثون أولمبي كامل (42.195 كم) على سطح كوكب آخر.",
                        "انحدرت إلى أعماق فوهات هائلة مثل فيكتوريا وإنديفور لدراسة طبقات الصخور الرسوبية.",
                        "لُخصت آخر إشاراتها اللاسلكية المؤثرة بعبارة: 'بطاريتي تنفد، وحلّ الظلام من حولي'."
                    ]
                },
                {
                    type: "timeline",
                    title: "15 عاماً من المغامرة",
                    events: [
                        { year: "25 يناير 2004", title: "الهبوط التاريخي", description: "الاستقرار داخل فوهة إيجل في سهل ميريدياني." },
                        { year: "مارس 2015", title: "ماراثون الفضاء", description: "تجاوز حاجز 42.195 كيلومتراً على أرض المريخ." },
                        { year: "يونيو 2018", title: "عاصفة الغبار العظمى", description: "عاصفة ترابية حجبت أشعة الشمس تماماً عن سطح الكوكب." },
                        { year: "13 فبراير 2019", title: "الوداع الأخير", description: "إعلان ناسا انتهاء المهمة بعد إرسال أكثر من 1000 نداء محاولة إيقاظ." }
                    ]
                },
                {
                    type: "numbers",
                    title: "أوبورتونيتي في أرقام",
                    stats: [
                        { value: "45.16 كم", label: "المسافة الإجمالية المقطوعة على المريخ" },
                        { value: "5,352", label: "يوماً مريخياً قضتها في الاستكشاف" },
                        { value: "217,594", label: "صورة علمية أُرسلت إلى الأرض" },
                        { value: "55 ضعفاً", label: "تجاوز العمر الافتراضي الأصلي للمهمة" }
                    ]
                }
            ]
        }
    },
    {
        id: "ingenuity",
        location: "Mars",
        image: "assets/images/ingenuity.png",
        model3d: "assets/models/ingenuity.glb",
        coordinates: {
            lat: 18.4447,
            lng: 77.4508
        },
        en: {
            name: "Ingenuity Helicopter",
            location: "Mars",
            year: "2024",
            story_parts: {
                intro: "Write the brief story/introduction here...",
                mission: "Write the reason for sending here...",
                achievement: "Write the achievements and duration here...",
                ending: "Write how it ended here..."
            },
            chapters: [
                {
                    type: "text",
                    title: "The Wright Brothers Moment on Mars",
                    content: "On April 19, 2021, the tiny 1.8 kg helicopter Ingenuity made history with the first powered, controlled flight on another world at 'Wright Brothers Field' inside Jezero Crater. Intended for only 5 test flights, it soared 72 times across the thin Martian atmosphere."
                },
                {
                    type: "facts",
                    title: "Aerial Marvel in Thin Air",
                    items: [
                        "Martian atmosphere is less than 1% density of Earth's, requiring twin counter-rotating carbon fiber blades spinning at 2,500 RPM.",
                        "Carried a tiny piece of muslin fabric from the wing of the 1903 Wright Brothers flyer taped beneath its solar panel.",
                        "Served as an aerial scout for the Perseverance rover, scouting steep terrain and sand dunes.",
                        "Equipped with commercial smartphone processors that were orders of magnitude faster than typical interplanetary computers."
                    ]
                },
                {
                    type: "timeline",
                    title: "Flights Across Jezero",
                    events: [
                        { year: "February 18, 2021", title: "Touchdown with Perseverance", description: "Arrived tucked beneath the belly of the rover in Jezero Crater." },
                        { year: "April 19, 2021", title: "Historic First Hover", description: "Ascended 3 meters, hovered, and landed smoothly." },
                        { year: "April 2023", title: "Flight 50 Milestone", description: "Surpassed fifty flights, reaching speeds of 23 km/h." },
                        { year: "January 18, 2024", title: "The 72nd and Final Flight", description: "Sustained rotor blade damage during landing, remaining standing as an eternal station." }
                    ]
                },
                {
                    type: "numbers",
                    title: "Ingenuity in Numbers",
                    stats: [
                        { value: "72", label: "Completed Flights (Target: 5)" },
                        { value: "17.0 km", label: "Total Distance Flown" },
                        { value: "128.8 min", label: "Total Flight Air Time" },
                        { value: "24 m", label: "Maximum Altitude Reached" }
                    ]
                }
            ]
        },
        ar: {
            name: "مروحية إنجنويتي (Ingenuity)",
            location: "المريخ",
            year: "2024",
            story_parts: {
                intro: "هنا تكتب القصة باختصار...",
                mission: "هنا يكتب سبب الإرسال...",
                achievement: "هنا يكتب الإنجاز ومدة العمل...",
                ending: "هنا يكتب كيف انتهت..."
            },
            chapters: [
                {
                    type: "text",
                    title: "لحظة الأخوان رايت فوق المريخ",
                    content: "في 19 أبريل 2021، دخلت المروحية الصغيرة 'إنجنويتي' (1.8 كجم) التاريخ بتحقيق أول تحليق ميكانيكي موجه على كوكب آخر في حقل الأخوان رايت داخل فوهة جيزيرو. ورغم أنها صُممت لخمس رحلات تجريبية فقط، إلا أنها حلقت 72 مرة في سماء المريخ الرقيقة."
                },
                {
                    type: "facts",
                    title: "معجزة الطيران في غلاف جوي هش",
                    items: [
                        "كثافة غلاف المريخ أقل من 1% من الأرض، مما تطلب شفرات ألياف كربونية تدور بسرعة تفوق 2500 دورة في الدقيقة.",
                        "حملت قطعة قماش صغيرة من جناح طائرة الأخوان رايت الأولى لعام 1903 ملصقة أسفل لوحها الشمسي.",
                        "عملت ككشافة جوية متقدمة لمركبة بيرسيفيرنس، مستكشفة التضاريس الوعرة والكثبان الرملية الخطيرة.",
                        "زُوّدت بمعالج هواتف ذكية تجاري بقدرات حسابية تفوق حواسيب الفضاء التقليدية بمئات المرات."
                    ]
                },
                {
                    type: "timeline",
                    title: "مسار التحليق فوق فوهة جيزيرو",
                    events: [
                        { year: "18 فبراير 2021", title: "الوصول في بطن بيرسيفيرنس", description: "الهبوط في فوهة جيزيرو مثبتة أسفل المركبة الأم." },
                        { year: "19 أبريل 2021", title: "التحليق التاريخي الأول", description: "الارتفاع 3 أمتار والتحليق لمدة 39 ثانية بنجاح باهر." },
                        { year: "أبريل 2023", title: "الرحلة رقم 50", description: "تجاوز حاجز 50 رحلة جوية وبلوغ سرعة 23 كم/ساعة." },
                        { year: "18 يناير 2024", title: "الرحلة رقم 72 والوداع", description: "تضرر طرف إحدى الشفرات أثناء الهبوط، لتبقى صامدة كمحطة علمية خالدة." }
                    ]
                },
                {
                    type: "numbers",
                    title: "إنجنويتي في أرقام",
                    stats: [
                        { value: "72", label: "رحلة جوية ناجحة (المخطط: 5)" },
                        { value: "17.0 كم", label: "إجمالي المسافة المحلقة في الجو" },
                        { value: "128.8 دقيقة", label: "المدة الإجمالية في سماء المريخ" },
                        { value: "24 متراً", label: "أعلى ارتفاع سجلته فوق السطح" }
                    ]
                }
            ]
        }
    }
];
