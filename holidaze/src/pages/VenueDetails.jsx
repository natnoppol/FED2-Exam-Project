import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For getting the dynamic ID from URL
import { getVenueById } from "../../api"; 
import { getUser } from "../../utils/auth";
import BookingForm from "../components/BookingForm"; 


const VenueDetails = ({ user }) => {
  const { venueId } = useParams(); // Get venue ID from the URL params
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isManager, setIsManager] = useState(false); // State to check if the user is a venue manager
  const loggedInUser = getUser(); // Get the logged-in user

  const handleBooking = (bookingData) => {
    // Handle the booking logic here (e.g., send the booking data to an API)
    console.log("Booking data:", bookingData);
    // You might want to show a success message or redirect after successful booking
  };

  useEffect(() => {
    // Check if the logged-in user is a venue manager
    if (user?.role === "venue_manager") {
      setIsManager(true);
    }
    
    const fetchVenueDetails = async () => {
      try {
        const data = await getVenueById(venueId); // Call getVenueById to fetch data for the selected venue
        setVenue(data); // Set venue data to state
      } catch (error) {
        setError("Failed to fetch venue details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenueDetails(); // Fetch the venue details when component mounts
  }, [venueId, loggedInUser?.role]); // Refetch if ID and Role changes (useful if route is dynamic)

  if (loading) return <p>Loading venue details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{venue.name}</h1>
      <p>{venue.description}</p>
      <img src={venue.media[0]} alt={venue.name} /> {/* Assuming media is an array */}
      <p>Price: ${venue.price}</p>
      
      {isManager ? (
        // Show buttons for venue manager
        <div>
          <button onClick={() => handleEdit(venue.id)} className="btn btn-primary">
            Edit Venue
          </button>
          <button onClick={() => handleDelete(venue.id)} className="btn btn-danger">
            Delete Venue
          </button>
        </div>
      ) : (
        // Show booking form for customers
        <BookingForm venue={venue} onBook={handleBooking} />
      )}

      {/* Show bookings for venue managers */}
      {isManager && (
        <div>
          <h3>Customer Bookings</h3>
          <ul>
            {venue.bookings?.map((booking) => (
              <li key={booking.id}>
                <p>Customer: {booking.customerName}</p>
                <p>Dates: {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}</p>
                <p>Guests: {booking.guests}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
const handleEdit = (venueId) => {
  // Navigate to the edit page (implement your navigation logic)
  console.log("Editing venue", venueId);
};

const handleDelete = async (venueId) => {
  // Call your delete API to remove the venue
  console.log("Deleting venue", venueId);
  // After deletion, you may want to redirect or update the state
};


export default VenueDetails;
