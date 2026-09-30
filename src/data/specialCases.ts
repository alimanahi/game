import { Category } from '../types';

export interface SpecialCase {
  id: string;
  title: string;
  category: Category;
  description: string;
  icon: string;
  requiredLevel: number;
  coinUnlockCost: number; // 0 if free, or coin cost
  bannerColor: string;
  badgeTitle: string;
}

export const SPECIAL_CASES: SpecialCase[] = [
  {
    id: 'case_science_myths',
    title: 'پرونده خرافات علمی و بدن',
    category: 'علم',
    description: 'رد پای باورهای نادرست رایج درباره مغز، خون، چشم و قوانین فیزیک.',
    icon: '🔬',
    requiredLevel: 1,
    coinUnlockCost: 0,
    bannerColor: 'from-blue-600 to-indigo-900',
    badgeTitle: 'حقیقت‌سنج علمی',
  },
  {
    id: 'case_persia_history',
    title: 'اسناد محرمانه تاریخ ایران',
    category: 'تاریخ ایران',
    description: 'راستی‌آزمایی روایت‌های باستانی، تخت جمشید، منشور کوروش و دوران کهن.',
    icon: '🏛️',
    requiredLevel: 1,
    coinUnlockCost: 0,
    bannerColor: 'from-amber-600 to-yellow-900',
    badgeTitle: 'کاوشگر کهن',
  },
  {
    id: 'case_space_secrets',
    title: 'اسرار سیاهچاله‌ها و منظومه شمسی',
    category: 'فضا و نجوم',
    description: 'شایعات نجومی، شگفتی‌های مدار سیارات و ایستگاه‌های فضایی ناسا.',
    icon: '🪐',
    requiredLevel: 2,
    coinUnlockCost: 100,
    bannerColor: 'from-purple-600 to-slate-950',
    badgeTitle: 'دیده‌بان فضا',
  },
  {
    id: 'case_wildlife_enigma',
    title: 'شگفتی‌های پنهان دنیای وحش',
    category: 'حیوانات',
    description: 'رفتارهای خارق‌العاده، خفاش‌ها، نهنگ‌ها و معماهای زیست‌شناسی جانوری.',
    icon: '🦁',
    requiredLevel: 2,
    coinUnlockCost: 150,
    bannerColor: 'from-emerald-600 to-teal-950',
    badgeTitle: 'محافظ طبیعت',
  },
  {
    id: 'case_shahnameh_lore',
    title: 'اسطوره‌های شاهنامه و ادبیات',
    category: 'شاهنامه',
    description: 'حقایق منظومه فردوسی، رستم و سیمرغ و کنایات جاودان زبان پارسی.',
    icon: '📜',
    requiredLevel: 3,
    coinUnlockCost: 200,
    bannerColor: 'from-rose-700 to-red-950',
    badgeTitle: 'شاهنامه‌پژوه',
  },
  {
    id: 'case_wonders_heritage',
    title: 'عجایب هفتگانه و معماری کهن',
    category: 'عجایب جهان',
    description: 'اهرام مصر، پترا، تاج‌محل و بناهای اعجاب‌انگیز تاریخ تمدن بشر.',
    icon: '🏺',
    requiredLevel: 3,
    coinUnlockCost: 250,
    bannerColor: 'from-orange-600 to-amber-950',
    badgeTitle: 'معمار حقیقت',
  },
  {
    id: 'case_tech_cyber',
    title: 'شایعات دنیای دیجیتال و هوش مصنوعی',
    category: 'فناوری و اینترنت',
    description: 'باگ‌های تاریخی، امنیت شبکه، الگوریتم‌ها و اینترنت مدرن.',
    icon: '💻',
    requiredLevel: 4,
    coinUnlockCost: 300,
    bannerColor: 'from-cyan-600 to-blue-950',
    badgeTitle: 'کارآگاه سایبری',
  },
];
