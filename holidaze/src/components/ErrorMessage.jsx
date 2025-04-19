
const ErrorMessage = ({ message }) => {
    return message ? (
      <div className="text-red-500 text-center mt-2">{message}</div>
    ) : null;
  };
  
  export default ErrorMessage;
  