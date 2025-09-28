export default function Footer() {
  const socials = [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com" },
    { id: "facebook",  label: "Facebook",  href: "https://www.facebook.com" },
    { id: "tiktok",    label: "TikTok",    href: "https://www.tiktok.com" },
    { id: "youtube",   label: "YouTube",   href: "https://www.youtube.com" },
  ];

  const Icon = ({ id }) => {
    switch (id) {
      case "instagram":
        return (
          // ícono oficial simplificado dentro de un círculo (relleno blanco)
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M12 7a5 5 0 1 0 5 5a5 5 0 0 0-5-5m0 8.2A3.2 3.2 0 1 1 15.2 12A3.2 3.2 0 0 1 12 15.2M17.4 7.1a1.2 1.2 0 1 1 1.2-1.2a1.2 1.2 0 0 1-1.2 1.2M12 2c3.2 0 3.6 0 4.9.07a6 6 0 0 1 2 .38A4.2 4.2 0 0 1 21.3 4.9a6 6 0 0 1 .38 2c.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9a6 6 0 0 1-.38 2a4.2 4.2 0 0 1-2.4 2.4a6 6 0 0 1-2 .38C15.6 21.9 15.2 22 12 22s-3.6-.1-4.9-.28a6 6 0 0 1-2-.38a4.2 4.2 0 0 1-2.4-2.4a6 6 0 0 1-.38-2C2.1 15.6 2 15.2 2 12s.1-3.6.28-4.9a6 6 0 0 1 .38-2A4.2 4.2 0 0 1 5.06 2.7a6 6 0 0 1 2-.38C8.4 2.1 8.8 2 12 2Z"/>
          </svg>
        );
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M13.5 9H16V6h-2.5C11.6 6 11 7.7 11 9.3V11H9v3h2v6h3v-6h2.1l.4-3H14v-1.5c0-.9.3-1.5 1.5-1.5Z"/>
          </svg>
        );
      case "tiktok":
        return (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M21 8.13a6.3 6.3 0 0 1-3.77-1.22A6.5 6.5 0 0 1 15.2 4H12v10.4a2.5 2.5 0 1 1-2-2.45V9.3a5.5 5.5 0 1 0 4.3 5.36V9.4a9 9 0 0 0 3.5 1.4c.8.2 1.4.3 2 .33V8.13Z"/>
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.7 3.6 12 3.6 12 3.6S4.3 3.6 2.6 4.1A3 3 0 0 0 .5 6.2A31.7 31.7 0 0 0 0 12c0 2 .2 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.7.5 9.4.5 9.4.5s7.7 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12c0-2-.2-4-.5-5.8ZM9.8 15.5V8.5l6.2 3.5Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="socials" aria-label="Redes sociales">
          {socials.map(s => (
            <a
              key={s.id}
              className={`socials__btn sb--${s.id}`}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              <Icon id={s.id} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
