"use client"
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {

  const pathname = usePathname();

  if(pathname.startsWith("/admin")){
  return (
    <>

      <main>{children}</main>

    </>
  );

  }
  else{
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );

  }

};
export default LayoutWrapper;
