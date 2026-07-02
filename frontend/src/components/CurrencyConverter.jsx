import { useState } from 'react';
import { ArrowRight, Coins } from 'lucide-react';
import { currencyApi } from '../api';

const CURRENCIES = [
  'USD', 'PKR', 'EUR', 'GBP', 'INR', 'AED', 'SAR', 'JPY',
  'CAD', 'AUD', 'CHF', 'CNY', 'SGD', 'BDT', 'NPR',
];

export default function CurrencyConverter() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('PKR');
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleConvert(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await currencyApi.convert(from, to, amount);
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card currency-converter">
      <div className="section-title">
        <Coins size={17} strokeWidth={2} />
        <h2>Currency Converter</h2>
        <span className="badge">ExchangeRate API</span>
      </div>

      <form onSubmit={handleConvert}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          aria-label="Amount"
        />
        <select value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From currency">
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ArrowRight size={16} className="arrow-icon" />
        <select value={to} onChange={(e) => setTo(e.target.value)} aria-label="To currency">
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Converting…' : 'Convert'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {result && (
        <p className="result">
          <strong>{result.amount} {result.from}</strong> = <strong>{result.converted.toFixed(2)} {result.to}</strong>
          <span className="result-meta"> · rate {result.rate} · {result.date}</span>
        </p>
      )}
    </section>
  );
}
