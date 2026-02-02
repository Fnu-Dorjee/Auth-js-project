
import  Navbar  from "./_components/navbar";


type ProtedLayoutProps = {
    children: React.ReactNode;
}

const ProtectedLayout = ({children}: ProtedLayoutProps )=>{
    return (
        <div className="w-full min-h-screen flex flex-col gap-y-10 items-center justify-center  bg-sky-700">
            <Navbar/>
            {children}
        </div>
    )
}

export default ProtectedLayout;