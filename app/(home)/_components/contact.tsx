"use client";

import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, SendHorizonal, Twitter } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import Heading from "@/components/home/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface ContactSectionProps {
  id?: string;
}

interface SocialItem {
  name: string;
  icon: React.ElementType;
  url: string;
  color: string;
}

const socials: SocialItem[] = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://web.facebook.com/kevin.iansyah/",
    color: "bg-blue-600",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/keviniansyah/",
    color: "bg-gradient-to-tr from-pink-500 to-yellow-500",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "#",
    color: "bg-sky-500",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/kevin-iansyah/",
    color: "bg-blue-700",
  },
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/KevinIansyah",
    color: "bg-gray-800",
  },
];

export default function ContactSection({ id }: ContactSectionProps) {
  const { t } = useLanguage();

  return (
    <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading title={t("heading.home.contact.title")} subtitle={t("heading.home.contact.subtitle")} description={t("heading.home.contact.description")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Google Maps */}
          <div className="lg:col-span-1 w-full h-full rounded-lg overflow-hidden">
            <iframe
              title="Lokasi Surabaya di Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253258.4167432963!2d112.76792524902346!3d-7.335610949166455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf8381ac47f%3A0x3027a76e352be40!2sSurabaya%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1752983318780!5m2!1sid!2sid"
              className="w-full h-full min-h-80 md:h-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact Form & Info */}
          <div className="lg:col-span-2 bg-linear-to-br from-muted to-background p-4 lg:p-6 space-y-4 lg:space-y-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-6 h-full">
              {/* Form Section */}
              <div className="flex-1 space-y-4 lg:space-y-6">
                <h3 className="text-lg font-semibold">{t("home.contact.leaveMessage")}</h3>

                <div className="space-y-4">
                  <Input className="text-sm" name="name" type="text" placeholder={t("form.home.contact.placeholder.name")} />
                  <Input className="text-sm" name="email" type="email" placeholder={t("form.home.contact.placeholder.email")} />
                  <Input className="text-sm" name="phone" type="text" placeholder={t("form.home.contact.placeholder.phone")} />
                  <Textarea className="text-sm min-h-22.5 lg:min-h-21" name="message" placeholder={t("form.home.contact.placeholder.message")} />
                  <Button className="w-full flex items-center justify-center gap-2 shadow-none" disabled>
                    {t("form.home.contact.button.submit")}
                    <SendHorizonal />
                  </Button>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden md:flex" />

              {/* Contact Info Section */}
              <div className="flex-1 space-y-4 lg:space-y-6">
                <h3 className="text-lg font-semibold">{t("home.contact.contactInfo")}</h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-base font-semibold">{t("home.contact.address")}</p>
                      <p className="text-sm text-muted-foreground">Jl. Gn. Anyar Jaya Selatan No.25, Gn. Anyar, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-2">
                    <Phone className="size-4.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-base font-semibold">{t("home.contact.phoneNumber")}</p>
                      <p className="text-sm text-muted-foreground">+62 858-1578-7906</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-2">
                    <Mail className="size-4.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-base font-semibold">Email</p>
                      <p className="text-sm text-muted-foreground">keviniansyah04@gmail.com</p>
                    </div>
                  </div>
                </div>

                <Separator className="hidden md:flex" />

                {/* Social Media */}
                <div className="flex gap-4 justify-center">
                  {socials.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <a key={item.name} href={item.url} aria-label={item.name} className={`p-2 rounded-lg transition hover:scale-105 ${item.color}`} target="_blank" rel="noopener noreferrer">
                        <IconComponent className="w-5 h-5 text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
