import { useNavigate } from "react-router-dom";
import { FiUser, FiHome } from "react-icons/fi";  

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>
      <p className="mb-4 text-gray-600">Choose your account type:</p>

      <div className="space-y-4">
        <button
          onClick={() => navigate("/register/customer")}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <FiUser className="text-white" />  
          Register as Customer
        </button>

        <button
          onClick={() => navigate("/register/venue-manager")}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <FiHome className="text-white" />  
          Register as Venue Manager
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
