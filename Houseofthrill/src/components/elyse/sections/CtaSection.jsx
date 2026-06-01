import ButtonLabel from "../shared/ButtonLabel.jsx";
import { CloseIcon } from "../shared/Icons.jsx";

function CtaSection({ formValues, onInputChange, onClearField, onSubmit, submitted }) {
  return (
    <section
      className="relative min-h-screen overflow-clip bg-[#141210] px-[clamp(0.95rem,3.2vw,3rem)] py-[clamp(4.2rem,9vw,7rem)]"
      id="book-a-visit"
    >
      <div className="relative z-[2] mx-auto max-w-[104rem]">
        <div className="grid items-end gap-[clamp(2rem,4vw,4rem)] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.85fr)]">
          <div className="grid max-w-[31rem] gap-4 self-start">
            <h2
              className="m-0 max-w-[12ch] text-[clamp(1.8rem,2.7vw,2.4rem)] leading-[1.05] [font-family:var(--font-display)]"
              data-reveal
            >
              Discover the Essence of Calm Living
            </h2>
            <p className="m-0 text-[clamp(0.98rem,1.05vw,1.05rem)] leading-[1.55] text-[rgba(245,239,230,0.9)] [font-family:var(--font-body)]" data-reveal>
              Experience the harmony of timeless design and wellness-centered
              living. Schedule a private viewing or request a brochure to begin
              your journey toward refined serenity.
            </p>
          </div>

          <div className="w-full max-w-[34rem] justify-self-end" data-reveal>
            <div className="relative border border-[rgba(245,239,230,0.12)] bg-[rgba(15,13,12,0.62)] p-[clamp(1.35rem,2vw,1.8rem)] backdrop-blur-[14px]">
              <form className="relative" onSubmit={onSubmit}>
                <div className="mb-[1.6rem] grid gap-[0.7rem]">
                  <h2 className="m-0 text-[clamp(2.2rem,5vw,4.85rem)] uppercase leading-[0.9] [font-family:var(--font-display)]">
                    Envision <span className="text-[#f6f0e8]">Your Life at Elyse</span>
                  </h2>
                  <p className="m-0 text-[clamp(0.98rem,1.05vw,1.05rem)] leading-[1.55] text-[rgba(245,239,230,0.68)] [font-family:var(--font-body)]">
                    Our manager will contact you as soon as possible.
                  </p>
                </div>

                <div className="grid gap-[0.85rem]">
                  {["name", "email", "phone"].map((field) => (
                    <div className="relative" key={field}>
                      <input
                        className="w-full border border-[rgba(245,239,230,0.16)] bg-[rgba(255,255,255,0.02)] px-4 py-[0.9rem] pr-12 text-[var(--color-text)] outline-none placeholder:text-[rgba(245,239,230,0.42)] focus:border-[rgba(245,239,230,0.34)] [font-family:var(--font-body)]"
                        name={field}
                        placeholder={field === "email" ? "Email" : field === "phone" ? "Phone" : "Name"}
                        required={field !== "phone"}
                        type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                        value={formValues[field]}
                        onChange={(event) => onInputChange(field, event.target.value)}
                      />
                      {formValues[field] ? (
                        <button
                          aria-label={`clear ${field}`}
                          className="absolute right-[0.85rem] top-1/2 inline-flex h-[1.4rem] w-[1.4rem] -translate-y-1/2 items-center justify-center bg-transparent text-[rgba(245,239,230,0.46)]"
                          type="button"
                          onClick={() => onClearField(field)}
                        >
                          <CloseIcon />
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-[1.2rem] grid gap-4">
                  <button
                    className="inline-flex min-h-12 w-fit items-center justify-center rounded-full border border-[rgba(245,239,230,0.44)] px-[1.8rem] py-3 text-[var(--color-text)] transition-colors duration-300 hover:border-white hover:bg-white hover:text-[var(--color-surface)]"
                    type="submit"
                  >
                    <ButtonLabel>request</ButtonLabel>
                  </button>
                  <p className="m-0 text-[0.88rem] leading-[1.5] text-[rgba(245,239,230,0.68)] [font-family:var(--font-body)]">
                    By sending your request, you&apos;re agreeing to our privacy
                    policy. We promise to keep your personal information safe
                    and secure
                  </p>
                </div>
              </form>

              {submitted ? (
                <div className="mt-4 border border-[rgba(148,220,177,0.24)] bg-[rgba(148,220,177,0.08)] p-4">
                  <div className="text-[0.98rem] leading-[1.4] [font-family:var(--font-body)]">
                    Thank you!
                    <br />
                    Your submission has been received!
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0">
        <div className="h-full w-full" data-parallax>
          <img
            alt="Modern glass-walled house lit warmly at dusk with surrounding trees and garden."
            className="hidden h-full w-full object-cover md:block"
            loading="lazy"
            src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881d5049ac7d72bb5f18f_cta-img--d.avif"
          />
          <img
            alt="Modern house with large glass windows illuminated at night, surrounded by trees and garden."
            className="block h-full w-full object-cover md:hidden"
            loading="lazy"
            src="https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec/693881c82316816e1085777d_cta-img--mob.avif"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,17,16,0.04),rgba(18,17,16,0.52))]"></div>
      </div>
    </section>
  );
}

export default CtaSection;
