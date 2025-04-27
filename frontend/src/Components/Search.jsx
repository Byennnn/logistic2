import React from "react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";

const Search = () => {
  return (
    <div className="w-full p-5 bg-white text-black/70 h-[85px] rounded-l-sm sticky top-0 z-50">
      <div className="flex justify-between">
        <div className="flex gap-5 items-center w-[600px]">
          {/* Sidebar toggle button */}

          {/* Search form */}
          
        </div>

        {/* Right-side icons and user profile */}
        <div className="flex gap-3 items-center">
          <MdOutlineDarkMode className="size-6 cursor-pointer" />
          <IoMdNotificationsOutline className="size-6 cursor-pointer" />
          <div className="dropdown dropdown-end">
            <img tabIndex={0} role="button" alt="/" className="size-10 rounded-full" />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 mt-2 shadow"
            >
             
              <li>
                <a href="https://logistic1.jjm-manufacturing.com/login">Log out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
