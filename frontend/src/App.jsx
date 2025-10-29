import { useState } from "react";
import "./styles/theme.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <main className="container">
        <h1>Bienvenue sur AppliPlumeroWeb 📚</h1>
        <p>Votre univers littéraire en ligne.</p>
        <button onClick={() => setCount(count + 1)}>
          Vous avez cliqué {count} fois
        </button>
      </main>
      <Footer />
    </>
  );
}

export default App;
