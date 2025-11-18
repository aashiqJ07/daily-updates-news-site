// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, Search, X } from 'lucide-react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContex.jsx';

const NEWSAPI_KEY = '87055bf8e55440909184a60c843c7b45'; // <- REPLACE THIS WITH YOUR REAL KEY

const links = ['business', 'entertainment', 'health', 'science', 'sports', 'technology'];

function Navbar({ setArticles }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);
  const cancelTokenRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Navbar unmounted');
      }
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const doSearch = async (q) => {
    if (!NEWSAPI_KEY || NEWSAPI_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('Missing NEWSAPI_KEY in Navbar.jsx. Replace with real key.');
      return;
    }

    if (cancelTokenRef.current) cancelTokenRef.current.cancel('New search');
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=40&apiKey=${encodeURIComponent(NEWSAPI_KEY)}`,
        { cancelToken: cancelTokenRef.current.token }
      );
      const items = res?.data?.articles ?? [];
      if (typeof setArticles === 'function') setArticles(items);
      navigate('/');
    } catch (err) {
      if (axios.isCancel && axios.isCancel(err)) return;
      console.error('Search error:', err);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!val || val.trim() === '') return;
      doSearch(val.trim());
    }, 600);
  };

  const toggleTheme = () => {
    if (!setTheme) return;
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
  };

  return (
    <header className="fixed w-full bg-white dark:bg-slate-900 z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/">
          <div className="md:text-2xl text-lg font-bold text-blue-600 cursor-pointer dark:text-gray-100">
            Daily Updates
          </div>
        </Link>

        <nav className="hidden md:flex space-x-6">
          {links.map((l) => (
            <Link
              key={l}
              to={`/${l}`}
              className="capitalize text-gray-700 hover:text-blue-600 transition dark:text-gray-200 dark:hover:text-blue-400"
            >
              {l}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={query}
              onChange={handleChange}
              type="text"
              placeholder="Search news..."
              className="md:pl-10 pl-8 pr-3 w-40 md:w-64 rounded-lg bg-gray-100 focus:bg-white focus:outline-none py-2"
            />
          </div>

         

          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden p-2 rounded-md bg-transparent dark:text-gray-200"
            aria-label="Open menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 bg-white dark:bg-slate-900">
          {links.map((l) => (
            <Link
              key={l}
              to={`/${l}`}
              onClick={() => setOpen(false)}
              className="block py-2 capitalize text-gray-700 hover:text-blue-600 transition dark:text-gray-200 dark:hover:text-white"
            >
              {l}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;
