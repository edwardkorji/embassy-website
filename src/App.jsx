import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

const Home = lazy(() => import("./pages/Home"));
const Publications = lazy(() => import("./pages/Publications"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publications" element={<Publications />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
