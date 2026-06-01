import { useEffect, useMemo, useRef, useState } from "react";
import "./projects-section.css";
import ButtonLabel from "../shared/ButtonLabel.jsx";

function getImageTransform(isActive) {
  const translatePercent = isActive ? 4.567 : 3.7399;
  const scale = isActive ? 1.0152 : 1.0125;

  return `translate(0%, ${translatePercent}%) translate3d(0px, 0px, 0px) scale(${scale}, ${scale})`;
}

function ProjectSlide({
  activeProject,
  cloneId,
  cloneType,
  onProjectChange,
  project,
  projectIndex,
  totalProjects,
}) {
  const isActive = projectIndex === activeProject;
  const isPrev = projectIndex === (activeProject + totalProjects - 1) % totalProjects;
  const isNext = projectIndex === (activeProject + 1) % totalProjects;
  
  const classes = [
    "splide__slide",
    "projects-slide",
    cloneType ? "splide__slide--clone" : "",
    isActive ? "is-active" : "",
    isActive ? "is-visible" : "",
    isPrev ? "is-prev" : "",
    isNext ? "is-next" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const id = cloneId ?? `splide01-slide0${projectIndex + 1}`;

  return (
    <div
      aria-current={isActive ? "true" : undefined}
      aria-hidden={cloneType ? "true" : !isActive ? "true" : undefined}
      aria-label={`Go to slide ${projectIndex + 1}`}
      className={classes}
      id={id}
      role="button"
      style={{ marginRight: "14rem", width: "calc(100% + 0rem)" }}
      tabIndex={cloneType || !isActive ? -1 : 0}
      onClick={() => onProjectChange(projectIndex)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onProjectChange(projectIndex);
        }
      }}
    >
      <div className="projects-slide-img" data-reveal>
        <div className="projects-slide-media" data-parallax>
          <img
            alt={project.alt}
            className="img-full-cover"
            data-anim="img-paralax"
            height="1176"
            loading="lazy"
            sizes="(max-width: 991px) 90vw, 807px"
            src={project.image}
            style={{
              translate: "none",
              rotate: "none",
              scale: "none",
              transform: getImageTransform(isActive),
            }}
            width="897"
          />
        </div>
        <div
          className="projects-slide-overlay image-overlay"
          data-image-overlay
        ></div>
      </div>
    </div>
  );
}

