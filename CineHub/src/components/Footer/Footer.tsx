import { AiFillGithub } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";

function Footer() {
  return (
    <>
      <footer className="flex justify-center items-center py-3 px-4 shadow-md mt-3 bg-dark">
        <header className="flex gap-3 items-center">
          <p>Make by Quoc Nguyen.</p>
          <div className="flex gap-2 items-center">
            <a
              href="https://bitbucket.org/big-projects/cinehub/src/master/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#6e5494] transition duration-300"
            >
              <AiFillGithub size={25} />
            </a>
            <a
              href="https://www.facebook.com/nhquoc99"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition duration-300"
            >
              <BsFacebook size={22} />
            </a>
          </div>
        </header>
      </footer>
    </>
  );
}

export default Footer;
