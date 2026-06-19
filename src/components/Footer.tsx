import Logo from "@/components/icons/Logo";

const navLinks = [
  { label: "Soluciones", href: "#soluciones" },
  { label: "Cómo trabajamos", href: "#como-trabajamos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacto", href: "#contacto" },
];

const contactLinks = [
  { label: "hola@gannetlabs.com", href: "mailto:hola@gannetlabs.com" },
  { label: "WhatsApp", href: "https://wa.me/5491100000000" },
  { label: "LinkedIn", href: "https://linkedin.com/company/gannetlabs" },
  { label: "Instagram", href: "https://instagram.com/gannetlabs" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 px-6 py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-1">
            <Logo className="h-7 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Software, automatización, datos e IA aplicada para negocios reales.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Navegación</h4>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Contacto</h4>
            <ul className="mt-4 space-y-2">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          © {year} GannetLabs. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
