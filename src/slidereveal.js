/*!
 * SlideReveal.js
 * Modern vanilla JS sliding side panel (drawer) — no dependencies
 *
 * @author      Mykhailo Kulyk <github.com/technoquill>
 * @copyright   2025 Mykhailo Kulyk
 * @license     MIT (see LICENSE file)
 * @repository  https://github.com/technoquill/slidereveal
 * @version     1.0.0
 *
 * @inspired    Original jQuery SlideReveal by Natthawat Pongsri (MIT)
 *              https://github.com/nnattawat/slidereveal
 *
 * @description
 *    SlideReveal.js is a lightweight, customizable, dependency-free JavaScript
 *    class for creating left/right side panels (drawers, menus, push menus)
 *    with overlay, pushBody, filter, keyboard accessibility, callbacks and more.
 *
 *    Supports px, %, vw, rem, em widths. Integrates easily into any frontend project.
 */
class SlideReveal {

    /**
     * Creates an instance of SlideReveal with customizable options to manage a sliding panel UI.
     *
     * @param {string} panelSelector - The CSS selector for the panel element.
     * @param {Object} [options={}] - An object containing configuration options for the sliding panel.
     * @param {number} [options.width=300] - The width of the panel in pixels|rem|em|vw|% equal vw.
     * @param {string} [options.position='right'] - The position of the panel, either 'right' or 'left'.
     * @param {boolean} [options.filter=false] - Determines whether a filter effect should be applied to the body content when the panel is open.
     * @param {string} [options.filterStyle='blur(2px)'] - The CSS filter style applied if the filter option is enabled.
     * @param {boolean} [options.overlay=true] - Whether an overlay is displayed behind the panel.
     * @param {string} [options.overlayColor='rgba(0,0,0,0.3)'] - The background color of the overlay.
     * @param {boolean} [options.closeOnOutsideClick=false] - Whether clicking outside the panel closes it.
     * @param {number} [options.speed=400] - The speed of the animation in milliseconds.
     * @param {boolean} [options.pushBody=false] - Whether the panel pushes the body content instead of overlapping it.
     * @param {string} [options.selector='body'] - The selector specifying the content that is affected by the sliding panel.
     * @param {string|null} [options.trigger=null] - The selector for the element that triggers the panel to open or close.
     * @param {boolean} [options.autoEscape=true] - Whether the Escape key closes the panel when it is open.
     * @param {number} [options.zIndex=1050] - zIndex panel (1050) and body (default value - 1)
     * @param {Object} [options.classNames={}] - (optional)
     *    Allows you to override the default CSS class names for all SlideReveal elements:
     *    - `bodyWrapper`: Wrapper around the main page content (default: 'slidereveal-body')
     *    - `bodyOpen`: Class added to <body> when the panel is open (default: 'slidereveal-open')
     *    - `panel`: Main sliding panel container class (default: 'slidereveal-panel')
     *    - `panelContent`: Main sliding panel content class (default: 'slidereveal-panel-content')
     *    - `overlay`: Overlay element class (default: 'slidereveal-overlay')
     *    Use these to better match your own CSS or to avoid style conflicts.
     * @param {Function|null} [options.onInit=null] - A callback function executed when the panel is initialized.
     * @param {Function|null} [options.onOpen=null] - A callback function executed when the panel is opened.
     * @param {Function|null} [options.onClose=null] - A callback function executed when the panel is closed.
     * @param {Function|null} [options.onEscape=null] - A callback function executed when the Escape key closes the panel.
     * @param {string} [options.ariaLabel='Menu'] - An accessible label for the panel.
     * @return {void}
     */
    constructor(panelSelector, options = {}) {
        this.options = Object.assign({
            width: 300,
            position: 'right',
            filter: false,
            filterStyle: 'blur(2px)',
            overlay: true,
            overlayColor: 'rgba(0,0,0,0.3)',
            closeOnOutsideClick: false,
            speed: 400,
            pushBody: false,
            selector: 'body',
            trigger: null,
            autoEscape: true,
            zIndex: 1050,
            classNames: {},
            onInit: null,
            onOpen: null,
            onClose: null,
            onEscape: null,
            ariaLabel: 'Menu',
        }, options);
        this._classNames = Object.assign({
            bodyWrapper: 'slidereveal-body',     // Wrapper around all page content gets pushed
            bodyOpen: 'slidereveal-open',     // Added to <body> when a panel is open
            panel: 'slidereveal-panel',    // Main sliding panel container
            panelContent: 'slidereveal-panel-content',    // Main sliding panel content
            overlay: 'slidereveal-overlay'   // Overlay behind the panel
        }, this.options.classNames || {});

        this.body = document.querySelector(this.options.selector);
        if (!this.body) {
            throw new Error('SlideReveal: content element not found for selector ' + this.options.selector);
        }
        this.panel = document.querySelector(panelSelector);
        if (!this.panel) {
            throw new Error('SlideReveal: panel element not found for selector ' + panelSelector);
        }
        this.panelContent = this._preparePanelContent();
        this.bodyContent = this._prepareBodyContainer(panelSelector);
        this.isOpen = false;
        this.init();
    }

