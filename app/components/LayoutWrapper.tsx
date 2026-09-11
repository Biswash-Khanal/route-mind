import Footer from "./Footer";
import Navbar from "./Navbar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};
export default LayoutWrapper;
