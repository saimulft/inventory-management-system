import { useLocation } from "react-router-dom";

const PageName = () => {
    const {pathname} = useLocation()
    return (
        <>
            {pathname === '/dashboard/home' && 'Dashboard'}
            {pathname.includes('/dashboard/management') && 'Management'}
            {pathname === '/dashboard/all-stores' && 'All Stores'}
            {pathname?.includes('/dashboard/all-stores/store-edit') && 'Update Store'}
            {pathname?.includes('/dashboard/add-store') && 'Add Store'}
            {pathname?.includes('/dashboard/profit-tracker') && 'Profit Tracker'}
            {pathname === '/dashboard/pending-arrival-from' && 'Pending Arrival'}
            {pathname === '/dashboard/sales-form' && 'Sales Form'}
            {pathname === '/dashboard/preparing-request-from' && 'Preparing Request'}
            {pathname === '/dashboard/add-ASIN-UPC-from' && 'Add ASIN/UPC'}
            {pathname === '/dashboard/support' && 'Support'}
            {pathname?.includes('/dashboard/settings') && 'Settings'}
        </>
    );
};

export default PageName;