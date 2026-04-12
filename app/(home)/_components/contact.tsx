"use client";

import { motion } from "motion/react";
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, SendHorizonal, Twitter } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

import Heading from "@/components/home/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { siteFieldClass } from "@/lib/site-ui";

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
    color: "bg-linear-to-tr from-pink-500 to-yellow-500",
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
    <section id={id} className="py-26 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading title={t("heading.home.contact.title")} subtitle={t("heading.home.contact.subtitle")} description={t("heading.home.contact.description")} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Google Maps */}
          <motion.div
            className="flex h-full min-h-0 flex-col lg:col-span-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-48px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-full min-h-80 flex-1 rounded-3xl border border-dashed border-border p-2">
              <div className="relative flex min-h-72 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-none transition-colors hover:border-primary/35">
                <iframe
                  title="Lokasi Surabaya di Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253258.4167432963!2d112.76792524902346!3d-7.335610949166455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf8381ac47f%3A0x3027a76e352be40!2sSurabaya%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1752983318780!5m2!1sid!2sid"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Form & Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-48px" }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border border-dashed border-border rounded-3xl p-2">
              <div
                className={cn(
                  "rounded-2xl border border-border bg-card p-4 shadow-none transition-colors lg:p-6",
                  "hover:border-primary/35"
                )}
              >
                <div className="flex h-full flex-col gap-8 md:flex-row lg:gap-6">
                  {/* Form Section */}
                  <div className="flex-1 space-y-4 lg:space-y-6">
                    <h3 className="text-lg font-semibold">{t("home.contact.leaveMessage")}</h3>

                    <div className="space-y-4">
                      <Input className={cn("h-10", siteFieldClass)} name="name" type="text" placeholder={t("form.home.contact.placeholder.name")} />
                      <Input className={cn("h-10", siteFieldClass)} name="email" type="email" placeholder={t("form.home.contact.placeholder.email")} />
                      <Input className={cn("h-10", siteFieldClass)} name="phone" type="text" placeholder={t("form.home.contact.placeholder.phone")} />
                      <Textarea
                        className={cn("min-h-25 resize-y py-2.5", siteFieldClass)}
                        name="message"
                        placeholder={t("form.home.contact.placeholder.message")}
                      />
                      <Button className="flex w-full items-center justify-center gap-2 shadow-none" disabled>
                        {t("form.home.contact.button.submit")}
                        <SendHorizonal />
                      </Button>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="hidden bg-border md:flex" />

                  {/* Contact Info Section */}
                  <div className="flex-1 space-y-4 lg:space-y-6">
                    <h3 className="text-lg font-semibold">{t("home.contact.contactInfo")}</h3>

                    <div className="mb-8 space-y-4 md:mb-6">
                      {/* Address */}
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="font-semibold md:text-sm">{t("home.contact.address")}</p>
                          <p className="text-muted-foreground md:text-sm">Jl. Gn. Anyar Jaya Selatan No.25, Gn. Anyar, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-2">
                        <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="font-semibold md:text-sm">{t("home.contact.phoneNumber")}</p>
                          <p className="text-muted-foreground md:text-sm">+62 858-1578-7906</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-2">
                        <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="font-semibold md:text-sm">Email</p>
                          <p className="text-muted-foreground md:text-sm">keviniansyah04@gmail.com</p>
                        </div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {socials.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <a
                            key={item.name}
                            href={item.url}
                            aria-label={item.name}
                            className="inline-flex rounded-lg border border-border bg-card p-1 transition-colors hover:border-primary/35"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className={cn("flex size-9 items-center justify-center rounded-md", item.color)}>
                              <IconComponent className="size-4 text-white" />
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
