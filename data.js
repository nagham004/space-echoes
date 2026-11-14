/**
 * Space Echoes — Story Sequence & Official NASA Sources (EN / AR)
 * Slide order: astronaut_intro -> motivations -> impossible_challenge ->
 *   engineering_solution -> journey -> memories -> timeline -> ending -> sources
 */

const uiText = {
    en: {
        siteTitle: "Left in Silence, Remembered in Science",
        siteTitlePrefix: "Left in Silence, ",
        siteTitleHighlight: "Remembered in Science",
        siteDesc: "Traces of NASA missions still stand witness to humanity's greatest adventures beyond Earth.",
        exploreMoon: "Explore The Moon",
        exploreMars: "Explore Mars",
        backToPlanets: "← Back to Planets Overview",
        langToggle: "English",
        moonSphereAria: "Interactive sphere of the Moon. Drag or use arrow keys to rotate, and mouse wheel or + and - to zoom.",
        marsSphereAria: "Interactive sphere of Mars. Drag or use arrow keys to rotate, and mouse wheel or + and - to zoom.",
        overviewSphereAria: "Interactive 3D view of the Moon and Mars. Hover to glow, click Mars to bring it forward, or click to zoom into full screen.",
        overviewHint: "Hover over the Moon to make it glow · Click Mars to bring it forward · Click to zoom in and explore landing sites",
        exploreHint: "Drag to rotate the globe · or use arrow keys (Enter to select marked artifact)",
        discoverStory: "Discover the Story",
        nextChapter: "Next Chapter",
        prevChapter: "Previous Chapter",
        finishStory: "Test your knowledge",
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
        scrollPrompt: "Discover what remains there",
        moonQuote: "Eternal footprints on silver soil",
        marsQuote: "A journey into the heart of red dust",
        skipLink: "Skip to main content",
        challengeBadge: "NASA Challenge",
        challengeOfficialName: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars",
        challengeArName: "",
        attributionOfficial: "Powered by NASA Open Data & 3D Assets",
        attributionAr: "",
        disclaimer: "This project is not endorsed by NASA",
        sourcesCreditsBtn: "Sources & credits",
        mobileSourcesBtn: "Sources",
        langToggleAria: "Switch language to Arabic",
        langSwitchedAnnouncement: "Switched to English"
    },
    ar: {
        siteTitle: "تُركت في صمت، خُلِّدت في العلم",
        siteTitlePrefix: "تُركت في صمت، ",
        siteTitleHighlight: "خُلِّدت في العلم",
        siteDesc: "ما زالت آثار بعثات ناسا شاهدة على أعظم مغامرات الإنسان خارج الأرض.",
        exploreMoon: "استكشف القمر",
        exploreMars: "استكشف المريخ",
        backToPlanets: "→ نظرة عامة على الكواكب",
        langToggle: "العربية",
        moonSphereAria: "كرة تفاعلية للقمر. اسحب أو استخدم مفاتيح الأسهم للتدوير، وعجلة الفأرة أو + و - للتكبير.",
        marsSphereAria: "كرة تفاعلية للمريخ. اسحب أو استخدم مفاتيح الأسهم للتدوير، وعجلة الفأرة أو + و - للتكبير.",
        overviewSphereAria: "عرض ثلاثي الأبعاد للقمر والمريخ. مرر الفأرة للتوهج، انقر على المريخ لتقديمه، أو انقر على الجرم للتكبير والاستكشاف.",
        overviewHint: "مرر الفأرة على القمر ليتوهج · انقر على المريخ ليتقدم للأمام · انقر على الجرم للتكبير واستكشاف المواقع",
        exploreHint: "اسحب لتدوير الكرة · أو استخدم الأسهم (Enter لاختيار المركبة المحددة)",
        discoverStory: "اكتشف القصة",
        nextChapter: "الفصل التالي",
        prevChapter: "الفصل السابق",
        finishStory: "اختبر معلوماتك",
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
        scrollPrompt: "اكتشف ما بقي هناك",
        moonQuote: "آثار خالدة على تربة فضية",
        marsQuote: "رحلة في قلب الغبار الأحمر",
        skipLink: "الانتقال إلى المحتوى الرئيسي",
        challengeBadge: "تحدي ناسا",
        challengeOfficialName: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars",
        challengeArName: "مهجورة لكن غير منسية: سرد قصص معدات ناسا المتروكة على القمر والمريخ",
        attributionOfficial: "Powered by NASA Open Data & 3D Assets",
        attributionAr: "مدعوم ببيانات ناسا المفتوحة ومجسماتها ثلاثية الأبعاد",
        disclaimer: "هذا المشروع غير مُعتمد من ناسا",
        sourcesCreditsBtn: "المصادر والاعتمادات",
        mobileSourcesBtn: "المصادر",
        langToggleAria: "Switch language to English",
        langSwitchedAnnouncement: "تم التبديل إلى العربية"
    }
};

const slideTitles = {
    "ar": {
        "astronaut_intro": "رسالة من رائد الفضاء",
        "motivations": "لماذا أُرسلت؟",
        "impossible_challenge": "التحدي المستحيل",
        "engineering_solution": "الحل الهندسي",
        "journey": "الرحلة",
        "memories": "لحظات لا تُنسى",
        "timeline": "الجدول الزمني",
        "ending": "كيف انتهت القصة؟",
        "astronaut_conclusion": "رسالة ختامية من رائد الفضاء",
        "sources": "المصادر"
    },
    "en": {
        "astronaut_intro": "A message from the astronaut",
        "motivations": "Why was it sent?",
        "impossible_challenge": "The impossible challenge",
        "engineering_solution": "The engineering solution",
        "journey": "The journey",
        "memories": "Unforgettable moments",
        "timeline": "Timeline",
        "ending": "How did it end?",
        "astronaut_conclusion": "A final message from the astronaut",
        "sources": "Sources"
    }
};

