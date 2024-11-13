import { Button } from "../ui/button";
import { Home, Info, Settings } from "lucide-react";
import TrackItLogoBlack from "/logos/trackit-transparent-black.png";

function Header() {
  return (
    <nav className="text-white-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex justify-center items-center">
          <img
            src={TrackItLogoBlack}
            alt="Logo"
            className="w-10 h-auto mx-auto"
          />
        </div>
        <div className="items-center">
          <ul className="flex space-x-4">
            <li>
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Services
              </Button>
            </li>
          </ul>
        </div>
        <div></div>
      </div>
    </nav>
  );
}

export default Header;
