import { useEffect, useState } from "react";
import ProductList from "../components/ProductList.jsx";
import { MakeBackendRequest } from "../services/MakeBackendRequest.js";

export default function Home() {
  const [mr,setMr] = useState([]);
  const [br,setBr] = useState([]);
  const [err,setErr] = useState(null);

  useEffect(() => {
    Promise.all([
      MakeBackendRequest({ urlSuffix: "/api/products", queryParamsObject: { by: "most_reviewed" } }),
      MakeBackendRequest({ urlSuffix: "/api/products", queryParamsObject: { by: "best_rated" } }),
    ])
      .then(([a,b]) => { setMr(a.data.results||[]); setBr(b.data.results||[]); })
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <div style={{padding:24,color:"crimson"}}>Error: {err}</div>;

  return (
    <main style={{maxWidth:1000,margin:"16px auto",padding:"8px 12px"}}>
      {/* mobile styles */}
      <style>{`
        .section-grid{ display:grid; grid-template-columns:1fr; gap:16px; }
        @media (min-width:640px){ .section-grid{ grid-template-columns:1fr; } }
        @media (min-width:768px){ .section-grid{ grid-template-columns:1fr; } } /* keep single col */
      `}</style>

      <h1 style={{margin:"8px 0"}}>Product Dashboard</h1>
      <div className="section-grid">
        <ProductList title="Most Reviewed" items={mr}/>
        <ProductList title="Best Rated" items={br}/>
      </div>
    </main>
  );
}
