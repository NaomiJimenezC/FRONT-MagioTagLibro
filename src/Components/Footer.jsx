import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../Sass/components/_Footer.scss";

const Footer = () => {
  return (
      <footer className="footer" aria-label="footer-heading">
        {/* Copyright */}
        <p className="copyright" aria-label="copyright">
          © MagioTaglibro 2025. All rights reserved.
        </p>

        {/* Contact & Socials */}
        <section className="contact-and-socials">
          {/* Contact Section */}
          <p>
            <a href="/contact" className="text-blue-400 hover:text-blue-500 transition duration-300 underline" >
               Contact Us
            </a>
          </p>

          {/* Social Media Links */}
          <section className="social-media-links" id ="social-media-links" aria-labelledby="social-media-links">

            <p className="text-sm mb-2">Follow us on:</p>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
               aria-label="Visit our Facebook page" className="hover:text-blue-500" >
              <FaFacebook size={24}/>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
               aria-label="Visit our Twitter profile" className="hover:text-blue-400" >
              <FaTwitter size={24}/>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
               aria-label="Visit our Instagram profile" className="hover:text-pink-500" >
              <FaInstagram size={24}/>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
               aria-label="Visit our LinkedIn profile" className="hover:text-blue-700" >
              <FaLinkedin size={24}/>
            </a>
          </section>
        </section>
      </footer>
  );
};

export default Footer;