const spaceArtifacts = [
    {
        "id": "apollo_lm",
        "location": "Moon",
        "image": "assets/images/apollo_lm.png",
        "model3d": "assets/models/Moon/apollo-lunar-module/apollo_lm.glb",
        "coordinates": {
            "lat": 0.67416,
            "lng": 23.47314
        },
        "sources": [
            {
                "title_en": "NASA NSSDCA — Apollo 11 Lunar Module / EASEP",
                "title_ar": "ناسا NSSDCA — مركبة الهبوط القمرية أبولو 11 / EASEP",
                "url": "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C"
            }
        ],
        "en": {
            "name": "Apollo Lunar Modules",
            "location": "Moon",
            "year": "1969",
            "brief_story": "The first crewed vehicle to land on the Moon. It set Neil Armstrong and Buzz Aldrin down in the Sea of Tranquility, stayed 21 hours 36 minutes, and left its descent stage and a small science station behind.",
            "astronaut_intro": [
                "Welcome, future explorers! I’m an astronaut, and today I’ll tell you about a spacecraft unlike any you’ve imagined.",
                "No seats, thin legs, and yet it did what nobody had done before. Its official name is the Apollo 11 Lunar Module, also known as “Eagle.”"
            ],
            "motivations": [
                "It was the first crewed vehicle designed to land on the Moon, carrying two men: Commander Neil Armstrong and lunar module pilot Buzz Aldrin.",
                "It also carried a science package called EASEP to leave on the lunar surface, plus tools for collecting rock and soil samples."
            ],
            "impossible_challenge": [
                "The big question: how do two men go down to the surface of the Moon and then come back up to the command module?",
                "Landing isn’t enough. The vehicle also had to lift off from the Moon to bring them home."
            ],
            "engineering_solution": [
                "The answer was a vehicle in two stages that worked together until the moment of separation.",
                "The descent stage, below: an octagonal prism 4.2 m across, with four legs holding it 1.5 m above the surface and the landing engine inside. It also served as the launch platform for the stage above.",
                "The ascent stage, above: a pressurized cabin of 6.65 cubic meters for the crew, and the engine that took the two men back. There were no seats."
            ],
            "journey": [
                "It launched on 16 July 1969 on a Saturn 5 from Cape Canaveral.",
                "On 20 July, Eagle separated from the command module, and its descent engine fired for 756.3 seconds to begin the descent.",
                "It touched down in the Sea of Tranquility at 20:17:40 UT. Armstrong reported: “Houston, Tranquility Base here - the Eagle has landed.”"
            ],
            "memories": [
                "Hours later, Armstrong stepped onto the Moon at 02:56:15 UT on 21 July and said: “That's one small step for man, one giant leap for mankind.”",
                "He first collected a small contingency sample of soil. Nineteen minutes later Aldrin followed and called the surface “Magnificent desolation.”",
                "They unveiled a plaque ending with “We came in peace for all mankind,” put up an American flag, and spoke with President Nixon by radiotelephone.",
                "They set up EASEP, collected 21.55 kg of lunar rock and soil, and walked about 250 meters in total."
            ],
            "timeline": [
                {
                    "when": "16 Jul 1969",
                    "event": "Launch on a Saturn 5 from Cape Canaveral"
                },
                {
                    "when": "20 Jul · 20:17:40 UT",
                    "event": "Landing in the Sea of Tranquility"
                },
                {
                    "when": "21 Jul · 02:56:15 UT",
                    "event": "Armstrong steps onto the Moon"
                },
                {
                    "when": "21 Jul · 04:40:39 UT",
                    "event": "EASEP is switched on by ground command"
                },
                {
                    "when": "21 Jul · 17:54:01 UT",
                    "event": "Liftoff, after 21 hours 36 minutes on the Moon"
                },
                {
                    "when": "22 Jul · 00:01:01 UT",
                    "event": "The ascent stage is jettisoned into lunar orbit"
                },
                {
                    "when": "3 Aug 1969",
                    "event": "EASEP transmission stopped before lunar sunset"
                },
                {
                    "when": "27 Aug 1969",
                    "event": "EASEP stops accepting commands; the experiment ends"
                }
            ],
            "ending": [
                "When the work was done, the ascent stage lifted off after 21 hours 36 minutes on the Moon and docked with the command module, flown by Michael Collins.",
                "The descent stage had served as the launch platform for the ascent stage, and it was left behind on the Moon.",
                "The ascent stage was then jettisoned into lunar orbit on 22 July. Its fate is not known, but it is assumed to have crashed into the Moon within one to four months.",
                "Ground control stopped EASEP’s transmissions on 3 August, before lunar sunset, as its solar-powered energy began to drop as predicted. It was switched on again, but on 27 August it no longer accepted commands and the experiment ended.",
                "And you? If you could leave one instrument on the Moon, what would you choose?"
            ],
            "astronaut_conclusion": "Though we left the Eagle's platform alone in the Sea of Tranquility, its legacy lives on as our first step among the stars. Now, it's your turn to take the next step!",
            "quiz": [
                {
                    "question": "What was the biggest challenge facing the Apollo Lunar Modules when landing?",
                    "options": ["Strong winds on the Moon", "How two men could land and then return to the command module", "High gravity", "Building a huge launch pad"],
                    "correct_index": 1
                },
                {
                    "question": "What happened to the descent stage (lower part) after the mission ended?",
                    "options": ["It returned to Earth", "It exploded in space", "It was left behind on the Moon as a launch platform", "It fell into the ocean"],
                    "correct_index": 2
                },
                {
                    "question": "How long did Apollo 11 (Eagle) spend on the lunar surface?",
                    "options": ["5 days", "21 hours and 36 minutes", "A full month", "Only two hours"],
                    "correct_index": 1
                }
            ]
        },
        "ar": {
            "name": "مركبات الهبوط القمرية (أبولو)",
            "location": "القمر",
            "year": "1969",
            "brief_story": "أول مركبة تحمل بشراً وتهبط بهم على القمر. أنزلت نيل أرمسترونغ وباز ألدرين في بحر الهدوء، وبقيت 21 ساعة و36 دقيقة، وتركت خلفها مرحلة الهبوط ومحطة علمية صغيرة.",
            "astronaut_intro": [
                "أهلاً بكم يا مستكشفي المستقبل! أنا رائد فضاء، وسأحكي لكم اليوم عن مركبة لا تشبه أي سفينة فضاء تتخيلونها.",
                "بلا مقاعد، وبأرجل رفيعة، ومع ذلك فعلت ما لم يفعله أحد قبلها. اسمها الرسمي مركبة الهبوط القمرية أبولو 11، وتُعرف أيضاً باسم «إيغل» (النسر)."
            ],
            "motivations": [
                "كانت أول مركبة مأهولة مصممة لتهبط على القمر، وحملت رجلين: القائد نيل أرمسترونغ وطيار المركبة باز ألدرين.",
                "وحملت معها أيضاً حزمة تجارب علمية اسمها «إيسيب» (EASEP) لتُترك على سطح القمر، وأدوات لجمع عينات الصخور والتربة."
            ],
            "impossible_challenge": [
                "السؤال الكبير: كيف ينزل رجلان إلى سطح القمر، ثم يعودان منه إلى المركبة الأم؟",
                "الهبوط وحده لا يكفي، فالمركبة يجب أن تقلع من القمر أيضاً لتعيدهما."
            ],
            "engineering_solution": [
                "الحل كان مركبة من مرحلتين تعملان معاً حتى لحظة الانفصال.",
                "مرحلة الهبوط في الأسفل: مبنى ثماني الأضلاع عرضه 4.2 متر، بأربعة أرجل ترفعه 1.5 متر عن السطح، وفيه محرك الهبوط. وكانت أيضاً منصة الإقلاع للمرحلة العلوية.",
                "ومرحلة الصعود في الأعلى: كابينة مضغوطة بحجم 6.65 متر مكعب للطاقم، ومحرك الصعود الذي أعاد الرجلين. ولا مقاعد فيها."
            ],
            "journey": [
                "انطلقت المركبة في 16 يوليو 1969 على صاروخ ساتورن 5 من كيب كانافيرال.",
                "وفي 20 يوليو انفصلت «إيغل» عن المركبة الأم، وعمل محرك الهبوط 756.3 ثانية لتبدأ رحلة الهبوط.",
                "ولامست سطح القمر في بحر الهدوء الساعة 20:17:40 بالتوقيت العالمي. وأبلغ أرمسترونغ: «هيوستن، هنا قاعدة الهدوء — النسر قد هبط»."
            ],
            "memories": [
                "بعد ساعات خرج أرمسترونغ إلى القمر، في 21 يوليو الساعة 02:56:15 بالتوقيت العالمي، وقال: «إنها خطوة صغيرة لإنسان، وقفزة عملاقة للبشرية».",
                "وجمع أولاً عينة سريعة من التربة. وبعد 19 دقيقة لحق به ألدرين ووصف المكان بأنه «وحشة مهيبة».",
                "وكشفا عن لوحة تنتهي بعبارة «لقد جئنا بسلام من أجل البشرية جمعاء»، ورفعا العلم الأمريكي، وتحدثا مع الرئيس نيكسون عبر الراديو.",
                "ونشرا محطة التجارب القمرية (إيسيب)، وجمعا 21.55 كجم من صخور القمر وتربته، وقطعا نحو 250 متراً في المجموع."
            ],
            "timeline": [
                {
                    "when": "16 يوليو 1969",
                    "event": "الإطلاق بصاروخ ساتورن 5 من كيب كانافيرال"
                },
                {
                    "when": "20 يوليو · 20:17:40 ت.ع",
                    "event": "الهبوط في بحر الهدوء"
                },
                {
                    "when": "21 يوليو · 02:56:15 ت.ع",
                    "event": "أرمسترونغ يخطو على القمر"
                },
                {
                    "when": "21 يوليو · 04:40:39 ت.ع",
                    "event": "تشغيل محطة التجارب بأمر من الأرض"
                },
                {
                    "when": "21 يوليو · 17:54:01 ت.ع",
                    "event": "الإقلاع بعد 21 ساعة و36 دقيقة على القمر"
                },
                {
                    "when": "22 يوليو · 00:01:01 ت.ع",
                    "event": "إلقاء مرحلة الصعود في مدار القمر"
                },
                {
                    "when": "3 أغسطس 1969",
                    "event": "إيقاف إرسال المحطة قبل غروب الشمس القمري"
                },
                {
                    "when": "27 أغسطس 1969",
                    "event": "توقف المحطة عن الاستجابة للأوامر وانتهاء التجربة"
                }
            ],
            "ending": [
                "حين انتهى العمل أقلعت مرحلة الصعود بعد 21 ساعة و36 دقيقة على القمر، والتحمت بالمركبة الأم التي كان يقودها مايكل كولينز.",
                "أما مرحلة الهبوط فكانت منصة الإقلاع للمرحلة العلوية، وتُركت على القمر.",
                "ثم أُلقيت مرحلة الصعود في مدار القمر يوم 22 يوليو. ومصيرها غير معروف، لكن يُفترض أنها اصطدمت بسطح القمر خلال شهر إلى أربعة أشهر.",
                "وأوقفت الأرض إرسال المحطة العلمية في 3 أغسطس قبل غروب الشمس القمري، لأنها تعمل بالطاقة الشمسية وبدأت طاقتها تنخفض كما كان متوقعاً. ثم أُعيد تشغيلها، وفي 27 أغسطس لم تعد تستجيب فانتهت التجربة.",
                "وأنتم، لو كان لكم أن تتركوا جهازاً واحداً على القمر، ماذا تختارون؟"
            ],
            "astronaut_conclusion": "رغم أننا تركنا منصة النسر وحيدة في بحر الهدوء، إلا أن أثرها سيظل حياً كأول خطوة لنا بين النجوم. حان دوركم لتخطوا الخطوة التالية!",
            "quiz": [
                {
                    "question": "ما هو التحدي الأكبر الذي واجه مركبات أبولو عند الهبوط؟",
                    "options": ["الرياح الشديدة على القمر", "كيفية هبوط رجلين ثم عودتهما للمركبة الأم", "الجاذبية العالية", "بناء منصة إطلاق ضخمة"],
                    "correct_index": 1
                },
                {
                    "question": "ماذا حدث لمرحلة الهبوط (الجزء السفلي) بعد انتهاء المهمة؟",
                    "options": ["عادت إلى الأرض", "انفجرت في الفضاء", "تُركت على القمر لتكون منصة إقلاع", "سقطت في المحيط"],
                    "correct_index": 2
                },
                {
                    "question": "كم كانت المدة التي قضتها مركبة أبولو 11 (إيغل) على سطح القمر؟",
                    "options": ["5 أيام", "21 ساعة و36 دقيقة", "شهر كامل", "ساعتين فقط"],
                    "correct_index": 1
                }
            ]
        }
    },
    {
        "id": "lrv",
        "location": "Moon",
        "image": "assets/images/lrv.png",
        "model3d": "assets/models/Moon/lunar-roving-vehicles/lunar_rover_3d_model.glb",
        "coordinates": {
            "lat": 26.1322,
            "lng": 3.6339
        },
        "sources": [
            {
                "title_en": "NASA NSSDCA — Apollo 15 Lunar Module / ALSEP",
                "title_ar": "ناسا NSSDCA — مركبة الهبوط القمرية أبولو 15 / ALSEP",
                "url": "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C"
            }
        ],
        "en": {
            "name": "Lunar Roving Vehicles (LRV)",
            "location": "Moon",
            "year": "1971",
            "brief_story": "The Lunar Roving Vehicle carried by Falcon on Apollo 15. It was the first time a vehicle of this kind was used on the Moon, and over three drives the astronauts covered 27.9 km.",
            "astronaut_intro": [
                "Welcome back! Buckle up, because I’m going to tell you about a vehicle with wheels that never drove on a paved road.",
                "Its road was the surface of the Moon itself. It’s called the Lunar Roving Vehicle, or LRV."
            ],
            "motivations": [
                "It was carried by Falcon, the Apollo 15 lunar module, with Commander David R. Scott and lunar module pilot James B. Irwin on board, the seventh and eighth men to walk on the Moon.",
                "The mission included geologic sample collection, surface photography, soil mechanics investigations, and an experiment to collect solar wind particles.",
                "The rover was used to explore regions within 5 km of the landing site."
            ],
            "impossible_challenge": [
                "Landing on the Moon isn’t enough for wide exploration.",
                "So how do the astronauts reach regions up to 5 km from Falcon, and get back?"
            ],
            "engineering_solution": [
                "The answer: a rover that travels inside the descent stage of Falcon. The descent stages of Apollo 15, 16 and 17 carried a lunar rover.",
                "On the Moon, the rover was unloaded, deployed and then driven by the astronauts. It was the first time a vehicle of this type had been used."
            ],
            "journey": [
                "Apollo 15 launched on 26 July 1971 on a Saturn 5 from Cape Canaveral.",
                "On 30 July, Falcon separated from the command module, piloted by Alfred Worden, at 18:13:30 UT.",
                "It landed at 22:16:29 UT in the Mare Imbrium region, at the foot of the Apennine mountain range."
            ],
            "memories": [
                "Two hours after landing, Scott stood at the upper hatch for 33 minutes, describing and photographing the terrain.",
                "On the first drive, the rover was unloaded and driven by the astronauts for the first time. Over the three drives (10.3, 12.5 and 5.1 km) they covered 27.9 km and collected 77.31 kg of samples.",
                "After the final moonwalk, Scott performed a televised demonstration: a hammer and a feather falling at the same rate in the lunar vacuum.",
                "The astronauts also left a plaque and a small figure in memory of fourteen American and Soviet space explorers who had died."
            ],
            "timeline": [
                {
                    "when": "26 Jul 1971",
                    "event": "Launch on a Saturn 5 from Cape Canaveral"
                },
                {
                    "when": "30 Jul · 22:16:29 UT",
                    "event": "Falcon lands in Mare Imbrium"
                },
                {
                    "when": "31 Jul",
                    "event": "Drive 1: 10.3 km"
                },
                {
                    "when": "1 Aug",
                    "event": "Drive 2: 12.5 km"
                },
                {
                    "when": "2 Aug",
                    "event": "Drive 3: 5.1 km"
                },
                {
                    "when": "2 Aug · 17:11:22 UT",
                    "event": "Falcon lifts off after 66 hours 55 minutes on the Moon"
                },
                {
                    "when": "3 Aug · 01:04:14 UT",
                    "event": "Falcon is jettisoned in lunar orbit and hits the Moon about two hours later"
                }
            ],
            "ending": [
                "The third drive, on 2 August, is the last one recorded on the NASA page we’re telling this from.",
                "Then Falcon lifted off after 66 hours 55 minutes on the Moon. After docking with the command module it was jettisoned in lunar orbit on 3 August and hit the surface about two hours later.",
                "And what happened to the rover itself afterwards? The NASA page we’re telling this from doesn’t say.",
                "If the choice were yours, which lunar crater would you visit first?"
            ],
            "astronaut_conclusion": "Our lunar rovers are still up there, parked in silence and waiting to be awakened. Perhaps you'll be the ones to drive them in the future!",
            "quiz": [
                {
                    "question": "How did the Lunar Roving Vehicle (LRV) travel to the Moon?",
                    "options": ["On a separate rocket", "It flew alongside the command module", "Astronauts built it by hand on the Moon", "Folded inside the descent stage of Falcon"],
                    "correct_index": 3
                },
                {
                    "question": "Where did this wheeled vehicle drive?",
                    "options": ["On pre-paved roads", "On the surface of the Moon itself", "Inside the space station", "On lunar ice"],
                    "correct_index": 1
                },
                {
                    "question": "What was the total distance the astronauts drove in the rover over its three drives?",
                    "options": ["5 kilometers", "100 kilometers", "27.9 kilometers", "10.3 kilometers"],
                    "correct_index": 2
                }
            ]
        },
        "ar": {
            "name": "مركبات التجوال القمرية (LRV)",
            "location": "القمر",
            "year": "1971",
            "brief_story": "مركبة التجوال القمرية التي حملتها «فالكون» ضمن مهمة أبولو 15. كانت أول مرة تُستعمل فيها مركبة من هذا النوع، وفي ثلاث جولات قطع الرائدان 27.9 كم.",
            "astronaut_intro": [
                "أهلاً بكم من جديد! اربطوا الأحزمة، فسأحكي لكم عن مركبة لها عجلات لكنها لم تسِر يوماً على طريق معبّد.",
                "طريقها كان سطح القمر نفسه. اسمها عربة التجوال القمرية."
            ],
            "motivations": [
                "حملتها «فالكون»، مركبة أبولو 15، وعلى متنها القائد ديفيد سكوت وطيار المركبة جيمس إيروين، سابع وثامن رجلين يمشيان على القمر.",
                "وشملت المهمة جمع عينات جيولوجية، وتصوير السطح، ودراسة خصائص تربة القمر، وتجربة لجمع جسيمات الرياح الشمسية.",
                "واستُعملت المركبة القمرية لاستكشاف مناطق تبعد حتى 5 كم عن موقع الهبوط."
            ],
            "impossible_challenge": [
                "الهبوط على القمر لا يكفي للاستكشاف الواسع.",
                "فكيف يصل الرائدان إلى مناطق تبعد حتى 5 كم عن «فالكون»، ثم يعودان إليها؟"
            ],
            "engineering_solution": [
                "الحل أن تسافر مركبة تجوال داخل مرحلة الهبوط في «فالكون». فقد حملت مراحل الهبوط في أبولو 15 و16 و17 مركبة تجوال.",
                "وعلى القمر أُنزلت المركبة ونُشرت ثم قادها الرائدان. وكانت المرة الأولى التي تُستعمل فيها مركبة من هذا النوع."
            ],
            "journey": [
                "انطلقت أبولو 15 في 26 يوليو 1971 على صاروخ ساتورن 5 من كيب كانافيرال.",
                "وفي 30 يوليو انفصلت «فالكون» عن المركبة الأم، التي كان يقودها ألفريد ووردن، الساعة 18:13:30 بالتوقيت العالمي.",
                "وهبطت الساعة 22:16:29 في منطقة بحر الأمطار عند سفح جبال أبنين."
            ],
            "memories": [
                "بعد ساعتين من الهبوط وقف سكوت 33 دقيقة عند الفتحة العلوية يصف التضاريس ويصوّرها.",
                "وفي أول جولة أُنزلت المركبة وقادها الرائدان لأول مرة. وفي الجولات الثلاث (10.3 و12.5 و5.1 كم) قطع الرائدان 27.9 كم، وجمعا 77.31 كجم من العينات.",
                "وبعد آخر جولة أجرى سكوت تجربة مصوّرة: أسقط مطرقة وريشة فسقطتا بالمعدل نفسه في فراغ القمر.",
                "وترك الرائدان لوحة وتمثالاً صغيراً تكريماً لأربعة عشر مستكشفاً أمريكياً وسوفييتياً فقدهم برنامجا الفضاء."
            ],
            "timeline": [
                {
                    "when": "26 يوليو 1971",
                    "event": "الإطلاق بصاروخ ساتورن 5 من كيب كانافيرال"
                },
                {
                    "when": "30 يوليو · 22:16:29 ت.ع",
                    "event": "هبوط «فالكون» في بحر الأمطار"
                },
                {
                    "when": "31 يوليو",
                    "event": "الجولة الأولى: 10.3 كم"
                },
                {
                    "when": "1 أغسطس",
                    "event": "الجولة الثانية: 12.5 كم"
                },
                {
                    "when": "2 أغسطس",
                    "event": "الجولة الثالثة: 5.1 كم"
                },
                {
                    "when": "2 أغسطس · 17:11:22 ت.ع",
                    "event": "إقلاع «فالكون» بعد 66 ساعة و55 دقيقة على القمر"
                },
                {
                    "when": "3 أغسطس · 01:04:14 ت.ع",
                    "event": "إلقاء «فالكون» في مدار القمر، وارتطامها بسطحه بعد نحو ساعتين"
                }
            ],
            "ending": [
                "كانت الجولة الثالثة، في 2 أغسطس، آخر جولة تسجّلها صفحة ناسا التي نحكي منها.",
                "ثم أقلعت «فالكون» بعد 66 ساعة و55 دقيقة على القمر. وبعد الالتحام بالمركبة الأم أُلقيت في مدار القمر يوم 3 أغسطس، وارتطمت بسطحه بعد نحو ساعتين.",
                "وما الذي حدث للمركبة القمرية نفسها بعد ذلك؟ لا تذكر ذلك صفحة ناسا التي نحكي منها.",
                "ولو كان القرار لكم، أي فوهة من فوهات القمر تزورونها أولاً؟"
            ],
            "astronaut_conclusion": "سياراتنا القمرية ما زالت هناك، مصطفة بصمت وتنتظر من يوقظها. ربما تكونون أنتم من سيقودها في المستقبل!",
            "quiz": [
                {
                    "question": "كيف سافرت مركبة التجوال القمرية إلى القمر؟",
                    "options": ["في صاروخ منفصل", "طارت بجوار المركبة الأم", "بناها الرواد يدوياً على القمر", "مطوية داخل مرحلة الهبوط للمركبة فالكون"],
                    "correct_index": 3
                },
                {
                    "question": "أين كانت تسير هذه المركبة ذات العجلات؟",
                    "options": ["على طرق معبدة مسبقاً", "على سطح القمر نفسه", "داخل محطة الفضاء", "على الجليد القمري"],
                    "correct_index": 1
                },
                {
                    "question": "كم المسافة الإجمالية التي قطعها الرائدان بالمركبة خلال جولاتها الثلاث؟",
                    "options": ["5 كيلومترات", "100 كيلومتر", "27.9 كيلومتراً", "10.3 كيلومترات"],
                    "correct_index": 2
                }
            ]
        },
        "coordinatesLabel": {
            "en": "Falcon landing site (Apollo 15)",
            "ar": "موقع هبوط Falcon (أبولو 15)"
        }
    },
    {
        "id": "spirit_opportunity",
        "location": "Mars",
        "image": "assets/images/spirit.png",
        "model3d": "assets/models/Mars/spirit-and-opportunity/spirit-and-opportunity.glb",
        "coordinates": {
            "lat": -14.5684,
            "lng": 175.4726
        },
        "coordinatesLabel": {
            "en": "Gusev: 14.57° S, 175.47° E · Meridiani: 1.95° S, 354.47° E",
            "ar": "Gusev: 14.57° S, 175.47° E · Meridiani: 1.95° S, 354.47° E"
        },
        "sources": [
            {
                "title_en": "NASA Science — Mars Exploration Rovers: Spirit and Opportunity",
                "title_ar": "ناسا للعلوم — مركبتا المريخ Spirit وOpportunity",
                "url": "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/"
            }
        ],
        "en": {
            "name": "Spirit & Opportunity Rovers",
            "location": "Mars",
            "year": "2004-2018",
            "brief_story": "Twin robot geologists sent to opposite sides of Mars to search for signs of past water. Spirit landed in Gusev Crater on 3 January 2004 (7.7 km, ended 2010), and Opportunity landed in Meridiani Planum on 24 January 2004 (45.16 km, silent June 2018).",
            "astronaut_intro": [
                "Welcome! Today we’re travelling to Mars, where two identical twin robots led the way.",
                "Their names are Spirit and Opportunity, and together they changed how we see the Red Planet."
            ],
            "motivations": [
                "Spirit and Opportunity are the two Mars Exploration Rovers, identical twin robots sent to look for signs of past water on Mars.",
                "They were targeted to sites on opposite sides of the planet that looked as though liquid water had once affected them: Spirit to Gusev Crater, a giant impact crater that may once have been a lake, and Opportunity to Meridiani Planum, where mineral deposits suggested a wet history."
            ],
            "impossible_challenge": [
                "The big question: how do we know whether water once changed the face of Mars, and whether its rocks carry a trace of a wet past?",
                "The answer was written in the rocks and soil, so two robot geologists had to study them piece by piece on opposite sides of the planet."
            ],
            "engineering_solution": [
                "The answer: two identical twin solar-powered robot geologists.",
                "Each was sent to a different side of Mars to study the rocks and soil at its site, using its solar panels for energy, so together they could uncover the history of water there."
            ],
            "journey": [
                "Spirit landed first on 3 January 2004 in Gusev Crater (Columbia Memorial Station), surrounded by crumpled airbags, and on the 16th Martian day (18/19 January 2004) captured a panorama showing the east hills about 3 km away.",
                "Opportunity landed on 24 January 2004 in Meridiani Planum, examined the outcrop behind its lander, exited Eagle Crater, and headed toward Endurance Crater."
            ],
            "memories": [
                "Together, the two rovers took more than 300,000 raw images and confirmed through the rock record that water was long-standing on ancient Mars.",
                "Spirit drove 7.7 km (4.8 miles), while Opportunity captured the 558-image “Lion King” panorama (over 75 MB) in 2004, took a wind-cleaned solar-panel self-portrait in March 2014, and drove 45.16 km (28.06 miles) — an off-Earth driving record."
            ],
            "timeline": [
                {
                    "when": "3 Jan 2004",
                    "event": "Spirit lands in Gusev Crater"
                },
                {
                    "when": "18/19 Jan 2004",
                    "event": "Spirit panorama of the landing site on Martian day 16"
                },
                {
                    "when": "24 Jan 2004",
                    "event": "Opportunity lands in Meridiani Planum"
                },
                {
                    "when": "2004 · Martian days 58 & 60",
                    "event": "Opportunity “Lion King” panorama of Eagle Crater"
                },
                {
                    "when": "2010",
                    "event": "Spirit concludes its mission after 7.7 km"
                },
                {
                    "when": "22-24 Mar 2014",
                    "event": "Opportunity self-portrait with wind-cleaned solar panels"
                },
                {
                    "when": "10 Jun 2018",
                    "event": "Opportunity’s last communication with Earth"
                },
                {
                    "when": "11 Oct 2026",
                    "event": "Perseverance passes Opportunity’s driving record"
                }
            ],
            "ending": [
                "In 2010, Spirit concluded its mission after driving 7.7 km on Mars (the NASA summary doesn’t give the reason).",
                "Opportunity kept exploring until June 2018, when a planet-wide dust storm blanketed its location; its last communication came on 10 June 2018 after about 14 years on Mars, and its distance record stood until Perseverance passed it on 11 October 2026.",
                "What the twins discovered remains: water was on Mars for a long time. So what will your generation discover?"
            ],
            "astronaut_conclusion": "Oppy's battery may have run out under the dust, but their exploratory spirit beats in every new mission we send. Mars is waiting for you!",
            "quiz": [
                {
                    "question": "What was the main goal of sending the twin rovers Spirit and Opportunity to Mars?",
                    "options": ["Searching for aliens", "Searching for signs of past water on Mars", "Building a space base", "Studying the planet's rings"],
                    "correct_index": 1
                },
                {
                    "question": "How did these two robot geologists get their power?",
                    "options": ["Solar power", "Nuclear fuel", "Regular batteries", "Wind power"],
                    "correct_index": 0
                },
                {
                    "question": "What remarkable off-Earth driving distance record did Opportunity achieve?",
                    "options": ["7.7 km", "100 km", "45.16 km", "20 km"],
                    "correct_index": 2
                }
            ]
        },
        "ar": {
            "name": "مركبتا سبيريت وأوبورتونيتي (Spirit & Opportunity)",
            "location": "المريخ",
            "year": "2004-2018",
            "brief_story": "روبوتان توأمان متطابقان أُرسلا إلى جهتين متقابلتين من المريخ للبحث عن علامات الماء القديم. هبطت سبيريت في فوهة غوسيف (3 يناير 2004، قطعت 7.7 كم، أنهت 2010)، وأوبورتونيتي في سهل ميريدياني بلانوم (24 يناير 2004، قطعت 45.16 كم، صمتت يونيو 2018).",
            "astronaut_intro": [
                "أهلاً بكم! اليوم نسافر إلى المريخ، حيث قاد الطريق روبوتان توأمان متطابقان.",
                "اسماهما سبيريت وأوبورتونيتي، ومعاً غيّرا نظرتنا إلى الكوكب الأحمر."
            ],
            "motivations": [
                "سبيريت وأوبورتونيتي هما مركبتا مهمة استكشاف المريخ، وقد أُرسلتا للبحث عن علامات الماء في ماضي الكوكب.",
                "واختيرت لهما مواقع على جهتين متقابلتين من الكوكب بدت وكأن ماءً سائلاً أثّر فيها قديماً: فوهة غوسيف لسبيريت (يُحتمل أنها كانت بحيرة)، وسهل ميريدياني بلانوم لأوبورتونيتي حيث تشير الرواسب المعدنية إلى ماضٍ رطب."
            ],
            "impossible_challenge": [
                "السؤال الكبير: كيف نعرف إن كان الماء قد غيّر وجه المريخ قديماً، وهل تحمل صخوره وتربته أثراً لماضٍ رطب؟",
                "الجواب كان مكتوباً في الصخور والتربة، فكان لا بد من جيولوجيين آليين يدرسانها قطعة قطعة على جانبي الكوكب."
            ],
            "engineering_solution": [
                "الحل: روبوتان جيولوجيان توأمان متطابقان يعملان بالطاقة الشمسية.",
                "أُرسل كل منهما إلى جهة متقابلة من المريخ ليدرس صخور موقعه وتربته معتمداً على ألواحه الشمسية، فيكشفا معاً تاريخ الماء على الكوكب."
            ],
            "journey": [
                "هبطت سبيريت أولاً في 3 يناير 2004 في فوهة غوسيف (محطة كولومبيا التذكارية) محاطة بوسائد هوائية مجعّدة، والتقطت في اليوم المريخي 16 (18/19 يناير 2004) بانوراما تُظهر التلال الشرقية على بعد نحو 3 كم.",
                "وهبطت أوبورتونيتي في 24 يناير 2004 في سهل ميريدياني بلانوم، وفحصت الصخور البارزة خلف منصة هبوطها، ثم خرجت من فوهة إيغل متجهة إلى فوهة إندورانس."
            ],
            "memories": [
                "التقطت المركبتان معاً أكثر من 300,000 صورة خام، وأكّدتا من سجل الصخور أن الماء بقي زمناً طويلاً على سطح المريخ قديماً.",
                "قطعت سبيريت 7.7 كم (4.8 ميل)، بينما التقطت أوبورتونيتي بانوراما «الأسد الملك» من 558 صورة (أكثر من 75 ميغابايت) عام 2004، وصورة ذاتية في مارس 2014 بعد أن نظّفت الرياح ألواحها، وقطعت 45.16 كم (28.06 ميلاً) كرقم قياسي خارج الأرض."
            ],
            "timeline": [
                {
                    "when": "3 يناير 2004",
                    "event": "هبوط سبيريت في فوهة غوسيف"
                },
                {
                    "when": "18/19 يناير 2004",
                    "event": "بانوراما سبيريت في اليوم المريخي 16"
                },
                {
                    "when": "24 يناير 2004",
                    "event": "هبوط أوبورتونيتي في سهل ميريدياني بلانوم"
                },
                {
                    "when": "2004 · اليومان 58 و60",
                    "event": "بانوراما «الأسد الملك» لفوهة إيغل"
                },
                {
                    "when": "2010",
                    "event": "سبيريت تنهي مهمتها بعد 7.7 كم"
                },
                {
                    "when": "22-24 مارس 2014",
                    "event": "صورة ذاتية لأوبورتونيتي بألواح نظّفتها الرياح"
                },
                {
                    "when": "10 يونيو 2018",
                    "event": "آخر اتصال لأوبورتونيتي بالأرض"
                },
                {
                    "when": "11 أكتوبر 2026",
                    "event": "بيرسيفيرانس تتجاوز رقم أوبورتونيتي القياسي"
                }
            ],
            "ending": [
                "في عام 2010 أنهت سبيريت مهمتها بعد أن قطعت 7.7 كم على المريخ (دون ذكر السبب في ملخص ناسا).",
                "واستمرت أوبورتونيتي نحو 14 سنة حتى غطّت عاصفة غبارية الكوكب في يونيو 2018، وكان آخر اتصال لها في 10 يونيو 2018، وبقي رقمها القياسي حتى تجاوزته بيرسيفيرانس في 11 أكتوبر 2026.",
                "لكن ما كشفه التوأمان يبقى: أن الماء كان على المريخ زمناً طويلاً. فماذا سيكتشف جيلكم أنتم؟"
            ],
            "astronaut_conclusion": "رغم أن بطارية أوبورتونيتي نفدت وغطاها الغبار، إلا أن روحهما الاستكشافية ما زالت تنبض في كل مهمة جديدة نرسلها. المريخ بانتظاركم!",
            "quiz": [
                {
                    "question": "ما هو الهدف الرئيسي من إرسال التوأم سبيريت وأوبورتونيتي إلى المريخ؟",
                    "options": ["البحث عن كائنات فضائية", "البحث عن علامات الماء في ماضي المريخ", "بناء قاعدة فضائية", "دراسة حلقات الكوكب"],
                    "correct_index": 1
                },
                {
                    "question": "كيف كان يحصل هذان الروبوتان الجيولوجيان على الطاقة؟",
                    "options": ["بالطاقة الشمسية", "بالوقود النووي", "بالبطاريات العادية", "بطاقة الرياح"],
                    "correct_index": 0
                },
                {
                    "question": "ما هو الرقم القياسي المذهل الذي حققته أوبورتونيتي كأطول مسافة قيادة خارج الأرض؟",
                    "options": ["7.7 كم", "100 كم", "45.16 كم", "20 كم"],
                    "correct_index": 2
                }
            ]
        }
    },
    {
        "id": "ingenuity",
        "location": "Mars",
        "image": "assets/images/ingenuity.png",
        "model3d": "assets/models/Mars/ingenuity-helicopter/ingenuity-helicopter.glb",
        "coordinates": {
            "lat": 18.4447,
            "lng": 77.4508
        },
        "sources": [
            {
                "title_en": "NASA Science — Ingenuity Mars Helicopter",
                "title_ar": "ناسا للعلوم — مروحية المريخ Ingenuity",
                "url": "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/"
            }
        ],
        "en": {
            "name": "Ingenuity Helicopter",
            "location": "Mars",
            "year": "2021-2024",
            "brief_story": "A small helicopter that rode to Mars beneath the Perseverance rover. It was meant to make no more than five test flights; it flew 72 over nearly three years.",
            "astronaut_intro": [
                "Welcome! This time we won’t drive. We’ll fly.",
                "I’ll tell you about a small helicopter that made history on Mars: Ingenuity."
            ],
            "motivations": [
                "Its goal was to demonstrate the first powered flight on Mars.",
                "It was a technology demonstration meant to make no more than five test flights in 30 days."
            ],
            "impossible_challenge": [
                "The biggest challenge: flying in an extremely thin atmosphere, less than 1 percent as dense as Earth’s."
            ],
            "engineering_solution": [
                "It weighed just 1.8 kg, and its rotors measured about 1.2 m from tip to tip.",
                "A solar panel charged its lithium-ion batteries, with enough energy for one 90-second flight per Martian day."
            ],
            "journey": [
                "NASA launched it on 30 July 2020 from Cape Canaveral, and it travelled strapped beneath the Perseverance rover.",
                "It landed on Mars on 18 February 2021 in Jezero Crater.",
                "On 29 March 2021 it rotated out from its horizontal position on the rover’s belly and extended into place. On 4 April it survived its first cold Martian night on its own."
            ],
            "memories": [
                "On 19 April 2021 it made the first powered, controlled flight on another planet, a feat called a “Wright Brothers moment.”",
                "After its tests, it became an aerial scout for scientists and rover planners, with its first scouting flight on 24 July 2021.",
                "It set records: distance (8 April 2022), altitude (5 October 2023) and groundspeed (12 October 2023).",
                "In total: 72 flights, 128.8 flying minutes, 17.0 km, and a top altitude of 24.0 m."
            ],
            "timeline": [
                {
                    "when": "30 Jul 2020",
                    "event": "Launch from Cape Canaveral"
                },
                {
                    "when": "18 Feb 2021",
                    "event": "Landing in Jezero Crater"
                },
                {
                    "when": "19 Apr 2021",
                    "event": "First flight"
                },
                {
                    "when": "7 May 2021",
                    "event": "Technology demonstration complete"
                },
                {
                    "when": "24 Jul 2021",
                    "event": "First scouting flight"
                },
                {
                    "when": "8 Apr 2022",
                    "event": "Distance record"
                },
                {
                    "when": "13 Apr 2023",
                    "event": "50 flights and beyond"
                },
                {
                    "when": "5 Oct 2023",
                    "event": "Altitude record"
                },
                {
                    "when": "12 Oct 2023",
                    "event": "Groundspeed record"
                },
                {
                    "when": "18 Jan 2024",
                    "event": "Last flight"
                },
                {
                    "when": "25 Jan 2024",
                    "event": "Mission completed"
                }
            ],
            "ending": [
                "Ingenuity flew for the last time on 18 January 2024.",
                "Its mission was completed on 25 January 2024, after nearly three years of aerial exploration and 72 historic flights.",
                "The NASA summary we’re telling this from doesn’t say why the mission ended.",
                "But the flight path goes on: Ingenuity paved the way for future aerial explorers, and NASA’s SkyFall mission will build on its success. Its limit was five flights, and it flew 72!"
            ],
            "astronaut_conclusion": "Ingenuity's blades have stopped spinning, but she proved that the Martian sky is no longer the limit for our ambition. Let your dreams fly high!",
            "quiz": [
                {
                    "question": "What was the biggest challenge facing Ingenuity's flight on Mars?",
                    "options": ["Thunderstorms", "Very strong gravity", "Lack of sunlight", "The extremely thin atmosphere"],
                    "correct_index": 3
                },
                {
                    "question": "How many test flights were planned, and how many did it actually fly?",
                    "options": ["10 planned and 10 flown", "5 planned and 72 flown", "72 planned and 5 flown", "1 planned and 100 flown"],
                    "correct_index": 1
                },
                {
                    "question": "How did Ingenuity travel from Earth to Mars?",
                    "options": ["Strapped beneath the Perseverance rover", "It flew on its own through space", "Inside a small separate rocket", "Carried by astronauts"],
                    "correct_index": 0
                }
            ]
        },
        "ar": {
            "name": "مروحية إنجنويتي (Ingenuity)",
            "location": "المريخ",
            "year": "2021-2024",
            "brief_story": "مروحية صغيرة سافرت إلى المريخ تحت بطن مركبة بيرسيفيرانس. كان مخططاً أن تطير خمس رحلات تجريبية على الأكثر، فطارت 72 رحلة خلال نحو ثلاث سنوات.",
            "astronaut_intro": [
                "أهلاً بكم! هذه المرة لن نسير على الأرض، بل سنطير.",
                "سأحكي لكم عن مروحية صغيرة صنعت تاريخاً على المريخ: إنجنويتي."
            ],
            "motivations": [
                "كان هدفها أن تُثبت إمكانية أول طيران مدعوم بمحرك على المريخ.",
                "وكانت تجربة تقنية يُفترض أن تطير 5 رحلات تجريبية على الأكثر خلال 30 يوماً."
            ],
            "impossible_challenge": [
                "التحدي الأكبر: أن تطير في جو رقيق جداً، كثافته أقل من 1% من كثافة جو الأرض."
            ],
            "engineering_solution": [
                "كتلتها 1.8 كجم فقط، وطول ريشتيها نحو 1.2 متر من الطرف إلى الطرف.",
                "وتشحن لوحة شمسية بطاريات ليثيوم أيون، وتكفي طاقتها لرحلة واحدة مدتها 90 ثانية في اليوم المريخي."
            ],
            "journey": [
                "أطلقتها ناسا في 30 يوليو 2020 من كيب كانافيرال، وسافرت مربوطة تحت بطن المركبة بيرسيفيرانس.",
                "وهبطت على المريخ في 18 فبراير 2021 في فوهة جيزيرو.",
                "وفي 29 مارس 2021 دارت من وضعها الأفقي تحت بطن المركبة وانتصبت في موضعها. وفي 4 أبريل نجت من أول ليلة باردة على المريخ بمفردها."
            ],
            "memories": [
                "في 19 أبريل 2021 نفّذت أول رحلة طيران مدعومة ومتحكَّم بها على كوكب آخر، ووصفوها بـ«لحظة الأخوين رايت».",
                "وبعد إتمام اختباراتها صارت مستكشفاً جوياً للعلماء ولمخططي مسار المركبة، وكانت أول رحلة استكشاف في 24 يوليو 2021.",
                "وسجّلت أرقاماً قياسية: المسافة (8 أبريل 2022)، والارتفاع (5 أكتوبر 2023)، والسرعة الأرضية (12 أكتوبر 2023).",
                "وبالمجموع: 72 رحلة، و128.8 دقيقة طيران، و17.0 كم، وأعلى ارتفاع 24.0 م."
            ],
            "timeline": [
                {
                    "when": "30 يوليو 2020",
                    "event": "الإطلاق من كيب كانافيرال"
                },
                {
                    "when": "18 فبراير 2021",
                    "event": "الهبوط في فوهة جيزيرو"
                },
                {
                    "when": "19 أبريل 2021",
                    "event": "أول رحلة طيران"
                },
                {
                    "when": "7 مايو 2021",
                    "event": "اكتمال التجربة التقنية"
                },
                {
                    "when": "24 يوليو 2021",
                    "event": "أول رحلة استكشاف"
                },
                {
                    "when": "8 أبريل 2022",
                    "event": "رقم قياسي في المسافة"
                },
                {
                    "when": "13 أبريل 2023",
                    "event": "الرحلة الخمسون وما بعدها"
                },
                {
                    "when": "5 أكتوبر 2023",
                    "event": "رقم قياسي في الارتفاع"
                },
                {
                    "when": "12 أكتوبر 2023",
                    "event": "رقم قياسي في السرعة الأرضية"
                },
                {
                    "when": "18 يناير 2024",
                    "event": "آخر رحلة طيران"
                },
                {
                    "when": "25 يناير 2024",
                    "event": "اكتمال المهمة"
                }
            ],
            "ending": [
                "طارت إنجنويتي آخر مرة في 18 يناير 2024.",
                "واكتملت مهمتها في 25 يناير 2024، بعد نحو ثلاث سنوات من الاستكشاف الجوي و72 رحلة تاريخية.",
                "وملخص ناسا الذي نحكي منه لا يذكر سبب انتهاء المهمة.",
                "لكن طريق الطيران لم ينتهِ: فقد مهّدت إنجنويتي لمستكشفين جويين قادمين، ومنهم مهمة سكاي فول التي ستبني على نجاحها. وكان حدّها خمس رحلات، وطارت 72!"
            ],
            "astronaut_conclusion": "شفرات إنجنويتي توقفت عن الدوران، لكنها أثبتت أن سماء المريخ لم تعد حداً لطموحنا. حلّقوا بأحلامكم عالياً!",
            "quiz": [
                {
                    "question": "ما هو التحدي الأكبر الذي واجه طيران مروحية إنجنويتي على المريخ؟",
                    "options": ["العواصف الرعدية", "الجاذبية القوية جداً", "انعدام أشعة الشمس", "الغلاف الجوي الرقيق جداً"],
                    "correct_index": 3
                },
                {
                    "question": "كم كان عدد الرحلات التجريبية المخطط لها، وكم رحلة طارت فعلياً؟",
                    "options": ["خُطط لـ 10 وطارت 10", "خُطط لـ 5 وطارت 72", "خُطط لـ 72 وطارت 5", "خُطط لـ 1 وطارت 100"],
                    "correct_index": 1
                },
                {
                    "question": "كيف سافرت إنجنويتي من الأرض إلى المريخ؟",
                    "options": ["مربوطة تحت بطن المركبة بيرسيفيرانس", "طارت بنفسها في الفضاء", "داخل صاروخ صغير منفصل", "حملها رواد الفضاء"],
                    "correct_index": 0
                }
            ]
        }
    }
];
