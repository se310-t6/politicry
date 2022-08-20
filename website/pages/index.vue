<template>
	<div>
		<div id="landingImage"></div>
		<section id="welcomeCard" class="section container column is-10">
			<div class="columns is-desktop ">
				<div class="column desktop-only is-half" />
				<div class="card column">
					<div class="card-content content">
						<h1 class="title is-1 extended">Kia Ora, We Are Politicry</h1>
						<p class="content is-size-4">Welcome! We are an aspiring development organisation focussing on the development of tools to improve the online experience. We believe that no one should be constantly subjected to the online hate that comes from US Politics - especially if you don't live there. To this end, we are developing Politicry - a browser extension to filter political posts from popular social media feeds.</p>
					</div>
					<div class="card-footer">
						<a class="card-footer-item is-primary is-light button m-2" href="#about">
							Learn More
						</a>
						<a class="card-footer-item is-primary button m-2" href="https://github.com/se310-t6/politicry">
							Download
						</a>
					</div>
				</div>
			</div>
		</section>
		<section class="section container column is-10" id="about">
			<div class="spacer-desktop" />
			<divs class="columns">
				<ContentPane
					class="column is-half"
					title="Open Source: And always will be."
					body="We fully believe in open source development, all of our repositories and code are freely available and always will be."
					:left="true"
				/>
				<!-- <div class="spacer-desktop" /> -->
				<!-- <div class="spacer-desktop" /> -->
				<ContentPane
					class="column is-half"
					title="Secure: Your data is safe"
					body="We use a secure server to store your data, and only use detections to improve future detection speed and accuracy."
					:left="false"
				/>
			</divs>
			<!-- <div class="spacer-desktop" /> -->
			<!-- <div class="spacer-desktop" /> -->
			<divs class="columns">
				<ContentPane
					class="column is-half"
					title="Fast: Performance is a Priority"
					body="We utilise the latest Tesseract libraries for state-of-the-art OCR support, for detecting those tricky keywords in images"
					:left="true"
				/>
				<!-- <div class="spacer-desktop" /> -->
				<!-- <div class="spacer-desktop" /> -->
				<ContentPane
					class="column is-half"
					title="Customisable: We are customisable"
					body="Individual customisations are available for each user, and can be saved and loaded at any time. Including dynamic wordlists, and toggles for each supported site."
					:left="false"
				/>
			</divs>

			<div class="spacer-desktop" />
			<div class="spacer-desktop" />
			<span id="team"></span>
			<div class="columns">
				<ProfileCard
					class="column"
					name="Josiah Bull"
					image="profiles/jo.jpeg"
					github="https://github.com/JosiahBull"
					linkedin="https://www.linkedin.com/in/josiah-bull/"
					blurb="Backend developer, enjoys tinkering with electronics in his free time."
				/>

				<ProfileCard
					class="column"
					name="Lang Cheng"
					image="profiles/lang.jpg"
					github="https://github.com/langisme"
					linkedin="www.linkedin.com/in/lang-cheng-162327219"
					blurb="A front-end engineer who's interested in graphic design, makes burgers part time."
				/>

				<ProfileCard
					class="column"
					name="Ryan Mardiono"
					image="profiles/ryan.jpg"
					github="https://github.com/Zasheus"
					linkedin="https://www.linkedin.com/in/ryan-mardiono/"
					blurb="Passionate Full Stack developer, enjoys making and learning new things."
				/>

				<ProfileCard
					class="column"
					name="Leonard Min"
					image="profiles/leonard.jpg"
					github="https://github.com/hmin697"
					linkedin="#"
					blurb="software engineering student, have interests in security"
				/>

				<ProfileCard
					class="column"
					name="Angelo Tangonan"
					image="profiles/angelo.jpg"
					github="https://github.com/atan958"
					linkedin="https://www.linkedin.com/in/angelo-tangonan-3788b41bb/"
					blurb="Software Engineer-to-be, aspiring to better people's lives through software."
				/>
			</div>
		</section>
	</div>
</template>

<script>
import ContentPane from '~/components/ContentPane';
import ProfileCard from '~/components/ProfileCard';

function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export default {
	name: 'HomePage',
	components: {
		ContentPane,
		ProfileCard
	},
	created() {
		window.addEventListener("resize", this.scaleOnSizeChange);
	},
	destroyed() {
		window.removeEventListener("resize", this.scaleOnSizeChange);
	},
	methods: {
		//Scale the landing page image when the page is resized
		scaleOnSizeChange(_e) {
			//Get height of card
			let heightCard = document.getElementById("welcomeCard").offsetHeight + convertRemToPixels(3);
			let heightWindow = window.innerHeight;
			let backgroundHeight = Math.max(heightCard, heightWindow);
			document.getElementById("landingImage").style.height = backgroundHeight + "px";
		}
	}
}
</script>


<style>

#landingImage {
	height: 100vh;
	width: 100vw;
	background-color: white;
	background-image: url("~assets/background.jpg");
	background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}

#welcomeCard {
	position: absolute;
	top: 10vh;
	left: 8.35%;
}

.desktop-only {
	display: none;
}

@media only screen and (min-width: 1024px) {
	.spacer-desktop {
		width: 100%;
		margin-top: 5em;
		height:1px;
	}

	#welcomeCard {
		position: absolute;
		top: 20vh;
		right: -10vw;
	}

	.desktop-only {
		display:block;
	}
}

@media only screen and (max-width: 600px) {
	h1 {
		font-size: 2em !important;
	}
}

</style>