    /**
     * Initializes the panel and its associated settings, styles, and functionality.
     *
     * The method configures the panel's position, size, accessibility attributes, and optional features such as overlay, body push effect, keyboard escape handling, and custom triggers for opening the panel.
     *
     * @return {void} This method does not return a value.
     */
    init() {

        // Panel styles
        Object.assign(this.panel.style, {
            position: 'fixed',
            top: '0',
            [this.options.position]: `-${this._panelWidthValue}`,
            width: `${this._panelWidthValue}`,
            height: '100vh',
            zIndex: this.options.zIndex,
            background: 'white',
        });

        // Content style
        Object.assign(this.panelContent.style, {
            position: 'relative',
            top: '0',
            left: '0',
            //width: `${this._panelWidthValue}`,
            width: '100%',
            overflowY: 'auto',
            //overflowX: 'hidden',
            padding: '0',
            boxSizing: 'border-box',
            wordBreak: 'break-word',
        });

        // Set aria attributes
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-modal', 'true');
        this.panel.setAttribute('aria-label', this.options.ariaLabel);
        this.panel.setAttribute('aria-hidden', 'true');

        // Overlay
        if (this.options.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = this._classNames.overlay;
            Object.assign(this.overlay.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: this.options.overlayColor,
                zIndex: this.options.zIndex - 1,
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.3s'
            });
            document.body.appendChild(this.overlay);
            this.overlay.addEventListener('click', () => this.close());
        }

        // Filter
        if (!this.options.overlay && this.options.closeOnOutsideClick) {
            this._bodyClickHandler = (e) => {
                if (this.isOpen && !this.panel.contains(e.target)) {
                    this.close();
                }
            };
            this.bodyContent.addEventListener('click', this._bodyClickHandler);
        }

        // Push
        if (this.options.pushBody) {
            this.bodyContent.style.transition = `transform ${this.options.speed}ms`;
        }

