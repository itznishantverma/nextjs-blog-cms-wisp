'use client'

import Link from 'next/link'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  PenTool,
  Brain,
  Calendar,
  Users,
  Shield,
  FileText,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const footerSections = {
  content: {
    title: 'Content',
    links: [
      { name: 'Articles', href: '/articles', icon: BookOpen },
      { name: 'Journals', href: '/journals', icon: PenTool },
      { name: 'Quizzes', href: '/quizzes', icon: Brain },
      { name: 'Daily GK', href: '/daily-gk', icon: Calendar },
      { name: 'Featured', href: '/featured' },
      { name: 'Trending', href: '/trending' },
      { name: "Editor's Choice", href: '/editors-choice' },
    ]
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about', icon: Users },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Blog', href: '/company-blog' },
    ]
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help', icon: HelpCircle },
      { name: 'FAQ', href: '/faq' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Report Content', href: '/report' },
      { name: 'Feedback', href: '/feedback' },
      { name: 'Status', href: '/status' },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy', icon: Shield },
      { name: 'Terms of Service', href: '/terms', icon: FileText },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'DMCA', href: '/dmca' },
      { name: 'Disclaimer', href: '/disclaimer' },
      { name: 'Accessibility', href: '/accessibility' },
    ]
  }
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'YouTube', href: '#', icon: Youtube },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
]

const contactInfo = [
  { icon: Mail, text: 'hello@aelvorm.com', href: 'mailto:hello@aelvorm.com' },
  { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, text: 'New York, NY 10001', href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AelVorm
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Your trusted source for news, insights, and knowledge. Stay informed with our comprehensive coverage of current events, expert analysis, and engaging content.
              </p>
              
              {/* Newsletter Signup */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Stay Updated</h4>
                <div className="flex space-x-2">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1"
                  />
                  <Button>Subscribe</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get the latest articles and updates delivered to your inbox.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="w-9 h-9 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => {
                    const Icon = link.icon
                    return (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                        >
                          {Icon && <Icon className="w-4 h-4 mr-2" />}
                          {link.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contact Info Section */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="space-y-3">
                {contactInfo.map((contact, index) => {
                  const Icon = contact.icon
                  return (
                    <Link
                      key={index}
                      href={contact.href}
                      className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {contact.text}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Stats</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>50,000+ Active Readers</p>
                <p>2,500+ Articles Published</p>
                <p>100+ Expert Contributors</p>
                <p>25,000+ Quizzes Completed</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Science', 'Politics', 'Sports', 'Health', 'Business'].map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AelVorm. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">
                Cookies
              </Link>
              <Link href="/sitemap" className="hover:text-foreground transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}