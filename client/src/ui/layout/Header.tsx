import logo from "@/assets/images/logo.png";

export const Header = () => {
  //
  return (
    <header className="center">
      <img className="h-full object-contain max-w-[5rem] lg:max-w-[12rem]" src={logo} alt="Nyangplendor Logo" />
    </header>
  )
}