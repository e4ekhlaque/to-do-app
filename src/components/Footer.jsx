import "../App.css";

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Todo Manager | Made with ❤️ by Ekhlaque
      </p>
    </footer>
  );
}

export default Footer;
