import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { useToast } from '../hooks/use-toast'

interface ContactPageProps {
  language: 'en' | 'ka'
}

const ContactPage = ({ language }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const content = {
    en: {
      title: 'Contact Us',
      subtitle: 'Get in touch with us for orders, questions, or feedback',
      contactInfo: 'Contact Information',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      hours: 'Business Hours',
      hoursText: 'Monday - Sunday: 9:00 AM - 10:00 PM',
      form: {
        title: 'Send us a Message',
        name: 'Your Name',
        email: 'Your Email',
        phone: 'Your Phone',
        message: 'Your Message',
        send: 'Send Message',
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again.'
      },
      info: {
        phone: '+995 555 123 456',
        email: 'info@piwkina.ge',
        address: 'Tbilisi, Georgia'
      }
    },
    ka: {
      title: 'დაგვიკავშირდით',
      subtitle: 'დაგვიკავშირდით შეკვეთებისთვის, კითხვებისთვის ან უკუკავშირისთვის',
      contactInfo: 'საკონტაქტო ინფორმაცია',
      phone: 'ტელეფონი',
      email: 'ელ-ფოსტა',
      address: 'მისამართი',
      hours: 'სამუშაო საათები',
      hoursText: 'ორშაბათი - კვირა: 9:00 - 22:00',
      form: {
        title: 'გამოგვიგზავნეთ შეტყობინება',
        name: 'თქვენი სახელი',
        email: 'თქვენი ელ-ფოსტა',
        phone: 'თქვენი ტელეფონი',
        message: 'თქვენი შეტყობინება',
        send: 'შეტყობინების გაგზავნა',
        success: 'შეტყობინება წარმატებით გაიგზავნა!',
        error: 'შეტყობინების გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.'
      },
      info: {
        phone: '+995 555 123 456',
        email: 'info@piwkina.ge',
        address: 'თბილისი, საქართველო'
      }
    }
  }

  const t = content[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: language === 'en' ? 'Missing Information' : 'ნაკლული ინფორმაცია',
        description: language === 'en' 
          ? 'Please fill in all required fields' 
          : 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate sending message (in real app, you'd send to your backend)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: t.form.success,
        description: language === 'en' 
          ? 'We will get back to you as soon as possible' 
          : 'ჩვენ მალე დაგიკავშირდებით'
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: t.form.error,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactItems = [
    {
      icon: Phone,
      label: t.phone,
      value: t.info.phone,
      href: `tel:${t.info.phone}`
    },
    {
      icon: Mail,
      label: t.email,
      value: t.info.email,
      href: `mailto:${t.info.email}`
    },
    {
      icon: MapPin,
      label: t.address,
      value: t.info.address,
      href: '#'
    },
    {
      icon: Clock,
      label: t.hours,
      value: t.hoursText,
      href: '#'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{t.contactInfo}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {item.label}
                        </h3>
                        {item.href !== '#' ? (
                          <a
                            href={item.href}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <div className="mt-8">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {language === 'en' ? 'Map coming soon' : 'რუკა მალე'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5 text-primary" />
                  <span>{t.form.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t.form.name} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{t.form.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">{t.form.phone}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">{t.form.message} *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {language === 'en' ? 'Sending...' : 'იგზავნება...'}
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t.form.send}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage