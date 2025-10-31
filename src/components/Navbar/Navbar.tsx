export function Navbar() {
  return (
    <nav className="bg-black fixed top-0 left-0 w-full flex items-center justify-between p-5">
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold  text-white">JuriLib</span>
      </div>

      <div className="flex items-center gap-x-5">
        <a href="#test" className="text-white">
          Organisationen
        </a>
        <button className="bg-white text-black p-2 pr-3 pl-3 rounded-full">
          Einloggen
        </button>
      </div>
    </nav>
  )
}
