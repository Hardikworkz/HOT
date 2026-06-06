function LineReveal({ as: Tag = "div", className = "", lines, align = "left", ...props }) {
  const Wrapper = Tag === "p" ? "span" : "div";
  const accessibleText = lines.join(" ");

  return (
    <Tag className={className} {...props}>
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {accessibleText}
      </span>
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
