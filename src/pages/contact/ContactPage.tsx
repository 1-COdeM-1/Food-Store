import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type FormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export function ContactPage() {
  const { t } = useTranslation('common');
  const { language, dir } = useLanguageStore();
  const [submitted, setSubmitted] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('tooShort')),
        email: z.string().email(t('invalidEmail')),
        phone: z.string().optional(),
        message: z.string().min(10, t('tooShort')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // TODO: Replace with API call when backend is ready
    console.log('Contact form data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t('email'),
      value: 'hello@luxemarket.com',
      href: 'mailto:hello@luxemarket.com',
    },
    {
      icon: Phone,
      label: t('phone'),
      value: '+966 50 123 4567',
      href: 'tel:+966501234567',
    },
    {
      icon: MapPin,
      label: t('address'),
      value: 'Riyadh, Saudi Arabia',
      href: '#',
    },
    {
      icon: Clock,
      label: language === 'ar' ? 'ساعات العمل' : 'Working Hours',
      value: t('contact.info.hours'),
      href: '#',
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
              {t('contact.title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('contact.info.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('contact.info.description')}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-xl',
                      'bg-card border border-border',
                      'hover:border-primary/30 hover:shadow-soft transition-all duration-200'
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {t('contact.form.successMessage')}
                    </h3>
                    <Button
                      className="mt-6"
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                    >
                      {t('send')} {t('message')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {t('contact.form.nameLabel')}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder={t('contact.form.namePlaceholder')}
                          {...register('name')}
                          className={cn(
                            'h-11 rounded-xl',
                            errors.name && 'border-red-500 focus-visible:ring-red-500'
                          )}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {t('contact.form.emailLabel')}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('contact.form.emailPlaceholder')}
                          {...register('email')}
                          className={cn(
                            'h-11 rounded-xl',
                            errors.email && 'border-red-500 focus-visible:ring-red-500'
                          )}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.form.phoneLabel')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t('contact.form.phonePlaceholder')}
                        {...register('phone')}
                        className="h-11 rounded-xl"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {t('contact.form.messageLabel')}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={t('contact.form.messagePlaceholder')}
                        rows={5}
                        {...register('message')}
                        className={cn(
                          'rounded-xl resize-none',
                          errors.message && 'border-red-500 focus-visible:ring-red-500'
                        )}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 rounded-xl font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          {t('sending')}
                        </div>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t('submit')}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
