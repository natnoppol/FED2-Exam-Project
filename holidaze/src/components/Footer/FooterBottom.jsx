import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const FooterBottom = () => (
  <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-4">
    <div className="flex justify-center space-x-4 mb-2">
    <a href="#" className="hover:text-blue-500" aria-label="Facebook"><FaFacebookF /></a>
      <a href="#" className="hover:text-blue-400" aria-label="Twitter"><FaTwitter /></a>
      <a href="#" className="hover:text-pink-500" aria-label="Instagram"><FaInstagram /></a>
    </div>
    &copy; {new Date().getFullYear()} Holidaze. All rights reserved.
  </div>
);

export default FooterBottom;
