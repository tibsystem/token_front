// Type definitions
interface AppDOMConfig {
    debug: boolean;
    focusDelay: number;
    defaultSoundPath: string;
    maxClassNameLength: number;
    maxSelectorLength: number;
    fullscreenConfirmMessage: string;
    selectors: {
        actionButtons: string;
    };
    sound: {
        preload: boolean;
        volume: number;
        fadeIn: boolean;
        fadeInDuration: number;
    };
    classes: {
        classesToKeep: string[];
    };
}

interface Logger {
    log: (msg: string) => void;
    error: (msg: string) => void;
    warn: (msg: string) => void;
    group: (name: string) => void;
    groupEnd: () => void;
}

interface AppCache {
    actionButtons: NodeListOf<Element> | null;
    audioCache: Map<string, HTMLAudioElement>;
}

interface RGB {
    r: number;
    g: number;
    b: number;
    formatted: string;
    values: string;
}

interface ColorObject {
    hex: string | null;
    rgb: string;
    rgba: (opacity?: number) => string;
    values: string;
}

interface CategoryColors {
    [shade: number]: ColorObject;
}

interface BootstrapVars {
    [varName: string]: ColorObject;
}

// Define a Record type for categories
type CategoryRecord = Record<string, CategoryColors>;

// Define bootstrap vars type
interface BootstrapVarsContainer {
    bootstrapVars?: BootstrapVars;
}

// Combine them into one ColorMap type
type ColorMap = CategoryRecord & BootstrapVarsContainer;

// Additional type for HTMLElement with offsetHeight property for panels
interface PanelElement extends HTMLElement {
    offsetHeight: number;
}

// Export as a module
export {}

// Extend global Window interface
declare global {
    interface Window {
        appDOM: AppDOM;
        colorMap: ColorMap;
        saveSettings?: () => void;
        bootstrap?: any;
        resetSettings?: () => void;
        savePanelState?: () => void;
    }
}

// Main AppDOM interface
interface AppDOM {
    // Core methods
    containsSubstring: (string: string, substring: string) => boolean;
    resetStyle: () => AppDOM;
    checkActiveStyles: (target?: Element, data?: NodeListOf<Element>) => AppDOM;
    
    // Configuration
    config: (options: Partial<AppDOMConfig>) => AppDOM;
    debug: (enabled: boolean) => AppDOM;
    
    // Action methods
    toggleTheme: () => AppDOM;
    updateThemeButtonsState: () => AppDOM;
    toggleClass: (target: string, className: string) => AppDOM;
    toggleReplace: (target: string, removeClass: string, addClass: string) => AppDOM;
    toggleSwap: (target: string, toggleClass: string) => AppDOM;
    
    // Sound methods
    preloadSound: (soundFile: string) => AppDOM;
    
    // Cleanup
    destroy: () => void;
}