function ProjectsSection({ activeProject, onProjectChange, onProjectOpen, projects }) {
  const sectionRef = useRef(null);
  const pointerStartXRef = useRef(null);
  
  const [headingVisible, setHeadingVisible] = useState(false);

  const leadingClones = useMemo(() => projects.slice(-2), [projects]);
  const trailingClones = useMemo(() => projects.slice(0, 2), [projects]);

  const leadingCount = leadingClones.length;
  const [visualPosition, setVisualPosition] = useState(activeProject + leadingCount);
  const [isSnapping, setIsSnapping] = useState(false);
  
  const prevActiveProject = useRef(activeProject);
  const visualPositionRef = useRef(visualPosition);

  useEffect(() => {
    visualPositionRef.current = visualPosition;
  }, [visualPosition]);

  useEffect(() => {
    if (prevActiveProject.current === activeProject) return;

    const total = projects.length;
    let diff = activeProject - prevActiveProject.current;

    if (diff < -total / 2) {
      diff += total; 
    } else if (diff > total / 2) {
      diff -= total;
    }

    setIsSnapping(false);
    setVisualPosition((prev) => prev + diff);
    prevActiveProject.current = activeProject;
  }, [activeProject, projects.length]);

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return;

    const total = projects.length;
    const currentPos = visualPositionRef.current;

    if (currentPos >= total + leadingCount) {
      setIsSnapping(true);
      setVisualPosition(currentPos - total);
    } else if (currentPos < leadingCount) {
      setIsSnapping(true);
      setVisualPosition(currentPos + total);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setHeadingVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const moveBy = (step) => {
    onProjectChange((activeProject + step + projects.length) % projects.length);
  };

  const handlePointerDown = (event) => {
    pointerStartXRef.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (pointerStartXRef.current === null) return;

    const deltaX = event.clientX - pointerStartXRef.current;
    pointerStartXRef.current = null;

    if (Math.abs(deltaX) < 50) return;
    moveBy(deltaX < 0 ? 1 : -1);
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
  };

  return (
    <section id="rooms-section" className="projects" data-projects-intro ref={sectionRef}>
      <div className="page-padding" data-projects-sticky>
        <div className="container">
          <div className="wrap projects-wrap">
            <div
              aria-label="Project living slider"
              aria-roledescription="carousel"
              className="splide projects-slider is-overflow is-initialized splide--loop splide--ltr splide--nav is-active projects-carousel"
              id="splide01"
              role="region"
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  moveBy(1);
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  moveBy(-1);
                }
              }}
            >
              <div className={`projects-heading ${headingVisible ? "is-visible" : ""}`}>
                <div className="caption">
                  <div className="projects-kicker main-heading">(Escape Rooms)</div>
                </div>
                <ul aria-label="Select a slide to show" className="splide__pagination projects-pagination" style={{ cursor: 'pointer' }} role="tablist">
                  {projects.map((project, index) => (
                    <li key={project.navLabel} role="presentation">
                      <button aria-controls={`splide01-slide0${index + 1}`} aria-label={`Go to slide ${index + 1}`} aria-selected={activeProject === index ? "true" : "false"} className={`splide__pagination__page projects-pagination-page${activeProject === index ? " is-active" : ""}`} role="tab" tabIndex={activeProject === index ? undefined : -1} type="button" onClick={() => onProjectChange(index)}>
                        <span>{`(${index + 1})`}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`project-title-stack project-titles ${headingVisible ? "is-visible" : ""}`}>
                {projects.map((project, index) => (
                  <div
                    className={`project-title${index === 0 ? " is-first" : ""}${activeProject === index ? " is-active" : ""}`}
                    data-project={index}
                    key={project.navLabel}
                  >
                    <h2 className="h4 mob-h7" aria-label={project.titleLines.join(" ")}>
                      {project.titleLines.map((line, i) => (
                        <div key={i} aria-hidden="true" style={{ position: "relative", display: "block", textAlign: "center", overflow: "clip" }}>
                          <div aria-hidden="true" style={{ position: "relative", display: "block", textAlign: "center", translate: "none", rotate: "none", scale: "none", transform: "translate(0px, 0%)" }}>
                            {line}&nbsp;
                          </div>
                        </div>
                      ))}
                    </h2>
                  </div>
                ))}
              </div>

              <div
                className="splide__track projects-track splide__track--loop splide__track--ltr splide__track--nav"
                data-projects-track
                id="splide01-track"
                style={{ paddingLeft: "0px", paddingRight: "0px" }}
                onPointerCancel={handlePointerCancel}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                <div
                  className="splide__list projects-list"
                  id="splide01-list"
                  role="presentation"
                  style={{
                    "--active-position": visualPosition,
                    ...(isSnapping ? { transition: "none" } : {}),
                  }}
                  onTransitionEnd={handleTransitionEnd} 
                >
                  {leadingClones.map((project, index) => (
                    <ProjectSlide activeProject={activeProject} cloneId={`splide01-clone0${index + 1}`} cloneType="before" key={`before-${project.navLabel}`} onProjectChange={onProjectChange} project={project} projectIndex={projects.length - leadingClones.length + index} totalProjects={projects.length} />
                  ))}

                  {projects.map((project, index) => (
                    <ProjectSlide activeProject={activeProject} key={project.navLabel} onProjectChange={onProjectChange} project={project} projectIndex={index} totalProjects={projects.length} />
                  ))}

                  {trailingClones.map((project, index) => (
                    <ProjectSlide activeProject={activeProject} cloneId={`splide01-clone0${leadingClones.length + index + 1}`} cloneType="after" key={`after-${project.navLabel}`} onProjectChange={onProjectChange} project={project} projectIndex={index} totalProjects={projects.length} />
                  ))}
                </div>
              </div>
            </div>

            <div className={`project-texts ${headingVisible ? "is-visible" : ""}`} data-projects-texts style={{ position: "relative" }}>
              {projects.map((project, index) => (
                <div
                  className={`project-text${index === 0 ? " is-first" : ""}${activeProject === index ? " is-active" : ""}`}
                  data-project={index}
                  key={`${project.navLabel}-summary`}
                  /* FIX applied here: Manages visibility strictly so they do not overlap vertically or stack visibly */
                  style={{
                    position: activeProject === index ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    opacity: activeProject === index ? 1 : 0,
                    visibility: activeProject === index ? "visible" : "hidden",
                    pointerEvents: activeProject === index ? "auto" : "none",
                    zIndex: activeProject === index ? 2 : 1,
                    transition: "opacity 0.4s ease, visibility 0.4s ease"
                  }}
                >
                  <p className="b1" aria-label={project.summaryLines.join(" ")}>
                    {project.summaryLines.map((line, i) => (
                      <span key={i} aria-hidden="true" style={{ position: "relative", display: "block", overflow: "clip" }}>
                        <span aria-hidden="true" style={{ position: "relative", display: "block", translate: "none", rotate: "none", scale: "none", transform: "translate(0px, 0%)" }}>
                          {line}&nbsp;
                        </span>
                      </span>
                    ))}
                  </p>
                  
                  <a
                    className="btn stroke-btn in-project"
                    data-open-modal=""
                    data-project-index={index}
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      onProjectOpen(index, event.currentTarget);
                    }}
                  >
                    <ButtonLabel>LEARN MORE</ButtonLabel>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;