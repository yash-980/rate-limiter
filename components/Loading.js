export default function Loading({ message = "Loading..." }) {
  return (
    <div className="container main">
      <div className="panel">{message}</div>
    </div>
  );
}
