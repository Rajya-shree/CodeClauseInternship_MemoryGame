import photo from "../assets/photo.jpeg";

function Card(props) {
  let { id, flip, value, setCompareArr } = props;

  const handleClick = (id) => {
    setCompareArr({ id, value, flip: true });
  };

  return (
    <div className="flip-card" onClick={() => handleClick(id)} id={id}>
      <div className={`flip-card-inner  ${flip ? "flip" : "no-flip"}`}>
        <div className="flip-card-front">
          <img src={photo} alt="" style={{ opacity: 0.8 }} />
        </div>
        <div className="flip-card-back">
          <h1>{value}</h1>
        </div>
      </div>
    </div>
  );
}

export default Card;
