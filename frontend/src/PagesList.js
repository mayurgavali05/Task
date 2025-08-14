import { useEffect, useState } from "react";
import axios from "axios";

export default function PagesList() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/pages", { withCredentials: true })
      .then((res) => setPages(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Your Facebook Pages</h2>
      <ul>
        {pages.map((p) => (
          <li key={p.id}>
            <img src={p.picture.data.url} alt={p.name} width="30" /> {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
