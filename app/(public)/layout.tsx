import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

/**
 * Layout for every public-facing route.
 *
 * The public chrome lives in a route group rather than being switched on in the
 * root layout via `usePathname()`. A layout receives no pathname, so the old
 * approach had to run on the client and re-render the whole tree on navigation;
 * route groups scope the chrome server-side with no client component involved.
 *
 * Route groups are not part of the URL, so these routes keep their paths.
 */
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-full flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default PublicLayout;