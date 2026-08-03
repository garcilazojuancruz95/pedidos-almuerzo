import "./Card.css";

export default function Card({ title, value }) {
  return (
    <div className="card">
      <span className="card-title">{title}</span>
      <h2 className="card-value">{value}</h2>
    </div>
  );
}