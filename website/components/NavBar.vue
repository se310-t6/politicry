<template>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item ml-2" href="#">
                <img src="~/assets/titled-logo.png" width="112" height="28">
            </a>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navBar">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navBar" class="navbar-menu">
            <div class="navbar-end">
            <a href="#about" class="navbar-item">
                About
            </a>
            <a href="#team" class="navbar-item">
                The Team
            </a>
            <a href="https://se310-t6.github.io/politicry/" class="navbar-item">
                Api
                <b-icon
                    icon="link"
                    type="is-secondary"
                    class="ml-2"
                />
            </a>
            <div class="navbar-item">
                <a class="button is-primary" href="https://github.com/se310-t6/politicry">
                    Download
                </a>
            </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    mounted() {
		//Copied from: https://bulma.io/documentation/components/navbar/
		// Get all "navbar-burger" elements
		const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
		// Check if there are any navbar burgers
		if ($navbarBurgers.length > 0) {
			// Add a click event on each of them
			$navbarBurgers.forEach( el => {
			el.addEventListener('click', () => {
				// Get the target from the "data-target" attribute
				const target = el.dataset.target;
				const $target = document.getElementById(target);
				// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
				el.classList.toggle('is-active');
				$target.classList.toggle('is-active');
			});
			});
		}
	}
}
</script>
