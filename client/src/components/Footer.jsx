const Footer = () => {
  return (
    <footer className="pb-24 md:pb-12 pt-6">
      <div className="main-wrap">
        <div className="glass-card px-6 py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
            © {new Date().getFullYear()} Emergency QR
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
