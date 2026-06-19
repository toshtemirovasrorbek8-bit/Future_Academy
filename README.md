# 🚀 Future Academy - Kelajak Ta'lim Platformasi va SaaS Ekotizimi

![Future Academy Banner](./src/assets/images/future_academy_banner_1781846103438.jpg)

**Future Academy** — bu zamonaviy IT ko'nikmalarini o'rganish, inson-simon ovozli sun'iy intellekt (AI) maslahatchilari tizimi bilan muloqot qilish hamda shaxsiy o'quv virtual ID-kartalarini boshqarish uchun mo'ljallangan eng ilg'or SaaS ta'lim platformasidir.

---

## ✨ Asosiy Imkoniyatlar va Funksiyalar (Key Features)

### 1. 🎙️ AI Lola - Inson-simon Maslahatchi (Ovozli Qo'ng'iroq Simulyatori)
* **Jonli Ovozli Aloqa:** Google Gemini 3.5 Flash o'rnatilgan server-side tizimi orqali ishlaydi.
* **Telefon Simulyatsiyasi:** Ovoz o'chirgich (Mute), baland ovozda gaplashish (Loudspeaker) va to'xtatish (Hang Up) boshqaruv tugmalariga ega.
* **Web Speech & Web Audio API:** Haqiqiy eski telefon signal tovushlari (Ringtone Synth) sintez qilinadi hamda Lola o'z javoblarini suvday toza o'zbek tilida ovoz chiqarib o'qib beradi.

### 2. 💻 Amaliy va Professional Kurslar (SaaS Focus)
Platformada zamonaviy va yuqori talabga ega bo'lgan 4 ta yo'nalish darslari joy olgan:
1. **Sun'iy Intellekt va Neyrotarmoqlar** (Gemini API, Prompt moliya va botlar)
2. **Fullstack JavaScript** (React, Express, Node.js, to'lov tizimlari)
3. **Kiberxavfsizlik va Etik Xakerlik** (Linux, pentesting, exploits)
4. **Android Mobil Dasturlash** (Kotlin, Jetpack Compose)

### 3. 💳 Dinamik Virtual ID-Karta (Blockchain Student Badge)
* Ma'lumotlaringizni formaga kiritganingizda, o'g'il yoki qiz bolaligiga moslashtirilgan real-time virtual talaba xujjat-kartasi shakllantiriladi (blockchain verification mock loglari bilan).
* Ismingiz o'zgarishi bilan profile avatar rasmi (dicebear) ham avtomatik yaratiladi.

### 4. 📊 SaaS Tarif Rejalari va F.A.Q.
* Boshlang'ich (bepul), Professional (\$99,000 UZS) va Enterprise (\$499,000 UZS) tarif rejalari.
* Akordeon shaklidagi chiroyli animatsiyali tez-tez beriladigan savol-javoblar qismi.

---

## 🛠️ Texnologik Stack (Tech Stack)

* **Frontend:** React 19, TypeScript, **Tailwind CSS v4** (Yangi tezkor kutubxona), Lucide Icons (barcha chiroyli piktogrammalar).
* **Backend:** Node.js, Express (API marshrutlari uchun).
* **AI Engine:** `@google/genai` (Google Gemini 3.5 Flash modeli bilan server-side integratsiyasi).
* **Port / Ingress:** Port `3000` (Bizning tizimda avtomatik nginx reverse-proxy bog'langan).

---

## 💻 Mahalliy Kompyuterda Ishga Tushirish (How To Run Locally)

Siz loyihani muvaffaqiyatli yuklab oldingiz (Siz yuborgan rasmdagi VS Code terminal oynasida hammasi to'g'ri bajarilgan! 🥳). Mahalliy kompyuterda ishlash bosqichlari:

### 1. Kutubxonalarni yuklash
Loyiha papkasiga kirib terminalda quyidagini ishga tushiring:
```bash
npm install
```

### 2. .env Sozlamalari (AI Lola To'liq Gapirishi Uchun)
Loyiha ildiz (root) papkasida `.env` deb nomlangan fayl yarating (yoki `.env.example` faylidan nusxa oling) va quyidagi kalitni o'rnating:
```env
GEMINI_API_KEY="SIZNING_GEMINI_API_KEYINGIZ"
APP_URL="http://localhost:3000"
```
*(Kalitsiz ham AI Lola ishlayveradi, lekin oflayn / stub-test javoblarini qaytaradi)*.

### 3. Loyihani Ishga Tushirish
Kodlarni sinash va saytni ko'rish uchun quyidagi buyruqni bering:
```bash
npm run dev
```

Sayt sizda mahalliy ravishda **`http://localhost:3000`** manzilida ishga tushadi.

---

## 📁 Loyihaning Toza Arxitekturasi (Folder Structure)

Futuristik talablarimizga mos ravishda Frontend va Backend papkalari toza ajratilgan:

```text
├── backend/
│   └── server.ts         # 🔥 Node.js express backend (Gemini API server qismi)
├── src/
│   ├── assets/           # Generatsiya qilingan loyiha rasmlari & bannerlari
│   ├── components/       # 🎨 Frontend qismlari (CallInterface, IDCard)
│   ├── App.tsx           # 🚀 UI Bosh sahifasi
│   ├── main.tsx          # React boshlang'ich nuqtasi
│   ├── index.css         # Tailwind global stillari
│   └── types.ts          # Ma'lumot turlari (TypeScript Types)
├── package.json          # Loyiha scriptlari va kutubxonalar ro'yxati
└── vite.config.ts        # Vite konfiguratsiyasi
```

---

## 🥳 Hammasi Zo'r Ishlamoqda!

Siz yuborgan terminal skrinshotiga ko'ra:
1. `npm install` muvaffaqiyatli bajarilgan.
2. `npm run dev` orqali Node.js + Express + Vite serveringiz ishga tushgan:
   > `Server running on port 3000`
3. Endi brauzeringizda **`http://localhost:3000`** manzilini ochib kelajak akademiyasini sinab ko'rishingiz va Lola bilan jonli suhbat qurishingiz mumkin!

**Future Academy doimo siz bilan! O'quv darslarida muvaffaqiyatlar tilaymiz!** 🚀 