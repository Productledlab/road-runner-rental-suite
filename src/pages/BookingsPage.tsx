
import AppLayout from "@/components/layout/AppLayout";
import BookingTable from "@/components/bookings/BookingTable";

const BookingsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="page-title">Bookings</h1>
        
        <BookingTable />
      </div>
    </AppLayout>
  );
};

export default BookingsPage;
