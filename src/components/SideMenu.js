const SideMenu = () => {
	return (
		<div className="pr-4 pl-10 w-1/6 mr-10 border-r border-grey pt-10 h-screen">
			<div className="text-xl font-bold text-red-700 pb-2">MENU LIST</div>
			<button className="flex hover:text-lg hover:font-semibold mb-1">
				Pizza
			</button>
			<button className="hover:text-lg hover:font-semibold">Chicken</button>
		</div>
	);
};

export default SideMenu;
