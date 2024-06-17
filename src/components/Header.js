import Logo from "../image/shakeys@1024.png";

const Header = () => {
	return (
		<header>
			<div className="flex items-center bg-white h-auto justify-center border-b border-grey w-full z-10">
				<img src={Logo} alt="Logo" width={120} height={120} />{" "}
			</div>
		</header>
	);
};

export default Header;
