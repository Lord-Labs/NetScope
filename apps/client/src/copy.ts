export type Locale = 'ar' | 'en';

export const copy = {
  ar: {
    skip: 'انتقل إلى المحتوى', changeTheme: 'تغيير المظهر', navigation: 'التنقل الرئيسي',
    overview: 'نظرة عامة', devices: 'الأجهزة', title: 'استهلاكك، بوضوح',
    subtitle: 'اعرف ما قيس، وما لم يُقس بعد.', recordedUsage: 'الاستهلاك المسجل',
    unknown: 'الاستهلاك غير معروف', noMeasurements: 'لا توجد قياسات بعد',
    notMeasuring: 'لم يبدأ القياس', foundation: 'هذه واجهة أولية. لم يُفعّل قياس الاستخدام على هذا الجهاز بعد.',
    coverageTitle: 'الفترات المفقودة ليست صفرًا',
    coverageDescription: 'ستظهر حالة القياس والفجوات بجانب أرقام الاستخدام. لا توجد بيانات تجريبية محسوبة على حسابك.',
    howItWorks: 'طريقة العمل', helpTitle: 'شبكة السكن فقط',
    helpDescription: 'الهدف هو قياس استخدام شبكة السكن وحفظه محليًا. سنوضح دقة القياس والفترات المفقودة. المشاركة وتقسيم التكلفة يأتيان بعد التحقق من القياس.',
    devicesDescription: 'كل أجهزتك تحت حساب واحد، عند تفعيل المشاركة.', noDevices: 'لا توجد بيانات أجهزة بعد',
    devicesEmpty: 'التسجيل وربط الأجهزة لم يُفعّلا بعد. لا يبدأ القياس من المتصفح.',
    preview: 'نسخة تأسيسية. لا توجد خدمة قياس أو مزامنة مفعلة.',
  },
  en: {
    skip: 'Skip to content', changeTheme: 'Change theme', navigation: 'Main navigation',
    overview: 'Overview', devices: 'Devices', title: 'Your usage, clearly',
    subtitle: 'Know what was measured, and what was missed.', recordedUsage: 'Recorded usage',
    unknown: 'Usage unknown', noMeasurements: 'No usage measured yet',
    notMeasuring: 'Not measuring', foundation: 'This is a foundation preview. Usage collection is not enabled on this device yet.',
    coverageTitle: 'Missing intervals are not zero',
    coverageDescription: 'Measurement status and gaps will appear alongside usage. No sample consumption is counted as yours.',
    howItWorks: 'How it works', helpTitle: 'Only your household connection',
    helpDescription: 'The goal is to measure your household connection and save readings locally. Accuracy and missing intervals stay visible. Sharing and cost allocation follow measurement validation.',
    devicesDescription: 'All your devices under one account, when sharing is available.', noDevices: 'No device data yet',
    devicesEmpty: 'Registration and device pairing are not enabled yet. A browser cannot start collection.',
    preview: 'Foundation preview. No collector or sync service is enabled.',
  },
} satisfies Record<Locale, Record<string, string>>;
