import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import TwinHealthLogo from "@/assets/TwinHealthLogo.png";

const Footer = () => {
  const footerLinks = {
    company: [
      { label: "About Us", href: "#" },
      { label: "Our Science", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
    programs: [
      { label: "Diabetes Reversal", href: "#" },
      { label: "Weight Management", href: "#" },
      { label: "PCOD/PCOS", href: "#" },
      { label: "Heart Health", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="w-full bg-[hsl(220,50%,10%)] text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img 
              src={TwinHealthLogo} 
              alt="Twin Health" 
              className="h-10 mb-6"
            />
            <p className="text-white/70 mb-6 max-w-sm">
              Twin Health uses precision health technology to help you reverse chronic metabolic diseases and live a healthier life.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Programs</h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="mailto:support@twinhealth.com" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors">
                <Mail className="w-5 h-5" />
                support@twinhealth.com
              </a>
              <a href="tel:+918001234567" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors">
                <Phone className="w-5 h-5" />
                1800-123-4567
              </a>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-5 h-5" />
              Bangalore, India
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Twin Health India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
