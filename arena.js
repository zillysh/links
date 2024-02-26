// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'microplastics-cwffpwvgluo' // The “slug” is just the end of the URL


// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.getElementById('channel-title')
	let channelDescription = document.getElementById('channel-description')
	let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')


	// Images!
	if (block.class == 'Image') {
		let imageItem =
		`
			<li class="Image" >
				<div class=image-shape></div>
				<div class="image-content">
					<figure>
					<img src="${block.image.large.url}" alt="${block.title} by ${block.user.full_name}">
					<figcaption>${block.title}</figcaption>
					</figure>
				</div>
			</li>
		`
	channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Links!
	else if (block.class == 'Link') {
		let linkItem =
			`
			<li class="Link">
			<div class=link-shape></div>
			<div class="link-content">
				<p><em>Link</em></p>
				<h3>${ block.title }</h3>
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</div>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Text!
	else if (block.class == 'Text') {
		let textItem =
		`
			<li class="Text">
			<div class=text-shape></div>
			<div class="text-content">
				<blockquote>
					${block.content_html}
				</blockquote>
			</div>
			</li>
		`
	channelBlocks.insertAdjacentHTML('beforeend', textItem)
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li class=Video >
					<div class=video-shape></div>
					<div class="video-content">
						<p><em>Video</em></p>
						<video controls src="${ block.attachment.url }"></video>
					</div>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			let pdfItem =
				`
					<li class="Pdf">
					<div class=pdf-shape></div>
					<div class="pdf-content">
						<a href="${block.attachment.url}">
							<figure>
								<img src="${block.image.large.url}" alt="${block.title}">
								<figcaption>${block.title}</figcaption>
							</figure>
						</a>
					</div?>
					</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li class="Audio">
				<div class=audio-shape></div>
				<div class="audio-content">
					<p><em>Audio</em></p>
					<audio controls src="${ block.attachment.url }"></video>
				</div>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

}

// // It‘s always good to credit your work:
// let renderUser = (user, container) => { // You can have multiple arguments for a function!
// 	let userAddress =
// 		`
// 		<address>
// 			<img src="${ user.avatar_image.display }">
// 			<h3>${ user.first_name }</h3>
// 			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
// 		</address>
// 		`
// 	container.insertAdjacentHTML('beforeend', userAddress)
// }


// Now that we have said what we can do, go get the data:

fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		// let channelUsers = document.getElementById('channel-users') // Show them together
		// data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		// renderUser(data.user, channelUsers)


    // Add click event listener to toggle image content visibility
	let currentImageContent = null;
	let images = document.querySelectorAll("li.Image");
	
	images.forEach((image) => {
	  image.addEventListener("click", () => {
		let content = image.querySelector(".image-content");
	
		if (currentImageContent && currentImageContent !== content) {
		  currentImageContent.classList.remove("clicked");
		}
	
		content.classList.toggle("clicked");
		currentImageContent = content;

		event.stopPropagation(); // Prevent event propagation to parent elements
	  });
	});
	
	document.body.addEventListener("click", () => {
	  closeImageContent();
	});
	
	const closeImageContent = () => {
	  if (currentImageContent) {
		currentImageContent.classList.remove("clicked");
		currentImageContent = null;
	  }
	};
	

	// Add click event listener to toggle link content visibility
	let currentLinkContent = null; 
	let links = document.querySelectorAll("li.Link");
	
	links.forEach((link) => {
	  link.addEventListener("click", () => {
		let content = link.querySelector(".link-content");
	
		if (currentLinkContent && currentLinkContent !== content) {
		  currentLinkContent.classList.remove("clicked");
		}
	
		content.classList.toggle("clicked");
		currentLinkContent = content;
	
		event.stopPropagation();
	  });
	});
	
	document.body.addEventListener("click", () => {
	  closeLinkContent();
	});
	
	const closeLinkContent = () => {
	  if (currentLinkContent) {
		currentLinkContent.classList.remove("clicked");
		currentLinkContent = null;
	  }
	};


	// Add click event listener to toggle video content visibility
	let currentVideoContent = null;
	let videos = document.querySelectorAll("li.Video");

	videos.forEach((video) => {
	video.addEventListener("click", (event) => {
		let content = video.querySelector(".video-content");

		if (currentVideoContent && currentVideoContent !== content) {
		currentVideoContent.classList.remove("clicked");
		}

		content.classList.toggle("clicked");
		currentVideoContent = content;

		event.stopPropagation();
	});
	});

	document.body.addEventListener("click", () => {
	closeVideoContent();
	});

	const closeVideoContent = () => {
	if (currentVideoContent) {
		currentVideoContent.classList.remove("clicked");
		currentVideoContent = null;
	}
	};


	// Add click event listener to toggle text content visibility
	let currentTextContent = null;
	let texts = document.querySelectorAll("li.Text");

	texts.forEach((text) => {
	text.addEventListener("click", (event) => {
		let content = text.querySelector(".text-content");

		if (currentTextContent && currentTextContent !== content) {
		currentTextContent.classList.remove("clicked");
		}

		content.classList.toggle("clicked");
		currentTextContent = content;

		event.stopPropagation();
	});
	});

	document.body.addEventListener("click", () => {
	closeTextContent();
	});

	const closeTextContent = () => {
	if (currentTextContent) {
		currentTextContent.classList.remove("clicked");
		currentTextContent = null;
	}
	};


	// Add click event listener to toggle audio content visibility
	let currentAudioContent = null;
	let audios = document.querySelectorAll("li.Audio");

	audios.forEach((audio) => {
	audio.addEventListener("click", (event) => {
		let content = audio.querySelector(".audio-content");

		if (currentAudioContent && currentAudioContent !== content) {
		currentAudioContent.classList.remove("clicked");
		}

		content.classList.toggle("clicked");
		currentAudioContent = content;

		event.stopPropagation();
	});
	});

	document.body.addEventListener("click", () => {
	closeAudioContent();
	});

	const closeAudioContent = () => {
	if (currentAudioContent) {
		currentAudioContent.classList.remove("clicked");
		currentAudioContent = null;
	}
	};


	// Add click event listener to toggle PDF content visibility
	let currentPdfContent = null;
	let pdfs = document.querySelectorAll("li.Pdf");

	pdfs.forEach((pdf) => {
	pdf.addEventListener("click", (event) => {
		let content = pdf.querySelector(".pdf-content");

		if (currentPdfContent && currentPdfContent !== content) {
		currentPdfContent.classList.remove("clicked");
		}

		content.classList.toggle("clicked");
		currentPdfContent = content;

		event.stopPropagation();
	});
	});

	document.body.addEventListener("click", () => {
	closePdfContent();
	});

	const closePdfContent = () => {
	if (currentPdfContent) {
		currentPdfContent.classList.remove("clicked");
		currentPdfContent = null;
	}
	};

});