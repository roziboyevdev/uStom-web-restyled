import { Course, CourseLevel, Professor } from './types';

export const mockProfessors: Professor[] = [
  {
    id: 'prof-1',
    name: 'Prof. Dr. Hikmatilla Qodirov',
    title: 'Xalqaro Implantologlar Assotsiatsiyasi (ITI) a\'zosi, Tibbiyot Fanlari Doktori',
    bio: 'Prof. Dr. Hikmatilla Qodirov 20 yildan ortiq vaqt davomida implantologiya, suyak augmentatsiyasi va murakkab jarrohlik amaliyotlari bilan shug\'ullanib keladi. Germaniya va Shveytsariyaning yetakchi klinikalarida malaka oshirgan. O\'zbekistondagi uStom o\'quv markazining bosh maslahatchisi va bir necha darsliklar muallifi.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    specialties: ['Implantologiya', 'Sinus Lift', 'Suyak augmentatsiyasi', 'Gnatologiya'],
    socials: {
      instagram: 'https://instagram.com/dr.hikmatilla',
      linkedin: 'https://linkedin.com/in/hikmatilla-qodirov',
      website: 'https://u-stom.uz/professors/qodirov'
    }
  },
  {
    id: 'prof-2',
    name: 'Doz. Dr. Dilshodbek Ergashaliyev',
    title: 'Oliy toifali Ortodont, Tibbiyot Fanlari Nomzodi',
    bio: 'Dilshodbek Ergashaliyev 15 yillik tajribaga ega ortodont bo\'lib, breket tizimlari, alignerlar va jag\'-yuz asimmetriyalarini davolashda mutaxassis hisoblanadi. Janubiy Koreya va Rossiyadagi zamonaviy ortodontiya akademiyalari bitiruvchisi. Hozirda gnatologik ortodontiya va raqamli rejalashtirish bo\'yicha dars beradi.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    specialties: ['Gnatologik Ortodontiya', 'Alignerlar', 'Breket Tizimlari', 'Digital Smile Design'],
    socials: {
      instagram: 'https://instagram.com/dr.dilshod_ortho',
      linkedin: 'https://linkedin.com/in/dilshod-ergashaliyev'
    }
  },
  {
    id: 'prof-3',
    name: 'Dr. Madina Shodiyeva',
    title: 'Estetik Stomatolog va Keramik Restavratsiya bo\'yich Xalqaro Ekspert',
    bio: 'Dr. Madina Shodiyeva Shveytsariyaning "StyleItaliano" estetik stomatologiya hamjamiyati a\'zosi. To\'g\'ridan-to\'g\'ri (kompozit) va bilvosita (vinir, lyuminir) restavratsiyalar sohasida 12 yillik amaliy tajribaga ega. U o\'zining nozik san\'atkorona yondashuvi va mikroskop ostida ishlash qobiliyati bilan tanilgan.',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&auto=format&fit=crop&q=80',
    specialties: ['Estetik Restavratsiya', 'Vinirlar', 'Mikroskopik Stomatologiya', 'Tish oqartirish'],
    socials: {
      instagram: 'https://instagram.com/dr.madina_esthetic',
      website: 'https://styleitaliano.org/madina-shodieva'
    }
  },
  {
    id: 'prof-4',
    name: 'Dr. Jahongir Rustamov',
    title: 'Oliy toifali Endodont, Xalqaro Endodontiya Jamiyati professional a\'zosi',
    bio: 'Dr. Jahongir Rustamov tish ildiz kanallarini mikroskopi ostida davolash (endodontiya) bo\'yicha O\'zbekistondagi eng yetakchi mutaxassislardan biridir. O\'tmas kanallarni o\'tish, kanallardan asbob qoldiqlari va eski materiallarni olib tashlash bo\'yicha yuzlab muvaffaqiyatli pretsedentlar muallifi.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    specialties: ['Mikroskopik Endodontiya', 'Endodontik Retreatment', 'Kanallarni Obturatsiyalash', 'Karies profilaktikasi'],
    socials: {
      instagram: 'https://instagram.com/dr.rustamov_endo',
      linkedin: 'https://linkedin.com/in/jahongir-rustamov'
    }
  }
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Zamonaviy Implantologiya: Nazariyadan Amaliyotga',
    shortDesc: 'Implantologiyaga kirish, murakkab operatsiyalar, sinus lift va suyak plastikasi sirlari.',
    fullDesc: 'Ushbu masterklass yangi boshlayotgan va o\'rta tajribaga ega stomatolog-jarrohlar uchun mo\'ljallangan. Darslar davomida implantlarni rejalashtirish (3D modellashtirish), jarrohlik shablonlarini tayyorlash, implantatsiya operatsiyasi texnikasi hamda xavf va asoratlarning oldini olish amaliy mashg\'ulotlar (fantomlarda) orqali batafsil o\'rgatiladi. Ishtirokchilar o\'zlari mustaqil tarzda fantomlarda implant o\'rnatib ko\'rishadi.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
    professorId: 'prof-1',
    date: '2026-07-15',
    time: '09:00 - 18:00',
    price: 450,
    currency: 'USD',
    remainingSeats: 6,
    totalSeats: 20,
    location: 'Toshkent sh., uStom Amaliy Klinik Markazi, Navoiy ko\'chasi, 14-uy',
    tags: ['Implantologiya', 'Surgical', 'Hands-on'],
    level: CourseLevel.ADVANCED,
    category: 'Implantologiya',
    agenda: [
      { time: '09:00 - 10:30', activity: 'Kirish: Jag\' anatomiyasi va 3D KT tahlili' },
      { time: '10:30 - 11:00', activity: 'Kofe-breyk va networking' },
      { time: '11:00 - 13:00', activity: 'Implant tizimlari va jarrohlik protokoli' },
      { time: '13:00 - 14:00', activity: 'Premium tushlik (Shinam restoran)' },
      { time: '14:00 - 16:30', activity: 'Hands-on: Fantom va qo\'y jag\'larida implant o\'rnatish' },
      { time: '16:30 - 17:00', activity: 'Asoratlar tahlili va savol-javoblar' },
      { time: '17:00 - 18:00', activity: 'Sertifikatlar topshirish va esdalik fotosessiya' }
    ]
  },
  {
    id: 'course-2',
    title: 'Ortodontiyada gnatologik yondashuv va o\'zgaruvchan apparatlar',
    shortDesc: 'Ortodontik tashxis qo\'yishda gnatologiya asoslari va zamonaviy alignerlar bilan ishlash.',
    fullDesc: 'Faqat tishlarni to\'g\'rilash emas, balki chakka-pastki jag\' bo\'g\'imi (TMJ) va chaynash mushaklari faoliyatini muvozanatga keltirish muhimdir. Ushbu kurs doirasida gnatologik tekshiruv usullari, artikulyatordan foydalanish, splint-terapiya prinsiplari hamda raqamli alignerlar tizimini amaliyotga tatbiq etish o\'rgatiladi.',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&auto=format&fit=crop&q=80',
    professorId: 'prof-2',
    date: '2026-07-28',
    time: '10:00 - 17:00',
    price: 380,
    currency: 'USD',
    remainingSeats: 12,
    totalSeats: 25,
    location: 'Toshkent sh., uStom Amaliy Klinik Markazi, Navoiy ko\'chasi, 14-uy',
    tags: ['Ortodontiya', 'Gnatologiya', 'Aligners'],
    level: CourseLevel.INTERMEDIATE,
    category: 'Ortodontiya',
    agenda: [
      { time: '10:00 - 11:30', activity: 'TMJ disfunksiyasi va chaynash apparati nevrologiyasi' },
      { time: '11:30 - 12:00', activity: 'Kofe-breyk' },
      { time: '12:00 - 13:30', activity: 'Kondilografiya va kondilyator tahlili' },
      { time: '13:30 - 14:30', activity: 'Tushlik baxti' },
      { time: '14:30 - 16:00', activity: 'Amaliy qism: Splintlarni modellashtirish va tekshiruv' },
      { time: '16:00 - 17:00', activity: 'Klinik keyslar muhokamasi va sertifikatlashtirish' }
    ]
  },
  {
    id: 'course-3',
    title: 'Badiiy restavratsiya va estetik stomatologiya sirlari',
    shortDesc: 'Old tishlar guruhini kompozit materiallar yordamida badiiy qayta tiklash texnologiyasi.',
    fullDesc: 'Ushbu masterklassda zamonaviy kompozit materiallarning optik xususiyatlari, qatlamlash (layering) texnikasi, anatomik shakl berish sirlari va mukammal jilolash (polishing) usullari ko\'rsatib beriladi. Har bir ishtirokchi mikroskop va lupalar ostida maxsus tayyorlangan fantom tishlarda amaliy mashq bajaradi.',
    image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?w=800&auto=format&fit=crop&q=80',
    professorId: 'prof-3',
    date: '2026-08-05',
    time: '09:00 - 17:30',
    price: 320,
    currency: 'USD',
    remainingSeats: 0,
    totalSeats: 15,
    location: 'Toshkent sh., uStom Amaliy Klinik Markazi, Navoiy ko\'chasi, 14-uy',
    tags: ['Estetika', 'Restorations', 'Hands-on'],
    level: CourseLevel.INTERMEDIATE,
    category: 'Estetik Stomatologiya',
    agenda: [
      { time: '09:00 - 10:45', activity: 'Tish optikasi, rang tanlash va biomimetik yondashuv' },
      { time: '10:45 - 11:15', activity: 'Kofe-breyk' },
      { time: '11:15 - 13:00', activity: 'Silikon kalit yordamida palatinal devorni tiklash mantiqi' },
      { time: '13:00 - 14:00', activity: 'Tushlik' },
      { time: '14:00 - 16:30', activity: 'Hands-on: IV va III sinf nuqsonlarini qatlamli tiklash' },
      { time: '16:30 - 17:30', activity: 'Polishing protokollari, savollar va yakuniy bosqich' }
    ]
  },
  {
    id: 'course-4',
    title: 'Mikroskop ostida endodontiya: kanallarni mukammal davolash',
    shortDesc: 'Murakkab ildiz kanallarini topish, o\'tish, kengaytirish va 3D obturatsiya qilish protokollari.',
    fullDesc: 'Stomatologiyada asboblarning sinishi yoki "step" (bosqich) paydo bo\'lishi eng ko\'p uchraydigan muammolardan biridir. Ushbu professional intensiv o\'quv kursida operatsion mikroskop ostida ishlash qoidalari, bypass qilish (singan asbob yonidan o\'tish), kanallarni ultratovush yordamida tozalash va issiq gutta-percha bilan germetik to\'ldirish amalda yetkaziladi.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
    professorId: 'prof-4',
    date: '2026-08-19',
    time: '09:00 - 18:00',
    price: 500,
    currency: 'USD',
    remainingSeats: 4,
    totalSeats: 12,
    location: 'Toshkent sh., uStom Amaliy Klinik Markazi, Navoiy ko\'chasi, 14-uy',
    tags: ['Endodontiya', 'Microscopic', 'Expert'],
    level: CourseLevel.EXPERT,
    category: 'Endodontiya',
    agenda: [
      { time: '09:00 - 10:30', activity: 'Mikroskop sozlamalari, ergonomika va tana holati' },
      { time: '10:30 - 11:00', activity: 'Kofe va shirinliklar' },
      { time: '11:00 - 13:00', activity: 'NiTi aylanma asboblari turlari va kanallarni kengaytirish xavfsizligi' },
      { time: '13:00 - 14:00', activity: 'Tushlik va muloqot' },
      { time: '14:00 - 16:30', activity: 'Hands-on: Plastik bloklar va extraction qilingan tishlarda mashg\'ulot' },
      { time: '16:30 - 18:00', activity: '3D obturatsiya (Thermafil, injektor uslublari) va sertifikatlashtirish' }
    ]
  },
  {
    id: 'course-5',
    title: 'Stomatologiya Klinikasini Boshqarish va Bemorlar Oqimi',
    shortDesc: 'Stomatologiya klinikasida marketing, bemorlar bilan muloqot va biznes tizimini yo\'lga qo\'yish.',
    fullDesc: 'Ko\'p stomatologlar daho shifokor bo\'lishsalarda, biznes va boshqaruv sirlarini bilishmaydi. Ushbu boshlovchilar uchun kurishimiz klinika menejmenti, soliqlar, xizmat ko\'rsatish madaniyati, raqamli marketing va ijtimoiy tarmoqlarda shaxsiy brendni shakllantirish bo\'yicha mukammal yo\'riqnomadir.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80',
    professorId: 'prof-1',
    date: '2026-09-02',
    time: '11:00 - 16:00',
    price: 200,
    currency: 'USD',
    remainingSeats: 15,
    totalSeats: 30,
    location: 'Toshkent sh., Hilton Tashkent City, Konferensiya-hol',
    tags: ['Klinika-Menejment', 'Biznes', 'Boshlovchilar'],
    level: CourseLevel.BEGINNER,
    category: 'Biznes va Marketing',
    agenda: [
      { time: '11:00 - 12:30', activity: 'Klinika tashkil etishdagi qonuniy va iqtisodiy talablar' },
      { time: '12:30 - 13:00', activity: 'Network kofe' },
      { time: '13:00 - 14:30', activity: 'SMM va Google Ads: qanday qilib arzon va sifatli bemor jalb qilish mumkin?' },
      { time: '14:30 - 15:30', activity: 'Bemor shikoyatlari va huquqiy asoratlarni yumshatish' },
      { time: '15:30 - 16:00', activity: 'Biznes-reja tuzish bo\'yicha checklist va yakunlash' }
    ]
  }
];
