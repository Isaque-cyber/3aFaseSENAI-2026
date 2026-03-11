import { Outlet } from "react-router"
import { Footer } from "../Footer"
import { Header } from "../Header"

export const Main = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header/>
            <main className="flex-1 container mx-auto">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}
