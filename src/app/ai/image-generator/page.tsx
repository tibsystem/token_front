'use client';

import { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function AiImageGenerator() {
	const aiContainerRef = useRef<HTMLDivElement | null>(null);
  const aiGeneratingRef = useRef<HTMLDivElement | null>(null);
  const aiGeneratedRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [dropdownRatioValue, setDropdownRatioValue] = useState("Ratio");
  const [dropdownStyleValue, setDropdownStyleValue] = useState("Style");

  const handleGenerateImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (aiContainerRef.current && aiGeneratingRef.current && aiGeneratedRef.current) {
      aiContainerRef.current.classList.remove("d-none");
      aiGeneratingRef.current.classList.remove("d-none");
      aiGeneratingRef.current.classList.add("show");
			
			if (typeof window !== "undefined" && aiContainerRef.current) {
				const aiContainerPosition = aiContainerRef.current.getBoundingClientRect().top + window.scrollY;
				window.scrollTo({ top: aiContainerPosition - 100, behavior: "smooth" });
			}
			
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setIsGenerated(true);
      }, 3000);
    }
  };

  const handleDropdownSelection = (category: string, value: string) => {
  	if (category === 'Ratio') {
    	setDropdownRatioValue(value);
  	} else {
    	setDropdownStyleValue(value);
  	}
  };

  const handlePreviewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = document.getElementById('previewImage') as HTMLImageElement | null;
        if (img && e.target?.result) {
        	img.src = e.target.result as string;
          img.classList.remove('d-none');
        } else if (img) {
          img.classList.add('d-none');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  
	useEffect(() => {
		if (typeof window !== 'undefined') {
      import('masonry-layout').then(({ default: Masonry }) => {
        new Masonry('[data-masonry]');
      }).catch((error) => console.error('Error loading Masonry:', error));
    }
  }, []);
  
	return (
		<>
			<div className="card border-0 rounded-4 overflow-hidden position-relative bg-component mb-4 mt-2" data-bs-theme="dark">
				<Image width="1920" height="1074" className="object-fit-cover position-absolute top-0 end-0 h-100 w-100 opacity-50" src="/assets/img/ai/cover.jpg" alt="" />
				
				<div className="position-relative p-3 p-md-4 bg-gradient-135 bg-gradient-from-black bg-gradient-to-transparent">
					<span className="border border-2 border-light position-absolute top-0 start-0 m-3 rounded-5 px-3 py-1 fw-bolder d-flex align-items-center">
						<div className="d-inline-flex align-items-center">
							<i className="fa fa-circle fa-fw fs-4px text-body text-opacity-75 me-3px ms-n1"></i> 
							<i className="fa fa-circle fa-fw fs-4px text-body text-opacity-50 me-3px"></i>
							<i className="fa fa-circle fa-fw fs-4px text-body text-opacity-25 me-2"></i>
						</div>
						AI-Generator
					</span>
					
					<div className="text-center fs-1 fw-bold mt-5 pt-3">
						Describe your 
						<span className="text-gradient2 bg-gradient-452 bg-gradient-from-teal bg-gradient-to-blue">ideas</span> and generate
					</div>
					
					<div className="text-center fs-5 fw-bold text-body text-opacity-75 mb-4">Transform your words into visual masterpieces: Leverage AI technology to craft breathtaking images.</div>
					
					<div className="position-relative mx-auto h-100 w-100 mb-2" style={{ maxWidth: '520px' }}>
						<form onSubmit={handleGenerateImage} method="POST" data-form-submit="generate-image">
							<input type="text" className="form-control form-control-lg bg-black bg-opacity-50 bg-blur-3 border-2 shadow-none rounded-4 h-60px" id="userInput" placeholder="Write a prompt to generate" />
							<div className="position-absolute end-0 top-0 bottom-0 d-flex p-10px">
								<button id="sendButton" className="d-flex align-items-center btn btn-lg border-0 bg-gradient-45 rounded-12px h-auto bg-gradient-from-blue bg-gradient-to-teal">
									Generate <i className="fa fa-arrow-right ms-2 text-inverse mt-1px"></i>
								</button>
							</div>
						</form>
					</div>
					
					<div className="position-relative h-100 w-100 mb-5 pb-3 mx-auto d-flex" style={{ maxWidth: '520px' }}>
						<div className="dropdown me-2">
							<label className="btn bg-black bg-opacity-50 bg-blur-3 rounded-10px fw-bolder border-0 d-flex align-items-center">
								<input type="file" className="d-none" accept="image/*" onChange={handlePreviewImage} />
								<i id="previewIcon" className="fa fa-fw fa-plus me-4px"></i> Upload Image
								<Image width="20" height="20" id="previewImage" src="null" alt="" className="w-20px h-20px rounded-3 me-n1 ms-2 d-none my-n1" />
							</label>
						</div>
						<div className="dropdown me-2 ms-auto">
							<button type="button" data-bs-toggle="dropdown" className="btn bg-black bg-opacity-50 bg-blur-3 rounded-10px fw-bolder border-0"><i className="fa fa-fw fa-globe me-2px"></i> <span id="aiRatioText">{dropdownRatioValue}</span> <i className="fa fa-chevron-down fa-fw opacity-50 ms-1"></i></button>
							<div className="dropdown-menu dropdown-menu-end rounded-3">
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Ratio", "Ratio")}>None</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Ratio", "1:1 (Square)")}>1:1 (Square)</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Ratio", "16:9 (Widescreen)")}>16:9 (Widescreen)</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Ratio", "4:3 (Standard)")}>4:3 (Standard)</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Ratio", "3:2 (Classic)")}>3:2 (Classic)</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Ratio", "21:9 (Ultra Wide)")}>21:9 (Ultra Wide)</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Ratio", "9:16 (Portrait)")}>9:16 (Portrait)</a>
							</div>
						</div>
						<div className="dropdown">
							<button type="button" data-bs-toggle="dropdown" className="btn bg-black bg-opacity-50 bg-blur-3 rounded-10px fw-bolder border-0"><i className="fa fa-fw fa-palette me-2px"></i> <span id="aiStyleText">{dropdownStyleValue}</span> <i className="fa fa-chevron-down fa-fw opacity-50 ms-1"></i></button>
							<div className="dropdown-menu dropdown-menu-end rounded-3">
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Style")}>None</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Realistic")}>Realistic</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Anime")}>Anime</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Cyberpunk")}>Cyberpunk</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Pixel Art")}>Pixel Art</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Cartoon")}>Cartoon</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Sketch")}>Sketch</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Fantasy")}>Fantasy</a>
								<a className="dropdown-item" href="#/" onClick={() => handleDropdownSelection("Style", "Neon")}>Neon</a>
							</div>
						</div>
					</div>
					
					<h4 className="mb-3">Image generation tools</h4>
					<div className="row g-3 g-lg-4">
						<div className="col-sm-6 col-xl-3">
							<div className="card border-0 rounded-4 overflow-hidden" data-bs-theme="dark">
								<Image className="card-img object-fit-cover" width="280" height="180" src="/assets/img/ai/tools-1.jpg" alt="" />
								<div className="card-img-overlay h-100 d-flex align-items-end bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
									<div>
										<Icon icon="solar:volleyball-2-bold-duotone" className="fs-30px"></Icon>
										<div className="fw-bold text-body fs-5">Text to Image</div>
										<div className="fw-bold text-body text-opacity-75 small">Turn your words into stunning visuals with AI-generated artwork.</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-xl-3">
							<div className="card border-0 rounded-4 overflow-hidden" data-bs-theme="dark">
								<Image className="card-img object-fit-cover" width="280" height="180" src="/assets/img/ai/tools-2.jpg" alt="" />
								<div className="card-img-overlay h-100 d-flex align-items-end bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
									<div>
										<Icon icon="solar:layers-minimalistic-bold-duotone" className="fs-30px"></Icon>
										<div className="fw-bold text-body fs-5">Text to PNG</div>
										<div className="fw-bold text-body text-opacity-75 small">Create high-quality PNG images from text with transparency support.</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-xl-3">
							<div className="card border-0 rounded-4 overflow-hidden" data-bs-theme="dark">
								<Image className="card-img object-fit-cover" width="280" height="180" src="/assets/img/ai/tools-3.jpg" alt="" />
								<div className="card-img-overlay h-100 d-flex align-items-end bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
									<div>
										<Icon icon="solar:gallery-edit-bold-duotone" className="fs-30px"></Icon>
										<div className="fw-bold text-body fs-5">Image Editor</div>
										<div className="fw-bold text-body text-opacity-75 small">Enhance, modify, and perfect your images with powerful editing tools.</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-xl-3">
							<div className="card border-0 rounded-4 overflow-hidden" data-bs-theme="dark">
								<Image className="card-img object-fit-cover" width="280" height="180" src="/assets/img/ai/tools-4.jpg" alt="" />
								<div className="card-img-overlay h-100 d-flex align-items-end bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
									<div>
										<Icon icon="solar:refresh-bold-duotone" className="fs-30px"></Icon>
										<div className="fw-bold text-body fs-5">Reimagine</div>
										<div className="fw-bold text-body text-opacity-75 small">Transform and regenerate images with fresh, AI-powered creativity.</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div id="aiGeneratedContainer" ref={aiContainerRef} className="mb-4 pt-2 d-none">
				<div id="aiGeneratingResult" ref={aiGeneratingRef} className={(isGenerating ? "show" : "d-none") + ' fade'}>
					<h4 className="mb-2">Generating</h4>
					<div className="mb-3 fw-bold d-flex align-items-center">
						<Icon icon="solar:info-circle-bold-duotone" className="fs-4"></Icon>
						<div className="ps-1">
							This is a simulated AI-generated response. Please note that the image was not created by an actual AI model.
						</div>
					</div>
					<div className="row g-3 g-lg-4">
						<div className="col-sm-6 col-lg-3">
							<div className="ratio" style={{ "--bs-aspect-ratio": "68.46%" } as React.CSSProperties}>
								<div><div className="shimmer-loader rounded-4 h-100"></div></div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-3">
							<div className="ratio" style={{ "--bs-aspect-ratio": "68.46%" } as React.CSSProperties}>
								<div><div className="shimmer-loader rounded-4 h-100"></div></div>
							</div>
						</div>	
						<div className="col-sm-6 col-lg-3">
							<div className="ratio" style={{ "--bs-aspect-ratio": "68.46%" } as React.CSSProperties}>
								<div><div className="shimmer-loader rounded-4 h-100"></div></div>
							</div>
						</div>	
						<div className="col-sm-6 col-lg-3">
							<div className="ratio" style={{ "--bs-aspect-ratio": "68.46%" } as React.CSSProperties}>
								<div><div className="shimmer-loader rounded-4 h-100"></div></div>
							</div>
						</div>	
					</div>
				</div>
				<div id="aiGeneratedResult" ref={aiGeneratedRef} className={(isGenerated ? "show" : "d-none") + ' fade'}>
					<h4 className="mb-2">AI-Generated Result</h4>
					<div className="mb-3 fw-bold d-flex align-items-center">
						<Icon icon="solar:info-circle-bold-duotone" className="fs-4"></Icon>
						<div className="ps-1">
							This is a simulated AI-generated response. Please note that the image was not created by an actual AI model.
						</div>
					</div>
					<div className="row g-3 g-lg-4">
						<div className="col-sm-6 col-lg-3">
							<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show" data-bs-theme="dark">
								<Image width="1024" height="682" src="/assets/img/ai/generated-1.jpg" className="card-img h-auto" alt="" />
								<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
									<div className="h-100 d-flex align-items-end">
										<div className="w-100">
											<h5 className="card-title text-truncate">Variant 1</h5>
											<div className="d-flex">
												<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
												<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-3">
							<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show" data-bs-theme="dark">
								<Image width="1024" height="701" src="/assets/img/ai/generated-2.jpg" className="card-img h-auto" alt="" />
								<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
									<div className="h-100 d-flex align-items-end">
										<div className="w-100">
											<h5 className="card-title text-truncate">Variant 2</h5>
											<div className="d-flex">
												<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
												<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-3">
							<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show" data-bs-theme="dark">
								<Image width="1024" height="701" src="/assets/img/ai/generated-3.jpg" className="card-img h-auto" alt="" />
								<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
									<div className="h-100 d-flex align-items-end">
										<div className="w-100">
											<h5 className="card-title text-truncate">Variant 3</h5>
											<div className="d-flex">
												<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
												<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-6 col-lg-3">
							<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show" data-bs-theme="dark">
								<Image width="1024" height="701" src="/assets/img/ai/generated-4.jpg" className="card-img h-auto" alt="" />
								<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
									<div className="h-100 d-flex align-items-end">
										<div className="w-100">
											<h5 className="card-title text-truncate">Variant 4</h5>
											<div className="d-flex">
												<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
												<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div className="mb-4 pt-2">
				<h4 className="mb-3">Explore Imagine</h4>
				<ul className="nav nav-pills mb-3 d-flex gap-1">
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px bg-component text-body" aria-current="page" href="#/">All</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Fantasy</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Art</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Nature</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Popculture</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Futuristic</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Architecture</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Animals</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">People</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Food</a></li>
					<li className="nav-item"><a className="nav-link rounded-5 px-4 py-7px hover-bg-light text-body" href="#/">Horror</a></li>
				</ul>
				<div className="row g-4" data-masonry='{"percentPosition": true }' data-bs-theme="dark">
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="682" src="/assets/img/ai/imagine-1.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Psychedelic girl illustration</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1019" height="768" src="/assets/img/ai/imagine-2.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Fantasy water character</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1020" height="768" src="/assets/img/ai/imagine-3.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Anime character using virtual reality glasses in the metaverse</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1019" height="768" src="/assets/img/ai/imagine-4.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Fantasy water character</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="574" src="/assets/img/ai/imagine-5.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Space adventure artwork</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="512" height="768" src="/assets/img/ai/imagine-6.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Futuristic half-robot tiger in nature</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="682" src="/assets/img/ai/imagine-7.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Psychedelic girl illustration</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="682" src="/assets/img/ai/imagine-8.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">View of airplane flying through a fantasy world</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="768" height="768" src="/assets/img/ai/imagine-9.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Fantasy style clouds with animal</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="578" height="768" src="/assets/img/ai/imagine-10.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Psychedelic girl illustration</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="585" src="/assets/img/ai/imagine-11.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Fantasy bird illustration</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="578" height="768" src="/assets/img/ai/imagine-12.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Vibrant colored autumn trees on fiery backdrop generated by AI</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="574" src="/assets/img/ai/imagine-13.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">View of rhinoceros animal with futuristic robotic parts</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="768" height="768" src="/assets/img/ai/imagine-14.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Robot and human silhouettes</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="432" height="768" src="/assets/img/ai/imagine-15.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Neon hologram of tiger</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="578" height="768" src="/assets/img/ai/imagine-16.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Fantasy house on the moon illustration</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="682" src="/assets/img/ai/imagine-17.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">People hanging out with robot</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="682" src="/assets/img/ai/imagine-18.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Off-road car in fantasy scenario</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="576" src="/assets/img/ai/imagine-19.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Cyberpunk city street at night with neon lights and futuristic aesthetic</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1020" height="768" src="/assets/img/ai/imagine-20.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Cartoon ai robot scene</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="768" height="768" src="/assets/img/ai/imagine-21.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Blockchain technology cartoon illustration</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="1024" height="643" src="/assets/img/ai/imagine-22.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Cartoon ai robot scene</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6 col-md-3">
						<div className="card rounded-4 bg-none border-0 overflow-hidden hover-show">
							<Image width="614" height="768" src="/assets/img/ai/imagine-23.jpg" className="card-img h-auto" alt="" />
							<div className="card-img-overlay d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div className="h-100 d-flex align-items-end">
									<div className="w-100">
										<h5 className="card-title text-truncate">Cartoon ai robot scene</h5>
										<div className="d-flex">
											<a href="#/" className="text-decoration-none text-body me-3"><i className="fa fa-fw fa-pen opacity-50"></i> Edit</a>
											<a href="#/" className="text-decoration-none text-body"><i className="fa fa-fw fa-repeat opacity-50"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}