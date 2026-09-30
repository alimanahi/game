export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'detective_1',
    name: 'کارآگاه کلاسیک',
    emoji: '🕵️‍♂️',
    description: 'با کلاه نمدی شاپو و بارانی نوآر',
  },
  {
    id: 'detective_2',
    name: 'بانوی حقیقت‌یاب',
    emoji: '🕵️‍♀️',
    description: 'کاوشگر باهوش و دقیق مدارک',
  },
  {
    id: 'detective_3',
    name: 'بازپرس تیزبین',
    emoji: '🧐',
    description: 'متخصص تحلیل اسناد و ذره‌بین طلایی',
  },
  {
    id: 'detective_4',
    name: 'کارآگاه مخفی',
    emoji: '🕶️',
    description: 'جستجوگر شایعات در تاریکی شب',
  },
  {
    id: 'detective_5',
    name: 'محقق علم و نجوم',
    emoji: '🔬',
    description: 'کارشناس شایعات علمی و فناوری',
  },
  {
    id: 'detective_6',
    name: 'استاد اسناد کهن',
    emoji: '📜',
    description: 'راستی‌آزمای تاریخ باستان و اسطوره‌ها',
  },
];
