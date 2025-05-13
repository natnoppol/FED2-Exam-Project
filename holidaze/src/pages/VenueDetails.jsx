import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenueById } from '../api';
import BookingForm from '../components/BookingForm';
import { toast } from 'react-toastify';
import { fallbackImage } from '../api';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FaWifi, FaParking, FaCoffee, FaDog } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import styles
import { Carousel } from 'react-responsive-carousel';
import { Spinner } from '../components/Spinner';

const BOOKINGS_PER_PAGE = 10;

const VenueDetails = ({ user }) => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();
  const [currentBookingsPage, setCurrentBookingsPage] = useState(1);

  const handleBookingSuccess = () => {
    toast.success('Booking successful!');
    navigate('/profile');
  };

  const handleEdit = (venueId) => {
    if (!isManager) {
      toast.error('You do not have permission to edit this venue.');
      return;
    }
    navigate(`/admin/manage-venues/${venueId}`);
  };

  const handleDelete = (venueId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this venue?'
    );
    if (!confirmDelete) return;

    toast.success(`Venue ${venueId} deleted (not yet implemented)`);
  };

  // Effect for setting isManager based on user prop
  useEffect(() => {
    if (user?.venueManager) {
      setIsManager(true);
    } else {
      setIsManager(false); // Ensure isManager is reset if user is not a manager or no user
    }
  }, [user?.venueManager]);

  // Effect for fetching venue details
  useEffect(() => {
    const fetchVenueDetails = async () => {
      setLoading(true); // Set loading true at the start of fetch
      setError(null); // Clear previous errors
      setCurrentBookingsPage(1); // Reset bookings page when fetching new venue
      try {
        const data = await getVenueById(venueId);
        setVenue(data);
      } catch (error) {
        setError('Failed to fetch venue details');
        console.error(error);
        setVenue(null); // Clear previous venue data on error
      } finally {
        setLoading(false);
      }
    };

    if (venueId) { // Only fetch if venueId is present
      fetchVenueDetails();
    }
  }, [venueId]); // Depends only on venueId

  // Pagination logic for bookings
  const allBookings = venue?.bookings || [];
  const indexOfLastBooking = currentBookingsPage * BOOKINGS_PER_PAGE;
  const indexOfFirstBooking = indexOfLastBooking - BOOKINGS_PER_PAGE;
  const currentDisplayBookings = allBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalBookingPages = Math.ceil(allBookings.length / BOOKINGS_PER_PAGE);

  const handleNextBookingsPage = () => {
    setCurrentBookingsPage((prevPage) => Math.min(prevPage + 1, totalBookingPages));
  };

  const handlePrevBookingsPage = () => {
    setCurrentBookingsPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (loading) return <Spinner message="Loading venue details..." />;

  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>

      {/* Rating Stars */}
      <div
        className="flex items-center mb-4"
        role="img"
        aria-label={
          venue.rating
            ? `Rating: ${venue.rating.toFixed(1)} out of 5`
            : 'No rating yet'
        }
      >
        {Array.from({ length: 5 }, (_, index) =>
          index < Math.round(venue.rating || 0) ? (
            <FaStar
              key={index}
              className="text-yellow-400 mr-1"
              aria-hidden="true"
            />
          ) : (
            <FaRegStar
              key={index}
              className="text-gray-400 mr-1"
              aria-hidden="true"
            />
          )
        )}
        <span className="ml-2 text-sm text-gray-600">
          {venue.rating ? `${venue.rating.toFixed(1)} / 5` : 'No rating yet'}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{venue.description}</p>

      {venue.media?.length > 0 ? (
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          className="mb-4 rounded-lg shadow"
        >
          {venue.media.map((image, index) => (
            <div key={index}>
              <img
                src={image.url}
                alt={image.alt || `Venue image ${index + 1}`}
                className="object-cover h-64 w-full rounded-lg"
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <img
          src={fallbackImage}
          alt={venue.name}
          className="w-full h-64 object-cover rounded-lg shadow mb-4"
        />
      )}

      <p className="text-lg font-bold text-green-700 mb-4">
        ${venue.price} / night
      </p>

      {/* Location Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <p>
          {venue.location?.address}, {venue.location?.city},{' '}
          {venue.location?.zip}
        </p>
        <p>
          {venue.location?.country}, {venue.location?.continent}
        </p>
      </div>

      {/* Amenities Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-700">
          <li className="flex items-center gap-2">
            <FaWifi /> {venue.meta?.wifi ? 'WiFi' : 'No WiFi'}
          </li>
          <li className="flex items-center gap-2">
            <FaParking /> {venue.meta?.parking ? 'Parking' : 'No Parking'}
          </li>
          <li className="flex items-center gap-2">
            <FaCoffee /> {venue.meta?.breakfast ? 'Breakfast' : 'No Breakfast'}
          </li>
          <li className="flex items-center gap-2">
            <FaDog /> {venue.meta?.pets ? 'Pet Friendly' : 'No Pets'}
          </li>
        </ul>
      </div>

      {/* Manager Actions or Booking Form */}
      {isManager && venue.owner?.email === user?.email ? (
        // Venue belongs to this manager
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleEdit(venue.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
          >
            Edit Venue
          </button>

          <button
            onClick={() => handleDelete(venue.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Venue
          </button>
        </div>
      ) : (
        // Only show booking form to customers or other users
        <BookingForm
          venue={venue}
          bookings={venue.bookings}
          onBook={handleBookingSuccess}
        />
      )}

      {/* Show Bookings for Venue Manager */}
      {isManager && venue.owner?.name === user?.name && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Customer Bookings</h3>
          {/* {venue.bookings?.length ? ( */}
          {currentDisplayBookings.length > 0 ? (
            <ul className="space-y-4">
              {currentDisplayBookings.map((booking) => (
                <li key={booking.id} className="border p-4 rounded">
                  <p>
                    <strong>Customer:</strong> {booking.customer?.name}
                  </p>
                  <p>
                    <strong>Dates:</strong>{' '}
                    {new Date(booking.dateFrom).toLocaleDateString()} -{' '}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Guests:</strong> {booking.guests}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet.</p>
          )}
          {allBookings.length > 0 && totalBookingPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button onClick={handlePrevBookingsPage} disabled={currentBookingsPage === 1} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-blue-600 hover:text-white cursor-pointer disabled:opacity-50">Previous</button>
              <span className="px-4 py-2 self-center">Page {currentBookingsPage} of {totalBookingPages}</span>
              <button onClick={handleNextBookingsPage} disabled={currentBookingsPage === totalBookingPages} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-blue-600 hover:text-white cursor-pointer disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
