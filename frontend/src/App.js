import Home from './views/Home.js'
import User from './admin/user/Users.js'
import Transaction from './admin/transaction/Transaction'
import TransactionUsers from './views/TransactionUser'
import TransactionCreate from './views/TransactionCreate'
import { RequireToken, RequireAdmin} from "./security/Auth";
import Login from "./views/Login"
import UserCreate from './admin/user/UserCreate'
import UserEdit from './admin/user/UserEdit'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={ <Login />} />
        <Route  path="/home" element={<RequireToken> <Home /></RequireToken>} />
        <Route  path="/userCreate" element={<RequireAdmin> <UserCreate /></RequireAdmin>} />
        <Route  path="/userEdit" element={<RequireAdmin> <UserEdit /></RequireAdmin>} />
        <Route  path="/users" element={<RequireAdmin> <User /> </RequireAdmin>} />
        <Route  path="/transaction" element={<RequireToken> <Transaction /> </RequireToken>} />
        <Route  path="/transactionUser" element={<RequireToken> <TransactionUsers /> </RequireToken>} />
        <Route  path="/transactionCreate" element={<RequireToken> <TransactionCreate /> </RequireToken>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
