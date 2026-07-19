import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/store/languageStore';
import { Award, Users, Globe, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

export function AboutPage() {
  const { t } = useTranslation('common');
  const { language, dir } = useLanguageStore();

  const values = [
    {
      icon: Award,
      title: t('about.quality'),
      description: t('about.qualityDesc'),
    },
    {
      icon: Users,
      title: t('about.customerFocus'),
      description: t('about.customerFocusDesc'),
    },
    {
      icon: Globe,
      title: t('about.integrity'),
      description: t('about.integrityDesc'),
    },
    {
      icon: Zap,
      title: t('about.innovation'),
      description: t('about.innovationDesc'),
    },
  ];

  return (
    <div className="animate-fade-in" dir={dir}>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/20">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              {t('about.title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t('about.storyText')}
            </p>
          </div>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-2xl" />
              <div className="relative bg-card rounded-2xl p-8 border border-border h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('about.mission')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.missionText')}
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/20 rounded-2xl" />
              <div className="relative bg-card rounded-2xl p-8 border border-border h-full">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('about.vision')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.visionText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t('about.values')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={cn(
                  'group bg-card rounded-2xl p-6 border border-border',
                  'transition-all duration-300 ease-soft',
                  'hover:shadow-soft-lg hover:border-primary/20 hover:-translate-y-1',
                  'animate-fade-in-up text-center'
                )}
                style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5',
                    'transition-transform duration-300 group-hover:scale-110'
                  )}
                >
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '5+', label: language === 'ar' ? 'سنوات خبرة' : 'Years Experience' },
              { value: '10K+', label: language === 'ar' ? 'عميل سعيد' : 'Happy Customers' },
              { value: '500+', label: language === 'ar' ? 'منتج' : 'Products' },
              { value: '50+', label: language === 'ar' ? 'علامة تجارية' : 'Brands' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl sm:text-5xl font-bold">{stat.value}</div>
                <div className="mt-2 text-primary-foreground/80 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
