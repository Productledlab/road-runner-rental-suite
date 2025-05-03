
import AppLayout from "@/components/layout/AppLayout";
import CustomerTable from "@/components/customers/CustomerTable";

const CustomersPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="page-title">Customers</h1>
        
        <CustomerTable />
      </div>
    </AppLayout>
  );
};

export default CustomersPage;
