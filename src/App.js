import "./app.css";
import ViewComp from "./Components/ViewComp";
// import { BrowserView, MobileView } from 'react-responsive';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ViewComp />
      <ToastContainer />
    </div>
  );
}

export default App;