// appDOM - Enhanced TypeScript Plugin for DOM Manipulation and UI Controls
(function(window: Window) {
    'use strict';

    // Create global appDOM object
    window.appDOM = (function(): AppDOM {
        // Private variables and cache
        const htmlRoot: HTMLElement = document.documentElement;
        const cache: AppCache = {
            actionButtons: null,
            audioCache: new Map<string, HTMLAudioElement>()
        };
        
        // Configuration object with security limits
        const config: AppDOMConfig = {
            debug: false,
            focusDelay: 200,
            defaultSoundPath: 'media/sound/',
            maxClassNameLength: 50,
            maxSelectorLength: 255,
            fullscreenConfirmMessage: 'Do you want to enter fullscreen mode?',
            selectors: {
                actionButtons: '[data-action]'
            },
            sound: {
                preload: false,
                volume: 1.0,
                fadeIn: false,
                fadeInDuration: 500
            },
            classes: {
                classesToKeep: ['hide-page-scrollbar'] // Classes that won't be removed during reset
            }
        };

        // Main plugin object
        const plugin: AppDOM = {
            // Check if string contains substring
            containsSubstring: function(string: string, substring: string): boolean {
                if (!string || !substring) {
                    logger.warn('Invalid parameters for containsSubstring');
                    return false;
                }
                const regex = new RegExp(`\\b${substring}\\b`, 'i');
                return regex.test(string);
            },

            // Reset style function
            resetStyle: function(): AppDOM {
                logger.group('Reset Style');
                const dataAction = document.querySelectorAll(config.selectors.actionButtons);
                
                // Reset all action buttons
                dataAction.forEach(element => {
                    if ((element as HTMLInputElement).type === 'checkbox') {
                        (element as HTMLInputElement).checked = false;
                        (element.parentNode as HTMLElement)?.classList.remove("active");
                    } else {
                        element.classList.remove("active");
                    }
                });

                // Keep specific classes while removing others
                const currentClasses = htmlRoot.className.split(' ');
                const filteredClasses = currentClasses.filter(className => 
                    config.classes.classesToKeep.includes(className)
                );
                htmlRoot.className = filteredClasses.join(' ');
                
                // Reset theme toggle buttons' aria-pressed attribute to match current theme
                // This should happen after resetSettings() since that might change the theme
                if (typeof window.resetSettings === 'function') {
                    window.resetSettings();
                }
                
                // After reset, check the current theme and update aria-pressed accordingly
                const currentTheme = htmlRoot.getAttribute('data-bs-theme') || 'light';
                const isDarkTheme = currentTheme === 'dark';
                document.querySelectorAll('[data-action="toggle-theme"]').forEach(button => {
                    button.setAttribute('aria-pressed', isDarkTheme.toString());
                });
                
                logger.log('Styles reset completed');
                logger.groupEnd();
                return plugin;
            },

            // Check active styles
            checkActiveStyles: function(target?: Element, data?: NodeListOf<Element>): AppDOM {
                logger.group('Checking Active Styles');
                const classes = htmlRoot.className.split(" ") || target;
                const dataAction = document.querySelectorAll(config.selectors.actionButtons) || data;

                dataAction.forEach(element => {
                    if ((element as HTMLInputElement).type === 'checkbox') {
                        (element as HTMLInputElement).checked = false;
                        (element.parentNode as HTMLElement)?.classList.remove("active");
                    } else {
                        element.classList.remove("active");
                    }
                });

                classes.forEach(className => {
                    const sanitizedClass = security.sanitizeClassName(className);
                    const elements = document.querySelectorAll(`[data-class="${sanitizedClass}"]`);
                    elements.forEach(element => {
                        if ((element as HTMLInputElement).type === 'checkbox') {
                            (element as HTMLInputElement).checked = true;
                            (element.parentNode as HTMLElement)?.classList.add("active");
                        } else {
                            element.classList.add("active");
                        }
                    });
                });

                logger.groupEnd();
                return plugin;
            },

            // Configuration
            config: function(options: Partial<AppDOMConfig>): AppDOM {
                Object.assign(config, options);
                logger.log('Configuration updated');
                return plugin;
            },

            debug: function(enabled: boolean): AppDOM {
                config.debug = enabled;
                // Add or remove debug class on body element
                const debugClass = 'app-debug-mode';
                if (enabled) {
                    document.body.classList.add(debugClass);
                } else {
                    document.body.classList.remove(debugClass);
                }
                logger.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
                return plugin;
            },

            // Action methods
            toggleTheme: function(): AppDOM {
                handlers.toggleTheme();
                return plugin;
            },

            updateThemeButtonsState: function(): AppDOM {
                const currentTheme = htmlRoot.getAttribute('data-bs-theme') || 'light';
                const isDarkTheme = currentTheme === 'dark';
                document.querySelectorAll('[data-action="toggle-theme"]').forEach(button => {
                    button.setAttribute('aria-pressed', isDarkTheme.toString());
                    logger.log(`Updated aria-pressed to ${isDarkTheme} on theme toggle button`);
                });
                return plugin;
            },

            toggleClass: function(target: string, className: string): AppDOM {
                if (!target || !className) {
                    logger.error('Target and className are required for toggleClass');
                    return plugin;
                }

                const element = document.createElement('button');
                element.setAttribute('data-action', 'toggle');
                element.setAttribute('data-class', className);
                element.setAttribute('data-target', target);
                
                handlers.toggle(element);
                return plugin;
            },

            toggleReplace: function(target: string, removeClass: string, addClass: string): AppDOM {
                if (!target || !addClass) {
                    logger.error('Target and addClass are required for toggleReplace');
                    return plugin;
                }

                const element = document.createElement('button');
                element.setAttribute('data-action', 'toggle-replace');
                element.setAttribute('data-target', target);
                element.setAttribute('data-addclass', addClass);
                if (removeClass) {
                    element.setAttribute('data-removeclass', removeClass);
                }
                
                handlers.toggleReplace(element);
                return plugin;
            },

            toggleSwap: function(target: string, toggleClass: string): AppDOM {
                if (!target || !toggleClass) {
                    logger.error('Target and toggleClass are required for toggleSwap');
                    return plugin;
                }

                const element = document.createElement('button');
                element.setAttribute('data-action', 'toggle-swap');
                element.setAttribute('data-target', target);
                element.setAttribute('data-toggleclass', toggleClass);
                
                handlers.toggleSwap(element);
                return plugin;
            },

            // Sound methods
            preloadSound: function(soundFile: string): AppDOM {
                const sanitizedSound = audioHelpers.sanitizeFilename(soundFile);
                
                if (!cache.audioCache.has(sanitizedSound)) {
                    const audio = audioHelpers.createAudioElement(
                        config.defaultSoundPath, 
                        sanitizedSound, 
                        config.sound.volume
                    );
                    cache.audioCache.set(sanitizedSound, audio);
                }
                return plugin;
            },

            // Cleanup
            destroy: function(): void {
                document.removeEventListener('click', handleAction);
                cache.actionButtons = null;
                
                // Clean up audio cache
                cache.audioCache.forEach(audio => {
                    audio.pause();
                    audio.src = '';
                });
                cache.audioCache.clear();
                
                logger.log('Plugin destroyed');
            }
        };

        // Debug logger
        const logger: Logger = {
            log: function(msg: string): void {
                if (config.debug) console.log(`[SmartAdmin] ${msg}`);
            },
            error: function(msg: string): void {
                if (config.debug) console.error(`[SmartAdmin Error] ${msg}`);
            },
            warn: function(msg: string): void {
                if (config.debug) console.warn(`[SmartAdmin Warning] ${msg}`);
            },
            group: function(name: string): void {
                if (config.debug) console.group(`[SmartAdmin Group] ${name}`);
            },
            groupEnd: function(): void {
                if (config.debug) console.groupEnd();
            }
        };

        // Enhanced Security utilities
        const security = {
            sanitizeClassName: function(className: string): string {
                if (typeof className !== 'string') {
                    logger.error('Invalid class name type');
                    return '';
                }
                
                // Length check to prevent DoS
                if (className.length > config.maxClassNameLength) {
                    logger.error(`Class name exceeds maximum length of ${config.maxClassNameLength} characters`);
                    return '';
                }

                // Enhanced pattern to only allow valid CSS class characters
                const sanitized = className.replace(/[^a-zA-Z0-9-_]/g, '')
                                         .replace(/^[0-9-_]/, '')
                                         .substring(0, config.maxClassNameLength);
                
                if (sanitized !== className) {
                    logger.warn(`Class name "${className}" contained invalid characters and was sanitized to "${sanitized}"`);
                }
                return sanitized;
            },
            
            sanitizeSelector: function(selector: string): string {
                if (typeof selector !== 'string') {
                    logger.error('Invalid selector type');
                    return '';
                }

                // Length check to prevent DoS
                if (selector.length > config.maxSelectorLength) {
                    logger.error(`Selector exceeds maximum length of ${config.maxSelectorLength} characters`);
                    return '';
                }

                // Enhanced CSS injection prevention
                if (/<[^>]*>|javascript:|data:|@import|expression|url\(|eval\(|setTimeout|setInterval/i.test(selector)) {
                    logger.error('Potential malicious selector detected');
                    return '';
                }

                // Only allow valid CSS selectors and escape potentially dangerous characters
                const sanitized = selector.replace(/[<>"'`=\/\\]/g, '')
                                        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                                        .trim();

                return sanitized;
            },

            validateDataAttribute: function(attribute: string): string {
                if (typeof attribute !== 'string') {
                    logger.error('Invalid data attribute type');
                    return '';
                }

                // Length check
                if (attribute.length > config.maxClassNameLength) {
                    logger.error(`Data attribute exceeds maximum length of ${config.maxClassNameLength} characters`);
                    return '';
                }

                // Enhanced pattern for data attributes
                return attribute.replace(/[^a-zA-Z0-9-_]/g, '')
                               .substring(0, config.maxClassNameLength);
            },

            checkFullscreenPermission: function(): boolean {
                if (!document.fullscreenEnabled && 
                    !(document as any).webkitFullscreenEnabled && 
                    !(document as any).mozFullScreenEnabled && 
                    !(document as any).msFullscreenEnabled) {
                    logger.error('Fullscreen not supported in this browser');
                    return false;
                }

                if (window.self !== window.top) {
                    try {
                        if (!(window.parent.document as Document).fullscreenEnabled) {
                            logger.error('Fullscreen not allowed in iframe');
                            return false;
                        }
                    } catch (e) {
                        logger.error('Cannot access parent frame for fullscreen permission');
                        return false;
                    }
                }

                return true;
            },
            
            getClosestElement: function(element: Element, selector: string): Element | null {
                if (!element || !selector) {
                    logger.error('Invalid parameters for getClosestElement');
                    return null;
                }
                
                try {
                    return element.closest(selector);
                } catch (error) {
                    logger.error(`Error finding closest element: ${(error as Error).message}`);
                    return null;
                }
            }
        };

        // Audio Helper Functions
        const audioHelpers = {
            sanitizeFilename: function(filename: string): string {
                return filename.replace(/[^\w.-]/g, '');
            },

            fadeInAudio: async function(audio: HTMLAudioElement, targetVolume: number, duration: number): Promise<void> {
                audio.volume = 0;
                const steps = 20;
                const increment = targetVolume / steps;
                const stepDuration = duration / steps;

                for (let i = 0; i <= steps; i++) {
                    await new Promise(resolve => setTimeout(resolve, stepDuration));
                    audio.volume = Math.min(targetVolume, i * increment);
                }
            },

            createAudioElement: function(path: string, sound: string, volume: number): HTMLAudioElement {
                const audio = new Audio();
                audio.src = `${path}${sound}`;
                audio.volume = volume;
                return audio;
            },

            // Add new helper to stop all sounds except one
            stopAllSoundsExcept: function(exceptSound: string): void {
                cache.audioCache.forEach((audio, key) => {
                    if (key !== exceptSound && !audio.paused) {
                        audio.pause();
                        audio.currentTime = 0;
                        // Find and update any elements playing this sound
                        const playingElements = document.querySelectorAll(`[data-audio-playing="${key}"]`);
                        playingElements.forEach(el => el.removeAttribute('data-audio-playing'));
                    }
                });
            }
        };

        // Utility functions
        const utils = {
            debounce: function<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
                let timeout: number | undefined;
                return function executedFunction(...args: Parameters<T>): void {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = window.setTimeout(later, wait);
                };
            },
            
            validateElement: function(element: Element | null, name: string): boolean {
                if (!element) {
                    logger.error(`${name} element not found`);
                    return false;
                }
                return true;
            },

            // Color extraction utilities
            extractColors: function(): void {
                logger.group('Color Extraction');

                // Initialize color map if not exists
                if (!window.colorMap) {
                    window.colorMap = {} as ColorMap;
                    logger.log('Created new colorMap object');
                } else {
                    logger.log('Using existing colorMap object');
                }

                const categories = ["primary", "danger", "success", "warning", "info"];
                const shades = Array.from({ length: 17 }, (_, i) => (i + 1) * 50).filter(shade => shade <= 900);
                const bootstrapVars = [
                    { name: "bodyBg", style: "background-color: var(--bs-body-bg)" },
                    { name: "bodyBgRgb", style: "background-color: rgb(var(--bs-body-bg-rgb))" },
                    { name: "bodyColor", style: "color: var(--bs-body-color)" },
                    { name: "bodyColorRgb", style: "color: rgb(var(--bs-body-color-rgb))" }
                ];

                // Create temporary elements for color extraction
                const ul = document.createElement("ul");
                ul.style.display = "none";

                // Add category and shade elements
                categories.forEach(category => {
                    shades.forEach(shade => {
                        const li = document.createElement("li");
                        li.className = `bg-${category}-${shade}`;
                        ul.appendChild(li);
                    });
                });

                // Add bootstrap variable elements
                bootstrapVars.forEach(varInfo => {
                    const li = document.createElement("li");
                    li.style.cssText = varInfo.style;
                    li.dataset.varName = varInfo.name;
                    ul.appendChild(li);
                });

                // Create container and append to body
                const container = document.createElement("div");
                container.id = "color-extraction-container";
                container.appendChild(ul);
                document.body.appendChild(container);

                // Helper function to parse RGB string to object with values and formatted string
                const parseRgb = (rgbString: string): RGB => {
                    if (!rgbString || rgbString === "rgba(0, 0, 0, 0)" || rgbString === "transparent") {
                        return { r: 0, g: 0, b: 0, formatted: "rgb(0, 0, 0)", values: "0, 0, 0" };
                    }
                    
                    const match = rgbString.match(/\d+/g);
                    if (!match || match.length < 3) {
                        return { r: 0, g: 0, b: 0, formatted: "rgb(0, 0, 0)", values: "0, 0, 0" };
                    }
                    
                    const [r, g, b] = match.map(Number);
                    return {
                        r, g, b,
                        formatted: rgbString,
                        values: `${r}, ${g}, ${b}`
                    };
                };

                // Extract colors for categories and shades
                categories.forEach(category => {
                    // Initialize category if it doesn't exist
                    if (!window.colorMap[category]) {
                        window.colorMap[category] = {} as CategoryColors;
                    }
                    
                    shades.forEach(shade => {
                        const element = ul.querySelector(`.bg-${category}-${shade}`);
                        if (!element) return;
                        
                        const bgColor = window.getComputedStyle(element).backgroundColor;
                        const rgbData = parseRgb(bgColor);
                        
                        (window.colorMap[category] as CategoryColors)[shade] = { 
                            hex: this.rgbToHex(bgColor),
                            rgb: rgbData.formatted,
                            rgba: (opacity = 1) => `rgba(${rgbData.values}, ${opacity})`,
                            values: rgbData.values
                        };
                    });
                });

                // Extract bootstrap variable colors
                if (!window.colorMap.bootstrapVars) {
                    window.colorMap.bootstrapVars = {} as BootstrapVars;
                    logger.log('Created bootstrapVars in colorMap');
                } else {
                    logger.log('Updating existing bootstrapVars in colorMap');
                }
                
                bootstrapVars.forEach(varInfo => {
                    const element = ul.querySelector(`[data-var-name="${varInfo.name}"]`);
                    if (!element) return;
                    
                    const property = varInfo.name.includes("bodyColor") ? "color" : "backgroundColor";
                    const colorValue = window.getComputedStyle(element)[property];
                    const rgbData = parseRgb(colorValue);
                    
                    if (window.colorMap.bootstrapVars) {
                        window.colorMap.bootstrapVars[varInfo.name] = { 
                            hex: this.rgbToHex(colorValue),
                            rgb: rgbData.formatted,
                            rgba: (opacity = 1) => `rgba(${rgbData.values}, ${opacity})`,
                            values: rgbData.values
                        };
                    }
                });

                // Clean up
                container.remove();
                
                // Dispatch event when color map is ready
                window.dispatchEvent(new Event("colorMapReady"));
                
                logger.log('Color extraction completed');
                logger.groupEnd();
            },

            rgbToHex: function(rgb: string): string | null {
                if (!rgb || rgb === "rgba(0, 0, 0, 0)" || rgb === "transparent") return null;
                const match = rgb.match(/\d+/g);
                if (!match || match.length < 3) return null;
                
                const [r, g, b] = match.map(Number);
                return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
            }
        };

        // Enhanced fullscreen handler
        const fullscreenHandler = {
            enter: function(): Promise<void> {
                try {
                    if (document.documentElement.requestFullscreen) {
                        return document.documentElement.requestFullscreen();
                    } else if ((document.documentElement as any).webkitRequestFullscreen) {
                        return (document.documentElement as any).webkitRequestFullscreen();
                    } else if ((document.documentElement as any).mozRequestFullScreen) {
                        return (document.documentElement as any).mozRequestFullScreen();
                    } else if ((document.documentElement as any).msRequestFullscreen) {
                        return (document.documentElement as any).msRequestFullscreen();
                    }
                    throw new Error('No fullscreen API available');
                } catch (error) {
                    logger.error(`Fullscreen error: ${(error as Error).message}`);
                    return Promise.reject(error);
                }
            },

            exit: function(): Promise<void> {
                try {
                    if (document.exitFullscreen) {
                        return document.exitFullscreen();
                    } else if ((document as any).webkitExitFullscreen) {
                        return (document as any).webkitExitFullscreen();
                    } else if ((document as any).mozCancelFullScreen) {
                        return (document as any).mozCancelFullScreen();
                    } else if ((document as any).msExitFullscreen) {
                        return (document as any).msExitFullscreen();
                    }
                    throw new Error('No fullscreen API available');
                } catch (error) {
                    logger.error(`Fullscreen exit error: ${(error as Error).message}`);
                    return Promise.reject(error);
                }
            },

            isFullscreen: function(): boolean {
                return !!(document.fullscreenElement || 
                         (document as any).webkitFullscreenElement || 
                         (document as any).mozFullScreenElement || 
                         (document as any).msFullscreenElement);
            }
        };

        // Enhanced handlers with all implementations
        const handlers = {
            toggle: function(element: Element): void {
                // Get and sanitize attributes
                const dataClass = element.getAttribute('data-class');
                
                // Validate dataClass exists before sanitizing
                if (!dataClass) {
                    logger.error('Missing required data-class attribute for toggle action');
                    return;
                }
                
                const sanitizedClass = security.sanitizeClassName(dataClass);
                const depClass = element.getAttribute('data-dependency');
                const coDepClass = element.getAttribute('data-codependence');
                const inputFocus = element.getAttribute('data-focus');

                logger.group('Toggle Action');
                logger.log(`Toggling class: ${sanitizedClass}`);

                htmlRoot.classList.toggle(sanitizedClass);

                if (depClass) {
                    depClass.split(" ").forEach(cls => {
                        const sanitizedCls = security.sanitizeClassName(cls);
                        htmlRoot.classList.add(sanitizedCls);
                        logger.log(`Added dependency class: ${sanitizedCls}`);
                    });
                }

                if (coDepClass) {
                    coDepClass.split(" ").forEach(cls => {
                        const sanitizedCls = security.sanitizeClassName(cls);
                        htmlRoot.classList.remove(sanitizedCls);
                        logger.log(`Removed codependency class: ${sanitizedCls}`);
                    });
                }

                if (inputFocus) {
                    const sanitizedFocus = security.validateDataAttribute(inputFocus);
                    setTimeout(() => {
                        const focusElement = document.getElementById(sanitizedFocus);
                        if (focusElement) focusElement.focus();
                        logger.log(`Focus set to element: ${sanitizedFocus}`);
                    }, config.focusDelay);
                }

                if (typeof window.saveSettings === 'function') {
                    window.saveSettings();
                    logger.log('🔑 Settings saved');
                }
                
                plugin.checkActiveStyles();
                logger.groupEnd();
            },

            toggleReplace: function(element: Element): void {
                const targetAttr = element.getAttribute('data-target');
                if (!targetAttr) {
                    logger.error('Missing required target attribute for toggle-replace action');
                    return;
                }
                
                const target = security.sanitizeSelector(targetAttr);
                const removeClass = security.sanitizeClassName(element.getAttribute('data-removeclass') || "");
                const addClass = security.sanitizeClassName(element.getAttribute('data-addclass') || "");
                
                if (!addClass) {
                    logger.error('Missing required addclass attribute for toggle-replace action');
                    return;
                }
                
                const targetElement = document.querySelector(target);

                logger.group('Toggle Replace Action');
                if (targetElement) {
                    targetElement.classList.remove(removeClass);
                    targetElement.classList.add(addClass);
                    logger.log(`Replaced class "${removeClass}" with "${addClass}" on ${target}`);
                } else {
                    logger.error(`Target element not found: ${target}`);
                }
                logger.groupEnd();
            },

            toggleSwap: function(element: Element): void {
                const targetAttr = element.getAttribute('data-target');
                const target = targetAttr ? security.sanitizeSelector(targetAttr) : 'html';
                const toggleClass = security.sanitizeClassName(element.getAttribute('data-toggleclass') || "");
                
                logger.group('Toggle Swap Action');
                if (!toggleClass) {
                    logger.error('Missing required toggleclass attribute for toggle-swap, defaulting to HTML target');
                    logger.groupEnd();
                    return;
                }

                const targetElement = document.querySelector(target);
                if (!targetElement) {
                    logger.error(`Target element not found: ${target}`);
                    logger.groupEnd();
                    return;
                }

                targetElement.classList.toggle(toggleClass);
                logger.log(`Toggled class "${toggleClass}" on ${target}`);
                
                if (plugin.containsSubstring(target, 'drawer')) {
                    htmlRoot.classList.toggle('hide-page-scrollbar');
                    logger.log('Toggled page scrollbar');
                }
                logger.groupEnd();
            },

            panelActions: {
                hideTooltips: function(panel: Element): void {
                    // Find all tooltips in the panel and hide them
                    const tooltipTriggers = panel.querySelectorAll('[data-bs-toggle="tooltip"]');
                    tooltipTriggers.forEach(el => {
                        const tooltip = window.bootstrap?.Tooltip.getInstance(el);
                        if (tooltip) {
                            tooltip.hide();
                        }
                    });
                },
                collapse: function(element: Element): void {
                    logger.group('Panel Collapse Action');
                    
                    const selectedPanel = security.getClosestElement(element, '.panel');
                    if (!selectedPanel) {
                        logger.error('Panel element not found');
                        logger.groupEnd();
                        return;
                    }
                
                    // Hide tooltips before collapsing
                    this.hideTooltips(selectedPanel);
                
                    const panelContainer = selectedPanel.querySelector('.panel-container');
                    if (!panelContainer) {
                        logger.error('Panel container not found');
                        logger.groupEnd();
                        return;
                    }
                
                    // Always ensure transition is set
                    (panelContainer as HTMLElement).style.transition = 'height 0.35s ease';
                    
                    // Store the current height before any changes
                    const startHeight = (panelContainer as HTMLElement).scrollHeight;
                    
                    // Toggle panel collapsed state
                    if (selectedPanel.classList.contains('panel-collapsed')) {
                        // For expanding: First ensure we're at 0 height
                        (panelContainer as HTMLElement).style.height = '0';
                        (panelContainer as HTMLElement).style.overflow = 'hidden';
                        // Force a reflow
                        (panelContainer as HTMLElement).offsetHeight; // Accessing offsetHeight forces reflow
                        
                        // Remove collapsed class
                        selectedPanel.classList.remove('panel-collapsed');
                        
                        // Animate to full height
                        (panelContainer as HTMLElement).style.height = startHeight + 'px';
                        
                        // After animation completes
                        setTimeout(function() {
                            (panelContainer as HTMLElement).style.overflow = 'visible';
                            (panelContainer as HTMLElement).style.height = 'auto';
                        }, 350);
                        
                        logger.log('Panel uncollapsed: ' + (selectedPanel as HTMLElement).id);
                    } else {
                        // For collapsing: First set exact current height
                        (panelContainer as HTMLElement).style.height = startHeight + 'px';
                        (panelContainer as HTMLElement).style.overflow = 'hidden';
                        // Force a reflow
                        (panelContainer as HTMLElement).offsetHeight; // Accessing offsetHeight forces reflow
                        
                        // Add collapsed class
                        selectedPanel.classList.add('panel-collapsed');
                        
                        // Animate to 0
                        (panelContainer as HTMLElement).style.height = '0';
                        
                        logger.log('Panel collapsed: ' + (selectedPanel as HTMLElement).id);
                    }
                
                    // Save panel state after toggle
                    if (typeof window.savePanelState === 'function') {
                        window.savePanelState();
                    }
                    
                    logger.groupEnd();
                },
                fullscreen: function(element: Element): void {
                    logger.group('Panel Fullscreen Action');
                    
                    const selectedPanel = security.getClosestElement(element, '.panel');
                    if (!selectedPanel) {
                        logger.error('Panel element not found');
                        logger.groupEnd();
                        return;
                    }

                    // Hide tooltips before fullscreen
                    this.hideTooltips(selectedPanel);
            
                    selectedPanel.classList.toggle('panel-fullscreen');
                    document.documentElement.classList.toggle('panel-fullscreen');
                    
                    logger.log(`Panel fullscreen toggled: ${(selectedPanel as HTMLElement).id}`);
                    logger.groupEnd();
                },
                close: function(element: Element): void {
                    logger.group('Panel Close Action');
                    
                    const selectedPanel = security.getClosestElement(element, '.panel');
                    if (!selectedPanel) {
                        logger.error('Panel element not found');
                        logger.groupEnd();
                        return;
                    }
            
                    // Hide tooltips before showing close confirmation
                    this.hideTooltips(selectedPanel);
            
                    const panelTitleElement = selectedPanel.querySelector('.panel-hdr h2');
                    const panelTitle = panelTitleElement?.textContent?.trim() || 'Untitled Panel';
                    
                    const killPanel = (): void => {
                        (selectedPanel as HTMLElement).style.transition = 'opacity 0.5s';
                        (selectedPanel as HTMLElement).style.opacity = '0';
                        
                        setTimeout(() => {
                            selectedPanel.remove();
                            logger.log(`Panel removed: ${(selectedPanel as HTMLElement).id}`);
                        }, 500);
                    };
                       
                    // Create modal if it doesn't exist
                    let confirmModal = document.getElementById('panelDeleteModal');
                    if (!confirmModal) {
                        const modalHTML = `
                            <div class="modal fade" id="panelDeleteModal" tabindex="-1" aria-hidden="true" style="--bs-modal-width: 450px;">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content bg-dark bg-opacity-50 shadow-5 translucent-dark">
                                        <div class="modal-header border-bottom-0">
                                            <h4 class="modal-title text-white d-flex align-items-center">
                                                Delete Panel?
                                            </h4>
                                            <button type="button" class="btn btn-system btn-system-light ms-auto" data-bs-dismiss="modal" aria-label="Close">
                                                <svg class="sa-icon sa-icon-2x">
                                                    <use href="img/sprite.svg#x"></use>
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="modal-body"></div>
                                        <div class="modal-footer border-top-0">
                                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">No, cancel</button>
                                            <button type="button" class="btn btn-danger" id="confirmPanelDelete">Yes, delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        document.body.insertAdjacentHTML('beforeend', modalHTML);
                        confirmModal = document.getElementById('panelDeleteModal');
                    }
            
                    // Update modal content with current panel title
                    const modalBody = confirmModal?.querySelector('.modal-body');
                    if (modalBody) {
                        modalBody.innerHTML = `
                        <div class="alert alert-danger bg-danger border-danger text-danger border-opacity-50 bg-opacity-10 mb-0">
                            You are about to delete <span class="fw-700">${panelTitle}.</span>
                            Are you sure you want to delete this panel?
                        </div>`;
                    }

                    // Initialize Bootstrap modal
                    if (confirmModal && window.bootstrap) {
                        const modal = new window.bootstrap.Modal(confirmModal);
                        
                        // Set up delete confirmation handler
                        const confirmDeleteBtn = confirmModal.querySelector('#confirmPanelDelete');
                        if (confirmDeleteBtn) {
                            const deleteHandler = (): void => {
                                killPanel();
                                modal.hide();
                                confirmDeleteBtn.removeEventListener('click', deleteHandler);
                            };
                            
                            confirmDeleteBtn.addEventListener('click', deleteHandler);
                            
                            // Show modal
                            modal.show();
                
                            // Clean up when modal is hidden
                            confirmModal.addEventListener('hidden.bs.modal', () => {
                                confirmDeleteBtn.removeEventListener('click', deleteHandler);
                            }, { once: true });
                        }
                    }
            
                    logger.groupEnd();
                },
                style: function(element: Element): void {
                    logger.group('Panel Style Action');
                    
                    // First find the panel container from any location
                    const panel = security.getClosestElement(element, '.panel');
                    if (!panel) {
                        logger.error('Panel element not found');
                        logger.groupEnd();
                        return;
                    }

                    // Then find the header within the panel
                    const selectedPanel = panel.querySelector('.panel-hdr');
                    if (!selectedPanel) {
                        logger.error('Panel header not found');
                        logger.groupEnd();
                        return;
                    }

                    const styleAttr = element.getAttribute('data-panel-style');
                    if (!styleAttr) {
                        logger.error('No style classes specified');
                        logger.groupEnd();
                        return;
                    }

                    // Split and sanitize each class
                    const newStyles = styleAttr.split(' ')
                        .map(style => security.sanitizeClassName(style.trim()))
                        .filter(style => style.startsWith('bg-')); // Only accept bg-* classes

                    if (newStyles.length === 0) {
                        logger.error('No valid bg-* classes specified');
                        logger.groupEnd();
                        return;
                    }

                    // Remove existing bg-* classes
                    const existingClasses = Array.from(selectedPanel.classList)
                        .filter(className => className.startsWith('bg-'));
                    existingClasses.forEach(className => {
                        selectedPanel.classList.remove(className);
                    });

                    // Add new bg classes
                    newStyles.forEach(style => {
                        selectedPanel.classList.add(style);
                        logger.log(`Added panel style: ${style}`);
                    });

                    // Save panel state
                    if (typeof window.savePanelState === 'function') {
                        window.savePanelState();
                    }
                    
                    logger.groupEnd();
                },
                toggleClass: function(element: Element): void {
                    logger.group('Panel Toggle Class Action');
                    
                    // First find the panel container from any location
                    const selectedPanel = security.getClosestElement(element, '.panel');
                    if (!selectedPanel) {
                        logger.error('Panel element not found');
                        logger.groupEnd();
                        return;
                    }

                    const toggleClass = security.sanitizeClassName(element.getAttribute('data-panel-toggle') || "");
                    if (!toggleClass) {
                        logger.error('No toggle class specified');
                        logger.groupEnd();
                        return;
                    }

                    // Toggle class on the panel itself
                    selectedPanel.classList.toggle(toggleClass);
                    logger.log(`Panel class toggled: ${toggleClass}`);

                    // Save panel state
                    if (typeof window.savePanelState === 'function') {
                        window.savePanelState();
                    }
                    
                    logger.groupEnd();
                },
                reset: function(element: Element): void {
                    logger.group('Panel Reset Action');
                    
                    // First find the panel container from any location
                    const selectedPanel = security.getClosestElement(element, '.panel');
                    if (!selectedPanel) {
                        logger.error('Panel element not found');
                        logger.groupEnd();
                        return;
                    }

                    // Get all classes
                    const panelClasses = Array.from(selectedPanel.classList);
                    const headerElement = selectedPanel.querySelector('.panel-hdr');
                    
                    // Remove all classes except the preserved ones from panel
                    panelClasses.forEach(className => {
                        if (!['panel', 'panel-collapsed', 'panel-fullscreen'].includes(className)) {
                            selectedPanel.classList.remove(className);
                        }
                    });

                    // Reset header classes if it exists
                    if (headerElement) {
                        const headerClasses = Array.from(headerElement.classList);
                        headerClasses.forEach(className => {
                            if (className !== 'panel-hdr') {
                                headerElement.classList.remove(className);
                            }
                        });
                    }

                    logger.log('Panel reset to default state');

                    // Save panel state
                    if (typeof window.savePanelState === 'function') {
                        window.savePanelState();
                    }
                    
                    logger.groupEnd();
                },
                refresh: function(element: Element): void {
                    logger.group('Panel Refresh Action');
                    
                    const selectedPanel = security.getClosestElement(element, '.panel');
                    if (!selectedPanel) {
                        logger.error('Panel element not found');
                        logger.groupEnd();
                        return;
                    }

                    // Get refresh duration from data attribute or use default
                    const refreshDuration = parseInt(element.getAttribute('data-refresh-duration') || "1000") || 1000;
                    
                    // Check if panel is already refreshing
                    if (selectedPanel.classList.contains('panel-refreshing')) {
                        logger.warn('Panel is already refreshing');
                        logger.groupEnd();
                        return;
                    }

                    // Add refreshing class
                    selectedPanel.classList.add('panel-refreshing');
                    logger.log('Panel refresh started');

                    // Get callback function name from data attribute
                    const callbackName = element.getAttribute('data-refresh-callback');
                    
                    // Execute callback if it exists
                    if (callbackName && typeof (window as any)[callbackName] === 'function') {
                        try {
                            (window as any)[callbackName](selectedPanel);
                            logger.log(`Executed callback: ${callbackName}`);
                        } catch (error) {
                            logger.error(`Error in refresh callback: ${(error as Error).message}`);
                        }
                    }

                    // Remove refreshing class after duration
                    setTimeout(() => {
                        selectedPanel.classList.remove('panel-refreshing');
                        logger.log('Panel refresh completed');
                    }, refreshDuration);

                    logger.groupEnd();
                }
            },
            toggleTheme: function(): void {
                logger.group('Toggle Theme Action');
                
                // Get current theme or default to 'light'
                const currentTheme = htmlRoot.getAttribute('data-bs-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                // Set the new theme
                htmlRoot.setAttribute('data-bs-theme', newTheme);
                logger.log(`Theme switched to: ${newTheme}`);

                // Use the utility method to update aria-pressed attributes
                plugin.updateThemeButtonsState();

                // Save settings if available
                if (typeof window.saveSettings === 'function') {
                    window.saveSettings();
                    logger.log('Theme settings saved');
                }

                // Re-extract colors after theme change
                setTimeout(() => {
                    utils.extractColors();
                    logger.log('Colors re-extracted after theme change');
                }, 100); // Small delay to ensure theme is fully applied
                
                logger.groupEnd();
            },
            removeClass: function(element: Element): void {
                const targetAttr = element.getAttribute('data-target');
                if (!targetAttr) {
                    logger.error('Missing required target attribute for remove-class action');
                    return;
                }
                
                const target = security.sanitizeSelector(targetAttr);
                const className = security.sanitizeClassName(element.getAttribute('data-classname') || "");
                
                if (!className) {
                    logger.error('Missing required classname attribute for remove-class action');
                    return;
                }
                
                const targetElement = document.querySelector(target);

                logger.group('Remove Class Action');
                if (targetElement?.classList.contains(className)) {
                    targetElement.classList.remove(className);
                    logger.log(`Removed class "${className}" from ${target}`);
                }

                if (target === 'html' && typeof window.saveSettings === 'function') {
                    window.saveSettings();
                    plugin.checkActiveStyles();
                    logger.log('Settings saved');
                }
                logger.groupEnd();
            },
            addClass: function(element: Element): void {
                const targetAttr = element.getAttribute('data-target');
                if (!targetAttr) {
                    logger.error('Missing required target attribute for add-class action');
                    return;
                }
                
                const target = security.sanitizeSelector(targetAttr);
                const className = security.sanitizeClassName(element.getAttribute('data-classname') || "");
                
                if (!className) {
                    logger.error('Missing required classname attribute for add-class action');
                    return;
                }
                
                const targetElement = document.querySelector(target);

                logger.group('Add Class Action');
                if (targetElement) {
                    targetElement.classList.add(className);
                    logger.log(`Added class "${className}" to ${target}`);
                } else {
                    logger.error(`Target element not found: ${target}`);
                }

                if (target === 'html' && typeof window.saveSettings === 'function') {
                    window.saveSettings();
                    plugin.checkActiveStyles();
                    logger.log('Settings saved');
                }
                logger.groupEnd();
            },
            appFullscreen: function(): void {
                logger.group('Fullscreen Action');
                
                if (!security.checkFullscreenPermission()) {
                    logger.error('Fullscreen permission denied');
                    logger.groupEnd();
                    return;
                }

                if (!fullscreenHandler.isFullscreen()) {
                    if (window.confirm(config.fullscreenConfirmMessage)) {
                        fullscreenHandler.enter()
                            .then(() => logger.log('Entered fullscreen mode'))
                            .catch(error => logger.error(`Fullscreen error: ${(error as Error).message}`));
                    }
                } else {
                    fullscreenHandler.exit()
                        .then(() => logger.log('Exited fullscreen mode'))
                        .catch(error => logger.error(`Fullscreen exit error: ${(error as Error).message}`));
                }
                
                logger.groupEnd();
            },
            playSound: async function(element: Element): Promise<void> {
                logger.group('Play Sound Action');
                
                try {
                    const soundFile = element.getAttribute('data-soundfile');
                    if (!soundFile) {
                        throw new Error('No sound file specified');
                    }

                    const sanitizedSound = audioHelpers.sanitizeFilename(soundFile);
                    
                    // Check if this sound is currently playing
                    if (element.getAttribute('data-audio-playing') === sanitizedSound) {
                        // If it's playing, pause it
                        handlers.pauseSound(element);
                        return;
                    }

                    // Stop all other playing sounds
                    audioHelpers.stopAllSoundsExcept(sanitizedSound);

                    const path = config.defaultSoundPath;
                    
                    // Try to get from cache first
                    let audioElement = cache.audioCache.get(sanitizedSound);
                    
                    if (!audioElement) {
                        audioElement = audioHelpers.createAudioElement(
                            path, 
                            sanitizedSound, 
                            config.sound.volume
                        );
                        cache.audioCache.set(sanitizedSound, audioElement);
                    }

                    // Reset the audio if it was previously played
                    audioElement.currentTime = 0;

                    // Apply fade-in if enabled
                    if (config.sound.fadeIn) {
                        await audioHelpers.fadeInAudio(
                            audioElement, 
                            config.sound.volume, 
                            config.sound.fadeInDuration
                        );
                    }
                    
                    await audioElement.play();
                    
                    // Store the currently playing audio element in a data attribute
                    element.setAttribute('data-audio-playing', sanitizedSound);
                    
                    logger.log(`Playing sound: ${path}${sanitizedSound}`);
                    
                    // Return promise that resolves when audio finishes playing
                    return new Promise((resolve, reject) => {
                        audioElement!.addEventListener('ended', () => {
                            element.removeAttribute('data-audio-playing');
                            resolve();
                        }, { once: true });
                        audioElement!.addEventListener('error', (e) => reject(e), { once: true });
                    });

                } catch (error) {
                    logger.error(`Failed to play sound: ${(error as Error).message}`);
                    throw error;
                } finally {
                    logger.groupEnd();
                }
            },
            pauseSound: function(element: Element): void {
                logger.group('Pause Sound Action');
                
                try {
                    const playingSound = element.getAttribute('data-audio-playing');
                    if (!playingSound) {
                        logger.log('No sound currently playing');
                        return;
                    }

                    const audioElement = cache.audioCache.get(playingSound);
                    if (audioElement) {
                        audioElement.pause();
                        audioElement.currentTime = 0; // Reset to beginning
                        element.removeAttribute('data-audio-playing');
                        logger.log(`Paused sound: ${playingSound}`);
                    }

                } catch (error) {
                    logger.error(`Failed to pause sound: ${(error as Error).message}`);
                } finally {
                    logger.groupEnd();
                }
            }
        };

        // Declare missing function
        const savePanelState = typeof (window as any).savePanelState === 'function' 
            ? (window as any).savePanelState 
            : function() { /* Default empty implementation */ };

        // Event delegation handler
        function handleAction(event: Event): void {
            const element = (event.target as Element).closest(config.selectors.actionButtons);
            if (!element) return;

            const actionType = security.validateDataAttribute(
                (element as HTMLElement).dataset.action || ""
            );
            
            // Add panel actions to the handler object
            const actionHandlers: Record<string, () => void> = {
                'toggle': () => handlers.toggle(element),
                'toggle-replace': () => handlers.toggleReplace(element),
                'toggle-swap': () => handlers.toggleSwap(element),
                'remove-class': () => handlers.removeClass(element),
                'add-class': () => handlers.addClass(element),
                'app-fullscreen': () => handlers.appFullscreen(),
                'playsound': () => handlers.playSound(element),
                'pausesound': () => handlers.pauseSound(element),
                // Add panel actions
                'panel-collapse': () => handlers.panelActions.collapse(element),
                'panel-fullscreen': () => handlers.panelActions.fullscreen(element),
                'panel-close': () => handlers.panelActions.close(element),
                'panel-style': () => handlers.panelActions.style(element),
                'panel-toggle': () => handlers.panelActions.toggleClass(element),
                'panel-reset': () => handlers.panelActions.reset(element),
                'panel-refresh': () => handlers.panelActions.refresh(element),
                'toggle-theme': () => handlers.toggleTheme()
            };

            const handler = actionHandlers[actionType];
            if (handler) {
                handler();
                logger.log(`Action executed: ${actionType}`);
            } else {
                logger.warn(`Unknown action type: ${actionType}`);
            }
        }

        // Initialize plugin
        function init(): void {
            document.addEventListener('click', handleAction);
            
            document.addEventListener('DOMContentLoaded', function() {
                cache.actionButtons = document.querySelectorAll(config.selectors.actionButtons);
                plugin.checkActiveStyles();
                
                // Set initial aria-pressed state for theme toggle buttons
                const currentTheme = htmlRoot.getAttribute('data-bs-theme') || 'light';
                const isDarkTheme = currentTheme === 'dark';
                document.querySelectorAll('[data-action="toggle-theme"]').forEach(button => {
                    button.setAttribute('aria-pressed', isDarkTheme.toString());
                });

                // Extract colors after DOM is loaded
                utils.extractColors();
                
                logger.log('Plugin initialized');
            });
            
            // Also try to set aria attributes immediately for buttons that might already be in the DOM
            setTimeout(() => {
                const currentTheme = htmlRoot.getAttribute('data-bs-theme') || 'light';
                const isDarkTheme = currentTheme === 'dark';
                document.querySelectorAll('[data-action="toggle-theme"]').forEach(button => {
                    button.setAttribute('aria-pressed', isDarkTheme.toString());
                });
            }, 0);
        }

        // Initialize the plugin
        init();

        // Return public methods
        return plugin;
    })();
})(window);

// Uncomment if you want to initialize on DOMContentLoaded
// document.addEventListener('DOMContentLoaded', function() {
//     window.appDOM.checkActiveStyles().debug(true);
// });
