// Init highlight library
hljs.highlightAll();


document.addEventListener('DOMContentLoaded', () => {

    // Autodetect button options and building panels
    const panels = {};

    document.querySelectorAll('.toggle-panel').forEach(button => {
        const target = button.dataset.target;
        const targetId = target.startsWith('#') ? target : `#${target}`;
        const targetKey = target.replace(/^#/, '');

        if (!panels[targetKey]) {
            panels[targetKey] = new SlideReveal(targetId, {});
        }

        button.addEventListener('click', () => {
            if (panels[targetKey]) {
                panels[targetKey].destroy();
                delete panels[targetKey];
                _resetPanelStyles(targetId);
            }

            let options = {};
            Object.entries(button.dataset).forEach(([key, value]) => {
                if (key !== "target") {
                    if (["true", "false"].includes(value)) value = value === "true";
                    options[key] = value;
                }
            });

            panels[targetKey] = new SlideReveal(targetId, options);
            panels[targetKey].toggle();

            panels[targetKey].onClose = () => {
                panels[targetKey].destroy();
                _resetPanelStyles(targetId);
                delete panels[targetKey];
            }
        });
    });

    // Panel links behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            const header = document.getElementById('heading');
            const headerHeight = header ? header.offsetHeight : 0;
            if (target) {
                e.preventDefault();
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                const container = this.closest('div[id]');
                setTimeout(() => {
                    panels[container.id].toggle()
                }, panels[container.id].options.speed)
            }
        });
    });


    if (window.location.hash) {
        const targetId = window.location.hash;
        scrollToBlock(targetId);
    }

    const pseudoHomeLink = document.querySelector('.home');
    pseudoHomeLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = window.location.origin + window.location.pathname;
    });

});




/**
 * Scrolls smoothly to a specific block element on the page identified by the given target ID.
 *
 * @param {string} targetId - The ID of the target element to scroll to. Must be a valid CSS selector.
 * @return {void}
 */
function scrollToBlock(targetId) {
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        //history.pushState(null, null, targetId);
    }
}

/**
 * Resets the styles and attributes of a panel identified by the given target ID.
 * Removes inline styles, attributes, and specific CSS classes to restore the panel to its default state.
 *
 * @param {string} targetId - A valid CSS selector string used to identify the target panel element.
 * @return {void} This function does not return a value.
 */
function _resetPanelStyles(targetId) {
    const el = document.querySelector(targetId);
    if (el) {
        el.style.transform = '';
        el.style.transition = '';
        el.style.right = '';
        el.style.left = '';
        el.style.width = '';
        el.style.height = '';
        el.style.zIndex = '';
        el.style.background = '';
        el.removeAttribute('aria-hidden');
        el.removeAttribute('aria-label');
        el.removeAttribute('aria-modal');
        el.removeAttribute('role');
        el.classList.remove('slidereveal-panel');
    }
}