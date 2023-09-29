class MiSchema extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const srcAttr = this.getAttribute("src")

        if (srcAttr === null || srcAttr.trim().length <= 0) {
            return
        }

        fetch(srcAttr, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
            .then(async (response) => {
                const doc = new DocumentFragment();
                const template = document.createElement("template")
                template.innerHTML = await response.text()
                doc.appendChild(template.content.cloneNode(true))
                this.appendChild(doc)
            })
            .catch(console.warn)
    }
}

customElements.define("mi-schema", MiSchema)
