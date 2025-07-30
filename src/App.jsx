import 'bootstrap/dist/css/bootstrap.min.css';
import "yet-another-react-lightbox/styles.css";

import './App.css';

import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import BeforeAfter from './components/BeforeAfter';

function App() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Hero />
      <Gallery />
      <Services />
      <BeforeAfter />
      <Footer />
    </>
  );
}

export default App;
