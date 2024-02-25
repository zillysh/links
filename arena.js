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

    let currentImageContent = null;
    const closeImageContent = () => {
      if (currentImageContent) {
        currentImageContent.classList.remove("clicked");
        currentImageContent = null;
      }
    };

    // Add click event listener to toggle image content visibility
    let images = document.querySelectorAll("li.Image");

    images.forEach((image) => {
      image.addEventListener("click", () => {
        let content = image.querySelector(".image-content");

        //   content.classList.toggle("clicked");

        if (currentImageContent && currentImageContent !== content) {
          currentImageContent.classList.remove("clicked");
        }

        // Toggle the 'show' class for the clicked image content
        content.classList.toggle("clicked");

        // Update the currently opened image content
        currentImageContent = content;

        event.stopPropagation();
      });
    });

    document.body.addEventListener("click", () => {
      closeImageContent();
    });

	let currentLinkContent = null; // Add this line to define currentLinkContent

	// Add click event listener to toggle link content visibility
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


  });