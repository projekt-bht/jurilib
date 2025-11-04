import Link from "next/link"

import { Login } from "../Login/Login"

export function Navbar() {
  return (
    <nav className="bg-black text-white flex items-center justify-between p-5 mx-auto">
      <div className="flex items-center space-x-2">
        <Link className="text-lg font-bold" href="/">JuriLib</Link>
      </div>

      <div className="flex items-center gap-x-5">
        <Link href="/organizations">Organisationen</Link>
        <Login />
      </div>
    </nav>
  )
}
