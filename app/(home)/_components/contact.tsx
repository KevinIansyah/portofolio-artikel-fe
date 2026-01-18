"use client";

import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, SendHorizonal, Twitter } from "lucide-react";

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
  return (
    <section id={id} className="py-16 mx-auto px-4 max-w-6xl">
      <div className="space-y-14">
        <Heading
          title="Hubungi Saya"
          subtitle="Kontak"
          description="Jika Anda memiliki pertanyaan, ingin bekerja sama, atau sekadar menyapa, jangan ragu untuk menghubungi saya melalui formulir atau informasi kontak yang tersedia di bawah ini."
          delay={200}
        />

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
                <h3 className="text-lg font-semibold">Tinggalkan Pesan</h3>

                <div className="space-y-4">
                  <Input className="text-sm" type="text" placeholder="Nama Anda" />
                  <Input className="text-sm" type="email" placeholder="Email Anda" />
                  <Input className="text-sm" type="text" placeholder="Nomor Telepon" />
                  <Textarea className="text-sm min-h-22.5 lg:min-h-21" placeholder="Pesan Anda" />
                  <Button className="w-full flex items-center justify-center gap-2 shadow-none" disabled>
                    Kirim
                    <SendHorizonal />
                  </Button>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden md:flex" />

              {/* Contact Info Section */}
              <div className="flex-1 space-y-4 lg:space-y-6">
                <h3 className="text-lg font-semibold">Informasi Kontak</h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4.5 h-4.5 text-muted-foreground shrink-0" />
                    <div className="space-y-2">
                      <h6 className="text-base font-semibold">Alamat</h6>
                      <p className="text-sm text-muted-foreground">Jl. Gn. Anyar Jaya Selatan No.25, Gn. Anyar, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-2">
                    <Phone className="w-4.5 h-4.5 text-muted-foreground shrink-0" />
                    <div className="space-y-2">
                      <h6 className="text-base font-semibold">Nomor Ponsel</h6>
                      <p className="text-sm text-muted-foreground">+62 858-1578-7906</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-2">
                    <Mail className="w-4.5 h-4.5 text-muted-foreground shrink-0" />
                    <div className="space-y-2">
                      <h6 className="text-base font-semibold">Email</h6>
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
