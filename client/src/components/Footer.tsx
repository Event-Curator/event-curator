export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>
          © {new Date().getFullYear()} EventCurator • Built with <span className="font-bold text-primary">DaisyUI</span>
        </p>
      </div>
    </footer>
  );
}
