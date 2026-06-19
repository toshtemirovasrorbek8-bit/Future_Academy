import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure the API key is retrieved safely. Only initialize if API key is present
const geminiKey = process.env.GEMINI_API_KEY;

// Create the Google Gen AI client with appropriate User-Agent as required by the guidelines
const ai = new GoogleGenAI({
  apiKey: geminiKey || "stub_key_for_no_crash",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Hardcoded futuristic courses for the SaaS
  const courses = [
    {
      id: "accounting-uzb",
      title: "Buxgalteriya asoslari (1C: Buxgalteriya)",
      description: "Korxona moliyasini yuritish, soliq hisobotini tayyorlash va 1C dasturida ishlashni noldan professional darajagacha o'rganing.",
      duration: "6 oy",
      lessonsCount: 45,
      difficulty: "Boshlang'ich",
      price: "Ishsiz va Hech qayerda ishlamaydiganlarga tekin. Qolganlarga 600,000 UZS / 2oy",
      rating: 4.7,
      enrolledStudents: 200,
      instructor: {
      name: "Ilmiya Majidova",
      role: "Bosh buxgalter va Sertifikatlangan instruktor",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
      modules: [
        "Buxgalteriya nazariyasi va asosiy tushunchalar",
        "Korxona moliyaviy hujjatlari (schyot-faktura, order, hisob-kitob)",
        "1C: Buxgalteriya dasturi bilan ishlash",
        "Soliq tizimi va hisobotlarni tayyorlash (QQS, daromad solig'i)",
        "Ish haqi, kadrlar hisobi va moliyaviy tahlil"
      ]
    },
    {
      id: "fullstack-js",
      title: "Fullstack JavaScript (React & Node.js)",
      description: "Zamonaviy veb dasturlashni boshidan boshlab professional darajagacha o'rganing. Haqiqiy SaaS loyihalar.",
      duration: "6 oy",
      lessonsCount: 64,
      difficulty: "Boshlang'ich",
      price: "150,000 UZS / oy",
      rating: 4.8,
      enrolledStudents: 2150,
      instructor: {
        name: "Malika Solihova",
        role: "Lead Frontend Engineer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
      },
      modules: [
        "HTML5, CSS3 va Tailwind CSS",
        "JavaScript ES6+ Mukammal o'rganish",
        "React.js va State Management (Redux)",
        "Express va MongoDB / PostgreSQL backend",
        "SaaS va To'lov tizimlari (Click, Payme, Stripe)"
      ]
    },
    {
      id: "cyber-security",
      title: "Kiberxavfsizlik va Etik Xakerlik",
      description: "Raqamli tizimlar xavfsizligini ta'minlash, tarmoq hujumlarini aniqlash va himoya tizimlarini loyihalash.",
      duration: "4 oy",
      lessonsCount: 40,
      difficulty: "O'rta",
      price: "220,000 UZS / oy",
      rating: 4.7,
      enrolledStudents: 890,
      instructor: {
        name: "Sardor Karimov",
        role: "Security Consultant",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
      },
      modules: [
        "Linux OS va Tarmoq asoslari",
        "Xavfsizlik auditlari va audit tizimi",
        "Veb va Mobil ilova teshuvchi hujumlari",
        "Kriptografiya va himoya choralari",
        "Pentesting & Exploit tahlillari"
      ]
    },
    {
      id: "kotlin-mobile",
      title: "Android Mobil Dasturlash (Kotlin & Jetpack Compose)",
      description: "Google standartlari asosida tezkor, zamonaviy va chiroyli Android mobil ilovalarni mustaqil yarating.",
      duration: "5 oy",
      lessonsCount: 52,
      difficulty: "O'rta",
      price: "160,000 UZS / oy",
      rating: 4.9,
      enrolledStudents: 1120,
      instructor: {
        name: "Jasur Nematov",
        role: "Senior Android Developer",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
      },
      modules: [
        "Kotlin tili asoslari",
        "Jetpack Compose interfeyslar",
        "Arxitektura (MVVM, Clean Architecture)",
        "API integratsiyasi va Retrofit",
        "Google Play Store-ga yuklash"
      ]
    }
  ];

  // SaaS Plans list
  const pricingPlans = [
    {
      id: "free-starter",
      name: "Boshlang'ich (Talaba)",
      price: "0",
      period: "Abadiy Tekin",
      features: [
        "Haftada 2 ta ochiq dars",
        "AI Lola-dan sutka davomida 5 ta bepul yordam",
        "Hamjamiyat guruhiga a'zolik",
        "Boshlang'ich o'quv materiallari",
        "Cheklangan kod laboratoriyasi"
      ],
      recommended: false
    },
    {
      id: "standard-pro",
      name: "Professional (SaaS)",
      price: "99,000",
      period: "oyiga",
      badge: "Eng Ommabop",
      features: [
        "Barcha 4 ta kursdan to'liq foydalanish",
        "Sutka davomida 24/7 inson-simon AI Lola maslahatlari",
        "Shaxsiy raqamlik ID karta va sertifikatlar",
        "AI yordamida uy vazifalarini tekshirish",
        "Bitiruvdan so'ng 100% ish taklifi"
      ],
      recommended: true
    },
    {
      id: "team-enterprise",
      name: "Jamoaviy (Kompaniya)",
      price: "499,000",
      period: "oyiga (5 talaba uchun)",
      features: [
        "5 tagacha foydalanuvchi hisobi",
        "Kompaniya ehtiyojiga moslashtirilgan o'quv rejasi",
        "Premium server API resurslari",
        "SaaS boshqaruv paneli va statistika",
        "Yopiq masterklasslarda qatnashish huquqi",
        "Talabalar muvaffaqiyati hisoboti"
      ],
      recommended: false
    }
  ];

  // Hardcoded Static call options / simulated numbers
  const callbackNumbers = [
    { name: "SaaS Savdo Bo'limi", number: "+998 (71) 200-50-50", type: "savdo" },
    { name: "Haqiqiy inson-simon AI Lola (Yo'l-yo'riq)", number: "+998 (99) 888-77-66", type: "konsultant" },
    { name: "Texnik Yordam", number: "+998 (71) 120-40-40", type: "texnik" }
  ];

  // API endpoints
  app.get("/api/courses", (req: Request, res: Response) => {
    res.json(courses);
  });

  app.get("/api/pricing", (req: Request, res: Response) => {
    res.json(pricingPlans);
  });

  app.get("/api/contacts", (req: Request, res: Response) => {
    res.json(callbackNumbers);
  });

  // AI Lola interaction API (Gemini proxied server-side)
  app.post("/api/consultant", async (req: Request, res: Response) => {
    try {
      const { message, history, userProfile, callType } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Sarlavha yoki xabar yuborilmadi" });
      }

      if (!geminiKey) {
        // Fallback response when key is missing, so it doesn't break and guides the user elegantly
        return res.json({
          response: "Salom! Men Future Academy maslahatchisi Lolaman. Tizimda hozircha GEMINI_API_KEY sozlanmagan, shuning uchun men oflayn rejimda ishlayapman. Bizning kurslarimizga qiziqish bildirganingiz uchun tashakkur! Savollaringiz bo'lsa, +998 (71) 200-50-50 raqamiga qo'ng'iroq qiling!"
        });
      }

      // Build context of courses
      const coursesContext = courses.map(c => `- ${c.title}: ${c.duration}, narxi ${c.price}. (${c.description})`).join("\n");
      const pricingContext = pricingPlans.map(p => `- ${p.name}: ${p.price} UZS / ${p.period}`).join("\n");

      const systemInstruction = `Siz 'Future Academy' (Kelajak Akademiyasi) o'quv markazining inson kabi gaplashadigan sun'iy intellekt maslahatchisisiz. Ismingiz - Lola. 
Mijoz sizga telefonda qo'ng'iroq qildi yoki chat orqali ulandi. 

AQLLI KO'RSATMALAR:
1. Suvday toza, muloyim, qisqa, sodda, shirin va o'ta insoniy o'zbek tilida gaplashing. Sintetik va sovuq gaplar ishlatmang (Masalan: "Assalomu alaykum! Future Academy markaziga xush kelibsiz! Men sizga yordam beruvchi shaxsiy maslahatchingiz Lolaman, qanday ko'maklasha olaman?" yoki "Vay, ajoyib tanlov! Oshib borayotgan ushbu sohaga juda talab katta!").
2. Qisqa javob bering, go'yo haqiqiy telefonda ovozli gaplashayotgandek. Gaplaringiz 2-3 jumlali bo'lsa ajoyib bo'ladi.
3. Mijozning ma'lumotlari: ${JSON.stringify(userProfile || {})}. 
4. Biz taklif qiladigan kurslar:
${coursesContext}
5. Bizning premium SaaS obuna paketlarimiz (talabalar uchun):
${pricingContext}
6. Telefon raqami: Future Academy bosh raqami +998 (71) 200-50-50.
7. Suhbat oxirida mijozga juda chiroyli tilaklar bildiring, ularga qaysi kurs yoki reja ma'qulligini so'rab, ro'yxatdan o'tishni tavsiya eting.
8. Agar mijoz ro'yxatdan o'tishni istasa, siz unga virtual ID-karta ochishingiz va darslarni boshlashiga ko'maklashishingizni ayting!`;

      // Structure historical messages for chat
      const chatHistory = (history || []).map((h: any) => {
        return {
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        };
      });

      // Query Gemini 3.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...chatHistory,
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.85,
          topP: 0.95
        }
      });

      const replyText = response.text || "Uzr, biroz texnik uzilish bo'ldi. Qayta so'rang, iltimos!";
      res.json({ response: replyText });

    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ 
        error: "Xatolik yuz berdi", 
        response: "Texnik ulanishda uzilish bo'ldi! Lekin xavotirlanmang, men maslahatchi Lola yoningizdaman. Future Academy-ning +998 (71) 200-50-50 raqamiga qo'ng'iroq qilsangiz, muammoni zudlik bilan hal qilamiz." 
      });
    }
  });

  // Handle client asset serving & index fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
