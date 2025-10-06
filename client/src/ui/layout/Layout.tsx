import {Outlet} from "react-router-dom";

export const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/*<Header />*/}
      <main className="flex-grow overflow-auto p-2 lg:p-4">
        <Outlet />
      </main>
    </div>
  )
}