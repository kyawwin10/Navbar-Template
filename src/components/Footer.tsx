import {
  Facebook,
  Globe,
  Instagram,
  MessageCircleMore,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-white text-[#731212] px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center">
            <img
              src="/image/LuxeLookLogo.jpg"
              alt="img"
              className="w-24 h-24 rounded-full shadow bg-black"
            />
          </div>

          <div>
            <h3 className="text-[#731212] font-semibold mb-3">My LuxeLook</h3>
            <ul className="space-y-2 text-sm text-[#731212]">
              <li>Beauty Insider</li>
              <li>Luxe Look Credit Card</li>
              <li>Order Status</li>
              <li>Purchase History</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-[#731212] font-semibold mb-3">Help</h3>
            <ul className="space-y-2 text-sm text-[#731212]">
              <li>Customer Service</li>
              <li>Returns & Exchanges</li>
              <li>Shipping</li>
              <li>Billing</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-start">
              <MessageCircleMore />
              <h4 className="ml-4 text-[#731212] font-semibold mb-3">
                Online Chat
              </h4>
            </div>
            <p className="space-y-2 text-sm text-[#731212]">
              Available on weekdays from 8am - 12 pm and 1pm to 5pm (Myanmar
              Time Zone UTC+06:30)
            </p>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-md text-gray-400">
          <p>Developer by © Shin Nyein Thit</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-gray-400">
            <Link
              to={`https://t.me/LuxeLook10823`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="w-5 h-5 hover:text-white cursor-pointer" />
            </Link>
            <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
            <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
            <Youtube className="w-5 h-5 hover:text-white cursor-pointer" />
            <Globe className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
