// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Navbar from "./components/Navbar";

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/" replace />;
// }

// export default function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <div className="p-4 text-lg font-bold">
//                 Welcome to Dashboard 🚀
//               </div>
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }