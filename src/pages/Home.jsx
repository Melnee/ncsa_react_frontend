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
      .then(([a, b]) => {
        setMr(a.data.results || []);
        setBr(b.data.results || []);
      })
      .catch((e) => setErr(e.message));
  }, []);
  if(err) return <div style={{padding:24,color:"crimson"}}>Error: {err}</div>;

  return (
    <main style={{maxWidth:1000,margin:"24px auto",padding:16}}>
      <h1 style={{marginTop:0}}>Product Dashboard</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:16}}>
        <ProductList title="Most Reviewed" items={mr}/>
        <ProductList title="Best Rated" items={br}/>
      </div>
    </main>
  );
}
