import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const FooterBottom = () => (
  <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-4">
    <div className="flex justify-center space-x-4 mb-2">
    {/* Placeholder link for Facebook - replace '#' with the actual URL when available */}
    <a href="#" className="hover:text-blue-500" aria-label="Facebook"><FaFacebookF /></a>
    {/* Placeholder link for Twitter - replace '#' with the actual URL when available */}
      <a href="#" className="hover:text-blue-400" aria-label="Twitter"><FaTwitter /></a>
    {/* Placeholder link for Instagram - replace '#' with the actual URL when available */}
      <a href="#" className="hover:text-pink-500" aria-label="Instagram"><FaInstagram /></a>
    </div>
    &copy; {new Date().getFullYear()} Holidaze. All rights reserved.
  </div>
);

export default FooterBottom;