        // Keyboard ESC
        if (this.options.autoEscape) {
            this._escHandler = (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                    if (typeof this.options.onEscape === 'function') {
                        this.options.onEscape();
                    }
                }
            };
            document.addEventListener('keydown', this._escHandler);
        }

        // Custom trigger (opening)
        if (this.options.trigger) {
            const triggers = typeof this.options.trigger === 'string'
                ? document.querySelectorAll(this.options.trigger)
                : [this.options.trigger];
            triggers.forEach(trigger =>
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle();
                })
            );
        }

        //
        if (typeof this.options.onInit === 'function') {
            this.options.onInit();
        }
    }

    /**
     * Opens the panel and applies the relevant styles and attributes based on the provided configurations.
     * It adjusts the position of the panel, manages overlay visibility, and optionally shifts the body content.
     * Executes the onOpen callback if defined.
     *
     * @return {void} Does not return any value.
     */
    open() {
        if (this.isOpen) return;

        // Add body class
        document.body.classList.add(this._classNames.bodyOpen);

        // Renew aria-hidden attribute
        this.panel.setAttribute('aria-hidden', 'false');

        // Set overlay styles
        if (this.options.overlay) {
            this.overlay.style.opacity = '1';
            this.overlay.style.pointerEvents = 'auto';
        }

        //
        let sign = (this.options.position === 'right') ? '-' : '';

        // Set panel styles
        this.panel.style.transition = `transform ${this.options.speed}ms`;
        this.panel.style.transform = `translateX(${sign}${this._panelWidthValue})`;

        // Set content style
        if (this.options.pushBody) {
            this.bodyContent.style.transform = `translateX(${sign}${this._panelWidthValue})`;
            document.body.style.overflowX = 'hidden';
        }

        // Set filter style
        if (this.options.filter) {
            let bodyWrapper = document.querySelector('.' + this._classNames.bodyWrapper);
            bodyWrapper.style.filter = this.options.filterStyle;
        }

        // Set open
        this.isOpen = true;

        if (typeof this.options.onOpen === 'function') {
            this.options.onOpen();
        }
    }

    /**
     * Closes the panel, hides it from view, and resets styles or attributes associated with the open state.
     * It also triggers optional callbacks and modifies the styles of related elements based on configuration.
     *
     * @return {void} Does not return any value.
     */
    close() {
        if (!this.isOpen) return;

        // Remove body class
        document.body.classList.remove(this._classNames.bodyOpen);

        this.bodyContent.style.transition = `transform ${this.options.speed}ms`;
        this.panel.style.transform = ``;
        this.panel.setAttribute('aria-hidden', 'true');

        if (this.options.overlay) {
            this.overlay.style.transition = `opacity ${this.options.speed}ms`;
            this.overlay.style.opacity = '0';
            this.overlay.style.pointerEvents = 'none';
        }
        if (this.options.filter) {
            let bodyWrapper = document.querySelector('.' + this._classNames.bodyWrapper);
            bodyWrapper.style.filter = '';
        }
        if (this.options.pushBody) {
            // Reset transform & etc.
            this.bodyContent.style.transform = '';
            this.bodyContent.style.transition = `transform ${this.options.speed}ms`;
            this.bodyContent.style.willChange = '';
            const onTransitionEnd = () => {
                document.body.style.overflowX = '';
                this.bodyContent.removeEventListener('transitionend', onTransitionEnd);
            };
            this.bodyContent.addEventListener('transitionend', onTransitionEnd);

            this.bodyContent.style.transform = '';
        }

        this.isOpen = false;

        if (typeof this.options.onClose === 'function') {
            this.options.onClose();
        }
    }

    /**
     * Toggles the state between open and close based on the current state.
     *
     * @return {void} Does not return any value.
     */
    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    /**
     * Cleans up resources and removes event listeners or DOM changes associated with the instance.
     * It removes overlay elements, resets body styles, and unregisters the escape key handler
     * depending on the provided options.
     *
     * @return {void} There is no return value.
     */
    destroy() {
        // Overlay
        if (this.options.overlay && this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        // pushBody styles
        if (this.options.pushBody) {
            this.bodyContent.style.transform = '';
            this.bodyContent.style.transition = '';
            this.bodyContent.style.overflowX = '';
        }
        // filter
        if (this.options.filter) {
            this.bodyContent.style.filter = '';
        }
        // panel
        if (this.panel) {
            this.panel.setAttribute('aria-hidden', 'true');
            this.panel.style.transform = '';
        }
        // body open class
        document.body.classList.remove(this._classNames.bodyOpen);

        // ESC
        if (this.options.autoEscape && this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }
        // Click
        if (this._bodyClickHandler) {
            this.bodyContent.removeEventListener('click', this._bodyClickHandler);
            this._bodyClickHandler = null;
        }
    }

    /**
     * Wraps all child elements of the given panel into a new div element with a specified class name.
     *
     * @return {HTMLElement} The newly created wrapper div containing the original children of the panel.
     */
    _preparePanelContent() {
        const panel = this.panel;
        const className = this._classNames.panelContent;
        const wrapper = document.createElement('div');
        wrapper.className = className;
        while (panel.firstChild) {
            wrapper.appendChild(panel.firstChild);
        }
        panel.className = this._classNames.panel;
        panel.appendChild(wrapper);
        return wrapper;
    }

    /**
     * Wraps the body content into a new div element with the specified wrapper class.
     * It moves all child nodes of the body into the new wrapper, except specific elements
     * such as the side panel or overlay.
     *
     * @param panelSelector
     * @return {HTMLElement} The newly created or existing wrapper element containing the body content.
     */
    _prepareBodyContainer(panelSelector) {
        const bodyWrapperClass = this._classNames.bodyWrapper;
        const selector = this.options.selector;
        const container = document.querySelector(selector);

        if (!container) throw new Error('SlideReveal: selector not found: ' + selector);

        // Check if there is a panel inside the selector
        const panel = document.querySelector(panelSelector);

        if (panel && container.contains(panel)) {
            // If there is a panel: return the wrapper
            let wrapper = container.querySelector('.' + bodyWrapperClass);
            if (wrapper) return wrapper;

            // else: create wrapper
            wrapper = document.createElement('div');
            wrapper.className = bodyWrapperClass;

            // Move all nodes except panel and overlay
            Array.from(container.childNodes).forEach(node => {
                if (
                    !(node.nodeType === 1 && (
                        node === panel ||
                        (node.classList && node.classList.contains(this._classNames.overlay))
                    ))
                ) {
                    wrapper.appendChild(node);
                }
            });

            container.appendChild(wrapper);
            return wrapper;
        } else {
            // There is no panel inside: add a class
            container.classList.add(bodyWrapperClass);
            return container;
        }
    }


    /**
     * @returns {string|number}
     */
    get _panelWidthValue() {
        let width = this.options.width;
        if (typeof width === 'number') return Math.abs(width) + 'px';
        if (typeof width === 'string') {
            width = width.trim();
            // replace % to vw
            if (width.endsWith('%')) {
                let num = parseFloat(width);
                if (!isNaN(num)) return num + 'vw';
            }
            return width.replace(/^[-+]/, '');
        }
        return '300px';
    }
}
