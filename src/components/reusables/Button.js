const Button = ({ text, ...props }) => {
  return (
    <button className="button shadow" {...props}>
      {text}
    </button>
  );
};

export default Button;
