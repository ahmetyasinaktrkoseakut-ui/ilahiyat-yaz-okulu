import { Faculty } from '../types';

export const TURKEY_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", 
  "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", 
  "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", 
  "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", 
  "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", 
  "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", 
  "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", 
  "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", 
  "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

// Initial faculties data preloaded so that the user doesn't face an empty system.
// These records are synchronized to Firestore whenever a user edits them in real-time.
export const INITIAL_FACULTIES: Faculty[] = [
  {
    id: "adana-cukurova-ilh",
    city: "Adana",
    univName: "Çukurova Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "adiyaman-adiyaman-ilh",
    city: "Adıyaman",
    univName: "Adıyaman Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "afyon-kocatepe-isl",
    city: "Afyonkarahisar",
    univName: "Afyon Kocatepe Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "agri-ibrahim-cecen-isl",
    city: "Ağrı",
    univName: "Ağrı İbrahim Çeçen Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "amasya-amasya-ilh",
    city: "Amasya",
    univName: "Amasya Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "ankara-ankara-ilh",
    city: "Ankara",
    univName: "Ankara Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz",
    announcementUrl: "https://divinity.ankara.edu.tr/"
  },
  {
    id: "ankara-hacibayram-ilh",
    city: "Ankara",
    univName: "Ankara Hacı Bayram Veli Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "ankara-yildirim-isl",
    city: "Ankara",
    univName: "Ankara Yıldırım Beyazıt Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "antalya-akdeniz-ilh",
    city: "Antalya",
    univName: "Akdeniz Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "artvin-coruh-ilh",
    city: "Artvin",
    univName: "Artvin Çoruh Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "aydin-adnan-menderes-isl",
    city: "Aydın",
    univName: "Aydın Adnan Menderes Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "balikesir-balikesir-ilh",
    city: "Balıkesir",
    univName: "Balıkesir Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "bilecik-seyh-edebali-isl",
    city: "Bilecik",
    univName: "Bilecik Şeyh Edebali Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "bingol-bingol-ilh",
    city: "Bingöl",
    univName: "Bingöl Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "bitlis-eren-isl",
    city: "Bitlis",
    univName: "Bitlis Eren Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "bolu-abant-izzet-ilh",
    city: "Bolu",
    univName: "Bolu Abant İzzet Baysal Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "burdur-mehmet-akif-ilh",
    city: "Burdur",
    univName: "Burdur Mehmet Akif Ersoy Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "bursa-uludag-ilh",
    city: "Bursa",
    univName: "Bursa Uludağ Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "canakkale-18mart-ilh",
    city: "Çanakkale",
    univName: "Çanakkale Onsekiz Mart Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "cankiri-karatekin-isl",
    city: "Çankırı",
    univName: "Çankırı Karatekin Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "corum-hitit-ilh",
    city: "Çorum",
    univName: "Hitit Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "denizli-pamukkale-ilh",
    city: "Denizli",
    univName: "Pamukkale Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "diyarbakir-dicle-ilh",
    city: "Diyarbakır",
    univName: "Dicle Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "edirne-trakya-ilh",
    city: "Edirne",
    univName: "Trakya Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "elazig-firat-ilh",
    city: "Elazığ",
    univName: "Fırat Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "erzincan-binali-yildirim-ilh",
    city: "Erzincan",
    univName: "Erzincan Binali Yıldırım Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "erzurum-ataturk-ilh",
    city: "Erzurum",
    univName: "Atatürk Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "eskisehir-osmangazi-ilh",
    city: "Eskişehir",
    univName: "Eskişehir Osmangazi Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz",
    announcementUrl: "https://ilahiyat.ogu.edu.tr/"
  },
  {
    id: "eskisehir-anadolu-ilh",
    city: "Eskişehir",
    univName: "Anadolu Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "gaziantep-gaziantep-ilh",
    city: "Gaziantep",
    univName: "Gaziantep Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "giresun-giresun-isl",
    city: "Giresun",
    univName: "Giresun Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "gumushane-gumushane-ilh",
    city: "Gümüşhane",
    univName: "Gümüşhane Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "hakkari-hakkari-ilh",
    city: "Hakkari",
    univName: "Hakkari Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "hatay-mustafakemal-ilh",
    city: "Hatay",
    univName: "Hatay Mustafa Kemal Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "isparta-suleyman-demirel-ilh",
    city: "Isparta",
    univName: "Süleyman Demirel Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "mersin-mersin-isl",
    city: "Mersin",
    univName: "Mersin Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "istanbul-istanbul-ilh",
    city: "İstanbul",
    univName: "İstanbul Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "istanbul-marmara-ilh",
    city: "İstanbul",
    univName: "Marmara Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "istanbul-medeniyet-isl",
    city: "İstanbul",
    univName: "İstanbul Medeniyet Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "istanbul-sabahattin-zaim-isl",
    city: "İstanbul",
    univName: "İstanbul Sabahattin Zaim Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "izmir-dokuzeylul-ilh",
    city: "İzmir",
    univName: "Dokuz Eylül Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "izmir-katip-celebi-isl",
    city: "İzmir",
    univName: "İzmir Katip Çelebi Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kars-kafkas-ilh",
    city: "Kars",
    univName: "Kafkas Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kastamonu-kastamonu-ilh",
    city: "Kastamonu",
    univName: "Kastamonu Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kayseri-erciyes-ilh",
    city: "Kayseri",
    univName: "Erciyes Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kirklareli-kirklareli-ilh",
    city: "Kırklareli",
    univName: "Kırklareli Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kirsehir-ahievran-isl",
    city: "Kırşehir",
    univName: "Kırşehir Ahi Evran Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kocaeli-kocaeli-ilh",
    city: "Kocaeli",
    univName: "Kocaeli Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "konya-necmettin-erbakan-ilh",
    city: "Konya",
    univName: "Necmettin Erbakan Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "konya-selcuk-isl",
    city: "Konya",
    univName: "Selçuk Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kutahya-dumlupinar-isl",
    city: "Kütahya",
    univName: "Kütahya Dumlupınar Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "malatya-inonu-ilh",
    city: "Malatya",
    univName: "İnönü Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "manisa-celalbayar-ilh",
    city: "Manisa",
    univName: "Manisa Celal Bayar Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kahramanmaras-sutcu-imam-ilh",
    city: "Kahramanmaraş",
    univName: "Kahramanmaraş Sütçü İmam Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "mardin-artuklu-isl",
    city: "Mardin",
    univName: "Mardin Artuklu Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "mugla-sitkikocman-ilh",
    city: "Muğla",
    univName: "Muğla Sıtkı Koçman Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "mus-alparslan-isl",
    city: "Muş",
    univName: "Muş Alparslan Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "nevsehir-hacibektas-ilh",
    city: "Nevşehir",
    univName: "Nevşehir Hacı Bektaş Veli Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "nigde-omerhalisdemir-isl",
    city: "Niğde",
    univName: "Niğde Ömer Halisdemir Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "ordu-ordu-ilh",
    city: "Ordu",
    univName: "Ordu Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "rize-erdogan-ilh",
    city: "Rize",
    univName: "Recep Tayyip Erdoğan Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "sakarya-sakarya-ilh",
    city: "Sakarya",
    univName: "Sakarya Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "samsun-19mayis-ilh",
    city: "Samsun",
    univName: "Ondokuz Mayıs Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "siirt-siirt-ilh",
    city: "Siirt",
    univName: "Siirt Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "sinop-sinop-ilh",
    city: "Sinop",
    univName: "Sinop Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "sivas-cumhuriyet-ilh",
    city: "Sivas",
    univName: "Sivas Cumhuriyet Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "tekirdag-namikkemal-ilh",
    city: "Tekirdağ",
    univName: "Tekirdağ Namık Kemal Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "tokat-gaziosmanpasa-isl",
    city: "Tokat",
    univName: "Tokat Gaziosmanpaşa Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "trabzon-trabzon-ilh",
    city: "Trabzon",
    univName: "Trabzon Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "tunceli-munzur-ilh",
    city: "Tunceli",
    univName: "Munzur Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "sanliurfa-harran-ilh",
    city: "Şanlıurfa",
    univName: "Harran Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "usak-usak-isl",
    city: "Uşak",
    univName: "Uşak Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "van-100yil-ilh",
    city: "Van",
    univName: "Van Yüzüncü Yıl Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "yozgat-bozok-ilh",
    city: "Yozgat",
    univName: "Yozgat Bozok Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "zonguldak-bulentecevit-ilh",
    city: "Zonguldak",
    univName: "Zonguldak Bülent Ecevit Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "aksaray-aksaray-isl",
    city: "Aksaray",
    univName: "Aksaray Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "bayburt-bayburt-ilh",
    city: "Bayburt",
    univName: "Bayburt Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "karaman-mehmetbey-isl",
    city: "Karaman",
    univName: "Karamanoğlu Mehmetbey Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kirikkale-kirikkale-ilh",
    city: "Kırıkkale",
    univName: "Kırıkkale Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "batman-batman-isl",
    city: "Batman",
    univName: "Batman Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "sirnak-sirnak-ilh",
    city: "Şırnak",
    univName: "Şırnak Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "bartin-bartin-isl",
    city: "Bartın",
    univName: "Bartın Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "ardahan-ardahan-ilh",
    city: "Ardahan",
    univName: "Ardahan Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "igdir-igdir-ilh",
    city: "Iğdır",
    univName: "Iğdır Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "yalova-yalova-isl",
    city: "Yalova",
    univName: "Yalova Üniversitesi",
    facultyName: "İslami İlimler Fakültesi",
    status: "belirsiz"
  },
  {
    id: "karabuk-karabuk-ilh",
    city: "Karabük",
    univName: "Karabük Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "kilis-7aralik-ilh",
    city: "Kilis",
    univName: "Kilis 7 Aralık Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "osmaniye-korkutata-ilh",
    city: "Osmaniye",
    univName: "Osmaniye Korkut Ata Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  },
  {
    id: "duzce-duzce-ilh",
    city: "Düzce",
    univName: "Düzce Üniversitesi",
    facultyName: "İlahiyat Fakültesi",
    status: "belirsiz"
  }
];
