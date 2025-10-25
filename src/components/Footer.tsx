import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#cccccc] text-[#731212] px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div>
            <img
              src="/image/LuxeLookLogo.jpg"
              alt="Logo"
              className="w-20 h-20 rounded-full mb-3"
            />
            <div className="flex gap-4">
              <Link to={"https://t.me/LuxeLook10823"} target="_blank">
                <Send className="w-5 h-5 hover:text-white cursor-pointer" />
              </Link>
              <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
              <Youtube className="w-5 h-5 hover:text-white cursor-pointer" />
              <Globe className="w-5 h-5 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="text-[#731212] font-semibold mb-3">CONTACT US</h3>
            <div className="flex justify-start items-center">
              <Mail className="inline-block mr-2" size={16} />
              <Link to={"mailto:Shinnyeinthit12345@gmail.com"}>
                <p className="text-sm">Shinnyeinthit12345@gmail.com</p>
              </Link>
            </div>
            <p className="text-sm mt-2">Yaw Min Gyi Street, Yangon, Myanmar</p>
            <p className="text-sm mt-2">
              <div className="flex justify-start items-center">
                <Phone className="inline-block mr-2" size={16} />
                <Link to={"tel:+959123456789"} className="hover:underline">
                  +95 9404159420
                </Link>
              </div>
            </p>
          </div>

          <div>
            <h3 className="text-[#731212] font-semibold mb-3">SUBSCRIBE</h3>
            <p className="text-sm mb-3">
              Enter your email to get notified about our new updates
            </p>
            <div className="flex justify-start">
              <Input
                type="email"
                placeholder="Shinnyeinthit12345@gmail.com"
                className="w-full rounded-none bg-white"
                disabled
              />
              <Button className="rounded-none">
                <Link to={"mailto:Shinnyeinthit12345@gmail.com"} target="_blank">
                  <Send className="w-5 h-5 text-white" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-md text-black">
          <p>© 2025 LuxeLook. All rights reserved.</p>
          <p>Developed by Shin Nyein Thit</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
