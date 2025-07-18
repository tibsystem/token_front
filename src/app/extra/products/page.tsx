import Link from 'next/link';
import Image from 'next/image';
	
export default function ExtraProducts() {
	return (
		<>
			<div className="d-flex align-items-center mb-3">
				<div>
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><a href="#/">Home</a></li>
						<li className="breadcrumb-item"><a href="#/">Extra</a></li>
						<li className="breadcrumb-item active">Products</li>
					</ol>
					<h1 className="page-header mb-0">Products</h1>
				</div>
				<div className="ms-auto">
					<a href="#/" className="btn btn-success btn-rounded px-4 rounded-pill"><i className="fa fa-plus fa-lg me-2 ms-n2 text-success-900"></i> Add Product</a>
				</div>
			</div>
		
			<div className="mb-3 d-sm-flex fw-bold">
				<div className="mt-sm-0 mt-2"><a href="#/" className="text-dark text-decoration-none"><i className="fa fa-download fa-fw me-1 text-dark text-opacity-50"></i> Export</a></div>
				<div className="ms-sm-4 ps-sm-1 mt-sm-0 mt-2"><a href="#/" className="text-dark text-decoration-none"><i className="fa fa-upload fa-fw me-1 text-dark text-opacity-50"></i> Import</a></div>
				<div className="ms-sm-4 ps-sm-1 mt-sm-0 mt-2 dropdown-toggle">
					<a href="#/" data-bs-toggle="dropdown" className="text-dark text-decoration-none"><i className="fa fa-cog fa-fw me-1 text-dark text-opacity-50"></i> More Actions <b className="caret"></b></a>
					<div className="dropdown-menu">
						<a className="dropdown-item" href="#/">Action</a>
						<a className="dropdown-item" href="#/">Another action</a>
						<a className="dropdown-item" href="#/">Something else here</a>
						<div role="separator" className="dropdown-divider"></div>
						<a className="dropdown-item" href="#/">Separated link</a>
					</div>
				</div>
			</div>
		
			<div className="card border-0">
				<ul className="nav nav-tabs nav-tabs-v2 px-3">
					<li className="nav-item me-2"><a href="#allTab" className="nav-link active px-2" data-bs-toggle="tab">All</a></li>
					<li className="nav-item me-2"><a href="#publishedTab" className="nav-link px-2" data-bs-toggle="tab">Published</a></li>
					<li className="nav-item me-2"><a href="#expiredTab" className="nav-link px-2" data-bs-toggle="tab">Expired</a></li>
					<li className="nav-item me-2"><a href="#deletedTab" className="nav-link px-2" data-bs-toggle="tab">Deleted</a></li>
				</ul>
				<div className="tab-content p-3">
					<div className="tab-pane fade show active" id="allTab">
						<div className="input-group mb-3">
							<button className="btn btn-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Filter products <b className="caret"></b></button>
							<div className="dropdown-menu">
								<a className="dropdown-item" href="#/">Action</a>
								<a className="dropdown-item" href="#/">Another action</a>
								<a className="dropdown-item" href="#/">Something else here</a>
								<div role="separator" className="dropdown-divider"></div>
								<a className="dropdown-item" href="#/">Separated link</a>
							</div>
							<div className="flex-fill position-relative">
								<div className="input-group">
									<div className="input-group-text position-absolute top-0 bottom-0 bg-none border-0 pe-0" style={{zIndex: 1}}>
										<i className="fa fa-search opacity-5"></i>
									</div>
									<input type="text" className="form-control ps-35px bg-light" placeholder="Search products..." />
								</div>
							</div>
						</div>
						
						<div className="table-responsive">
							<table className="table table-hover text-nowrap">
								<thead>
									<tr>
										<th className="pt-0 pb-2"></th>
										<th className="pt-0 pb-2">Product</th>
										<th className="pt-0 pb-2">Inventory</th>
										<th className="pt-0 pb-2">Type</th>
										<th className="pt-0 pb-2">Vendor</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product1" />
												<label className="form-check-label" htmlFor="product1"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="300" height="450" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-6.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Force Majeure White T Shirt</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">83 in stock for 3 variants</td>
										<td className="align-middle">Cotton</td>
										<td className="align-middle">Force Majeure</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product2" />
												<label className="form-check-label" htmlFor="product2"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="300" height="300" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-7.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Eco-friendly fashion, organic cotton, slow fashion polo shirts</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">79 in stock for 3 variants</td>
										<td className="align-middle">Cotton</td>
										<td className="align-middle">Polo</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product3" />
												<label className="form-check-label" htmlFor="product3"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="143" height="220" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-8.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Nike Shoes (Red Color)</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">19 in stock for 1 variants</td>
										<td className="align-middle">Sports</td>
										<td className="align-middle">Nike</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product4" />
												<label className="form-check-label" htmlFor="product4"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="147" height="220" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-9.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Nike Air Max (Blue Color)</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">19 in stock for 1 variants</td>
										<td className="align-middle">Sports</td>
										<td className="align-middle">Nike</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product5" />
												<label className="form-check-label" htmlFor="product5"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="143" height="220" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-10.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Skate Sneaker (Orange Color)</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">19 in stock for 1 variants</td>
										<td className="align-middle">Sports</td>
										<td className="align-middle">Skate</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product6" />
												<label className="form-check-label" htmlFor="product6"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="107" height="220" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-11.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Teen Fashion T-shirt (Black)</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">30 in stock for 4 variants</td>
										<td className="align-middle">T-Shirt</td>
										<td className="align-middle">Tulsa</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product7" />
												<label className="form-check-label" htmlFor="product7"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="106" height="220" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-12.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Levis Blue Jeans</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">49 in stock for 8 variants</td>
										<td className="align-middle">Jeans</td>
										<td className="align-middle">Levis</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product8" />
												<label className="form-check-label" htmlFor="product8"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="300" height="400" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-13.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Boots (White Color)</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">19 in stock for 1 variants</td>
										<td className="align-middle">Sports</td>
										<td className="align-middle">Nike</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product9" />
												<label className="form-check-label" htmlFor="product9"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="300" height="375" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-14.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Hiking Boots</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">94 in stock for 1 variants</td>
										<td className="align-middle">Sports</td>
										<td className="align-middle">Skate</td>
									</tr>
									<tr>
										<td className="w-10px align-middle">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="product10" />
												<label className="form-check-label" htmlFor="product10"></label>
											</div>
										</td>
										<td>
											<div className="d-flex align-items-center">
												<div className="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
													<Image alt="" width="300" height="200" className="mw-100 mh-100 w-auto h-auto" src="/assets/img/product/product-15.jpg" />
												</div>
												<div className="ms-3">
													<Link href="/extra/product-details" className="text-dark text-decoration-none">Dress (Pink)</Link>
												</div>
											</div>
										</td>
										<td className="align-middle">23 in stock for 5 variants</td>
										<td className="align-middle">Dress</td>
										<td className="align-middle">Sktoe</td>
									</tr>
								</tbody>
							</table>
						</div>
					
						<div className="d-md-flex align-items-center">
							<div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
								Showing 1 to 10 of 57 entries
							</div>
							<ul className="pagination mb-0 justify-content-center">
								<li className="page-item disabled"><a href="#/" className="page-link">Previous</a></li>
								<li className="page-item"><a className="page-link" href="#/">1</a></li>
								<li className="page-item active"><a className="page-link" href="#/">2</a></li>
								<li className="page-item"><a className="page-link" href="#/">3</a></li>
								<li className="page-item"><a className="page-link" href="#/">4</a></li>
								<li className="page-item"><a className="page-link" href="#/">5</a></li>
								<li className="page-item"><a className="page-link" href="#/">6</a></li>
								<li className="page-item"><a className="page-link" href="#/">Next</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}