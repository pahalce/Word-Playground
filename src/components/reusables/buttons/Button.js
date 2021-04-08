const Button = ({ text, className, ...props }) => {
  return (
    <button className={className ? className + " button shadow" : "button shadow"} {...props}>
      {text}
    </button>
  );
};

export default Button;
