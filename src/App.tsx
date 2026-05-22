import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import "./index.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Calendar from "./pages/Calendar";
import HeadToHead from "./pages/HeadToHead";
import Awards from "./pages/Awards";
import HallOfShame from "./pages/HallOfShame";
import MatchdayKings from "./pages/MatchdayKings";
import Streaks from "./pages/Streaks";
import WhatIf from "./pages/WhatIf";
import Charts from "./pages/Charts";
import Memes from "./pages/Memes";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/head-to-head" element={<HeadToHead />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/hall-of-shame" element={<HallOfShame />} />
          <Route path="/matchday-kings" element={<MatchdayKings />} />
          <Route path="/streaks" element={<Streaks />} />
          <Route path="/what-if" element={<WhatIf />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/roast" element={<Memes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
