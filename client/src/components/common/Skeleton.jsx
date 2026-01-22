import "./Skeleton.css";

const Skeleton = ({ height = "20px", width = "100%" }) => {
  return <div className="skeleton" style={{ height, width }}></div>;
};

export default Skeleton;
