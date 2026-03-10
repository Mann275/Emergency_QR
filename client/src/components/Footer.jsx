const Footer = () => {
  return (
    <footer className="pb-12 pt-0">
      <div className="main-wrap">
        <div className="px-6 py-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted)] opacity-50">
            © {new Date().getFullYear()} Emergency QR
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
