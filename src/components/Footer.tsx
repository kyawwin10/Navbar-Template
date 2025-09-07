import {
  Facebook,
  Globe,
  Instagram,
  MessageCircleMore,
  Twitter,
  Youtube,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <>
      <footer className="bg-black text-gray-300 px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Column 1 */}
          <div>
            <h3 className="text-white font-semibold mb-3">About LuxeLook</h3>
            <ul className="space-y-2 text-sm">
              <li>About Luxe Look</li>
              <li>Newsroom</li>
              <li>Careers</li>
              <li>Luxe Look Values</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-3">My LuxeLook</h3>
            <ul className="space-y-2 text-sm">
              <li>Beauty Insider</li>
              <li>Luxe Look Credit Card</li>
              <li>Order Status</li>
              <li>Purchase History</li>
              <li>Account Settings</li>
              <li>Beauty Offers</li>
              <li>Rewards Bazaar</li>
              <li>Book a Reservation</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold mb-3">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>Customer Service</li>
              <li>Returns & Exchanges</li>
              <li>Shipping</li>
              <li>Billing</li>
              <li>International Shipments</li>
              <li>Store Locations</li>
              <li>Online Ordering</li>
              <li>Teen Skincare Resource</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-start">
              <MessageCircleMore />
              <h4 className="ml-4 text-white font-semibold mb-3">Online Chat</h4>
            </div>
            <p className="space-y-2 text-sm">
              Available on weekdays from 8am - 12 pm and 1pm to 5pm
              (Myanmar Time Zone UTC+06:30)
            </p>
          </div>

          {/* Signup Form */}
          {/* <div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger className="flex justify-start">
                  <MessageCircleMore />
                  <h4 className="ml-4 mb-4">Online Chat</h4>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <Input type="text" placeholder="Text" />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Sent</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">
                Sign Up for Luxe Look
              </h3>
              <div>
                <input
                  type="text"
                  placeholder="Mobile Phone Number"
                  className="w-full p-2 rounded bg-white text-black"
                />
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Mobile Phone Number"
                  className="w-full p-2 rounded bg-white text-black"
                />
              </div>
            </div>
          </div> */}
        </div>

        <hr className="border-gray-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-md text-gray-400">
          <p>Developer by © Shin Nyein Thit</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-gray-400">
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
