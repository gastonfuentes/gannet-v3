import { FadeUp } from "@/components/animations/FadeUp";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  /** Substring of `title` rendered with the brand gradient. */
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

const SectionHeading = ({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
}: SectionHeadingProps) => {
  const renderTitle = () => {
    if (!highlight || !title.includes(highlight)) return title;
    const [before, after] = title.split(highlight);
    return (
      <>
        {before}
        <span className="gradient-text">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <FadeUp
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="mb-4 inline-flex items-center rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs font-medium text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl lg:leading-[1.1]">
        {renderTitle()}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-sm text-muted-foreground md:text-base",
            align === "center" ? "max-w-2xl" : "max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
    </FadeUp>
  );
};

export default SectionHeading;
