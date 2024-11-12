function Footer() {
  return (
    <footer className="text-white py-8">
      <div className="container mx-auto text-center">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          &copy; {new Date().getFullYear()} TrackIT. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
