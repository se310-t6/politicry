<template>
    <div class="column">
        <div class="card">
        <header class="card-header">
            <div class="card-header-title is-centered is-size-4 has-text-grey">{{name}}</div>
        </header>
        <div class="card-content">
            <figure class="image">
                <img v-lazy-load class="is-rounded" :src="require(`~/assets/${image}`)"/>
            </figure>
        </div>
        <footer class="card-footer">
            <div class="card-footer-item">
            <div class="content has-text-centered">
                {{blurb}}
            </div>
            </div>
        </footer>
        <footer class="card-footer">
            <a class="card-footer-item" :href="github">
                <b-icon
                    icon="github"
                    size="is-large"
                    type="is-primary"
                />
            </a>
            <a class="card-footer-item" :href="linkedin">
                <b-icon
                    icon="linkedin"
                    size="is-large"
                    type="is-primary"
                />
            </a>
        </footer>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        github: {
            type: String,
            required: true
        },
        linkedin: {
            type: String,
            required: true
        },
        blurb: {
            type: String,
            required: true
        }
    }
}
</script>
