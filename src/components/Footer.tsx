import React from "react";

const Footer = () => {
  return (
    <footer className="mt-8 text-center text-gray-500">
      <p>
        &copy; {new Date().getFullYear()} Luno Investment Calculator. All
        rights reserved.
      </p>
      <p>
        Developed by{" "}
        <a
          href="https://github.com/ThianHooi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Thian Hooi 🇲🇾
        </a>
      </p>
    </footer>
  );
};

export default Footer;