import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'

interface FooterProps {
  language: 'en' | 'ka'
}

const Footer = ({ language }: FooterProps) => {
  const content = {
    en: {
      company: 'Piwkina.ge',
      description: 'Traditional Georgian roasted pork delivery service',
      contact: 'Contact Information',
      phone: '+995 555 123 456',
      email: 'info@piwkina.ge',
      address: 'Tbilisi, Georgia',
      quickLinks: 'Quick Links',
      followUs: 'Follow Us',
      rights: '© 2024 Piwkina.ge. All rights reserved.'
    },
    ka: {
      company: 'Piwkina.ge',
      description: 'ტრადიციული ქართული შემწვარი გოჭის მიტანის სერვისი',
      contact: 'საკონტაქტო ინფორმაცია',
      phone: '+995 555 123 456',
      email: 'info@piwkina.ge',
      address: 'თბილისი, საქართველო',
      quickLinks: 'სწრაფი ბმულები',
      followUs: 'გამოგვყევით',
      rights: '© 2024 Piwkina.ge. ყველა უფლება დაცულია.'
    }
  }

  const t = content[language]

  const links = [
    { name: { en: 'Home', ka: 'მთავარი' }, href: '/' },
    { name: { en: 'Products', ka: 'პროდუქტები' }, href: '/products' },
    { name: { en: 'About', ka: 'ჩვენ შესახებ' }, href: '/about' },
    { name: { en: 'Contact', ka: 'კონტაქტი' }, href: '/contact' },
  ]

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">{t.company}</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.contact}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{t.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{t.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{t.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">{t.rights}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer