import './App.css'
import LoginPage from './users/Auth/loginpage'
import SignupPage from './users/Auth/signuppage'
import ForgotPasswordPage from './users/Auth/forgotpassword'
import ResetPasswordPage from './users/Auth/resetpassword'
import HomePage from './users/pages/guest/home'
import Shop from './users/pages/guest/shop'
import ExplorePage from './users/pages/guest/explore'
import OffersPage from './users/pages/guest/offers'
import BookDetailPage from './users/pages/guest/bookdetail'
import UserDash from './users/pages/authed/dash'
import CartPage from './users/pages/authed/cart'
import ProfilePage from './users/pages/authed/profile'
import OrderHistory from './users/pages/authed/orders'
import AdminBookPage from './users/pages/admin/Books'
import UsersPage from './users/pages/admin/users'
import AdminDash from './users/pages/admin/dash'
import ReportsPage from './users/pages/admin/RF'
import OrdersPage from './users/pages/admin/orders'
import Announcements from './users/pages/admin/Announcements'
import StaffDash from './users/pages/staffs/dash'


import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App(){
  return(<>
    <Routes>
        {/*user*/}
        <Route path="/" element={<Navigate to="/login"/>}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/home" element={<HomePage></HomePage>}></Route>
        <Route path="/books" element={<Shop/>}></Route>
        <Route path="/explore" element={<ExplorePage/>}></Route>
        <Route path="/offers" element={<OffersPage/>}></Route>
        <Route path="/book/:id" element={<BookDetailPage/>}></Route>
        <Route path="/dashboard" element={<UserDash/>}></Route>
        <Route path="/cart" element={<CartPage/>}></Route>
        <Route path="/profile" element={<ProfilePage/>}></Route>
        <Route path="/orders" element={<OrderHistory/>}></Route>
        {/*Staff\*/ }
        <Route path="/staff/dashboard" element={<StaffDash/>}></Route>

        {/*admin*/}
        <Route path="/admin/dashboard" element={<AdminDash/>}></Route>
        <Route path="/admin/books" element={<AdminBookPage/>}></Route>
        <Route path="/admin/users" element={<UsersPage/>}></Route>
        <Route path="/admin/reports" element={<ReportsPage/>}></Route>
        <Route path="/admin/orders" element={<OrdersPage/>}></Route>
        <Route path="/admin/announcements" element={<Announcements/>}></Route>

    </Routes>
  </>);
}
export default App;
