import "./App.css";
import { router } from "./Routes/Router.jsx";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
