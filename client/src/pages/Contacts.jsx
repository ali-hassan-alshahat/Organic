import React from "react";
import { MapPin, Mail, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contacts = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />,
      text: "Cairo, Egypt",
    },
    {
      icon: <Mail className="w-6 h-6 sm:w-8 sm:h-8" />,
      text: "Proxy@gmail.com",
    },
    {
      icon: <PhoneCall className="w-6 h-6 sm:w-8 sm:h-8" />,
      text: "(+20) 10 1234 5678",
    },
  ];

  return (
    <>
      <div className="center px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-4">
                  {contactInfo.map((info, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-[#2c742f] p-2 bg-green-50 rounded-full">
                        {info.icon}
                      </span>
                      <p className="text-gray-700 font-medium">{info.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Just Say Hello
                </h3>
                <p className="text-gray-600 mb-8">
                  Do you fancy saying hi to me or you want to get started with
                  your project and you need my help? Feel free to contact me.
                </p>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="title"
                      type="text"
                      placeholder="Message title"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      id="message"
                      placeholder="Type your message here..."
                      rows={6}
                      required
                      className="resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-full py-4">
        <iframe
          width="100%"
          height="400"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=Cairo+(Ecobazar)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        >
          <a href="https://www.mapsdirections.info/it/calcola-la-popolazione-su-una-mappa/">
            popolazione per regione Italia mappa
          </a>
        </iframe>
      </div>
    </>
  );
};

export default Contacts;
