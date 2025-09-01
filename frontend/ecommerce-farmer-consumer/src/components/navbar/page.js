export default function Navbar() {
    return (
        <nav className="flex flex-row justify-between bg-gray-800 p-4">
            <h1 className="text-white text-2xl">Sprout</h1>
            <div className="flex space-x-4 items-center">
                <a href="#" className="text-gray-300 hover:text-white">Home</a>
                <a href="#" className="text-gray-300 hover:text-white">Shop</a>
                <a href="#" className="text-gray-300 hover:text-white">About</a>
                <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>
            {/* <div> */}
            <button className="bg-green-500 text-white px-4 py-2 rounded-2xl">Login</button>
            {/* </div> */}
        </nav>
    );
}
