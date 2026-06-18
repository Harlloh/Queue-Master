import { Link } from "react-router-dom";
import {
  RiQrCodeLine,
  RiListOrdered,
  RiMapPinLine,
  RiPulseLine,
  RiSettings4Line,
  RiShieldCheckLine,
  RiTimeLine,
  RiTeamLine,
  RiAlertLine,
  RiFingerprintLine,
  RiCheckboxCircleLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { MdLock, MdQrCode } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";

const Section = ({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section id={id} className={`w-full px-6 sm:px-8 ${className}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

const FeatureCard = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) => (
  <div className="group card-elevated p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
    <div className="w-11 h-11 rounded-lg bg-brand-soft text-brand flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2b7234] flex items-center justify-center">
              <MdLock className="text-white text-lg" />
            </div>
            <span className="text-black font-bold text-sm tracking-widest uppercase">
              CDS Admin
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#security"
              className="hover:text-foreground transition-colors"
            >
              Security
            </a>
            <a
              href="#benefits"
              className="hover:text-foreground transition-colors"
            >
              Benefits
            </a>
          </nav>
          <Link
            to="/admin-login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign in
            <RiArrowRightLine className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <Section className="pt-16 sm:pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Built for NYSC CDS meetings
            </div> */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Attendance Management
              <br />
              <span className="text-brand">Without the Queue</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              Generate attendance sessions, verify location, assign queue
              numbers automatically, and confirm physical presence with QR-based
              check-ins.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/admin-login"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-brand text-brand-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Sign in <RiArrowRightLine className="w-4 h-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-accent transition-colors"
              >
                Learn How It Works
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Accounts are issued by{" "}
              <a href="mailto:alloolorunfemi@gmail.com" className="underline">
                the developer
              </a>
              . Public sign-up is disabled.
            </p>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <RiShieldCheckLine className="w-4 h-4 text-brand" /> Geofenced
              </div>
              <div className="flex items-center gap-1.5">
                <RiFingerprintLine className="w-4 h-4 text-brand" /> Device
                verified
              </div>
              <div className="flex items-center gap-1.5">
                <RiCheckboxCircleLine className="w-4 h-4 text-brand" /> Unique
                queue IDs
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-scale-in">
            <div className="absolute -inset-6 bg-linear-to-tr from-brand-soft via-transparent to-transparent rounded-3xl blur-2xl" />
            <div className="relative card-elevated p-6 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground">Live session</p>
                  <p className="font-semibold">Ikeja LGA · Thursday CDS</p>
                </div>
                <span className="badge-open">Open</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-4 bg-brand-soft/40">
                  <p className="text-xs text-muted-foreground mb-2">
                    Your queue #
                  </p>
                  <p className="text-4xl font-bold text-brand tabular-nums">
                    042
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RiTimeLine className="w-3.5 h-3.5" /> Checked in 10:14 AM
                  </div>
                </div>
                <div className="rounded-xl border border-border p-4 flex flex-col items-center justify-center bg-card">
                  <div className=" rounded-lg bg-foreground p-2 flex gap-px items-center">
                    <MdQrCode size={85} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Verification QR
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Live attendance
                  </p>
                  <span className="text-xs text-brand font-semibold">
                    128 present
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { n: "041", name: "A. Bello", s: "NYSC/LA/24/A1289" },
                    { n: "042", name: "You", s: "NYSC/LA/24/B0412" },
                    { n: "043", name: "C. Okafor", s: "NYSC/LA/24/C7741" },
                  ].map((r) => (
                    <div
                      key={r.n}
                      className={`flex items-center justify-between text-sm py-1.5 px-2 rounded-md ${
                        r.name === "You" ? "bg-brand-soft" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground w-8">
                          #{r.n}
                        </span>
                        <span className="font-medium">{r.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {r.s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Problem */}
      <Section className="py-20 border-t border-border bg-secondary/40">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-brand mb-2">The problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Manual attendance doesn't scale.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hundreds of corpers writing numbers by hand creates bottlenecks,
            delays, and unreliable records every CDS day.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: RiTimeLine,
              t: "Long queues before meetings",
              d: "Corpers waste hours waiting to write their numbers.",
            },
            {
              icon: RiListOrdered,
              t: "Slow manual numbering",
              d: "Officials assign queue numbers one by one, by hand.",
            },
            {
              icon: RiAlertLine,
              t: "Duplicate entries",
              d: "The same corper appears multiple times across registers.",
            },
            {
              icon: RiShieldCheckLine,
              t: "Hard to verify presence",
              d: "No way to confirm someone actually showed up.",
            },
            {
              icon: RiTeamLine,
              t: "Bottlenecks at scale",
              d: "Large CDS groups overwhelm a single attendance desk.",
            },
            {
              icon: RiPulseLine,
              t: "No real-time visibility",
              d: "Admins can't see attendance counts as they happen.",
            },
          ].map((p) => (
            <div key={p.t} className="card-elevated p-5">
              <div className="w-9 h-9 rounded-lg bg-destructive text-red-500 flex items-center justify-center mb-3">
                <p.icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{p.t}</h3>
              <p className="text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how" className="py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-brand mb-2">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Four steps from queue to confirmed attendance
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              n: "01",
              icon: RiSettings4Line,
              t: "Admin creates a session",
              d: "Open a new attendance session with location and time settings.",
            },
            {
              n: "02",
              icon: RiQrCodeLine,
              t: "Corpers scan the QR",
              d: "Each corper scans the session QR code displayed at the venue or by visiting the url for the LGA.",
            },
            {
              n: "03",
              icon: RiMapPinLine,
              t: "Location is verified",
              d: "The app confirms the corper is within the approved boundary.",
            },
            {
              n: "04",
              icon: RiCheckboxCircleLine,
              t: "Queue number issued",
              d: "A unique number and personal QR are generated for verification.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="card-elevated p-6 relative overflow-hidden"
            >
              <span className="absolute top-4 right-4 text-xs font-mono text-muted-foreground/70">
                {s.n}
              </span>
              <div className="w-11 h-11 rounded-lg bg-brand text-brand-foreground flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-1.5">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section id="features" className="py-24 border-t border-border">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-brand mb-2">Key features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to run attendance
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={RiQrCodeLine}
            title="QR-based check-in"
            desc="Corpers scan a session QR to start their check-in instantly."
          />
          <FeatureCard
            icon={RiListOrdered}
            title="Automatic queue assignment"
            desc="Numbers are issued in order, with no manual coordination."
          />
          <FeatureCard
            icon={RiMapPinLine}
            title="Geofence verification"
            desc="Only corpers physically inside the venue can check in."
          />
          <FeatureCard
            icon={RiPulseLine}
            title="Real-time tracking"
            desc="See attendance counts and entries update live as they happen."
          />
          <FeatureCard
            icon={RiSettings4Line}
            title="Admin session management"
            desc="Open, close, and configure sessions in a single dashboard."
          />
          <FeatureCard
            icon={RiCheckboxCircleLine}
            title="Personal verification QR"
            desc="Every corper receives a unique QR for on-site confirmation."
          />
        </div>
      </Section>

      {/* Security */}
      <Section
        id="security"
        className="py-24 bg-secondary/40 border-t border-border"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-brand mb-2">Security</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Designed to prevent abuse
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg">
              Multiple layers of verification ensure every queue number
              represents a real corper, present at the venue — with no
              duplicates or manipulation.
            </p>
          </div>
          <div className="space-y-3">
            {[
              {
                icon: RiCheckboxCircleLine,
                t: "State code verification",
                d: "Each state code can only check in once per session.",
              },
              {
                icon: RiFingerprintLine,
                t: "Device fingerprint validation",
                d: "Devices are identified to block duplicate submissions.",
              },
              {
                icon: RiShieldCheckLine,
                t: "Safe queue assignment",
                d: "Numbers are issued atomically — guaranteed unique, in order.",
              },
            ].map((i) => (
              <div
                key={i.t}
                className="card-elevated p-5 flex gap-4 items-start"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-brand text-brand-foreground flex items-center justify-center">
                  <i.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{i.t}</h3>
                  <p className="text-sm text-muted-foreground">{i.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section id="benefits" className="py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-brand mb-2">Benefits</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            A better experience for everyone
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "For admins",
              icon: RiSettings4Line,
              items: [
                "Faster attendance management",
                "Significantly less manual work",
                "Better visibility into who attended",
                "Easier on-the-spot verification",
              ],
            },
            {
              title: "For corpers",
              icon: RiTeamLine,
              items: [
                "Faster check-in, no waiting",
                "No more manual queues",
                "Transparent queue numbering",
                "Simple QR-based verification",
              ],
            },
          ].map((b) => (
            <div key={b.title} className="card-elevated p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
                  <b.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold">{b.title}</h3>
              </div>
              <ul className="space-y-3">
                {b.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <RiCheckboxCircleLine className="w-4.5 h-4.5 text-brand mt-0.5 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-24">
        <div className="relative overflow-hidden rounded-2xl bg-foreground text-background px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Modernize Attendance Management
            </h2>
            <p className="mt-4 text-base sm:text-lg opacity-80 max-w-xl mx-auto">
              Replace manual attendance processes with secure, automated
              check-ins.
            </p>
            <Link
              to="/admin-login"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-brand-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Sign in <RiArrowRightLine className="w-4 h-4" />
            </Link>
            <p className="mt-3 text-xs opacity-70">
              Need access?{" "}
              <a
                className="underline"
                target="_blank"
                href="mailto:alloolorunfemi@gmail.com"
              >
                Contact the developer{" "}
              </a>
              — accounts are issued, not self-created.
            </p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2b7234] flex items-center justify-center">
              <MdLock className="text-white text-lg" />
            </div>
            <span className="text-black font-bold text-sm tracking-widest uppercase">
              CDS Admin
            </span>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p>Contact</p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/in/allo-olorunfemi"
                className="hover:text-foreground transition-colors"
              >
                <FaLinkedin size={34} color="blue" />
              </a>
              <a
                href="mailto:alloolorunfemi@gmail.com"
                className="hover:text-foreground transition-colors"
              >
                <BiLogoGmail size={34} color="red" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
