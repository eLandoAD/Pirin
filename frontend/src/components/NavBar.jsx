function NavBar() {
    return (
        <nav className="bg-primary-white flex items-center p-4 px-6">
            <div className="bg-secondary-white w-[30%] p-1 pl-3 border rounded-lg border-slate-300">Search</div>
            <div className="flex justify-end items-center gap-12 w-[70%]">
                <div>Notifiche?</div>
                <div className="flex pr-4 gap-4">
                    <button className="bg-secondary-white rounded-lg hover:bg-slate-200 cursor-pointer px-2 py-1 border">Log In</button>
                    <button className="bg-green rounded-lg hover:bg-green-dark cursor-pointer px-2 py-1">Sign Up</button>
                </div>
            </div>
            
        </nav>
    )
}

export default NavBar