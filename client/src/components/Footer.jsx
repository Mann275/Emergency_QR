const Footer = () => {
  return (
    <footer className="py-16 text-center">
      <p className="text-[10px] font-black tracking-[0.5em]" style={{ color: 'var(--ink)' }}>
        © {new Date().getFullYear()} Emergency QR
      </p>
    </footer>
  );
};

export default Footer;
