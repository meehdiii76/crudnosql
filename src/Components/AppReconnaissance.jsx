import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import Pagination from "react-js-pagination";
import { Link, useParams, useHistory } from "react-router-dom";
//a remplacer si on met sur heroku
const uri = "http://localhost:8080";
function App() {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [img, setImg] = useState([]);
  const [actualImg, setActualImg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordre, setOrdre] = useState(true);

  useEffect(() => {
    axios.get(uri + "/predictions").then((response) => {
      setImg(response.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (img !== []) {
      setActualImg(img.slice((page - 1) * 10, page * 10));
    }
  }, [img]);

  useEffect(() => {
    if (img !== []) {
      setActualImg(img.slice((page - 1) * 10, page * 10));
    }
  }, [page]);

  useEffect(() => {
    if (img !== []) {
      let l;
      if (ordre) {
        l = img.sort(function (a, b) {
          return new Date(a.host_since) - new Date(b.host_since);
        });
      } else {
        l = img.sort(function (a, b) {
          return new Date(b.host_since) - new Date(a.host_since);
        });
      }
      console.log(l);
      setActualImg(l.slice((1 - 1) * 10, 1 * 10));
      setPage(1);
    }
  }, [ordre]);

  function handleChangePage(p) {
    setPage(p);
  }

  function sortArray() {
    setOrdre(!ordre);
  }

  return !loading ? (
    <>
      <table>
        <thead>
          <tr>
            <td>Image</td>
            <td>Nom</td>
            <td>Probabilité</td>
            <td>Date</td>
            <td>
              <button onClick={sortArray}>Trier par date</button>
            </td>
          </tr>
        </thead>
        <tbody>
          {actualImg?.map((elem, index) => {
            return (
              <tr key={index}>
                <td>
                  <img src={`data:image;base64, ${elem.image}`} />
                </td>
                <td>{elem.analyse.type}</td>
                <td>{elem.analyse.taux}</td>
                <td>{elem.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {img !== undefined && (
        <div className="row pagination-bottom">
          <div className="mx-auto">
            <Pagination
              itemClass="page-item"
              linkClass="page-link"
              activePage={page}
              itemsCountPerPage={10}
              totalItemsCount={img.length}
              pageRangeDisplayed={5}
              onChange={handleChangePage}
            />
          </div>
        </div>
      )}

      <br />

      <button
        onClick={() => {
          history.push("/reconnaissance/");
        }}
      >
        Reconnaissance d'image
      </button>
    </>
  ) : (
    <>Chargement...</>
  );
}

export default App;
