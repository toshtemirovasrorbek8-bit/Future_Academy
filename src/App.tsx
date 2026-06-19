import React, { useState, useEffect } from "react";
import { 
  Phone, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Cpu, 
  ChevronRight, 
  CheckCircle, 
  UserPlus, 
  Star, 
  MessageSquare, 
  Users, 
  Zap, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Check
} from "lucide-react";
import CallInterface from "./components/CallInterface";
import IDCard from "./components/IDCard";
import { Course, PricingPlan, UserProfile } from "./types";

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  
  // Custom user state to drive the dynamic virtual ID card and registration flow
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Aliyor Bekmurodov",
    phone: "+998 (90) 123-45-67",
    email: "aliyor@future.uz",
    level: "Tashrif Buyuruvchi",
    selectedCourseId: "ai-engineering",
    balance: 500000,
    idCardNumber: `FA-${Math.floor(Math.random() * 900000 + 100000)}`,
    isRegistered: false
  });

  const [activeTab, setActiveTab] = useState<'info' | 'register'>('info');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState(userProfile.name);
  const [formPhone, setFormPhone] = useState(userProfile.phone);
  const [formEmail, setFormEmail] = useState(userProfile.email);

  useEffect(() => {
    // Fetch courses from server
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]);
        }
      })
      .catch(err => console.error("Error fetching courses", err));

    // Fetch pricing plans from server
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => {
        setPricingPlans(data);
        const recommended = data.find((p: any) => p.recommended);
        setSelectedPlan(recommended || data[0]);
      })
      .catch(err => console.error("Error fetching pricing", err));
  }, []);

  const handleProfileUpdate = (updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...updated
    }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: formName,
      phone: formPhone,
      email: formEmail,
      isRegistered: true,
      level: "Akademiya A'zosi"
    }));
    setRegistrationMessage("Tabriklaymiz! Siz muvaffaqiyatli ro'yxatdan o'tdingiz va shaxsiy virtual ID-kartangiz tayyorlandi!");
    setTimeout(() => {
      setRegistrationMessage(null);
    }, 4500);
  };

  const selectCourseEnroll = (course: Course) => {
    setUserProfile(prev => ({
      ...prev,
      selectedCourseId: course.id
    }));
    const element = document.getElementById("registration-anchor");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectPricingEnroll = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setUserProfile(prev => ({
      ...prev,
      level: plan.id === 'free-starter' ? 'Tekin Obunachi' : plan.id === 'standard-pro' ? 'Premium Eng Ommabop' : 'Enterprise Jamoa'
    }));
    
    // Quick notification animation
    setRegistrationMessage(`Siz ${plan.name} tarifini tanladingiz. Lola bilan gaplashib obunani tugating!`);
    setTimeout(() => {
      setRegistrationMessage(null);
    }, 4000);

    const element = document.getElementById("phone-simulation-anchor");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans overflow-x-hidden">
      
      {/* Background neon grids and decorative ambient light bubbles */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[200px] left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-sans flex items-center">
                FUTURE <span className="text-cyan-400 ml-1">ACADEMY</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 block tracking-widest leading-none">KELAJAK TA'LIMI</span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-350">
            <a href="#kurslar" className="hover:text-cyan-400 transition-colors">Kurslarimiz</a>
            <a href="#lola-live" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
              <span>AI Lola Live</span>
              <span className="animate-pulse bg-cyan-500 w-2 h-2 rounded-full" />
            </a>
            <a href="#tariflar" className="hover:text-cyan-400 transition-colors">Tarif rejalari</a>
            <a href="#id-manager" className="hover:text-cyan-400 transition-colors">Virtual ID Karta</a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Elegant direct call anchor */}
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] text-slate-500 font-mono">KELAJAK JONLI ALOQA</span>
              <a href="tel:+998712005050" className="text-sm font-mono font-bold text-cyan-400 hover:text-cyan-300 transition">+998 (71) 200-50-50</a>
            </div>
            <a 
              href="#phone-simulation-anchor"
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition duration-200 transform hover:scale-103"
            >
              Lola-ga bog'lanish
            </a>
          </div>
        </div>
      </header>

      {/* CENTRALIZED TOAST / NOTIFICATION */}
      {registrationMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-slate-900 border border-cyan-400/40 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fade-in animate-slide-up max-w-sm">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-200 leading-snug font-medium">
            {registrationMessage}
          </p>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          
          {/* Dynamic badge with human tone */}
          <div className="inline-flex items-center space-x-2 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest font-semibold">
              O'ZBEKISTONDAGI ILK JONLI AI TA'LIM EKOTIZIMI
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans text-slate-100 tracking-tight leading-[1.1] text-balance">
            Oddiy Kurslardan Charchadingizmi? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500">
              Future Academy bilan Kelajakka Qadam Qo'ying!
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Biz professional IT darslarini inson-simon sun'iy intellekt maslahatchilar tizimi bilan birlashtirdik. 
            Shaxsiy maslahatchingiz <strong className="text-cyan-400">Lola</strong> bilan hoziroq qo'ng'iroq qiling, 
            darajangizni aniqlang va bevosita virtual ta'lim shartnomalaridan birini tanlang.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="#phone-simulation-anchor"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-2xl font-bold text-sm text-center transition shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2.5"
            >
              <span>Lola Bilan Ovozli Gaplashish</span>
              <Smartphone className="w-4 h-4" />
            </a>
            
            <a 
              href="#kurslar"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-850 text-slate-100 rounded-2xl font-bold text-sm text-center border border-slate-800 transition flex items-center justify-center space-x-2"
            >
              <span>Kurslarni Ko'rish</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-900 max-w-lg">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-cyan-400 font-mono">15,000+</span>
              <span className="text-xs text-slate-500 font-medium">Bajarilgan darslar</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-purple-400 font-mono">98.4%</span>
              <span className="text-xs text-slate-500 font-medium">Mamnuniyatlilik</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-cyan-400 font-mono">24/7</span>
              <span className="text-xs text-slate-500 font-medium font-mono">AI Lola qo'ng'irog'i</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Widget Container */}
        <div id="phone-simulation-anchor" className="lg:col-span-5 flex flex-col justify-center">
          <div className="absolute -z-10 bg-gradient-to-tr from-cyan-400/20 to-purple-600/20 w-[300px] h-[300px] rounded-full blur-3xl opacity-30 mx-auto" />
          <span className="text-center text-xs text-purple-400 font-mono tracking-widest uppercase mb-4 block">
            ★ LOYIHANING ENG QAYNOQ QISMI ★
          </span>
          <CallInterface 
            userProfile={userProfile} 
            onProfileUpdate={handleProfileUpdate} 
            selectedPlanName={selectedPlan?.name}
          />
        </div>
      </section>

      {/* DETAILED SaaS COURSES SECTION */}
      <section id="kurslar" className="bg-slate-950/40 py-24 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-bold">ZAMONAVIY TA'LIM KORPUSI</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              SaaS Amaliyotiga Asoslangan Professional Kurslar
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              O'quv dasturlarimiz mutlaqo amaliy loyihalarga asoslangan. Har bir kurs AI Lola va mentorlar tizimi bilan boyitilgan.
            </p>
          </div>

          {/* Core Interactive Course Navigator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* List of courses */}
            <div className="lg:col-span-5 space-y-4">
              {courses.map((course) => (
                <article
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  id={`course-nav-${course.id}`}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                    selectedCourse?.id === course.id
                      ? 'bg-slate-900 border-cyan-400/60 shadow-lg shadow-cyan-400/5'
                      : 'bg-slate-950/20 border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold font-mono text-purple-400 bg-purple-950/40 border border-purple-500/20 rounded">
                      {course.difficulty}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mb-1">{course.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{course.description}</p>
                  
                  <div className="mt-3 pt-3 border-t border-slate-900 flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{course.price}</span>
                    <span className="text-slate-500">{course.enrolledStudents} talaba</span>
                  </div>
                </article>
              ))}
            </div>

            {/* Selected Course Modules details & Instructor view */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm self-stretch flex flex-col justify-between">
              {selectedCourse ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-100">{selectedCourse.title}</h3>
                      <p className="text-sm text-cyan-400 font-mono mt-1">Sinf darslar soni: {selectedCourse.lessonsCount} ta</p>
                    </div>
                    
                    {/* Interactive Star rating */}
                    <div className="flex items-center space-x-1 font-mono text-sm bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                      <Star className="w-4 h-4 text-amber-400 fill-current animate-pulse" />
                      <span className="text-amber-400 font-bold">{selectedCourse.rating}</span>
                    </div>
                  </div>

                  <p className="text-slate-350 text-sm leading-relaxed">{selectedCourse.description}</p>

                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">O'quv moduli tuzilmasi:</h4>
                    <div className="space-y-2">
                      {selectedCourse.modules.map((module, idx) => (
                        <div key={idx} className="flex items-stretch space-x-3 bg-slate-950/60 p-3 rounded-xl border border-slate-850 text-xs text-slate-300">
                          <span className="text-cyan-400 font-mono font-black">{`0${idx + 1}`}</span>
                          <span className="leading-snug">{module}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructor Segment */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={selectedCourse.instructor.avatar} 
                        alt={selectedCourse.instructor.name}
                        className="w-10 h-10 rounded-full border border-cyan-400/40 object-cover" 
                      />
                      <div>
                        <span className="block text-xs text-slate-500 font-mono leading-none">SENIOR MENTOR</span>
                        <h5 className="text-sm font-bold text-slate-200 mt-1">{selectedCourse.instructor.name}</h5>
                        <p className="text-[10px] text-cyan-400/80 font-mono underline">{selectedCourse.instructor.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => selectCourseEnroll(selectedCourse)}
                      id={`btn-enroll-${selectedCourse.id}`}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition duration-200 flex items-center space-x-1.5"
                    >
                      <span>Ro'yxatdan o'tish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-20">
                  <BookOpen className="w-12 h-12 text-slate-700 mb-4" />
                  <p className="text-slate-500 text-sm">Tuzilmalar yuklanmoqda. Iltimos, kursni tanlang.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* DYNAMIC VIRTUAL IDENTITY CARD & HUMAN REGISTRATION SECTION */}
      <section id="id-manager" className="py-24 border-t border-slate-900 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-bold">IDENTITY BLOCKCHAIN MAPPING</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-snug">
              O'quv ID-Kartangizni Hozir Yarating va Lolaga Bog'lashni Yakunlang!
            </h2>
            <p className="text-slate-350 text-sm leading-relaxed">
              Bizning SaaS platformamizda ro'yxatdan o'tgan har bir talaba uchun virtual hisoblash tizimida o'zining shaxsiy blockchain ID hujjati generatori mavjud. 
              Quyidagi formaga haqiqiy ma'lumotlaringizni kiriting va o'ng tarafdagi virtual ID kartangizda darhol aks etganini ko'ring!
            </p>

            {/* Quick validation indicator */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Lola insoniy tizimi uchun real profilingiz muhim:</span>
                <p className="text-[11px] text-slate-400 leading-snug mt-1">
                  Har safar AI Lolaga va darslar aloqasiga qo'ng'iroq qilganingizda, tizim ushbu o'quv ID-karta orqali balans va darslaringiz taraqqiyot rejasini avtomatik ravishda bilib oladi!
                </p>
              </div>
            </div>

            {/* Quick Registration Form */}
            <form onSubmit={handleRegisterSubmit} id="registration-anchor" className="space-y-4 bg-slate-900/45 p-6 rounded-2xl border border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">To'liq ism-sharifingiz</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="Masalan: Aliyor Bekmurodov" 
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-cyan-400/80"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Telefon raqamingiz</label>
                  <input 
                    type="text" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    required
                    placeholder="Masalan: +998 (90) 123-45-67" 
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-cyan-400/80"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Elektron pochta manzilingiz</label>
                <input 
                  type="email" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  placeholder="aliyor@future.uz" 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-cyan-400/80"
                />
              </div>

              <button
                type="submit"
                id="btn-register-submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition duration-200"
              >
                PROFILNI ID JONLI YUKLASH
              </button>
            </form>
          </div>

          {/* Interactive ID Card display */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">SIZNING JONLI KO'RINISHINGIZ</span>
            <IDCard userProfile={userProfile} />
            
            <p className="text-center text-[11px] text-slate-500 max-w-xs leading-normal mt-4">
              *ID-kartani o'zingiz xohlagancha shakllantirishingiz mumkin. Ismingiz o'zgarishi bilan profil rasmi (bottts api) ham o'zgaradi!
            </p>
          </div>
        </div>
      </section>

      {/* SaaS PLANS & PRICING TABLE */}
      <section id="tariflar" className="py-24 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-bold">SAAS TA'RIF TIZIMLARI</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Kelajakda O'qish Uchun Kirish Tariflari
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              O'zingizga qulay bo'lgan tarif paketini tanlang. Obunangiz faollashtirilgach, AI maslahatchi Lola butun o'tirgichingizni rejalashtiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id}
                id={`pricing-card-${plan.id}`}
                className={`flex flex-col justify-between rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative ${
                  plan.recommended
                    ? 'bg-slate-900/80 border-cyan-400 shadow-xl shadow-cyan-400/5'
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-cyan-400 text-slate-950 text-[10px] font-bold tracking-wider rounded-full uppercase">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1.5 my-4">
                    <span className="text-3xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight">{plan.price}</span>
                    <span className="text-xs font-mono text-slate-400">UZS / {plan.period}</span>
                  </div>

                  {/* Feature listings */}
                  <ul className="space-y-3.5 border-t border-slate-900 pt-5 mt-5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300 leading-snug">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => selectPricingEnroll(plan)}
                    id={`btn-select-plan-${plan.id}`}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition duration-200 ${
                      plan.recommended
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800'
                    }`}
                  >
                    USHBU PLANNI TANLASH
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE F.A.Q Accordion */}
      <section className="py-24 border-t border-slate-900 bg-slate-950 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-bold">TOSH-SINOV SAVOLLAR</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Tez-tez beriladigan savollar</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Future Academy va bizning insoniy AI Lola maslahat tizimlarimiz qanday ishlashi haqida bilib oling.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Future Academy o'zi nima?",
                a: "Future Academy - bu zamonaviy IT va kiberxavfsizlik ko'nikmalarini o'rgatadigan eng ilg'or SaaS ta'lim platformasidir. Biz o'quv dasturlarimizga inson-simon sun'iy intellekt qo'ng'iroq va chat maslahatchilar tizimini (Lola) integratsiya qilganmiz."
              },
              {
                q: "Sun'iy intellekt Lola haqiqiy gaplasha oladimi?",
                a: "Ha! Lola tizimi Gemini 3.5 Flash modeli tomonidan boshqariladi. Shuningdek, u Web Speech API yordamida har bir matnli gapini inson ovozida o'qib berish imkoniyatiga ega. Siz qo'ng'iroq qilib yoki yozgan holda u bilan suvday toza o'zbek tilida gaplashishingiz mumkin!"
              },
              {
                q: "Qo'ng'iroq simulyatori nega bepul?",
                a: "Bizning talabalar platformaning barcha interaktiv muloqot tizimlaridan foydalana olishlari uchun simulyatorni sinov rejimida mutlaqo bepul qildik. Profilingizni o'rnatib qo'ng'iroqni boshlasangiz kifoya."
              },
              {
                q: "Kurslar qanchalik mukammal tuzilgan?",
                a: "Bizning o'quv dasturlarimiz eng yetakchi o'zbek va xorijlik Senior IT muhandislar tomonidan ishlab chiqilgan va dasturchi sifatidagi birinchi kundan boshlab SaaS loyihalarini qanday yaratishga qaratilgan."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/55 border border-slate-850 rounded-2xl overflow-hidden transition duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  id={`btn-faq-toggle-${idx}`}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-slate-200 hover:text-cyan-400 transition"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 text-cyan-400/70 transition-transform duration-200 ${faqOpen === idx ? 'rotate-180' : ''}`} />
                </button>
                
                {faqOpen === idx && (
                  <div className="p-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-850/60 bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRIC CALL DIRECT OVERVIEW SECTION WITH BRIGHT PHONE BANNERS */}
      <section className="bg-slate-900 border-t border-slate-850 py-16 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-slate-100">Professional mutaxassislar suhbati kerakmi?</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Agar sun'iy intellekt Lola-dan tashqari ofisimizga yoki inson operatorlarimizga to'g'ridan-to'g'ri telefon qo'ng'irog'i amalga oshirmoqchi bo'lsangiz, asosiy aloqa raqamimiz doimo ochiq.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 shrink-0">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3.5">
              <Phone className="w-5 h-5 text-cyan-400 fill-current" />
              <div>
                <span className="block text-[9px] font-mono text-slate-500 uppercase leading-none">OFIS MASLAHAT LINIYASI</span>
                <span className="text-sm font-mono font-black text-slate-100">+998 (71) 200-50-50</span>
              </div>
            </div>

            <a
              href="tel:+998712005050"
              className="px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-2xl transition duration-200"
            >
              Hozir Qo'ng'iroq Qilish
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-100">FUTURE ACADEMY</span>
              <p className="text-[9px] text-slate-500 font-mono tracking-wider">KELAJAK AKADEMIYASI SAAS MCHJ © 2026</p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500 space-y-1">
            <p>O'zbekistondagi zamonaviy IT-Markaz & SaaS Virtual Muloqot Tizimi.</p>
            <p>Hamma huquqlar qonunchilik doirasida himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
