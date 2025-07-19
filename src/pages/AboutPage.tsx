import { Clock, Users, Award, Heart } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

interface AboutPageProps {
  language: 'en' | 'ka'
}

const AboutPage = ({ language }: AboutPageProps) => {
  const content = {
    en: {
      title: 'About Piwkina.ge',
      subtitle: 'Preserving Georgian culinary traditions since 2020',
      story: {
        title: 'Our Story',
        content: `Piwkina.ge was born from a passion for authentic Georgian cuisine and a desire to share the rich flavors of traditional roasted pork with families across Tbilisi. Our journey began in 2020 when our founder, inspired by generations-old family recipes, decided to bring the authentic taste of Georgian "შემწვარი გოჭი" directly to your doorstep.

        We believe that food is more than just sustenance – it's a connection to our heritage, our culture, and our community. Every piece of pork we prepare is seasoned with traditional Georgian spices and cooked using time-honored methods passed down through generations.

        Today, we're proud to serve hundreds of families throughout Tbilisi, maintaining the highest standards of quality and authenticity in every order we deliver.`
      },
      values: {
        title: 'Our Values',
        items: [
          {
            icon: Award,
            title: 'Quality First',
            description: 'We source only the finest ingredients and maintain strict quality standards in every step of our process.'
          },
          {
            icon: Heart,
            title: 'Traditional Methods',
            description: 'Our recipes and cooking techniques have been passed down through generations of Georgian families.'
          },
          {
            icon: Users,
            title: 'Community Focus',
            description: 'We\'re committed to serving our local community and supporting Georgian culinary traditions.'
          },
          {
            icon: Clock,
            title: 'Fresh Daily',
            description: 'Every order is prepared fresh daily using traditional Georgian cooking methods and spices.'
          }
        ]
      },
      mission: {
        title: 'Our Mission',
        content: 'To preserve and share the authentic flavors of Georgian cuisine by delivering the highest quality traditional roasted pork directly to families throughout Tbilisi, while maintaining the cultural heritage and time-honored cooking methods that make our food truly special.'
      }
    },
    ka: {
      title: 'Piwkina.ge-ს შესახებ',
      subtitle: '2020 წლიდან ვინარჩუნებთ ქართულ კულინარიულ ტრადიციებს',
      story: {
        title: 'ჩვენი ისტორია',
        content: `Piwkina.ge დაიბადა ავთენტური ქართული სამზარეულოს ვნებით და ტრადიციული შემწვარი გოჭის მდიდარი გემოების თბილისის ოჯახებთან გაზიარების სურვილით. ჩვენი მოგზაურობა 2020 წელს დაიწყო, როდესაც ჩვენმა დამფუძნებელმა, თაობებით გადმოცემული ოჯახური რეცეპტებით შთაგონებულმა, გადაწყვიტა ქართული "შემწვარი გოჭის" ავთენტური გემო პირდაპირ თქვენს კართან მიეტანა.

        ჩვენ გვჯერა, რომ საკვები უბრალო საზრდოზე მეტია – ეს არის კავშირი ჩვენს მემკვიდრეობასთან, ჩვენს კულტურასთან და ჩვენს საზოგადოებასთან. ყოველი ნაჭერი გოჭი, რომელსაც ვამზადებთ, ტრადიციული ქართული სანელებლებითაა გაწებული და თაობებით გადმოცემული მეთოდებით მომზადებული.

        დღეს ჩვენ ვამაყობთ, რომ ვემსახურებით ასობით ოჯახს მთელ თბილისში, ვინარჩუნებთ ხარისხისა და ავთენტურობის უმაღლეს სტანდარტებს ყოველ შეკვეთაში, რომელსაც ვაწვდით.`
      },
      values: {
        title: 'ჩვენი ღირებულებები',
        items: [
          {
            icon: Award,
            title: 'ხარისხი პირველ ადგილზე',
            description: 'ჩვენ ვირჩევთ მხოლოდ საუკეთესო ინგრედიენტებს და ვინარჩუნებთ მკაცრ ხარისხის სტანდარტებს ჩვენი პროცესის ყოველ ეტაპზე.'
          },
          {
            icon: Heart,
            title: 'ტრადიციული მეთოდები',
            description: 'ჩვენი რეცეპტები და მომზადების ტექნიკა ქართული ოჯახების თაობებით არის გადმოცემული.'
          },
          {
            icon: Users,
            title: 'საზოგადოებაზე ფოკუსი',
            description: 'ჩვენ ვართ ერთგულები ჩვენი ადგილობრივი საზოგადოების მომსახურებისა და ქართული კულინარიული ტრადიციების მხარდაჭერისადმი.'
          },
          {
            icon: Clock,
            title: 'ყოველდღე ახალი',
            description: 'ყოველი შეკვეთა ყოველდღე ახლად მზადდება ტრადიციული ქართული მომზადების მეთოდებითა და სანელებლებით.'
          }
        ]
      },
      mission: {
        title: 'ჩვენი მისია',
        content: 'ქართული სამზარეულოს ავთენტური გემოების შენარჩუნება და გაზიარება უმაღლესი ხარისხის ტრადიციული შემწვარი გოჭის პირდაპირ თბილისის ოჯახებთან მიტანით, კულტურული მემკვიდრეობისა და თაობებით გადმოცემული მომზადების მეთოდების შენარჩუნებით, რაც ჩვენს საკვებს ნამდვილად განსაკუთრებულს ხდის.'
      }
    }
  }

  const t = content[language]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16">
          <div className="aspect-video rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=600&fit=crop"
              alt="Traditional Georgian Roasted Pork"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {t.story.title}
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            {t.story.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            {t.values.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.values.items.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t.mission.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {t.mission.content}
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default AboutPage