const Logo = ({ className }: { className?: string }) => {
  return (
    <img
      src="/logosvg.svg"
      alt="GannetLabs"
      className={className}
    />
  );
};

export default Logo;
