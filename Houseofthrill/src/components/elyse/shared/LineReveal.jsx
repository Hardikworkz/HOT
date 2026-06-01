function LineReveal({ as: Tag = "div", className = "", lines, align = "left", ...props }) {
  const Wrapper = Tag === "p" ? "span" : "div";

  return (
    <Tag className={className} {...props}>
      {lines.map((line, index) => (
        <Wrapper
          aria-hidden="true"
          className="line-reveal-outer"
          key={`${line}-${index}`}
          style={{
            position: "relative",
            display: "block",
            textAlign: align,
            overflow: "clip",
          }}
        >
          <Wrapper
            aria-hidden="true"
            className="line-reveal-inner"
            style={{
              position: "relative",
              display: "block",
              textAlign: align,
            }}
          >
            {line}
          </Wrapper>
        </Wrapper>
      ))}
    </Tag>
  );
}

export default LineReveal;
