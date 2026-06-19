'use client';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import * as React from 'react';

type TextStaggeredFadeProps = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  gradientWordCount?: number;
};

export const StaggeredFade: React.FC<TextStaggeredFadeProps> = ({
  text,
  className = '',
  as = 'h2',
  gradientWordCount = 0,
}) => {
  const variants = {
    hidden: { opacity: 0 },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.07 },
    }),
  };

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const MotionComponent = motion[as] as typeof motion.h1;

  // Split text into words for gradient word handling
  const words = text.split(' ');
  const gradientWords = words.slice(0, gradientWordCount).join(' ');
  const remainingText = words.slice(gradientWordCount).join(' ');
  
  // Calculate starting index for remaining letters (gradient word length + space)
  const startIndex = gradientWordCount > 0 ? gradientWords.length + 1 : 0;
  const remainingLetters = remainingText.split('');

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? 'show' : ''}
      variants={variants}
      viewport={{ once: true }}
      className={cn(
        'text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]',
        className
      )}
    >
      {gradientWordCount > 0 && (
        <>
          <motion.span
            key="gradient-word"
            variants={variants}
            custom={0}
            className="gradient-text"
          >
            {gradientWords}
          </motion.span>
          <motion.span variants={variants} custom={gradientWords.length}>
            {' '}
          </motion.span>
        </>
      )}
      {remainingLetters.map((letter, i) => (
        <motion.span key={`${letter}-${i}`} variants={variants} custom={startIndex + i}>
          {letter}
        </motion.span>
      ))}
    </MotionComponent>
  );
};
