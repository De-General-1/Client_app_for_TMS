import { useAuth } from "react-oidc-context";
import person from "../assets/images/person.png";

const HomePage = () => {
  const auth = useAuth();

  return (
    <div className="flex justify-center py-10 h-screen w-full bg-[#8fc1e553]">
      <div className="flex justify-between w-full mx-24 ">
        <div className="w-1/2 mt-[10%]">
          <h1 className="text-7xl font-bold mb-4">Welcome,</h1>
          <h3 className="text-3xl font-bold mb-4 text-gray-700">
            Manage Tasks Easily for Teams and Team members.
          </h3>
          <button
            onClick={() => auth.signinRedirect()}
            className="bg-blue-600 px-10 py-3 rounded-full hover:bg-blue-700 text-white mt-5"
          >
            Sign In
          </button>
        </div>
        <div className="w-1/2 flex justify-end">
          <img src={person} className="w-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
