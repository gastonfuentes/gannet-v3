import { ArrowRight } from "lucide-react";

interface AnnouncementBadgeProps {
  emoji?: string;
  text: string;
  href?: string;
}

const AnnouncementBadge = ({ emoji = "🚀", text, href = "#" }: AnnouncementBadgeProps) => {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground rounded-full gradient-badge transition-colors hover:text-foreground"
    >
      <span>{emoji}</span>
      <span>{text}</span>
      <ArrowRight className="w-4 h-4" />
    </a>
  );
};

export default AnnouncementBadge;
