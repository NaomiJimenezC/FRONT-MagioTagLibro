import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8" aria-labelledby="footer-heading">
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Copyright */}
        <article>
          <p className="text-sm">
            © <span lang="en">MagioTaglibro</span> 2025. All rights reserved.
          </p>
        </article>

        {/* Contact Section */}
        <section aria-labelledby="contact-heading">
          <nav aria-label="Contact navigation">
            <ul className="list-none p-0">
              <li>
                <a
                  href="/contact"
                  className="text-blue-400 hover:text-blue-500 transition duration-300 underline"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </section>

        {/* Social Media Links */}
        <section aria-labelledby="social-media-heading">

          <p className="text-sm mb-2">Follow us on:</p>
          <ul className="flex justify-center md:justify-start space-x-4">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="hover:text-blue-500"
              >
                <FaFacebook size={24} />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Twitter profile"
                className="hover:text-blue-400"
              >
                <FaTwitter size={24} />
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram profile"
                className="hover:text-pink-500"
              >
                <FaInstagram size={24} />
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn profile"
                className="hover:text-blue-700"
              >
                <FaLinkedin size={24} />
              </a>
            </li>
          </ul>
        </section>
      </section>
    </footer>
  );
};

export default Footer;
