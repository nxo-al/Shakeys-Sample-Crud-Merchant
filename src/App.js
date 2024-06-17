import { CircleX, Drumstick, Pencil, Pizza, Trash } from "lucide-react";
import "./App.css";
import Header from "./components/Header";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { db } from "./firebaseConfig";
import { set, ref, onValue, remove, update } from "firebase/database";

const pizzaFlavor = [
	{ name: "Classic Cheese Americana" },
	{ name: "Pepperoni Crrrunch Americana" },
	{ name: "Glazed Bacon Americana" },
	{ name: "Hawaiian Delight Americana" },
];

const chickenFlavor = [
	{ name: "Sour Cream" },
	{ name: "Cheese" },
	{ name: "BBQ" },
	{ name: "Truffle" },
];

const App = () => {
	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
		resetForm();
	}

	const [items, setItems] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [itemName, setItemName] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selected, setSelected] = useState(null);
	const [price, setPrice] = useState("");
	const [cost, setCost] = useState("");
	const [stock, setStock] = useState("");
	const [description, setDescription] = useState("");
	const [buttonText, setButtonText] = useState("Add Item");
	const [editIndex, setEditIndex] = useState(null);

	useEffect(() => {
		const itemsRef = ref(db, "items");
		onValue(itemsRef, (snapshot) => {
			const data = snapshot.val();
			console.log("Fetched Data: ", data);
			if (data) {
				const itemsArray = Object.keys(data).map((key) => ({
					key,
					...data[key],
				}));
				setItems(itemsArray);
			} else {
				setItems([]);
			}
		});
	}, []);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const newItem = {
			itemName,
			selectedCategory,
			selectedFlavor: selected?.name,
			price,
			cost,
			stock,
			description,
		};

		if (editIndex !== null) {
			const itemKey = items[editIndex].key;
			update(ref(db, `items/${itemKey}`), newItem);
			setButtonText("Add Item");
			setEditIndex(null);
		} else {
			set(ref(db, `items/${newItem.itemName}`), newItem);
		}

		resetForm();
		closeModal();
	};

	const handleEdit = (index) => {
		const item = items[index];
		setItemName(item.itemName);
		setSelectedCategory(item.selectedCategory);
		setSelected(
			item.selectedCategory === "Pizza" ? pizzaFlavor[0] : chickenFlavor[0]
		);
		setPrice(item.price);
		setCost(item.cost);
		setStock(item.stock);
		setDescription(item.description);
		setButtonText("Update Item");
		setEditIndex(index);
		setIsOpen(true);
	};

	const handleDelete = (index) => {
		const itemKey = items[index].key;
		remove(ref(db, `items/${itemKey}`));
	};

	const handleFormChange = () => {
		if (editIndex !== null) {
			setButtonText("Update Item");
		} else {
			setButtonText("Add Item");
		}
	};

	const resetForm = () => {
		setItemName("");
		setSelectedCategory("");
		setSelected(null);
		setPrice("");
		setCost("");
		setStock("");
		setDescription("");
		setButtonText("Add Item");
		setEditIndex(null);
	};

	return (
		<div>
			<Header />
			<div className="flex justify-center w-full">
				<div className="flex w-9/12 justify-center items-center">
					<div className="flex flex-col w-full">
						<div className="font-bold text-3xl text-red-700 text-center pt-5">
							MERCHANT
						</div>

						{/* Pizza */}
						<div className="flex w-auto h-auto mt-10 items-center rounded-md">
							<div className="flex items-center border-4 rounded-md h-auto p-2 border-red-700">
								<div className="flex-none text-red-700">
									<Pizza size={50} />
								</div>
								<div className="flex-none font-montserrat pl-4 text-2xl font-bold text-red-700">
									Pizza
								</div>
							</div>

							<div className="flex items-center border-4 rounded-md h-auto p-2 border-red-700 ml-4">
								<div className="flex-none text-red-700">
									<Drumstick size={50} />
								</div>
								<div className="flex-none font-montserrat pl-4 text-2xl font-bold text-red-700">
									Chicken
								</div>
							</div>
							<div className="flex justify-end gap-4 w-full">
								<button
									type="button"
									onClick={openModal}
									className="text-center border rounded-md p-4 text-white bg-red-700 text-xl font-semibold w-60 hover:bg-red-300"
								>
									+ Add Items
								</button>
							</div>
						</div>

						<div className="flex items-center bg-red-700 text-white pl-4 h-10 my-4 rounded-md">
							<div className="flex-1 text-xl font-semibold">ITEM LIST</div>
						</div>

						{/* Show all data from firebase realtime database here */}
						{items.length === 0 ? (
							<div className="text-center text-gray-500">No items found.</div>
						) : (
							<div className="h-auto border-gray-200 rounded-md">
								{items.map((item, index) => (
									<div
										key={index}
										className="border-b border-gray-300 my-4 p-2"
									>
										<div className="flex justify-between items-center">
											<div className="flex w-10/12 gap-2 justify-between">
												<div className="flex items-center">
													{item.selectedCategory === "Pizza" ? (
														<Pizza size={50} className="text-red-700" />
													) : (
														<Drumstick size={50} className="text-red-700" />
													)}
												</div>
												<div className="flex flex-col justify-start w-2/5">
													<div className="flex items-center font-bold text-lg text-red-700">
														{item.itemName}
													</div>
													<div className="flex items-center text-gray-500 text-sm">
														{item.description}
													</div>
												</div>
												<div className="flex items-start justify-evenly flex-col text-sm w-2/5">
													<div className="flex">
														<div className="font-semibold">Category: </div>
														<div className="pl-2">{item.selectedCategory}</div>
													</div>
													<div className="flex">
														<div className="font-semibold">Flavor:</div>
														<div className="pl-2">{item.selectedFlavor}</div>
													</div>
													<div className="flex">
														<div className="font-semibold">Price:</div>
														<div className="pl-2">&#8369; {item.price}</div>
													</div>
												</div>
												<div className="flex items-start justify-evenly flex-col text-sm w-1/5">
													<div className="flex">
														<div className="font-semibold">Cost:</div>
														<div className="pl-2">&#8369; {item.cost}</div>
													</div>
													<div className="flex">
														<div className="font-semibold">Stock:</div>
														<div className="pl-2">{item.stock}</div>
													</div>
												</div>
											</div>
											<div className="flex gap-4">
												<button
													onClick={() => handleEdit(index)}
													className="text-blue-500 hover:underline"
												>
													<div className="bg-red-700 text-white p-2 rounded-md">
														<Pencil strokeWidth={2.5} size={30} />
													</div>
												</button>
												<button onClick={() => handleDelete(index)}>
													<div className="bg-red-700 text-white p-2 rounded-md">
														<Trash strokeWidth={2.5} size={30} />
													</div>
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Add Items Modal */}
			<div>
				<Transition appear show={isOpen} as={Fragment}>
					<Dialog as="div" className="relative z-10" onClose={closeModal}>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-black bg-opacity-25" />
						</Transition.Child>

						<div className="fixed inset-0 overflow-y-auto">
							<div className="flex min-h-full items-center justify-center p-4 text-center">
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0 scale-95"
									enterTo="opacity-100 scale-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100 scale-100"
									leaveTo="opacity-0 scale-95"
								>
									<Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
										<Dialog.Title
											as="h3"
											className="flex items-center justify-between text-2xl font-bold leading-6 text-red-700"
										>
											<div className="flex-1 text-center">Add New Item</div>
											<button onClick={closeModal} className="flex-none">
												<CircleX />
											</button>
										</Dialog.Title>

										<div className="mt-2">
											<form onSubmit={handleFormSubmit}>
												<div className="mt-4">
													<div className="flex gap-4">
														<div className="w-full">
															<label
																htmlFor="itemName"
																className="block text-sm font-medium text-gray-700"
															>
																Name
															</label>
															<input
																type="text"
																id="itemName"
																className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
																value={itemName}
																onChange={(e) => setItemName(e.target.value)}
																onKeyUp={handleFormChange}
															/>
														</div>
														<div className="w-full">
															<label
																htmlFor="category"
																className="block text-sm font-medium text-gray-700"
															>
																Category
															</label>
															<select
																id="category"
																className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
																value={selectedCategory}
																onChange={(e) =>
																	setSelectedCategory(e.target.value)
																}
																onKeyUp={handleFormChange}
															>
																<option value="" disabled>
																	Select Category
																</option>
																<option value="Pizza">Pizza</option>
																<option value="Chicken">Chicken</option>
															</select>
														</div>
													</div>
												</div>

												<div className="mt-4">
													<RadioGroup value={selected} onChange={setSelected}>
														<RadioGroup.Label className="block text-sm font-medium text-gray-700">
															Flavors
														</RadioGroup.Label>
														<div className="grid grid-cols-2 gap-2 mt-2">
															{selectedCategory === "Pizza"
																? pizzaFlavor.map((flavor) => (
																		<RadioGroup.Option
																			key={flavor.name}
																			value={flavor}
																			className={({ active, checked }) =>
																				`${
																					active
																						? "ring-2 ring-offset-2 ring-red-500"
																						: ""
																				}
                                                                    ${
																																			checked
																																				? "bg-red-600 text-white"
																																				: "bg-white"
																																		}
                                                                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
																			}
																		>
																			{({ checked }) => (
																				<>
																					<div className="flex w-full items-center justify-between">
																						<div className="flex items-center">
																							<div className="text-sm">
																								<RadioGroup.Label
																									as="p"
																									className={`font-medium  ${
																										checked
																											? "text-white"
																											: "text-gray-900"
																									}`}
																								>
																									{flavor.name}
																								</RadioGroup.Label>
																							</div>
																						</div>
																						{checked && (
																							<div className="shrink-0 text-white">
																								<CheckCircleIcon className="h-6 w-6" />
																							</div>
																						)}
																					</div>
																				</>
																			)}
																		</RadioGroup.Option>
																  ))
																: chickenFlavor.map((flavor) => (
																		<RadioGroup.Option
																			key={flavor.name}
																			value={flavor}
																			className={({ active, checked }) =>
																				`${
																					active
																						? "ring-2 ring-offset-2 ring-red-500"
																						: ""
																				}
                                                                    ${
																																			checked
																																				? "bg-red-600 text-white"
																																				: "bg-white"
																																		}
                                                                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
																			}
																		>
																			{({ checked }) => (
																				<>
																					<div className="flex w-full items-center justify-between">
																						<div className="flex items-center">
																							<div className="text-sm">
																								<RadioGroup.Label
																									as="p"
																									className={`font-medium  ${
																										checked
																											? "text-white"
																											: "text-gray-900"
																									}`}
																								>
																									{flavor.name}
																								</RadioGroup.Label>
																							</div>
																						</div>
																						{checked && (
																							<div className="shrink-0 text-white">
																								<CheckCircleIcon className="h-6 w-6" />
																							</div>
																						)}
																					</div>
																				</>
																			)}
																		</RadioGroup.Option>
																  ))}
														</div>
													</RadioGroup>
												</div>

												<div className="mt-4 grid grid-cols-3 gap-4">
													<div>
														<label
															htmlFor="price"
															className="block text-sm font-medium text-gray-700"
														>
															Price
														</label>
														<input
															type="number"
															id="price"
															className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
															value={price}
															onChange={(e) => setPrice(e.target.value)}
															onKeyUp={handleFormChange}
														/>
													</div>
													<div>
														<label
															htmlFor="cost"
															className="block text-sm font-medium text-gray-700"
														>
															Cost
														</label>
														<input
															type="number"
															id="cost"
															className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
															value={cost}
															onChange={(e) => setCost(e.target.value)}
															onKeyUp={handleFormChange}
														/>
													</div>
													<div>
														<label
															htmlFor="stock"
															className="block text-sm font-medium text-gray-700"
														>
															Stock
														</label>
														<input
															type="number"
															id="stock"
															className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
															value={stock}
															onChange={(e) => setStock(e.target.value)}
															onKeyUp={handleFormChange}
														/>
													</div>
												</div>

												<div className="mt-4">
													<label
														htmlFor="description"
														className="block text-sm font-medium text-gray-700"
													>
														Description
													</label>
													<textarea
														id="description"
														rows="3"
														className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
														value={description}
														onChange={(e) => setDescription(e.target.value)}
														onKeyUp={handleFormChange}
													/>
												</div>

												<div className="mt-4 flex justify-end">
													<button
														type="button"
														className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
														onClick={closeModal}
													>
														Cancel
													</button>
													<button
														type="submit"
														className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
													>
														{buttonText}
													</button>
												</div>
											</form>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition>
			</div>
		</div>
	);
};

export default App;
