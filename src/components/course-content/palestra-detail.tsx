'use client';

import { CheckCircle, Users, AlertTriangle, ListChecks, ArrowUpRight, BarChart, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/hooks/use-locale';

type Palestra = {
    title: string;
    subtitle: string;
    targetAudience: string[];
    problem: string[];
    content: string[];
    benefits: string[];
    methodology: string;
    duration: string;
    expectedResult: string;
};

interface PalestraDetailProps {
  course: Palestra;
}

const DetailSection = ({ title, items, icon: Icon }: { title: string; items: string[]; icon: React.ElementType }) => (
    <div className="mb-8">
        <h3 className={cn("text-xl font-bold text-primary mb-4 flex items-center gap-2", "font-headline")}>
            <Icon className="h-6 w-6" />
            {title}
        </h3>
        <ul className="space-y-2">
        {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
            <span className="text-muted-foreground">{item}</span>
            </li>
        ))}
        </ul>
    </div>
);

export default function PalestraDetail({ course }: PalestraDetailProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-12">
      
      <DetailSection title={t('palestras.detail.targetAudience')} items={course.targetAudience} icon={Users} />
      
      <DetailSection title={t('palestras.detail.problem')} items={course.problem} icon={AlertTriangle} />
      
      <DetailSection title={t('palestras.detail.content')} items={course.content} icon={ListChecks} />
 
      <DetailSection title={t('palestras.detail.benefits')} items={course.benefits} icon={ArrowUpRight} />

      <div className="mb-8">
        <h3 className={cn("text-xl font-bold text-primary mb-4 flex items-center gap-2", "font-headline")}>
            <BarChart className="h-6 w-6" />
            {t('palestras.detail.methodology')}
        </h3>
        <p className="text-muted-foreground">{course.methodology}</p>
      </div>

      <div className="mb-8">
        <h3 className={cn("text-xl font-bold text-primary mb-4 flex items-center gap-2", "font-headline")}>
            <Clock className="h-6 w-6" />
            {t('palestras.detail.duration')}
        </h3>
        <p className="text-muted-foreground">{course.duration}</p>
      </div>

      <div className="rounded-lg bg-primary/10 p-6 text-center">
         <h3 className={cn("text-xl font-bold text-primary mb-2", "font-headline")}>
            {t('palestras.detail.expectedResult')}
        </h3>
        <p className="text-lg font-semibold text-foreground">"{course.expectedResult}"</p>
      </div>

    </div>
  );
}
